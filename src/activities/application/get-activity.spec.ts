import { NotFoundException } from '@nestjs/common';
import { Activity } from '../domain/activity';
import { ActivityRepository } from './activity-repository';
import { GetActivity } from './get-activity';

class FakeRepository extends ActivityRepository {
  constructor(private activities: Activity[]) { super(); }
  create(): Promise<Activity> { throw new Error('no usado'); }
  findByUserAndDate(): Promise<Activity[]> { throw new Error('no usado'); }
  async findById(id: string): Promise<Activity | null> { return this.activities.find((a) => a.id === id) ?? null; }
  setCompletedAt(): Promise<Activity> { throw new Error('no usado'); }
  softDelete(): Promise<void> { throw new Error('no usado'); }
  reschedule(): Promise<Activity> { throw new Error('no usado'); }
}

const make = (over: Partial<Activity>): Activity => ({
  id: 'a1', userId: 'u1', categoryId: 1, title: 'x', description: null,
  scheduledDate: '2026-10-27', startTime: null, durationMinutes: null,
  completedAt: null, createdAt: new Date(), updatedAt: new Date(), ...over,
});

describe('GetActivity', () => {
  it('devuelve la actividad si es del usuario', async () => {
    const result = await new GetActivity(new FakeRepository([make({})])).execute({ activityId: 'a1', userId: 'u1' });
    expect(result.id).toBe('a1');
  });

  it('404 si no existe', async () => {
    await expect(new GetActivity(new FakeRepository([])).execute({ activityId: 'nope', userId: 'u1' }))
      .rejects.toBeInstanceOf(NotFoundException);
  });

  it('404 si es de otro usuario', async () => {
    await expect(new GetActivity(new FakeRepository([make({ userId: 'otro' })])).execute({ activityId: 'a1', userId: 'u1' }))
      .rejects.toBeInstanceOf(NotFoundException);
  });
});