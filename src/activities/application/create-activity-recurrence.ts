import { BadRequestException, Injectable } from '@nestjs/common';
import { ActivityRecurrence, RecurrenceFrequency } from '../domain/activity-recurrence';
import { ActivityRecurrenceRepository } from './activity-recurrence-repository';
import { generateOccurrenceDates } from './generate-occurrence-dates';

const HORIZON_DAYS = 60;

export interface CreateActivityRecurrenceInput {
  userId: string;
  categoryId: number;
  title: string;
  description?: string | null;
  startTime?: string | null;
  durationMinutes?: number | null;
  reminderMinutes?: number | null;
  frequency: RecurrenceFrequency;
  intervalCount?: number;
  daysOfWeek?: number[];
  startDate: string;
  endDate?: string | null;
}

@Injectable()
export class CreateActivityRecurrence {
  constructor(private readonly recurrences: ActivityRecurrenceRepository) {}

  execute(input: CreateActivityRecurrenceInput): Promise<ActivityRecurrence> {
    const intervalCount = input.intervalCount ?? 1;
    const daysOfWeek = input.frequency === 'WEEKLY' ? (input.daysOfWeek ?? []) : [];

    if (input.frequency === 'WEEKLY' && daysOfWeek.length === 0) {
      throw new BadRequestException('Una recurrencia semanal necesita al menos un día de la semana');
    }

    const horizonEnd = addDays(input.startDate, HORIZON_DAYS - 1);
    const occurrenceDates = generateOccurrenceDates(
      { frequency: input.frequency, intervalCount, daysOfWeek, startDate: input.startDate, endDate: input.endDate ?? null },
      horizonEnd,
    );
    const generatedUntil = input.endDate && input.endDate < horizonEnd ? input.endDate : horizonEnd;

    return this.recurrences.createWithOccurrences(
      {
        userId: input.userId, categoryId: input.categoryId, title: input.title,
        description: input.description ?? null, startTime: input.startTime ?? null,
        durationMinutes: input.durationMinutes ?? null, reminderMinutes: input.reminderMinutes ?? null,
        frequency: input.frequency, intervalCount, daysOfWeek,
        startDate: input.startDate, endDate: input.endDate ?? null, generatedUntil,
      },
      occurrenceDates,
    );
  }
}

function addDays(dateString: string, days: number): string {
  const date = new Date(`${dateString}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}