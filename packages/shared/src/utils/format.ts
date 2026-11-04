import { format, formatDistanceToNow, parseISO } from 'date-fns';

// ============================================================
// DATE UTILITIES
// ============================================================

export function formatDate(date: Date | string, pattern = 'dd/MM/yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, pattern);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd/MM/yyyy HH:mm');
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

// ============================================================
// STRING UTILITIES
// ============================================================

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, maxLength: number, suffix = '...'): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function titleCase(text: string): string {
  return text
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
}

export function generateInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

// ============================================================
// NUMBER UTILITIES
// ============================================================

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('pt-PT').format(num);
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount / 100);
}

export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export function formatWordCount(count: number): string {
  if (count < 1000) return `${count} words`;
  return `${(count / 1000).toFixed(1)}k words`;
}

// ============================================================
// OBJECT UTILITIES
// ============================================================

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

export function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

// ============================================================
// ARRAY UTILITIES
// ============================================================

export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (groups, item) => {
      const groupKey = String(item[key]);
      const group = groups[groupKey] ?? [];
      group.push(item);
      return { ...groups, [groupKey]: group };
    },
    {} as Record<string, T[]>,
  );
}

export function sortByDate<T extends { createdAt: Date }>(
  array: T[],
  order: 'asc' | 'desc' = 'desc',
): T[] {
  return [...array].sort((a, b) => {
    const diff = a.createdAt.getTime() - b.createdAt.getTime();
    return order === 'asc' ? diff : -diff;
  });
}

// ============================================================
// VALIDATION UTILITIES
// ============================================================

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ============================================================
// ASYNC UTILITIES
// ============================================================

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: { retries?: number; delay?: number; backoff?: number } = {},
): Promise<T> {
  const { retries = 3, delay = 1000, backoff = 2 } = options;
  let lastError: unknown;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < retries - 1) {
        await sleep(delay * Math.pow(backoff, attempt));
      }
    }
  }

  throw lastError;
}
