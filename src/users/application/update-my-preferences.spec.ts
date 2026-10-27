import { PreferencesUpdate, UserPreferencesRepository } from './user-preferences-repository';
import { UserPreferences } from '../domain/user-preferences';
import { UpdateMyPreferences } from './update-my-preferences';

class FakeRepository extends UserPreferencesRepository {
  public lastUpdate?: { userId: string; changes: PreferencesUpdate };
  findByUserId(): Promise<UserPreferences> { throw new Error('no usado'); }
  async update(userId: string, changes: PreferencesUpdate): Promise<UserPreferences> {
    this.lastUpdate = { userId, changes };
    return {
      timezone: 'America/Lima', locale: 'es', weekStartsOn: 1, preferredWeightUnit: 'KG',
      notificationsEnabled: true, defaultReminderMinutes: 10, dailySummaryTime: null, ...changes,
    };
  }
}

describe('UpdateMyPreferences', () => {
  it('pasa solo los cambios que el usuario mandó', async () => {
    const repo = new FakeRepository();
    await new UpdateMyPreferences(repo).execute('u1', { preferredWeightUnit: 'LB' });
    expect(repo.lastUpdate).toEqual({ userId: 'u1', changes: { preferredWeightUnit: 'LB' } });
  });
});