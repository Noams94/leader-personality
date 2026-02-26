import type { AssessmentItem, LeaderFactor, FollowerFactor, Factor } from './types';

export const ITEMS: AssessmentItem[] = [
  // ── FACTOR 1: ENERGY ──────────────────────────────────────────────
  { id: 'E1',   factor: 'energy', labelEn: 'Charismatic',  labelHe: 'כריזמטי',    reversed: false },
  { id: 'E2',   factor: 'energy', labelEn: 'Leaderly',     labelHe: 'הנהגתי',     reversed: false },
  { id: 'E3',   factor: 'energy', labelEn: 'Exciting',     labelHe: 'מלהיב',      reversed: false },
  { id: 'E4',   factor: 'energy', labelEn: 'Guiding',      labelHe: 'מוביל',      reversed: false },
  { id: 'E5',   factor: 'energy', labelEn: 'Confident',    labelHe: 'בטוח בעצמו', reversed: false },
  { id: 'E6',   factor: 'energy', labelEn: 'Daring',       labelHe: 'מעז',        reversed: false },
  { id: 'E7r',  factor: 'energy', labelEn: 'Coward',       labelHe: 'פחדן',       reversed: true  },
  { id: 'E8r',  factor: 'energy', labelEn: 'Frightened',   labelHe: 'נפחד',       reversed: true  },
  { id: 'E9r',  factor: 'energy', labelEn: 'Submissive',   labelHe: 'כנוע',       reversed: true  },
  { id: 'E10r', factor: 'energy', labelEn: 'Undecisive',   labelHe: 'מהוסס',      reversed: true  },

  // ── FACTOR 2: PSYCHOPATHY ─────────────────────────────────────────
  { id: 'P1',   factor: 'psychopathy', labelEn: 'Sickening',    labelHe: 'מחליא',  reversed: false },
  { id: 'P2',   factor: 'psychopathy', labelEn: 'Corrupt',      labelHe: 'מושחת',  reversed: false },
  { id: 'P3',   factor: 'psychopathy', labelEn: 'Disingenuous', labelHe: 'רמאי',   reversed: false },
  { id: 'P4',   factor: 'psychopathy', labelEn: 'Violent',      labelHe: 'אלים',   reversed: false },
  { id: 'P5',   factor: 'psychopathy', labelEn: 'Sadistic',     labelHe: 'סדיסט',  reversed: false },
  { id: 'P6',   factor: 'psychopathy', labelEn: 'Nasty',        labelHe: 'נבזי',   reversed: false },
  { id: 'P7',   factor: 'psychopathy', labelEn: 'Disgusting',   labelHe: 'חולני',  reversed: false },
  { id: 'P8',   factor: 'psychopathy', labelEn: 'Agonizing',    labelHe: 'מאמלל',  reversed: false },
  { id: 'P9',   factor: 'psychopathy', labelEn: 'Abusive',      labelHe: 'מתעלל',  reversed: false },
  { id: 'P10',  factor: 'psychopathy', labelEn: 'Cruel',        labelHe: 'אכזר',   reversed: false },

  // ── FACTOR 3: ORGANIZATION ────────────────────────────────────────
  { id: 'O1',   factor: 'organization', labelEn: 'Orderly',              labelHe: 'מסודר',    reversed: false },
  { id: 'O2',   factor: 'organization', labelEn: 'Organized',            labelHe: 'מאורגן',   reversed: false },
  { id: 'O3',   factor: 'organization', labelEn: 'Performance-Oriented', labelHe: 'ביצועי',   reversed: false },
  { id: 'O4',   factor: 'organization', labelEn: 'Consistent',           labelHe: 'עקבי',     reversed: false },
  { id: 'O5',   factor: 'organization', labelEn: 'Accurate',             labelHe: 'מדויק',    reversed: false },
  { id: 'O6r',  factor: 'organization', labelEn: 'Childish',             labelHe: 'ילדותי',   reversed: true  },
  { id: 'O7r',  factor: 'organization', labelEn: 'Eccentric',            labelHe: 'תמהוני',   reversed: true  },
  { id: 'O8r',  factor: 'organization', labelEn: 'Whimsical',            labelHe: 'גחמני',    reversed: true  },
  { id: 'O9r',  factor: 'organization', labelEn: 'Infantile',            labelHe: 'תינוקי',   reversed: true  },
  { id: 'O10r', factor: 'organization', labelEn: 'Stupid',               labelHe: 'מטופש',    reversed: true  },

  // ── FACTOR 4: IRRITABILITY ────────────────────────────────────────
  { id: 'I1',   factor: 'irritability', labelEn: 'Cranky',       labelHe: 'רגזן',    reversed: false },
  { id: 'I2',   factor: 'irritability', labelEn: 'Hot-Blooded',  labelHe: 'חם מזג',  reversed: false },
  { id: 'I3',   factor: 'irritability', labelEn: 'Aggressive',   labelHe: 'תוקפני',  reversed: false },
  { id: 'I4',   factor: 'irritability', labelEn: 'Hot-Headed',   labelHe: 'חמום',    reversed: false },
  { id: 'I5',   factor: 'irritability', labelEn: 'Bellicose',    labelHe: 'משתלח',   reversed: false },
  { id: 'I6',   factor: 'irritability', labelEn: 'Screaming',    labelHe: 'צרחני',   reversed: false },
  { id: 'I7',   factor: 'irritability', labelEn: 'Flashy',       labelHe: 'צעקני',   reversed: false },
  { id: 'I8r',  factor: 'irritability', labelEn: 'Tolerant',     labelHe: 'סובלני',  reversed: true  },
  { id: 'I9r',  factor: 'irritability', labelEn: 'Calm',         labelHe: 'רגוע',    reversed: true  },
  { id: 'I10r', factor: 'irritability', labelEn: 'Patient',      labelHe: 'סבלני',   reversed: true  },

  // ── FACTOR 5: INTELLECT ───────────────────────────────────────────
  { id: 'T1',   factor: 'intellect', labelEn: 'Intelligent',    labelHe: 'אינטליגנטי',  reversed: false },
  { id: 'T2',   factor: 'intellect', labelEn: 'Clever',         labelHe: 'פיקח',         reversed: false },
  { id: 'T3',   factor: 'intellect', labelEn: 'Insightful',     labelHe: 'בעל תובנה',    reversed: false },
  { id: 'T4',   factor: 'intellect', labelEn: 'Sharp',          labelHe: 'חד',           reversed: false },
  { id: 'T5',   factor: 'intellect', labelEn: 'Wise',           labelHe: 'נבון',         reversed: false },
  { id: 'T6',   factor: 'intellect', labelEn: 'Cognitive',      labelHe: 'שכלי',         reversed: false },
  { id: 'T7',   factor: 'intellect', labelEn: 'Rationalistic',  labelHe: 'רציונליסטי',  reversed: false },
  { id: 'T8',   factor: 'intellect', labelEn: 'Sober-Minded',   labelHe: 'מפוכח',        reversed: false },
  { id: 'T9',   factor: 'intellect', labelEn: 'Intellectual',   labelHe: 'אינטלקטואלי', reversed: false },
  { id: 'T10r', factor: 'intellect', labelEn: 'Silly',          labelHe: 'טפשי',         reversed: true  },

  // ── FACTOR 6: SUPPORTIVENESS (follower questionnaire only) ────────
  // Top-10 loading adjectives from Study 3, Factor 1 (Table 7)
  // Negative-loading items → reversed: true (high rating = low Supportiveness)
  { id: 'S1r',  factor: 'supportiveness', labelEn: 'Destructive',  labelHe: 'דורסני',   reversed: true  },
  { id: 'S2',   factor: 'supportiveness', labelEn: 'Refreshing',   labelHe: 'מרענן',    reversed: false },
  { id: 'S3r',  factor: 'supportiveness', labelEn: 'Dense',        labelHe: 'אטום',     reversed: true  },
  { id: 'S4r',  factor: 'supportiveness', labelEn: 'Inaccessible', labelHe: 'חסום',     reversed: true  },
  { id: 'S5',   factor: 'supportiveness', labelEn: 'Supportive',   labelHe: 'תומך',     reversed: false },
  { id: 'S6r',  factor: 'supportiveness', labelEn: 'Egoistic',     labelHe: 'אגואיסטי', reversed: true  },
  { id: 'S7',   factor: 'supportiveness', labelEn: 'Understanding',labelHe: 'מבין',     reversed: false },
  { id: 'S8r',  factor: 'supportiveness', labelEn: 'Exhausting',   labelHe: 'מתיש',     reversed: true  },
  { id: 'S9r',  factor: 'supportiveness', labelEn: 'Loathsome',    labelHe: 'מאוס',     reversed: true  },
  { id: 'S10r', factor: 'supportiveness', labelEn: 'Disparaging',  labelHe: 'מזלזל',    reversed: true  },

  // ── FACTOR 7: WEAKNESS (follower questionnaire only) ─────────────
  // Top-10 loading adjectives from Study 3, Factor 2 (Table 7)
  // Items describe weakness directly — high rating = high Weakness score
  { id: 'W1',   factor: 'weakness', labelEn: 'Controlled',    labelHe: 'נשלט',    reversed: false },
  { id: 'W2',   factor: 'weakness', labelEn: 'Confused',      labelHe: 'מבולבל',  reversed: false },
  { id: 'W3',   factor: 'weakness', labelEn: 'Weakly',        labelHe: 'חלשלוש',  reversed: false },
  { id: 'W4',   factor: 'weakness', labelEn: 'Wimpish',       labelHe: 'רכרוכי',  reversed: false },
  { id: 'W5',   factor: 'weakness', labelEn: 'Defeatist',     labelHe: 'תבוסתן',  reversed: false },
  { id: 'W6',   factor: 'weakness', labelEn: 'Obsequious',    labelHe: 'נגרר',    reversed: false },
  { id: 'W7',   factor: 'weakness', labelEn: 'Dependent',     labelHe: 'תלותי',   reversed: false },
  { id: 'W8',   factor: 'weakness', labelEn: 'Terrified',     labelHe: 'מבוהל',   reversed: false },
  { id: 'W9',   factor: 'weakness', labelEn: 'Absent-Minded', labelHe: 'מעופף',   reversed: false },
  { id: 'W10',  factor: 'weakness', labelEn: 'Subservient',   labelHe: 'שפוט',    reversed: false },
];

// Ordered factor lists used by the wizard
export const LEADER_FACTOR_KEYS: LeaderFactor[] = [
  'energy', 'psychopathy', 'organization', 'irritability', 'intellect',
];

export const FOLLOWER_FACTOR_KEYS: FollowerFactor[] = [
  'supportiveness', 'weakness', 'energy', 'psychopathy', 'organization', 'irritability', 'intellect',
];

// Legacy export kept for backward compat
export const FACTORS: Array<{ key: LeaderFactor; stepIndex: number }> = [
  { key: 'energy',       stepIndex: 1 },
  { key: 'psychopathy',  stepIndex: 2 },
  { key: 'organization', stepIndex: 3 },
  { key: 'irritability', stepIndex: 4 },
  { key: 'intellect',    stepIndex: 5 },
];

export function getItemsByFactor(factor: Factor): AssessmentItem[] {
  return ITEMS.filter(item => item.factor === factor);
}
