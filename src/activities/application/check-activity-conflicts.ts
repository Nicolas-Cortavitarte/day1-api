import { Injectable } from '@nestjs/common';
import { Activity } from '../domain/activity';
import { ActivityRepository } from './activity-repository';

export interface CheckConflictsInput {
  userId: string;
  scheduledDate: string;
  startTime: string | null;
  durationMinutes: number | null;
  excludeActivityId?: string;
}

@Injectable()
export class CheckActivityConflicts {
  constructor(private readonly activities: ActivityRepository) {}

  async execute(input: CheckConflictsInput): Promise<Activity[]> {
    if (!input.startTime) return [];

    const sameDay = await this.activities.findByUserAndDate(
      input.userId,
      input.scheduledDate,
    );
    const candidates = sameDay.filter(
      (a) => a.id !== input.excludeActivityId && a.startTime !== null,
    );

    return candidates.filter((other) => overlaps(input, other));
  }
}

function overlaps(
  a: { startTime: string | null; durationMinutes: number | null },
  b: { startTime: string | null; durationMinutes: number | null },
): boolean {
  if (a.durationMinutes == null || b.durationMinutes == null) return false;

  const [startA, endA] = toRange(a);
  const [startB, endB] = toRange(b);
  return startA < endB && startB < endA;
}

function toRange(a: {
  startTime: string | null;
  durationMinutes: number | null;
}): [number, number] {
  const start = toMinutes(a.startTime!);
  const end = a.durationMinutes != null ? start + a.durationMinutes : start;
  return [start, end];
}

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}
