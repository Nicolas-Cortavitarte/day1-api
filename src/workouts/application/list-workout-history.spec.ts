import { WorkoutHistoryEntry } from '../domain/workout-history-entry';
import { WorkoutHistoryRepository } from './workout-history-repository';
import { ListWorkoutHistory } from './list-workout-history';

class FakeRepository extends WorkoutHistoryRepository {
  lastLimit?: number;
  constructor(private entries: WorkoutHistoryEntry[]) { super(); }
  async findForUser(userId: string, limit: number): Promise<WorkoutHistoryEntry[]> {
    this.lastLimit = limit;
    return this.entries.slice(0, limit);
  }
}

const make = (over: Partial<WorkoutHistoryEntry>): WorkoutHistoryEntry => ({
  sessionId: 's1', activityId: 'a1', activityTitle: 'Pierna', scheduledDate: '2026-10-20',
  exerciseCount: 3, setCount: 9, ...over,
});

describe('ListWorkoutHistory', () => {
  it('usa el límite por defecto si no se especifica', async () => {
    const repo = new FakeRepository([make({})]);
    await new ListWorkoutHistory(repo).execute('u1');
    expect(repo.lastLimit).toBe(30);
  });

  it('respeta el límite pedido, sin pasar el máximo', async () => {
    const repo = new FakeRepository([make({})]);
    await new ListWorkoutHistory(repo).execute('u1', 500);
    expect(repo.lastLimit).toBe(100);
  });
});