import { Injectable } from '@nestjs/common';
import { UserProfile } from '../domain/user-profile';
import { UserProfileRepository } from './user-profile-repository';

@Injectable()
export class GetMyProfile {
  constructor(private readonly profile: UserProfileRepository) {}
  execute(userId: string): Promise<UserProfile> {
    return this.profile.findByUserId(userId);
  }
}