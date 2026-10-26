import { Activity } from '../domain/activity';

export type NewActivity = Omit<Activity, 'id' | 'completedAt' | 'createdAt' | 'updatedAt'>;

export abstract class ActivityRepository {
  abstract create(activity: NewActivity): Promise<Activity>;

  abstract findByUserAndDate(userId: string, date: string): Promise<Activity[]>;
}