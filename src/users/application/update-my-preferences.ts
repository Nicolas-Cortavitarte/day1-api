import { Injectable } from '@nestjs/common';
import { UserPreferences } from '../domain/user-preferences';
import { PreferencesUpdate, UserPreferencesRepository } from './user-preferences-repository';

@Injectable()
export class UpdateMyPreferences {
  constructor(private readonly preferences: UserPreferencesRepository) {}
  execute(userId: string, changes: PreferencesUpdate): Promise<UserPreferences> {
    return this.preferences.update(userId, changes);
  }
}