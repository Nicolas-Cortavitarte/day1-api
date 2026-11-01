export interface WorkoutHistoryEntry {
  readonly sessionId: string;
  readonly activityId: string;
  readonly activityTitle: string;
  readonly scheduledDate: string;
  readonly exerciseCount: number;
  readonly setCount: number;
}