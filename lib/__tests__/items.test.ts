import { describe, it, expect } from 'vitest';
import { ITEMS, LEADER_FACTOR_KEYS, FOLLOWER_FACTOR_KEYS, getItemsByFactor } from '../items';
import type { Factor } from '../types';

describe('ITEMS data integrity', () => {
  it('should have exactly 70 items total (50 leader + 20 follower-only)', () => {
    expect(ITEMS.length).toBe(70);
  });

  it('should have no duplicate IDs', () => {
    const ids = ITEMS.map(i => i.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('should have exactly 10 items per factor', () => {
    const factors: Factor[] = [
      'energy', 'psychopathy', 'organization', 'irritability', 'intellect',
      'supportiveness', 'weakness',
    ];
    for (const factor of factors) {
      const items = ITEMS.filter(i => i.factor === factor);
      expect(items.length, `factor "${factor}" should have 10 items`).toBe(10);
    }
  });

  it('should have 50 leader items (5 factors × 10)', () => {
    const leaderItems = ITEMS.filter(
      i => !['supportiveness', 'weakness'].includes(i.factor)
    );
    expect(leaderItems.length).toBe(50);
  });

  it('should have 20 follower-only items (2 factors × 10)', () => {
    const followerOnly = ITEMS.filter(
      i => ['supportiveness', 'weakness'].includes(i.factor)
    );
    expect(followerOnly.length).toBe(20);
  });

  it('every item should have required fields', () => {
    for (const item of ITEMS) {
      expect(item.id).toBeTruthy();
      expect(item.factor).toBeTruthy();
      expect(item.labelEn).toBeTruthy();
      expect(item.labelHe).toBeTruthy();
      expect(typeof item.reversed).toBe('boolean');
    }
  });

  it('reversed items should have "r" suffix in their ID', () => {
    for (const item of ITEMS) {
      if (item.reversed) {
        expect(item.id, `reversed item ${item.id} should end with "r"`).toMatch(/r$/);
      }
    }
  });

  it('non-reversed items should NOT have "r" suffix', () => {
    for (const item of ITEMS) {
      if (!item.reversed) {
        expect(item.id, `non-reversed item ${item.id} should not end with "r"`).not.toMatch(/r$/);
      }
    }
  });

  it('every item should have a feminine Hebrew label', () => {
    for (const item of ITEMS) {
      expect(
        item.labelHeFemale,
        `item ${item.id} missing labelHeFemale`
      ).toBeTruthy();
    }
  });
});

describe('FACTOR_KEYS', () => {
  it('LEADER_FACTOR_KEYS should have 5 factors', () => {
    expect(LEADER_FACTOR_KEYS.length).toBe(5);
  });

  it('FOLLOWER_FACTOR_KEYS should have 7 factors', () => {
    expect(FOLLOWER_FACTOR_KEYS.length).toBe(7);
  });

  it('FOLLOWER_FACTOR_KEYS should include all leader factors', () => {
    for (const key of LEADER_FACTOR_KEYS) {
      expect(FOLLOWER_FACTOR_KEYS).toContain(key);
    }
  });
});

describe('getItemsByFactor', () => {
  it('should return correct items for each factor', () => {
    const energyItems = getItemsByFactor('energy');
    expect(energyItems.length).toBe(10);
    expect(energyItems.every(i => i.factor === 'energy')).toBe(true);
  });
});
