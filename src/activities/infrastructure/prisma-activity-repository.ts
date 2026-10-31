import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NewActivity, ActivityRepository } from '../application/activity-repository';
import { Activity, RescheduleInput } from '../domain/activity';
import { toDateOnly, toTimeOnly, fromDateOnly, fromTimeOnly } from '../../shared/date-conversion';

@Injectable()
export class PrismaActivityRepository extends ActivityRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(activity: NewActivity, options?: { createWorkoutSession: boolean }): Promise<Activity> {
    const row = await this.prisma.$transaction(async (tx) => {
      const created = await tx.activity.create({
        data: {
          userId: activity.userId,
          categoryId: activity.categoryId,
          title: activity.title,
          description: activity.description,
          scheduledDate: toDateOnly(activity.scheduledDate),
          startTime: activity.startTime ? toTimeOnly(activity.startTime) : null,
          durationMinutes: activity.durationMinutes,
        },
      });
      if (options?.createWorkoutSession) {
        await tx.workoutSession.create({ data: { activityId: created.id } });
      }
      return created;
    });
    return toDomain(row);
  }

  async findByUserAndDate(userId: string, scheduledDate: string): Promise<Activity[]> {
    const rows = await this.prisma.activity.findMany({
      where: { userId, scheduledDate: toDateOnly(scheduledDate), deletedAt: null },
    });
    return rows.map(toDomain);
  }

  async findById(id: string): Promise<Activity | null> {
    const row = await this.prisma.activity.findFirst({ where: { id, deletedAt: null } });
    return row ? toDomain(row) : null;
  }

  async setCompletedAt(id: string, completedAt: Date | null): Promise<Activity> {
    const row = await this.prisma.activity.update({ where: { id }, data: { completedAt } });
    return toDomain(row);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.activity.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async update(
    id: string,
    changes: Partial<Pick<Activity, 'title' | 'description' | 'categoryId' | 'durationMinutes'>>,
  ): Promise<Activity> {
    const row = await this.prisma.activity.update({ where: { id }, data: changes });
    return toDomain(row);
  }

  async reschedule(input: RescheduleInput): Promise<Activity> {
    const [, row] = await this.prisma.$transaction([
      this.prisma.activityReschedule.create({
        data: {
          activityId: input.activityId,
          fromDate: toDateOnly(input.fromDate),
          fromTime: input.fromTime ? toTimeOnly(input.fromTime) : null,
          toDate: toDateOnly(input.toDate),
          toTime: input.toTime ? toTimeOnly(input.toTime) : null,
        },
      }),
      this.prisma.activity.update({
        where: { id: input.activityId },
        data: { scheduledDate: toDateOnly(input.toDate), startTime: input.toTime ? toTimeOnly(input.toTime) : null },
      }),
    ]);
    return toDomain(row);
  }
}

function toDomain(row: {
  id: string; userId: string; categoryId: number; title: string; description: string | null;
  scheduledDate: Date; startTime: Date | null; durationMinutes: number | null;
  completedAt: Date | null; createdAt: Date; updatedAt: Date;
}): Activity {
  return {
    id: row.id,
    userId: row.userId,
    categoryId:row.categoryId,
    title: row.title,
    description: row.description,
    scheduledDate: fromDateOnly(row.scheduledDate),
    startTime: row.startTime ? fromTimeOnly(row.startTime) : null,
    durationMinutes: row.durationMinutes,
    completedAt: row.completedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}