export function toDateOnly(dateString: string): Date {
  return new Date(`${dateString}T00:00:00Z`);
}

export function toTimeOnly(timeString: string): Date {
  return new Date(`1970-01-01T${timeString}Z`);
}

export function fromDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function fromTimeOnly(date: Date): string {
  return date.toISOString().slice(11, 19);
}