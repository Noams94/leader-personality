export type LeaderFactor = 'energy' | 'psychopathy' | 'organization' | 'irritability' | 'intellect';
export type FollowerFactor = LeaderFactor | 'supportiveness' | 'weakness';
export type Factor = FollowerFactor;

export type Role = 'leader' | 'follower';
export type Sector = 'business' | 'military' | 'religious';
export type Gender = 'male' | 'female' | 'other';

export interface AssessmentItem {
  id: string;
  factor: Factor;
  labelEn: string;
  labelHe: string;
  reversed: boolean;
}

export type Responses = Record<string, number>;
export type FactorScores = Record<LeaderFactor, number>;
export type FollowerScores = Record<FollowerFactor, number>;
