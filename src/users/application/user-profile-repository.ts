import { UserProfile } from '../domain/user-profile';

export type ProfileUpdate = Partial<Pick<UserProfile, 'displayName' | 'avatarUrl'>>;

export abstract class UserProfileRepository {
  abstract findByUserId(userId: string): Promise<UserProfile>;
  
  abstract update(userId: string, changes: ProfileUpdate): Promise<UserProfile>;
}