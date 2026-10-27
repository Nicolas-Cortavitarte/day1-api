import { NotFoundException } from '@nestjs/common';
import { Activity } from '../../activities/domain/activity';
import { ActivityRepository } from '../../activities/application/activity-repository';
import { WorkoutSession } from '../domain/workout-session';
import { WorkoutSessionRepository } from './workout-session-repository';
import { WorkoutSessionExercise } from '../domain/workout-session-exercise';
import { WorkoutSessionExerciseRepository } from './workout-session-exercise-repository';
import { WorkoutSet } from '../domain/workout-set';
import { NewWorkoutSet, WorkoutSetRepository } from './workout-set-repository';
import { LogSet } from './log-set';

class FakeActivities extends ActivityRepository {
  constructor(private activities: Activity[]) {
    super();
  }
  create(): Promise<Activity> {
    throw new Error('no usado');
  }
  findByUserAndDate(): Promise<Activity[]> {
    throw new Error('no usado');
  }
  async findById(id: string): Promise<Activity | null> {
    return this.activities.find((a) => a.id === id) ?? null;
  }
  setCompletedAt(): Promise<Activity> {
    throw new Error('no usado');
  }
  softDelete(): Promise<void> {
    throw new Error('no usado');
  }
  reschedule(): Promise<Activity> {
    throw new Error('no usado');
  }
  countForSession(): Promise<number> {
    throw new Error('no usado');
  }
}

class FakeSessions extends WorkoutSessionRepository {
  constructor(private sessions: WorkoutSession[]) {
    super();
  }
  findByActivityId(): Promise<WorkoutSession | null> {
    throw new Error('no usado');
  }
  async findById(id: string): Promise<WorkoutSession | null> {
    return this.sessions.find((s) => s.id === id) ?? null;
  }
}

class FakeSessionExercises extends WorkoutSessionExerciseRepository {
  constructor(private items: WorkoutSessionExercise[]) {
    super();
  }
  countForSession(): Promise<number> {
    throw new Error('no usado');
  }
  add(): Promise<WorkoutSessionExercise> {
    throw new Error('no usado');
  }
  async findById(id: string): Promise<WorkoutSessionExercise | null> {
    return this.items.find((e) => e.id === id) ?? null;
  }
}

class FakeSets extends WorkoutSetRepository {
  public created?: NewWorkoutSet;
  countForSessionExercise(): Promise<number> {
    return Promise.resolve(0);
  }
  async create(set: NewWorkoutSet): Promise<WorkoutSet> {
    this.created = set;
    return { id: 'set1', setNumber: 1, ...set };
  }
}

const activity: Activity = {
  id: 'act1',
  userId: 'u1',
  categoryId: 2,
  title: 'Gym',
  description: null,
  scheduledDate: '2026-10-27',
  startTime: null,
  durationMinutes: null,
  completedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};
const session: WorkoutSession = {
  id: 'ses1',
  activityId: 'act1',
  startedAt: null,
  endedAt: null,
  notes: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};
const sessionExercise: WorkoutSessionExercise = {
  id: 'se1',
  sessionId: 'ses1',
  exerciseId: 'ex1',
  position: 1,
  notes: null,
};

const makeUseCase = (opts: { activities?: Activity[] } = {}) =>
  new LogSet(
    new FakeActivities(opts.activities ?? [activity]),
    new FakeSessions([session]),
    new FakeSessionExercises([sessionExercise]),
    new FakeSets(),
  );

describe('LogSet', () => {
  it('registra la serie con el siguiente número', async () => {
    const result = await makeUseCase().execute({
      sessionExerciseId: 'se1',
      userId: 'u1',
      reps: 10,
      weightValue: 40,
      weightUnit: 'KG',
    });
    expect(result.reps).toBe(10);
  });

  it('404 si el ejercicio de sesión no existe', async () => {
    await expect(
      new LogSet(
        new FakeActivities([activity]),
        new FakeSessions([session]),
        new FakeSessionExercises([]),
        new FakeSets(),
      ).execute({ sessionExerciseId: 'nope', userId: 'u1' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('404 si la sesión no es del usuario', async () => {
    await expect(
      makeUseCase({ activities: [{ ...activity, userId: 'otro' }] }).execute({
        sessionExerciseId: 'se1',
        userId: 'u1',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
