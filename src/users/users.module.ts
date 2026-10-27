import { Module } from '@nestjs/common';
import { GetMyPreferences } from './application/get-my-preferences';
import { UpdateMyPreferences } from './application/update-my-preferences';
import { UserPreferencesRepository } from './application/user-preferences-repository';
import { PrismaUserPreferencesRepository } from './infrastructure/prisma-user-preferences-repository';
import { UsersController } from './presentation/users.controller';

@Module({
  controllers: [UsersController],
  providers: [
    { provide: UserPreferencesRepository, useClass: PrismaUserPreferencesRepository },
    GetMyPreferences,
    UpdateMyPreferences,
  ],
})
export class UsersModule {}