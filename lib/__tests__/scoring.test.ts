import { describe, it, expect } from 'vitest';
import { scoreAssessment, scoreFollowerAssessment, getComparisonLabel } from '../scoring';
import { ITEMS } from '../items';
import type { Responses } from '../types';

// Build a full set of responses with a given value
function buildResponses(role: 'leader' | 'follower', value: number): Responses {
  const resp: Responses = {};
  for (const item of ITEMS) {
    if (role === 'leader' && ['supportiveness', 'weakness'].includes(item.factor)) continue;
    resp[item.id] = value;
  }
  return resp;
}

describe('scoreAssessment (leader, 5 factors)', () => {
  it('should return all 5 factor scores', () => {
    const scores = scoreAssessment(buildResponses('leader', 3));
    expect(Object.keys(scores)).toHaveLength(5);
    expect(scores).toHaveProperty('energy');
    expect(scores).toHaveProperty('psychopathy');
    expect(scores).toHaveProperty('organization');
    expect(scores).toHaveProperty('irritability');
    expect(scores).toHaveProperty('intellect');
  });

  it('all-3 responses should produce correct scores accounting for reverse coding', () => {
    // When all raw responses are 3:
    //   normal items: score = 3
    //   reversed items: score = 6 - 3 = 3
    // So mean should be exactly 3.00 for all factors
    const scores = scoreAssessment(buildResponses('leader', 3));
    for (const factor of Object.keys(scores) as Array<keyof typeof scores>) {
      expect(scores[factor]).toBe(3);
    }
  });

  it('all-1 responses should correctly reverse-code', () => {
    // normal items: 1, reversed items: 6-1=5
    const scores = scoreAssessment(buildResponses('leader', 1));
    // Energy has 6 normal + 4 reversed → mean = (6*1 + 4*5)/10 = 26/10 = 2.6
    expect(scores.energy).toBe(2.6);
    // Psychopathy: 10 normal, 0 reversed → mean = 1
    expect(scores.psychopathy).toBe(1);
  });

  it('all-5 responses should correctly reverse-code', () => {
    const scores = scoreAssessment(buildResponses('leader', 5));
    // Psychopathy: 10 normal, 0 reversed → mean = 5
    expect(scores.psychopathy).toBe(5);
    // Energy: 6 normal(5) + 4 reversed(6-5=1) → (30+4)/10 = 3.4
    expect(scores.energy).toBe(3.4);
  });

  it('scores should be between 1 and 5', () => {
    for (const val of [1, 2, 3, 4, 5]) {
      const scores = scoreAssessment(buildResponses('leader', val));
      for (const s of Object.values(scores)) {
        expect(s).toBeGreaterThanOrEqual(1);
        expect(s).toBeLessThanOrEqual(5);
      }
    }
  });
});

describe('scoreFollowerAssessment (7 factors)', () => {
  it('should return all 7 factor scores', () => {
    const scores = scoreFollowerAssessment(buildResponses('follower', 3));
    expect(Object.keys(scores)).toHaveLength(7);
    expect(scores).toHaveProperty('supportiveness');
    expect(scores).toHaveProperty('weakness');
  });

  it('all-3 should give 3.0 for all factors', () => {
    const scores = scoreFollowerAssessment(buildResponses('follower', 3));
    for (const s of Object.values(scores)) {
      expect(s).toBe(3);
    }
  });
});

describe('getComparisonLabel', () => {
  it('should return "above" when score > benchmark + 0.15', () => {
    expect(getComparisonLabel(4.5, 4.0)).toBe('above');
  });

  it('should return "below" when score < benchmark - 0.15', () => {
    expect(getComparisonLabel(3.5, 4.0)).toBe('below');
  });

  it('should return "match" when difference is within ±0.15', () => {
    expect(getComparisonLabel(4.1, 4.0)).toBe('match');
    expect(getComparisonLabel(3.9, 4.0)).toBe('match');
    expect(getComparisonLabel(4.0, 4.0)).toBe('match');
  });

  it('should return "match" at the boundary (exactly 0.14)', () => {
    expect(getComparisonLabel(4.14, 4.0)).toBe('match');
  });

  it('should return "above" just beyond boundary', () => {
    expect(getComparisonLabel(4.16, 4.0)).toBe('above');
  });
});
