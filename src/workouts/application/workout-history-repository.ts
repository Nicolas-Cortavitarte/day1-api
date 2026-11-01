import { WorkoutHistoryEntry } from '../domain/workout-history-entry';

export abstract class WorkoutHistoryRepository {
  abstract findForUser(userId: string, limit: number): Promise<WorkoutHistoryEntry[]>;
}