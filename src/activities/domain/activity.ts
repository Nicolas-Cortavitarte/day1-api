export type WeightUnit = 'KG' | 'LB';

export interface Activity {
  readonly id: string;
  readonly userId: string;
  readonly categoryId: number;
  readonly title: string;
  readonly description: string | null;
  readonly scheduledDate: string;
  readonly startTime: string | null;
  readonly durationMinutes: number | null;
  readonly completedAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface RescheduleInput {
  activityId: string;
  fromDate: string;
  fromTime: string | null;
  toDate: string;
  toTime: string | null;
}