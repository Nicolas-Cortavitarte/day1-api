import { createServer, Server } from 'node:http';
import { AddressInfo } from 'node:net';
import { exportJWK, generateKeyPair, JWK, KeyLike, SignJWT } from 'jose';
import { InvalidTokenError } from '../application/token-verifier';
import { SupabaseTokenVerifier } from './supabase-token-verifier';

/**
 * Prueba con firmas REALES: levantamos un servidor local que publica un JWKS
 * (como hace Supabase) y firmamos tokens con la clave privada correspondiente.
 */
describe('SupabaseTokenVerifier', () => {
  const userId = '5b0e3a54-0b66-4d3b-9d57-2f6a6c6f0a11';
  let server: Server;
  let baseUrl: string;
  let issuer: string;
  let privateKey: KeyLike;
  let otherPrivateKey: KeyLike;
  let verifier: SupabaseTokenVerifier;

  beforeAll(async () => {
    const pair = await generateKeyPair('ES256');
    privateKey = pair.privateKey;
    otherPrivateKey = (await generateKeyPair('ES256')).privateKey;
    const publicJwk: JWK = { ...(await exportJWK(pair.publicKey)), kid: 'test-key', alg: 'ES256', use: 'sig' };

    server = createServer((req, res) => {
      if (req.url === '/auth/v1/.well-known/jwks.json') {
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({ keys: [publicJwk] }));
      } else {
        res.statusCode = 404;
        res.end();
      }
    });
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    issuer = `${baseUrl}/auth/v1`;
    verifier = new SupabaseTokenVerifier(baseUrl);
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  const sign = (options: {
    key?: KeyLike;
    sub?: string | null;
    iss?: string;
    aud?: string;
    exp?: string | number;
    kid?: string;
  } = {}) => {
    const jwt = new SignJWT({})
      .setProtectedHeader({ alg: 'ES256', kid: options.kid ?? 'test-key' })
      .setIssuer(options.iss ?? issuer)
      .setAudience(options.aud ?? 'authenticated')
      .setIssuedAt()
      .setExpirationTime(options.exp ?? '1h');
    if (options.sub !== null) jwt.setSubject(options.sub ?? userId);
    return jwt.sign(options.key ?? privateKey);
  };

  it('devuelve el id del usuario (sub) de un token válido', async () => {
    await expect(verifier.verify(await sign())).resolves.toEqual({ id: userId });
  });

  it('rechaza un token firmado con otra clave', async () => {
    await expect(verifier.verify(await sign({ key: otherPrivateKey }))).rejects.toBeInstanceOf(InvalidTokenError);
  });

  it('rechaza un token expirado', async () => {
    const expired = Math.floor(Date.now() / 1000) - 3600;
    await expect(verifier.verify(await sign({ exp: expired }))).rejects.toBeInstanceOf(InvalidTokenError);
  });

  it('rechaza un token de otro emisor (otro proyecto)', async () => {
    await expect(verifier.verify(await sign({ iss: 'https://otro.supabase.co/auth/v1' }))).rejects.toBeInstanceOf(
      InvalidTokenError,
    );
  });

  it('rechaza un token con audiencia distinta de "authenticated"', async () => {
    await expect(verifier.verify(await sign({ aud: 'anon' }))).rejects.toBeInstanceOf(InvalidTokenError);
  });

  it('rechaza un token sin sub', async () => {
    await expect(verifier.verify(await sign({ sub: null }))).rejects.toBeInstanceOf(InvalidTokenError);
  });

  it('rechaza un token sin firma (alg none)', async () => {
    const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString('base64url');
    const unsigned = `${b64({ alg: 'none' })}.${b64({ sub: userId, iss: issuer, aud: 'authenticated' })}.`;
    await expect(verifier.verify(unsigned)).rejects.toBeInstanceOf(InvalidTokenError);
  });

  it('rechaza un token firmado con HS256 usando la clave pública como secreto', async () => {
    // Ataque clásico de confusión de algoritmo: solo se aceptan ES256/RS256.
    const forged = await new SignJWT({})
      .setProtectedHeader({ alg: 'HS256', kid: 'test-key' })
      .setIssuer(issuer)
      .setAudience('authenticated')
      .setSubject(userId)
      .setExpirationTime('1h')
      .sign(new TextEncoder().encode('lo-que-sea'));
    await expect(verifier.verify(forged)).rejects.toBeInstanceOf(InvalidTokenError);
  });

  it('rechaza basura que no es un JWT', async () => {
    await expect(verifier.verify('esto-no-es-un-jwt')).rejects.toBeInstanceOf(InvalidTokenError);
  });

  it('falla al construirse si falta SUPABASE_URL', () => {
    expect(() => new SupabaseTokenVerifier(undefined)).toThrow('SUPABASE_URL');
  });
});