import { WorkoutSet } from '../domain/workout-set';

export type NewWorkoutSet = Pick<
  WorkoutSet, 'sessionExerciseId' | 'reps' | 'weightValue' | 'weightUnit' | 'durationSeconds' | 'completedAt'
>;

export abstract class WorkoutSetRepository {
  abstract countForSessionExercise(sessionExerciseId: string): Promise<number>;
  abstract create(set: NewWorkoutSet): Promise<WorkoutSet>;
}