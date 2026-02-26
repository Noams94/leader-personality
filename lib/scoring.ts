import { ITEMS } from './items';
import type { LeaderFactor, FollowerFactor, FactorScores, FollowerScores, Responses } from './types';

const reverseScore = (raw: number): number => 6 - raw;

const mean = (arr: number[]): number => {
  const sum = arr.reduce((a, b) => a + b, 0);
  return Math.round((sum / arr.length) * 100) / 100;
};

/** Score a leader self-report (5 factors). */
export function scoreAssessment(responses: Responses): FactorScores {
  const factors: LeaderFactor[] = ['energy', 'psychopathy', 'organization', 'irritability', 'intellect'];
  const scores = {} as FactorScores;

  for (const factor of factors) {
    const items = ITEMS.filter(item => item.factor === factor);
    const adjusted = items.map(item => {
      const raw = responses[item.id] ?? 3;
      return item.reversed ? reverseScore(raw) : raw;
    });
    scores[factor] = mean(adjusted);
  }

  return scores;
}

/** Score a follower report of a supervisor (7 factors, including Supportiveness & Weakness). */
export function scoreFollowerAssessment(responses: Responses): FollowerScores {
  const factors: FollowerFactor[] = [
    'energy', 'psychopathy', 'organization', 'irritability', 'intellect',
    'supportiveness', 'weakness',
  ];
  const scores = {} as FollowerScores;

  for (const factor of factors) {
    const items = ITEMS.filter(item => item.factor === factor);
    if (items.length === 0) continue;
    const adjusted = items.map(item => {
      const raw = responses[item.id] ?? 3;
      return item.reversed ? reverseScore(raw) : raw;
    });
    scores[factor] = mean(adjusted);
  }

  return scores;
}

export function getComparisonLabel(
  score: number,
  benchmark: number
): 'above' | 'below' | 'match' {
  const diff = score - benchmark;
  if (Math.abs(diff) < 0.15) return 'match';
  return diff > 0 ? 'above' : 'below';
}
