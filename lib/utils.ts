import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDeviceType(): string {
  if (typeof navigator === 'undefined') return 'unknown';
  if (/ipad|tablet/i.test(navigator.userAgent)) return 'tablet';
  if (/mobi|android/i.test(navigator.userAgent)) return 'mobile';
  return 'desktop';
}
