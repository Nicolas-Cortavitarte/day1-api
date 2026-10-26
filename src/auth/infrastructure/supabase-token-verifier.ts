import { createRemoteJWKSet, jwtVerify, JWTVerifyGetKey } from 'jose'; 
import { AuthenticatedUser } from '../authenticated-user';
import { InvalidTokenError, TokenVerifier } from '../application/token-verifier';

export class SupabaseTokenVerifier extends TokenVerifier {
    private readonly issuer: string;
    private readonly keys: JWTVerifyGetKey;

    constructor(supabaseUrl: string | undefined) {
        super();
        if(!supabaseUrl) {
            throw new Error('No se encontró la variable de entorno SUPABASE_URL');
        }
        this.issuer = `${supabaseUrl.replace(/\/+$/, '')}/auth/v1`;
        this.keys = createRemoteJWKSet(new URL(`${this.issuer}/.well-known/jwks.json`));
    }

    async verify(token: string): Promise<AuthenticatedUser> {
        let subject: unknown;
        try {
            const { payload } = await jwtVerify(token, this.keys, {
                issuer: this.issuer,
                audience: 'authenticated',
                algorithms: ['ES256', 'RS256'],
            });
            subject = payload.sub; 
        } catch (error) {
            throw new InvalidTokenError('Token inválido', { cause: error });
        }
        if (typeof subject != 'string' || subject.length === 0) {
            throw new InvalidTokenError('El token no identifica a ningún usuario');
        }
        return { id: subject};
    }
}