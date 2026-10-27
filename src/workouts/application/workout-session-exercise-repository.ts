import { WorkoutSessionExercise } from '../domain/workout-session-exercise';

export type NewSessionExercise = Pick<WorkoutSessionExercise, 'sessionId' | 'exerciseId' | 'notes'>;

export abstract class WorkoutSessionExerciseRepository {
  abstract countForSession(sessionId: string): Promise<number>;
  
  abstract add(input: NewSessionExercise): Promise<WorkoutSessionExercise>;
}