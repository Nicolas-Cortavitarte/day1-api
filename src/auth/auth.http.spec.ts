import { Body, Controller, Get, INestApplication, Post } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { TokenVerifier, InvalidTokenError } from './application/token-verifier';
import type { AuthenticatedUser } from './authenticated-user';
import { AuthModule } from './auth.module';
import { CurrentUser } from './presentation/current-user.decorator';
import { Public } from './presentation/public.decorator';

@Controller()
class ProbeController {
  @Public()
  @Get('open')
  open() {
    return { ok: true };
  }

  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser) {
    return { userId: user.id };
  }

  // Ruta de prueba: el cliente intenta colarse con un userId en el cuerpo. Debe ignorarse.
  @Post('echo')
  echo(@CurrentUser() user: AuthenticatedUser, @Body() body: { userId?: string }) {
    return { userId: user.id, ignoredFromBody: body.userId };
  }
}

describe('Autenticación (HTTP, guard global real)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.SUPABASE_URL = 'https://proyecto-de-prueba.supabase.co'; // no se hace ninguna llamada de red
    const moduleRef = await Test.createTestingModule({ imports: [AuthModule], controllers: [ProbeController] })
      .overrideProvider(TokenVerifier)
      .useValue({
        verify: (token: string) =>
          token === 'token-de-ana' ? Promise.resolve({ id: 'ana-uuid' }) : Promise.reject(new InvalidTokenError()),
      })
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('una ruta @Public() responde sin token', () => request(app.getHttpServer()).get('/open').expect(200));

  it('una ruta normal sin token responde 401 (seguro por defecto)', () =>
    request(app.getHttpServer()).get('/me').expect(401));

  it('con token inválido responde 401', () =>
    request(app.getHttpServer()).get('/me').set('Authorization', 'Bearer falso').expect(401));

  it('con token válido el controlador recibe el userId del token', () =>
    request(app.getHttpServer()).get('/me').set('Authorization', 'Bearer token-de-ana').expect(200, { userId: 'ana-uuid' }));

  it('ignora un userId enviado en el cuerpo: manda el del token', () =>
    request(app.getHttpServer())
      .post('/echo')
      .set('Authorization', 'Bearer token-de-ana')
      .send({ userId: 'victima-uuid' })
      .expect(201, { userId: 'ana-uuid', ignoredFromBody: 'victima-uuid' }));
});