import { differenceInCalendarDays, parseISO } from 'date-fns';

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function daysRemaining(endDateIso: string): number {
  return differenceInCalendarDays(parseISO(endDateIso), parseISO(todayIso()));
}

export function isUrgent(endDateIso: string): boolean {
  return daysRemaining(endDateIso) <= 7;
}

export function formatDaysLabel(days: number): string {
  if (days > 0) return `${days} day${days === 1 ? '' : 's'} left`;
  if (days === 0) return 'Due today';
  return `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} overdue`;
}
