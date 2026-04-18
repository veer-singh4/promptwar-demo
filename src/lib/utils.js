import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import DOMPurify from 'dompurify';
import { useState } from 'react';

/**
 * Merges Tailwind classes and handles conflicts
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Robust HTML sanitization for AI-generated or user-generated content
 */
export function sanitize(html) {
  if (!html) return "";
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'span', 'img'],
    ALLOWED_ATTR: ['class', 'src', 'alt', 'width', 'height']
  });
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

/**
 * Custom hook for persistent state in LocalStorage
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`LocalStorage Error [${key}]:`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`LocalStorage Set Error [${key}]:`, error);
    }
  };

  return [storedValue, setValue];
}
