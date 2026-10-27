import { Injectable } from '@nestjs/common';
import { UserPreferences } from '../domain/user-preferences';
import { UserPreferencesRepository } from './user-preferences-repository';

@Injectable()
export class GetMyPreferences {
  constructor(private readonly preferences: UserPreferencesRepository) {}
  execute(userId: string): Promise<UserPreferences> {
    return this.preferences.findByUserId(userId);
  }
}