import { Injectable } from '@nestjs/common';
import { UserProfile } from '../domain/user-profile';
import { ProfileUpdate, UserProfileRepository } from './user-profile-repository';

@Injectable()
export class UpdateMyProfile {
  constructor(private readonly profile: UserProfileRepository) {}
  execute(userId: string, changes: ProfileUpdate): Promise<UserProfile> {
    return this.profile.update(userId, changes);
  }
}