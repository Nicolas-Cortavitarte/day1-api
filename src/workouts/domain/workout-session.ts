export interface WorkoutSession {
  readonly id: string;
  readonly activityId: string;
  readonly startedAt: Date | null;
  readonly endedAt: Date | null;
  readonly notes: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}