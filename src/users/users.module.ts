import { Module } from '@nestjs/common';
import { GetMyPreferences } from './application/get-my-preferences';
import { UpdateMyPreferences } from './application/update-my-preferences';
import { UserPreferencesRepository } from './application/user-preferences-repository';
import { PrismaUserPreferencesRepository } from './infrastructure/prisma-user-preferences-repository';
import { GetMyProfile } from './application/get-my-profile';
import { UpdateMyProfile } from './application/update-my-profile';
import { UserProfileRepository } from './application/user-profile-repository';
import { PrismaUserProfileRepository } from './infrastructure/prisma-user-profile-repository';
import { DeleteMyAccount } from './application/delete-my-account';
import { UserAccountRepository } from './application/user-account-repository';
import { PrismaUserAccountRepository } from './infrastructure/prisma-user-account-repository';
import { UsersController } from './presentation/users.controller';
import { UserProfileController } from './presentation/user-profile.controller';

@Module({
  controllers: [UsersController, UserProfileController],
  providers: [
    { provide: UserPreferencesRepository, useClass: PrismaUserPreferencesRepository },
    GetMyPreferences,
    UpdateMyPreferences,
    { provide: UserProfileRepository, useClass: PrismaUserProfileRepository },
    GetMyProfile,
    UpdateMyProfile,
    { provide: UserAccountRepository, useClass: PrismaUserAccountRepository },
    DeleteMyAccount,
  ],
})
export class UsersModule {}