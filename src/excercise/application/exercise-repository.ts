import { Exercise } from '../domain/exercise';

export type NewExercise = Pick<Exercise, 'userId' | 'name' | 'muscleGroup'>;

export abstract class ExerciseRepository {
  abstract findAvailableFor(userId: string): Promise<Exercise[]>;

  abstract create(exercise: NewExercise): Promise<Exercise>;
}