import { describe, it, expect } from 'vitest';
import { cn, sanitize, getStatusColor, formatTime } from '../lib/utils';

describe('VenueIQ Utilities', () => {
  describe('cn (Tailwind Merger)', () => {
    it('should merge classes properly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
      expect(cn('p-4', 'p-8')).toBe('p-8');
    });

    it('should handle conditional classes', () => {
      const isRed = true;
      const isBlue = false;
      expect(cn('p-4', isRed && 'text-red', isBlue && 'bg-blue')).toBe('p-4 text-red');
    });
  });

  describe('sanitize (DOMPurify Wrapper)', () => {
    it('should remove malicious scripts', () => {
      const dirty = '<script>alert("xss")</script><p>Hello</p>';
      expect(sanitize(dirty)).toBe('<p>Hello</p>');
    });

    it('should remove dangerous attributes', () => {
      const dirty = '<img src="x" onerror="alert(1)">';
      expect(sanitize(dirty)).toBe('<img src="x">');
    });
  });

  describe('getStatusColor', () => {
    it('should return red for >= 85%', () => {
      expect(getStatusColor(85)).toBe('status-red');
      expect(getStatusColor(95)).toBe('status-red');
    });

    it('should return amber for 60-84%', () => {
      expect(getStatusColor(60)).toBe('status-amber');
      expect(getStatusColor(84)).toBe('status-amber');
    });

    it('should return green for < 60%', () => {
      expect(getStatusColor(59)).toBe('status-green');
      expect(getStatusColor(20)).toBe('status-green');
    });
  });

  describe('formatTime', () => {
    it('should format dates properly', () => {
      const date = new Date('2024-01-01T19:30:00');
      // Format can vary by locale but should contain 07:30 or 19:30
      expect(formatTime(date)).toMatch(/7:30|19:30/);
    });
  });
});
