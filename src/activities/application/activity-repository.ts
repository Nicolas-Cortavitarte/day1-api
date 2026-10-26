import { Activity } from '../domain/activity';

export type NewActivity = Omit<Activity, 'id' | 'completedAt' | 'createdAt' | 'updatedAt'>;

export abstract class ActivityRepository {
  abstract create(activity: NewActivity): Promise<Activity>;

  abstract findByUserAndDate(userId: string, date: string): Promise<Activity[]>;

  abstract findById(id: string): Promise<Activity | null>;

  abstract setCompletedAt(id: string, completedAt: Date | null): Promise<Activity>; 
}