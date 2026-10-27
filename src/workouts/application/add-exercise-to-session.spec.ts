import { NotFoundException } from '@nestjs/common';
import { Activity } from '../../activities/domain/activity';
import { ActivityRepository } from '../../activities/application/activity-repository';
import { Exercise } from '../../excercises/domain/exercise';
import { ExerciseRepository } from '../../excercises/application/exercise-repository';
import { WorkoutSession } from '../domain/workout-session';
import { WorkoutSessionRepository } from './workout-session-repository';
import { WorkoutSessionExercise } from '../domain/workout-session-exercise';
import { NewSessionExercise, WorkoutSessionExerciseRepository } from './workout-session-exercise-repository';
import { AddExerciseToSession } from './add-exercise-to-session';

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
}

class FakeExercises extends ExerciseRepository {
  constructor(private exercises: Exercise[]) { super(); }
  findAvailableFor(): Promise<Exercise[]> { throw new Error('no usado'); }
  create(): Promise<Exercise> { throw new Error('no usado'); }
  async findById(id: string): Promise<Exercise | null> { return this.exercises.find((e) => e.id === id) ?? null; }
}

class FakeSessionExercises extends WorkoutSessionExerciseRepository {
  public added?: NewSessionExercise;
  countForSession(): Promise<number> { return Promise.resolve(0); }
  async add(input: NewSessionExercise): Promise<WorkoutSessionExercise> {
    this.added = input;
    return { id: 'se1', position: 1, ...input, notes: input.notes ?? null };
  }
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
const systemExercise: Exercise = { id: 'ex1', userId: null, name: 'Sentadilla', muscleGroup: null };

const makeUseCase = (opts: { activities?: Activity[]; sessions?: WorkoutSession[]; exercises?: Exercise[] } = {}) =>
  new AddExerciseToSession(
    new FakeActivities(opts.activities ?? [activity]),
    new FakeSessions(opts.sessions ?? [session]),
    new FakeSessionExercises(),
    new FakeExercises(opts.exercises ?? [systemExercise]),
  );

describe('AddExerciseToSession', () => {
  it('agrega un ejercicio del sistema a la sesión', async () => {
    const result = await makeUseCase().execute({ activityId: 'act1', userId: 'u1', exerciseId: 'ex1' });
    expect(result.exerciseId).toBe('ex1');
  });

  it('404 si la actividad no es del usuario', async () => {
    await expect(
      makeUseCase({ activities: [{ ...activity, userId: 'otro' }] }).execute({ activityId: 'act1', userId: 'u1', exerciseId: 'ex1' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('404 si la actividad no tiene sesión de gimnasio', async () => {
    await expect(
      makeUseCase({ sessions: [] }).execute({ activityId: 'act1', userId: 'u1', exerciseId: 'ex1' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('404 si el ejercicio es privado de otro usuario', async () => {
    await expect(
      makeUseCase({ exercises: [{ ...systemExercise, userId: 'otro' }] }).execute({ activityId: 'act1', userId: 'u1', exerciseId: 'ex1' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});