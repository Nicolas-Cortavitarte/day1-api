import { ActivityRecurrence } from '../domain/activity-recurrence';

export type NewActivityRecurrence = Omit<ActivityRecurrence, 'id'>;

export abstract class ActivityRecurrenceRepository {
  abstract createWithOccurrences(rule: NewActivityRecurrence, occurrenceDates: string[]): Promise<ActivityRecurrence>;

  abstract findById(id: string): Promise<ActivityRecurrence | null>;

  abstract updateAndCascade(
    id: string,
    changes: Partial<
      Pick<ActivityRecurrence, 'title' | 'description' | 'categoryId' | 'durationMinutes' | 'reminderMinutes'>
    >,
  ): Promise<ActivityRecurrence>;
}