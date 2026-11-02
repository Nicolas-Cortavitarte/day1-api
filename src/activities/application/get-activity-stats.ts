import { Injectable } from '@nestjs/common';
import { ActivityStats, CategoryStat } from '../domain/activity-stats';
import { ActivityStatsRepository, ActivityStatsRow } from './activity-stats-repository';

@Injectable()
export class GetActivityStats {
  constructor(private readonly stats: ActivityStatsRepository) {}

  async execute(userId: string, today: string): Promise<ActivityStats> {
    const rows = await this.stats.findForUser(userId);
    return computeStats(rows, today);
  }
}

type MutableCategoryStat = {
  categoryId: number;
  categoryName: string;
  completed: number;
  total: number;
};

export function computeStats(rows: ActivityStatsRow[], today: string): ActivityStats {
  const dueRows = rows.filter((r) => r.scheduledDate <= today);

  const totalScheduled = dueRows.length;
  const totalCompleted = dueRows.filter((r) => r.completedAt != null).length;
  const completionRate = totalScheduled > 0 ? Math.round((totalCompleted / totalScheduled) * 100) : 0;

  const completedDates = new Set(
    dueRows.filter((r) => r.completedAt != null).map((r) => r.scheduledDate),
  );
  const { currentStreak, longestStreak } = computeStreaks(completedDates, today);

  const byCategoryMap = new Map<number, MutableCategoryStat>();
  for (const row of dueRows) {
    const existing = byCategoryMap.get(row.categoryId) ?? {
      categoryId: row.categoryId,
      categoryName: row.categoryName,
      completed: 0,
      total: 0,
    };
    existing.total += 1;
    if (row.completedAt != null) existing.completed += 1;
    byCategoryMap.set(row.categoryId, existing);
  }

  const byCategory: CategoryStat[] = Array.from(byCategoryMap.values()).sort((a, b) => b.total - a.total);

  return {
    totalCompleted,
    totalScheduled,
    completionRate,
    currentStreak,
    longestStreak,
    byCategory,
  };
}

function computeStreaks(
  completedDates: Set<string>,
  today: string,
): { currentStreak: number; longestStreak: number } {
  if (completedDates.size === 0) return { currentStreak: 0, longestStreak: 0 };

  const sorted = Array.from(completedDates).sort();
  let longestStreak = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    run = isNextDay(sorted[i - 1], sorted[i]) ? run + 1 : 1;
    longestStreak = Math.max(longestStreak, run);
  }

  let currentStreak = 0;
  let cursor = completedDates.has(today) ? today : addDaysISO(today, -1);
  while (completedDates.has(cursor)) {
    currentStreak += 1;
    cursor = addDaysISO(cursor, -1);
  }

  return { currentStreak, longestStreak };
}

function isNextDay(prev: string, next: string): boolean {
  return addDaysISO(prev, 1) === next;
}

function addDaysISO(dateString: string, amount: number): string {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}