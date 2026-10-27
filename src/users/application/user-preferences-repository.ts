import { UserPreferences } from '../domain/user-preferences';

export type PreferencesUpdate = Partial<UserPreferences>;

export abstract class UserPreferencesRepository {
  abstract findByUserId(userId: string): Promise<UserPreferences>;
  
  abstract update(userId: string, changes: PreferencesUpdate): Promise<UserPreferences>;
}