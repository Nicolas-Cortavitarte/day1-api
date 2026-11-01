import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { fromDateOnly } from '../../shared/date-conversion';
import { WorkoutHistoryEntry } from '../domain/workout-history-entry';
import { WorkoutHistoryRepository } from '../application/workout-history-repository';

@Injectable()
export class PrismaWorkoutHistoryRepository extends WorkoutHistoryRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findForUser(userId: string, limit: number): Promise<WorkoutHistoryEntry[]> {
    const rows = await this.prisma.workoutSession.findMany({
      where: { activity: { userId, deletedAt: null } },
      include: { activity: true, exercises: { include: { sets: true } } },
      orderBy: { activity: { scheduledDate: 'desc' } },
      take: limit,
    });

    return rows.map((row) => ({
      sessionId: row.id,
      activityId: row.activityId,
      activityTitle: row.activity.title,
      scheduledDate: fromDateOnly(row.activity.scheduledDate),
      exerciseCount: row.exercises.length,
      setCount: row.exercises.reduce((total, ex) => total + ex.sets.length, 0),
    }));
  }
}