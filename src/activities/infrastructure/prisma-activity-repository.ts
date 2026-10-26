import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NewActivity, ActivityRepository } from '../application/activity-repository';
import { Activity } from '../domain/activity';

@Injectable()
export class PrismaActivityRepository extends ActivityRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(activity: NewActivity): Promise<Activity> {
    const row = await this.prisma.activity.create({
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
    return toDomain(row);
  }

  async findByUserAndDate(userId: string, scheduledDate: string): Promise<Activity[]> {
    const rows = await this.prisma.activity.findMany({
      where: { userId, scheduledDate: toDateOnly(scheduledDate), deletedAt: null },
    });
    return rows.map(toDomain);
  }
}

function toDateOnly(dateString: string): Date {
  return new Date(`${dateString}T00:00:00Z`);
}

function toTimeOnly(timeString: string): Date {
  return new Date(`1970-01-01T${timeString}Z`);
}

function fromDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function fromTimeOnly(date: Date): string {
  return date.toISOString().slice(11, 19);
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