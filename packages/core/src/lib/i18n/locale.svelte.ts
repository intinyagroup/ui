import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const LOCALE_KEY = Symbol('intinya-locale');

export type LocaleConfig = {
  locale: string;                    // e.g. 'en-US', 'id-ID'
  weekStartsOn?: 0 | 1;              // 0 = Sunday, 1 = Monday
  messages?: Record<string, string>; // translation overrides
};

const defaultMessages: Record<string, string> = {
  'datepicker.placeholder': 'Pick a date',
  'carousel.previous': 'Previous',
  'carousel.next': 'Next',
  'calendar.today': 'Today',
  'empty.noResults': 'No results found',
  'pagination.previous': 'Previous',
  'pagination.next': 'Next',
  'infiniteScroll.noMore': 'No more items',
  'infiniteScroll.loading': 'Loading...',
  'validation.required': 'This field is required',
  'validation.email': 'Please enter a valid email'
};

// Global writable (defaults to browser locale)
export const localeStore = writable<LocaleConfig>({
  locale: typeof navigator !== 'undefined' ? navigator.language : 'en-US'
});

// Context for nested config (per-component-tree override)
export function setLocale(config: LocaleConfig) {
  setContext(LOCALE_KEY, config);
  localeStore.set(config);
}

export function getLocale(): LocaleConfig {
  return (
    getContext<LocaleConfig | undefined>(LOCALE_KEY) ?? {
      locale: typeof navigator !== 'undefined' ? navigator.language : 'en-US'
    }
  );
}

export function t(key: string, locale?: LocaleConfig): string {
  const config = locale ?? getLocale();
  return config.messages?.[key] ?? defaultMessages[key] ?? key;
}

export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions, locale?: string): string {
  const loc = locale ?? getLocale().locale;
  return new Intl.DateTimeFormat(loc, options).format(date);
}

export function formatNumber(n: number, options?: Intl.NumberFormatOptions, locale?: string): string {
  const loc = locale ?? getLocale().locale;
  return new Intl.NumberFormat(loc, options).format(n);
}

export function formatCurrency(n: number, currency: string, locale?: string): string {
  const loc = locale ?? getLocale().locale;
  return new Intl.NumberFormat(loc, { style: 'currency', currency }).format(n);
}
