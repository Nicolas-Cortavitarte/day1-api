export type WeightUnit = 'KG' | 'LB';

export interface WorkoutSet {
  readonly id: string;
  readonly sessionExerciseId: string;
  readonly setNumber: number;
  readonly reps: number | null;
  readonly weightValue: number | null;
  readonly weightUnit: WeightUnit | null;
  readonly durationSeconds: number | null;
  readonly completedAt: Date | null;
}