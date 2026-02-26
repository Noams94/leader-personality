import type { LeaderFactor, FollowerFactor, FactorScores } from './types';

export const BENCHMARKS: FactorScores = {
  energy:       4.12,
  psychopathy:  1.18,
  organization: 4.35,
  irritability: 1.79,
  intellect:    4.26,
};

// Study 4 sector benchmarks (business / military / religious leader self-reports)
export const SECTOR_BENCHMARKS: Record<string, FactorScores> = {
  business: {
    energy:       4.12,
    psychopathy:  1.18,
    organization: 4.35,
    irritability: 1.79,
    intellect:    4.26,
  },
  military: {
    energy:       3.84,
    psychopathy:  1.34,
    organization: 3.81,
    irritability: 2.20,
    intellect:    4.04,
  },
  religious: {
    energy:       3.73,
    psychopathy:  1.10,
    organization: 3.52,
    irritability: 1.92,
    intellect:    4.01,
  },
};

// Leader questionnaire — 5 factors
export const FACTOR_ORDER: LeaderFactor[] = [
  'energy',
  'psychopathy',
  'organization',
  'irritability',
  'intellect',
];

// Follower questionnaire — 7 factors (Supportiveness & Weakness first, matching Study 3 eigenvalue order)
export const FOLLOWER_FACTOR_ORDER: FollowerFactor[] = [
  'supportiveness',
  'weakness',
  'energy',
  'psychopathy',
  'organization',
  'irritability',
  'intellect',
];
