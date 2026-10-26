import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TokenVerifier } from './application/token-verifier';
import { SupabaseTokenVerifier } from './infrastructure/supabase-token-verifier';
import { AuthGuard } from './presentation/auth.guard';

@Module({
  providers: [
    {
      provide: TokenVerifier,
      useFactory: () => new SupabaseTokenVerifier(process.env.SUPABASE_URL),
    },
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
  exports: [TokenVerifier],
})
export class AuthModule {}