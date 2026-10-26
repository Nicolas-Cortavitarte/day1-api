import { NotFoundException } from '@nestjs/common';
import { Activity, RescheduleInput } from '../domain/activity';
import { ActivityRepository } from './activity-repository';
import { RescheduleActivity } from './reschedule-activity';

class FakeRepository extends ActivityRepository {
  public lastReschedule?: RescheduleInput;
  constructor(private activities: Activity[]) { super(); }
  create(): Promise<Activity> { throw new Error('no usado'); }
  findByUserAndDate(): Promise<Activity[]> { throw new Error('no usado'); }
  setCompletedAt(): Promise<Activity> { throw new Error('no usado'); }
  softDelete(): Promise<void> { throw new Error('no usado'); }
  async findById(id: string): Promise<Activity | null> {
    return this.activities.find((a) => a.id === id) ?? null;
  }
  async reschedule(input: RescheduleInput): Promise<Activity> {
    this.lastReschedule = input;
    const activity = this.activities.find((a) => a.id === input.activityId)!;
    return { ...activity, scheduledDate: input.toDate, startTime: input.toTime };
  }
}

const make = (over: Partial<Activity>): Activity => ({
  id: 'a1', userId: 'u1', categoryId: 1, title: 'x', description: null,
  scheduledDate: '2026-10-26', startTime: '09:00:00', durationMinutes: null,
  completedAt: null, createdAt: new Date(), updatedAt: new Date(), ...over,
});

describe('RescheduleActivity', () => {
  it('mueve la actividad y registra from/to', async () => {
    const repo = new FakeRepository([make({})]);
    const result = await new RescheduleActivity(repo).execute({
      activityId: 'a1', userId: 'u1', toDate: '2026-10-28', toTime: '15:00:00',
    });
    expect(result.scheduledDate).toBe('2026-10-28');
    expect(repo.lastReschedule).toEqual({
      activityId: 'a1', fromDate: '2026-10-26', fromTime: '09:00:00', toDate: '2026-10-28', toTime: '15:00:00',
    });
  });

  it('404 si no existe', async () => {
    const repo = new FakeRepository([]);
    await expect(new RescheduleActivity(repo).execute({ activityId: 'nope', userId: 'u1', toDate: '2026-10-28', toTime: null }))
      .rejects.toBeInstanceOf(NotFoundException);
  });

  it('404 si es de otro usuario', async () => {
    const repo = new FakeRepository([make({ userId: 'otro' })]);
    await expect(new RescheduleActivity(repo).execute({ activityId: 'a1', userId: 'u1', toDate: '2026-10-28', toTime: null }))
      .rejects.toBeInstanceOf(NotFoundException);
  });
});