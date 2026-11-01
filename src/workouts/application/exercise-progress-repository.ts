import { ExerciseProgressPoint } from '../domain/exercise-progress-point';

export abstract class ExerciseProgressRepository {
  abstract findForExercise(exerciseId: string, userId: string): Promise<ExerciseProgressPoint[]>;
}