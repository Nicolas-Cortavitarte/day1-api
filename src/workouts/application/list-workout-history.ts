import { Injectable } from '@nestjs/common';
import { WorkoutHistoryEntry } from '../domain/workout-history-entry';
import { WorkoutHistoryRepository } from './workout-history-repository';

const DEFAULT_LIMIT = 30;
const MAX_LIMIT = 100;

@Injectable()
export class ListWorkoutHistory {
  constructor(private readonly history: WorkoutHistoryRepository) {}

  execute(userId: string, limit?: number): Promise<WorkoutHistoryEntry[]> {
    const safeLimit = Math.min(limit && limit > 0 ? limit : DEFAULT_LIMIT, MAX_LIMIT);
    return this.history.findForUser(userId, safeLimit);
  }
}