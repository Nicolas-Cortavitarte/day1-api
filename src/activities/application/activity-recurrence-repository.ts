import { ActivityRecurrence } from '../domain/activity-recurrence';

export type NewActivityRecurrence = Omit<ActivityRecurrence, 'id'>;

export abstract class ActivityRecurrenceRepository {
  abstract createWithOccurrences(rule: NewActivityRecurrence, occurrenceDates: string[]): Promise<ActivityRecurrence>;
}