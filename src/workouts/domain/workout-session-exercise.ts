export interface WorkoutSessionExercise {
  readonly id: string;
  readonly sessionId: string;
  readonly exerciseId: string;
  readonly position: number;
  readonly notes: string | null;
}