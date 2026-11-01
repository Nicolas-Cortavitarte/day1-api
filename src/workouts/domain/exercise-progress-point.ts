import { WeightUnit } from './workout-set';

export interface ExerciseProgressPoint {
  readonly sessionId: string;
  readonly date: string;
  readonly bestWeightValue: number | null;
  readonly weightUnit: WeightUnit | null;
  readonly reps: number | null;
  readonly durationSeconds: number | null;
}