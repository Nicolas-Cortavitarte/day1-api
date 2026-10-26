import { Activity } from '../domain/activity';
import { ActivityRepository } from './activity-repository';
import {
  CheckActivityConflicts,
  CheckConflictsInput,
} from './check-activity-conflicts';

class FakeRepository extends ActivityRepository {
  constructor(private activities: Activity[]) {
    super();
  }
  create(): Promise<Activity> {
    throw new Error('no usado en estos tests');
  }
  async findByUserAndDate(
    userId: string,
    scheduledDate: string,
  ): Promise<Activity[]> {
    return this.activities.filter(
      (a) => a.userId === userId && a.scheduledDate === scheduledDate,
    );
  }
}

const make = (over: Partial<Activity>): Activity => ({
  id: over.id ?? 'other',
  userId: 'u1',
  categoryId: 1,
  title: 'x',
  description: null,
  scheduledDate: '2026-10-26',
  startTime: null,
  durationMinutes: null,
  completedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...over,
});

const run = (
  existing: Activity[],
  input: Omit<CheckConflictsInput, 'userId' | 'excludeActivityId'>,
  options: { excludeActivityId?: string } = {},
) =>
  new CheckActivityConflicts(new FakeRepository(existing)).execute({
    userId: 'u1',
    ...input,
    ...options,
  });

describe('CheckActivityConflicts', () => {
  it('sin hora (flexible) nunca choca', async () => {
    const existing = [make({ startTime: '09:00:00' })];
    await expect(
      run(existing, {
        scheduledDate: '2026-10-26',
        startTime: null,
        durationMinutes: null,
      }),
    ).resolves.toEqual([]);
  });

  it('sin duración: nunca choca, ni siquiera con la misma hora exacta', async () => {
    const existing = [make({ startTime: '09:00:00' })];
    await expect(
      run(existing, {
        scheduledDate: '2026-10-26',
        startTime: '09:00:00',
        durationMinutes: null,
      }),
    ).resolves.toEqual([]);
  });

  it('sin duración no bloquea a otra actividad con duración', async () => {
    const existing = [make({ startTime: '09:00:00', durationMinutes: null })];
    await expect(
      run(existing, {
        scheduledDate: '2026-10-26',
        startTime: '09:00:00',
        durationMinutes: 30,
      }),
    ).resolves.toEqual([]);
  });

  it('con duración: choca si los rangos se solapan', async () => {
    const existing = [make({ startTime: '09:00:00', durationMinutes: 60 })]; // 09:00–10:00
    await expect(
      run(existing, {
        scheduledDate: '2026-10-26',
        startTime: '09:30:00',
        durationMinutes: 30,
      }),
    ).resolves.toHaveLength(1);
    await expect(
      run(existing, {
        scheduledDate: '2026-10-26',
        startTime: '10:00:00',
        durationMinutes: 30,
      }),
    ).resolves.toEqual([]); // justo al terminar, no choca
  });

  it('excluye la propia actividad al reprogramar', async () => {
    const existing = [make({ id: 'a1', startTime: '09:00:00' })];
    await expect(
      run(
        existing,
        {
          scheduledDate: '2026-10-26',
          startTime: '09:00:00',
          durationMinutes: null,
        },
        { excludeActivityId: 'a1' },
      ),
    ).resolves.toEqual([]);
  });

  it('otra fecha nunca choca', async () => {
    const existing = [
      make({ startTime: '09:00:00', scheduledDate: '2026-10-27' }),
    ];
    await expect(
      run(existing, {
        scheduledDate: '2026-10-26',
        startTime: '09:00:00',
        durationMinutes: null,
      }),
    ).resolves.toEqual([]);
  });
});
