import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import DOMPurify from 'dompurify';

/**
 * Merges Tailwind classes and handles conflicts
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Sanitizes HTML content using DOMPurify
 */
export function sanitize(content) {
  return DOMPurify.sanitize(content);
}

/**
 * Returns consistent status colors based on percentage
 */
export function getStatusColor(pct) {
  if (pct >= 85) return 'status-red';
  if (pct >= 60) return 'status-amber';
  return 'status-green';
}

/**
 * Formats time from Date or string
 */
export function formatTime(input) {
  const date = input instanceof Date ? input : new Date(input);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
