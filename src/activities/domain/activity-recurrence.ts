export type RecurrenceFrequency = 'DAILY' | 'WEEKLY';

export interface ActivityRecurrence {
  readonly id: string;
  readonly userId: string;
  readonly categoryId: number;
  readonly title: string;
  readonly description: string | null;
  readonly startTime: string | null;
  readonly durationMinutes: number | null;
  readonly reminderMinutes: number | null;
  readonly frequency: RecurrenceFrequency;
  readonly intervalCount: number;
  readonly daysOfWeek: number[];
  readonly startDate: string;
  readonly endDate: string | null;
  readonly generatedUntil: string;
}