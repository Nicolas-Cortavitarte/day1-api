export interface CategoryStat {
  readonly categoryId: number;
  readonly categoryName: string;
  readonly completed: number;
  readonly total: number;
}

export interface ActivityStats {
  readonly totalCompleted: number;
  readonly totalScheduled: number;
  readonly completionRate: number;
  readonly currentStreak: number;
  readonly longestStreak: number;
  readonly byCategory: CategoryStat[];
}