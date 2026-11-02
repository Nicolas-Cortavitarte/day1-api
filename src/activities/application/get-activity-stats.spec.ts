import { ActivityStatsRow } from './activity-stats-repository';
import { computeStats } from './get-activity-stats';

const make = (over: Partial<ActivityStatsRow>): ActivityStatsRow => ({
  scheduledDate: '2026-10-20',
  completedAt: null,
  categoryId: 1,
  categoryName: 'Gimnasio',
  ...over,
});

describe('computeStats', () => {
  it('ignora actividades futuras para el % de cumplimiento', () => {
    const rows = [
      make({ scheduledDate: '2026-10-20', completedAt: new Date() }),
      make({ scheduledDate: '2026-11-05', completedAt: null }), // futura
    ];
    const result = computeStats(rows, '2026-10-26');
    expect(result.totalScheduled).toBe(1);
    expect(result.completionRate).toBe(100);
  });

  it('calcula racha actual consecutiva terminando hoy', () => {
    const rows = [
      make({ scheduledDate: '2026-10-24', completedAt: new Date() }),
      make({ scheduledDate: '2026-10-25', completedAt: new Date() }),
      make({ scheduledDate: '2026-10-26', completedAt: new Date() }),
    ];
    const result = computeStats(rows, '2026-10-26');
    expect(result.currentStreak).toBe(3);
  });

  it('no rompe la racha si hoy todavía no se completó nada', () => {
    const rows = [
      make({ scheduledDate: '2026-10-24', completedAt: new Date() }),
      make({ scheduledDate: '2026-10-25', completedAt: new Date() }),
    ];
    const result = computeStats(rows, '2026-10-26');
    expect(result.currentStreak).toBe(2);
  });

  it('corta la racha actual si hay un hueco', () => {
    const rows = [
      make({ scheduledDate: '2026-10-20', completedAt: new Date() }),
      make({ scheduledDate: '2026-10-25', completedAt: new Date() }),
      make({ scheduledDate: '2026-10-26', completedAt: new Date() }),
    ];
    const result = computeStats(rows, '2026-10-26');
    expect(result.currentStreak).toBe(2);
    expect(result.longestStreak).toBe(2);
  });

  it('agrupa por categoría', () => {
    const rows = [
      make({ categoryId: 1, categoryName: 'Gimnasio', completedAt: new Date() }),
      make({ categoryId: 1, categoryName: 'Gimnasio', completedAt: null }),
      make({ categoryId: 2, categoryName: 'Estudio', completedAt: new Date() }),
    ];
    const result = computeStats(rows, '2026-10-26');
    const gym = result.byCategory.find((c) => c.categoryId === 1);
    expect(gym).toEqual({ categoryId: 1, categoryName: 'Gimnasio', completed: 1, total: 2 });
  });
});