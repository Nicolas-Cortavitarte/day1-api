import { NotFoundException } from '@nestjs/common';
import { Activity } from '../domain/activity';
import { ActivityRepository } from './activity-repository';
import { DeleteActivity } from './delete-activity';

class FakeRepository extends ActivityRepository {
  public deletedIds: string[] = [];
  constructor(private activities: Activity[]) { super(); }
  create(): Promise<Activity> { throw new Error('no usado'); }
  findByUserAndDate(): Promise<Activity[]> { throw new Error('no usado'); }
  setCompletedAt(): Promise<Activity> { throw new Error('no usado'); }
  async findById(id: string): Promise<Activity | null> {
    return this.activities.find((a) => a.id === id) ?? null;
  }
  async softDelete(id: string): Promise<void> {
    this.deletedIds.push(id);
  }
}

const make = (over: Partial<Activity>): Activity => ({
  id: 'a1', userId: 'u1', categoryId: 1, title: 'x', description: null,
  scheduledDate: '2026-10-26', startTime: null, durationMinutes: null,
  completedAt: null, createdAt: new Date(), updatedAt: new Date(), ...over,
});

describe('DeleteActivity', () => {
  it('marca la actividad como eliminada (soft delete)', async () => {
    const repo = new FakeRepository([make({})]);
    await new DeleteActivity(repo).execute({ activityId: 'a1', userId: 'u1' });
    expect(repo.deletedIds).toEqual(['a1']);
  });

  it('404 si no existe', async () => {
    const repo = new FakeRepository([]);
    await expect(new DeleteActivity(repo).execute({ activityId: 'nope', userId: 'u1' })).rejects.toBeInstanceOf(NotFoundException);
  });

  it('404 si es de otro usuario, y no la borra', async () => {
    const repo = new FakeRepository([make({ userId: 'otro' })]);
    await expect(new DeleteActivity(repo).execute({ activityId: 'a1', userId: 'u1' })).rejects.toBeInstanceOf(NotFoundException);
    expect(repo.deletedIds).toEqual([]);
  });
});