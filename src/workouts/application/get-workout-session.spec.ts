import { NotFoundException } from '@nestjs/common';
import { Activity } from '../../activities/domain/activity';
import { ActivityRepository } from '../../activities/application/activity-repository';
import { WorkoutSession } from '../domain/workout-session';
import { WorkoutSessionRepository } from './workout-session-repository';
import { WorkoutSessionDetail } from '../domain/workout-session-detail';
import { WorkoutSessionDetailRepository } from './workout-session-detail-repository';
import { GetWorkoutSession } from './get-workout-session';

class FakeActivities extends ActivityRepository {
  constructor(private activities: Activity[]) { super(); }
  create(): Promise<Activity> { throw new Error('no usado'); }
  findByUserAndDate(): Promise<Activity[]> { throw new Error('no usado'); }
  async findById(id: string): Promise<Activity | null> { return this.activities.find((a) => a.id === id) ?? null; }
  setCompletedAt(): Promise<Activity> { throw new Error('no usado'); }
  softDelete(): Promise<void> { throw new Error('no usado'); }
  reschedule(): Promise<Activity> { throw new Error('no usado'); }
}

class FakeSessions extends WorkoutSessionRepository {
  constructor(private sessions: WorkoutSession[]) { super(); }
  async findByActivityId(activityId: string): Promise<WorkoutSession | null> {
    return this.sessions.find((s) => s.activityId === activityId) ?? null;
  }
  findById(): Promise<WorkoutSession | null> { throw new Error('no usado'); }
}

class FakeDetail extends WorkoutSessionDetailRepository {
  constructor(private detail: WorkoutSessionDetail | null) { super(); }
  async findBySessionId(): Promise<WorkoutSessionDetail | null> { return this.detail; }
}

const activity: Activity = {
  id: 'act1', userId: 'u1', categoryId: 2, title: 'Gym', description: null,
  scheduledDate: '2026-10-27', startTime: null, durationMinutes: null,
  completedAt: null, createdAt: new Date(), updatedAt: new Date(),
};
const session: WorkoutSession = {
  id: 'ses1', activityId: 'act1', startedAt: null, endedAt: null, notes: null,
  createdAt: new Date(), updatedAt: new Date(),
};
const detail: WorkoutSessionDetail = { id: 'ses1', activityId: 'act1', startedAt: null, endedAt: null, notes: null, exercises: [] };

describe('GetWorkoutSession', () => {
  it('devuelve el detalle si la actividad es del usuario y tiene sesión', async () => {
    const result = await new GetWorkoutSession(new FakeActivities([activity]), new FakeSessions([session]), new FakeDetail(detail))
      .execute({ activityId: 'act1', userId: 'u1' });
    expect(result.id).toBe('ses1');
  });

  it('404 si la actividad no es del usuario', async () => {
    await expect(
      new GetWorkoutSession(new FakeActivities([{ ...activity, userId: 'otro' }]), new FakeSessions([session]), new FakeDetail(detail))
        .execute({ activityId: 'act1', userId: 'u1' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('404 si la actividad no tiene sesión de gimnasio', async () => {
    await expect(
      new GetWorkoutSession(new FakeActivities([activity]), new FakeSessions([]), new FakeDetail(detail))
        .execute({ activityId: 'act1', userId: 'u1' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});