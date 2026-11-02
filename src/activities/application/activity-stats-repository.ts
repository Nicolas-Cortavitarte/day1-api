export interface ActivityStatsRow {
  readonly scheduledDate: string;
  readonly completedAt: Date | null;
  readonly categoryId: number;
  readonly categoryName: string;
}

export abstract class ActivityStatsRepository {
  abstract findForUser(userId: string): Promise<ActivityStatsRow[]>;
}