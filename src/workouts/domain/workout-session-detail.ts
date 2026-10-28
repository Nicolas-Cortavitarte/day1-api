import { WeightUnit } from './workout-set';

export interface WorkoutSetSummary {
  readonly id: string;
  readonly setNumber: number;
  readonly reps: number | null;
  readonly weightValue: number | null;
  readonly weightUnit: WeightUnit | null;
  readonly durationSeconds: number | null;
  readonly completedAt: Date | null;
}

export interface WorkoutSessionExerciseDetail {
  readonly id: string;
  readonly exerciseId: string;
  readonly exerciseName: string;
  readonly position: number;
  readonly notes: string | null;
  readonly sets: WorkoutSetSummary[];
}

export interface WorkoutSessionDetail {
  readonly id: string;
  readonly activityId: string;
  readonly startedAt: Date | null;
  readonly endedAt: Date | null;
  readonly notes: string | null;
  readonly exercises: WorkoutSessionExerciseDetail[];
}