import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityRecurrenceRepository, NewActivityRecurrence } from '../application/activity-recurrence-repository';
import { ActivityRecurrence } from '../domain/activity-recurrence';

@Injectable()
export class PrismaActivityRecurrenceRepository extends ActivityRecurrenceRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async createWithOccurrences(rule: NewActivityRecurrence, occurrenceDates: string[]): Promise<ActivityRecurrence> {
    return this.prisma.$transaction(async (tx) => {
      const recurrenceRow = await tx.activityRecurrence.create({
        data: {
          userId: rule.userId,
          categoryId: rule.categoryId,
          title: rule.title,
          description: rule.description,
          startTime: rule.startTime ? toTimeOnly(rule.startTime) : null,
          durationMinutes: rule.durationMinutes,
          reminderMinutes: rule.reminderMinutes,
          frequency: rule.frequency,
          intervalCount: rule.intervalCount,
          daysOfWeek: rule.daysOfWeek,
          startDate: toDateOnly(rule.startDate),
          endDate: rule.endDate ? toDateOnly(rule.endDate) : null,
          generatedUntil: toDateOnly(rule.generatedUntil),
        },
      });

      if (occurrenceDates.length > 0) {
        await tx.activity.createMany({
          data: occurrenceDates.map((date) => ({
            userId: rule.userId,
            categoryId: rule.categoryId,
            title: rule.title,
            description: rule.description,
            scheduledDate: toDateOnly(date),
            startTime: rule.startTime ? toTimeOnly(rule.startTime) : null,
            durationMinutes: rule.durationMinutes,
            reminderMinutes: rule.reminderMinutes,
            recurrenceId: recurrenceRow.id,
            occurrenceDate: toDateOnly(date),
          })),
        });
      }

      return toDomain(recurrenceRow);
    });
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
  id: string;
  userId: string;
  categoryId: number;
  title: string;
  description: string | null;
  startTime: Date | null;
  durationMinutes: number | null;
  reminderMinutes: number | null;
  frequency: string;
  intervalCount: number;
  daysOfWeek: number[];
  startDate: Date;
  endDate: Date | null;
  generatedUntil: Date | null;
}): ActivityRecurrence {
  return {
    id: row.id,
    userId: row.userId,
    categoryId: row.categoryId,
    title: row.title,
    description: row.description,
    startTime: row.startTime ? fromTimeOnly(row.startTime) : null,
    durationMinutes: row.durationMinutes,
    reminderMinutes: row.reminderMinutes,
    frequency: row.frequency as ActivityRecurrence['frequency'],
    intervalCount: row.intervalCount,
    daysOfWeek: row.daysOfWeek,
    startDate: fromDateOnly(row.startDate),
    endDate: row.endDate ? fromDateOnly(row.endDate) : null,
    generatedUntil: fromDateOnly(row.generatedUntil!),
  };
}