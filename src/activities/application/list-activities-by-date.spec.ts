import { Activity } from '../domain/activity';
import { ActivityRepository } from './activity-repository';
import { ListActivitiesByDate } from './list-activities-by-date';

class FakeRepository extends ActivityRepository {
  constructor(private activities: Activity[]) { super(); }
  create(): Promise<Activity> { throw new Error('no usado'); }
  async findByUserAndDate(userId: string, scheduledDate: string): Promise<Activity[]> {
    return this.activities.filter((a) => a.userId === userId && a.scheduledDate === scheduledDate);
  }
}

const make = (over: Partial<Activity>): Activity => ({
  id: 'a1', userId: 'u1', categoryId: 1, title: 'x', description: null,
  scheduledDate: '2026-10-26', startTime: null, durationMinutes: null,
  completedAt: null, createdAt: new Date(), updatedAt: new Date(), ...over,
});

describe('ListActivitiesByDate', () => {
  it('devuelve solo las actividades del usuario en esa fecha', async () => {
    const repo = new FakeRepository([
      make({ id: 'a1', userId: 'u1', scheduledDate: '2026-10-26' }),
      make({ id: 'a2', userId: 'u1', scheduledDate: '2026-10-27' }), // otra fecha
      make({ id: 'a3', userId: 'u2', scheduledDate: '2026-10-26' }), // otro usuario
    ]);
    const result = await new ListActivitiesByDate(repo).execute({ userId: 'u1', scheduledDate: '2026-10-26' });
    expect(result).toEqual([expect.objectContaining({ id: 'a1' })]);
  });
});