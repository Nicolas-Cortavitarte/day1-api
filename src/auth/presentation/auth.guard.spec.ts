import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InvalidTokenError, TokenVerifier } from '../application/token-verifier';
import { AuthGuard } from './auth.guard';
import { IS_PUBLIC_KEY } from './public.decorator';

describe('AuthGuard', () => {
  const verify = jest.fn<ReturnType<TokenVerifier['verify']>, [string]>();
  const getAllAndOverride = jest.fn();
  const guard = new AuthGuard({ getAllAndOverride } as unknown as Reflector, { verify } as TokenVerifier);

  const contextWith = (request: object) =>
    ({
      getHandler: () => undefined,
      getClass: () => undefined,
      switchToHttp: () => ({ getRequest: () => request }),
    }) as unknown as ExecutionContext;

  beforeEach(() => {
    jest.resetAllMocks();
    getAllAndOverride.mockReturnValue(false);
  });

  it('deja pasar las rutas @Public() sin pedir token', async () => {
    getAllAndOverride.mockReturnValue(true);
    await expect(guard.canActivate(contextWith({ headers: {} }))).resolves.toBe(true);
    expect(getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, expect.any(Array));
    expect(verify).not.toHaveBeenCalled();
  });

  it('con token válido guarda el usuario verificado en request.user', async () => {
    verify.mockResolvedValue({ id: 'user-1' });
    const request: { headers: Record<string, string>; user?: unknown } = {
      headers: { authorization: 'Bearer token-ok' },
    };
    await expect(guard.canActivate(contextWith(request))).resolves.toBe(true);
    expect(verify).toHaveBeenCalledWith('token-ok');
    expect(request.user).toEqual({ id: 'user-1' });
  });

  it('acepta "bearer" en minúsculas', async () => {
    verify.mockResolvedValue({ id: 'user-1' });
    await expect(guard.canActivate(contextWith({ headers: { authorization: 'bearer t' } }))).resolves.toBe(true);
  });

  it.each([
    ['sin cabecera', undefined],
    ['esquema distinto de Bearer', 'Basic abc'],
    ['Bearer sin token', 'Bearer'],
    ['con partes de más', 'Bearer a b'],
  ])('responde 401 %s', async (_name, authorization) => {
    await expect(guard.canActivate(contextWith({ headers: { authorization } }))).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(verify).not.toHaveBeenCalled();
  });

  it('responde 401 si el token es inválido y no deja usuario en la petición', async () => {
    verify.mockRejectedValue(new InvalidTokenError());
    const request: { headers: Record<string, string>; user?: unknown } = {
      headers: { authorization: 'Bearer malo' },
    };
    await expect(guard.canActivate(contextWith(request))).rejects.toBeInstanceOf(UnauthorizedException);
    expect(request.user).toBeUndefined();
  });

  it('NO convierte un fallo inesperado en 401 (se propaga como 500)', async () => {
    const boom = new Error('no se pudo descargar el JWKS');
    verify.mockRejectedValue(boom);
    await expect(guard.canActivate(contextWith({ headers: { authorization: 'Bearer t' } }))).rejects.toBe(boom);
  });
});