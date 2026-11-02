import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { fromDateOnly } from '../../shared/date-conversion';
import { ActivityStatsRepository, ActivityStatsRow } from '../application/activity-stats-repository';

@Injectable()
export class PrismaActivityStatsRepository extends ActivityStatsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findForUser(userId: string): Promise<ActivityStatsRow[]> {
    const rows = await this.prisma.activity.findMany({
      where: { userId, deletedAt: null },
      include: { category: true },
    });

    return rows.map((row) => ({
      scheduledDate: fromDateOnly(row.scheduledDate),
      completedAt: row.completedAt,
      categoryId: row.categoryId,
      categoryName: row.category.name,
    }));
  }
}