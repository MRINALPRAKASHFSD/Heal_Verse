import type { ISODateString } from '../types';

export function toIsoDateString(date: Date | number | string): ISODateString {
  return new Date(date).toISOString() as ISODateString;
}

export function formatDate(date: Date | number | string, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(date));
}

export function formatDateTime(date: Date | number | string, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date));
}

export function isSameDay(left: Date | number | string, right: Date | number | string): boolean {
  const leftDate = new Date(left);
  const rightDate = new Date(right);

  return leftDate.toDateString() === rightDate.toDateString();
}