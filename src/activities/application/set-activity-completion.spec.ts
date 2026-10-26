import { NotFoundException } from '@nestjs/common';
import { Activity } from '../domain/activity';
import { ActivityRepository } from './activity-repository';
import { SetActivityCompletion } from './set-activity-completion';

class FakeRepository extends ActivityRepository {
  constructor(private activities: Activity[]) { super(); }
  create(): Promise<Activity> { throw new Error('no usado'); }
  findByUserAndDate(): Promise<Activity[]> { throw new Error('no usado'); }
  async findById(id: string): Promise<Activity | null> {
    return this.activities.find((a) => a.id === id) ?? null;
  }
  async setCompletedAt(id: string, completedAt: Date | null): Promise<Activity> {
    const activity = this.activities.find((a) => a.id === id)!;
    return { ...activity, completedAt };
  }
}

const make = (over: Partial<Activity>): Activity => ({
  id: 'a1', userId: 'u1', categoryId: 1, title: 'x', description: null,
  scheduledDate: '2026-10-26', startTime: null, durationMinutes: null,
  completedAt: null, createdAt: new Date(), updatedAt: new Date(), ...over,
});

describe('SetActivityCompletion', () => {
  it('marca la actividad como completada', async () => {
    const repo = new FakeRepository([make({})]);
    const result = await new SetActivityCompletion(repo).execute({ activityId: 'a1', userId: 'u1', completed: true });
    expect(result.completedAt).toBeInstanceOf(Date);
  });

  it('la descompleta', async () => {
    const repo = new FakeRepository([make({ completedAt: new Date() })]);
    const result = await new SetActivityCompletion(repo).execute({ activityId: 'a1', userId: 'u1', completed: false });
    expect(result.completedAt).toBeNull();
  });

  it('404 si la actividad no existe', async () => {
    const repo = new FakeRepository([]);
    await expect(new SetActivityCompletion(repo).execute({ activityId: 'nope', userId: 'u1', completed: true }))
      .rejects.toBeInstanceOf(NotFoundException);
  });

  it('404 si la actividad es de otro usuario (no 403)', async () => {
    const repo = new FakeRepository([make({ userId: 'otro' })]);
    await expect(new SetActivityCompletion(repo).execute({ activityId: 'a1', userId: 'u1', completed: true }))
      .rejects.toBeInstanceOf(NotFoundException);
  });
});