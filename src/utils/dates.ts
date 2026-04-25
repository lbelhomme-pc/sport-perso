import {
  addDays,
  addWeeks,
  differenceInCalendarWeeks,
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  isWithinInterval,
  parseISO,
  startOfWeek
} from "date-fns";
import { fr } from "date-fns/locale";

export const ISO_DATE_FORMAT = "yyyy-MM-dd";

export function toISODate(date: Date): string {
  return format(date, ISO_DATE_FORMAT);
}

export function parseDate(date: string): Date {
  return parseISO(date);
}

export function formatShortDate(date: string | Date): string {
  return format(typeof date === "string" ? parseISO(date) : date, "d MMM", { locale: fr });
}

export function formatLongDate(date: string | Date): string {
  return format(typeof date === "string" ? parseISO(date) : date, "EEEE d MMMM", { locale: fr });
}

export function getMonday(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}

export function getSunday(date: Date): Date {
  return endOfWeek(date, { weekStartsOn: 1 });
}

export function getWeekDays(date: Date): string[] {
  return eachDayOfInterval({ start: getMonday(date), end: getSunday(date) }).map(toISODate);
}

export function getTotalWeeks(startDate: string, targetDate: string): number {
  return Math.max(
    1,
    differenceInCalendarWeeks(parseISO(targetDate), parseISO(startDate), { weekStartsOn: 1 }) + 1
  );
}

export function getWeekStart(startDate: string, week: number): Date {
  return addWeeks(parseISO(startDate), Math.max(0, week - 1));
}

export function getWeekEnd(startDate: string, week: number): Date {
  return addDays(getWeekStart(startDate, week), 6);
}

export function getCurrentWeekIndex(startDate: string, targetDate: string, now = new Date()): number {
  const totalWeeks = getTotalWeeks(startDate, targetDate);
  const week = differenceInCalendarWeeks(now, parseISO(startDate), { weekStartsOn: 1 }) + 1;
  return Math.min(totalWeeks, Math.max(1, week));
}

export function getWeekIndexForDate(startDate: string, targetDate: string, date: string): number {
  return getCurrentWeekIndex(startDate, targetDate, parseISO(date));
}

export function isDateInWeek(date: string, weekStart: Date): boolean {
  return isWithinInterval(parseISO(date), { start: weekStart, end: addDays(weekStart, 6) });
}

export function isToday(date: string): boolean {
  return isSameDay(parseISO(date), new Date());
}

export function getDaysBetween(startDate: string, endDate: string): string[] {
  return eachDayOfInterval({ start: parseISO(startDate), end: parseISO(endDate) }).map(toISODate);
}
