import { RecurrenceFrequency } from '../domain/activity-recurrence';

export interface RecurrenceRuleDates {
  frequency: RecurrenceFrequency;
  intervalCount: number;
  daysOfWeek: number[];
  startDate: string;
  endDate: string | null;
}

export function generateOccurrenceDates(rule: RecurrenceRuleDates, horizonEnd: string): string[] {
  const cutoff = rule.endDate && rule.endDate < horizonEnd ? rule.endDate : horizonEnd;
  const dates: string[] = [];

  if (rule.frequency === 'DAILY') {
    let current = rule.startDate;
    while (current <= cutoff) {
      dates.push(current);
      current = addDays(current, rule.intervalCount);
    }
    return dates;
  }

  let current = rule.startDate;
  while (current <= cutoff) {
    const weeksSinceStart = Math.floor(diffDays(rule.startDate, current) / 7);
    if (weeksSinceStart % rule.intervalCount === 0 && rule.daysOfWeek.includes(dayOfWeek(current))) {
      dates.push(current);
    }
    current = addDays(current, 1);
  }
  return dates;
}

function addDays(dateString: string, days: number): string {
  const date = new Date(`${dateString}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function diffDays(from: string, to: string): number {
  const ms = new Date(`${to}T00:00:00Z`).getTime() - new Date(`${from}T00:00:00Z`).getTime();
  return Math.round(ms / 86_400_000);
}

function dayOfWeek(dateString: string): number {
  return new Date(`${dateString}T00:00:00Z`).getUTCDay();
}