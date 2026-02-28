import type { AssessmentItem, LeaderFactor, FollowerFactor, Factor } from './types';

export const ITEMS: AssessmentItem[] = [
  // ── FACTOR 1: ENERGY ──────────────────────────────────────────────
  { id: 'E1',   factor: 'energy', labelEn: 'Charismatic',  labelHe: 'כריזמטי',    labelHeFemale: 'כריזמטית',    reversed: false },
  { id: 'E2',   factor: 'energy', labelEn: 'Leaderly',     labelHe: 'הנהגתי',     labelHeFemale: 'הנהגתית',     reversed: false },
  { id: 'E3',   factor: 'energy', labelEn: 'Exciting',     labelHe: 'מלהיב',      labelHeFemale: 'מלהיבה',      reversed: false },
  { id: 'E4',   factor: 'energy', labelEn: 'Guiding',      labelHe: 'מוביל',      labelHeFemale: 'מובילה',      reversed: false },
  { id: 'E5',   factor: 'energy', labelEn: 'Confident',    labelHe: 'בטוח בעצמו', labelHeFemale: 'בטוחה בעצמה', reversed: false },
  { id: 'E6',   factor: 'energy', labelEn: 'Daring',       labelHe: 'מעז',        labelHeFemale: 'מעיזה',       reversed: false },
  { id: 'E7r',  factor: 'energy', labelEn: 'Coward',       labelHe: 'פחדן',       labelHeFemale: 'פחדנית',      reversed: true  },
  { id: 'E8r',  factor: 'energy', labelEn: 'Frightened',   labelHe: 'נפחד',       labelHeFemale: 'נפחדת',       reversed: true  },
  { id: 'E9r',  factor: 'energy', labelEn: 'Submissive',   labelHe: 'כנוע',       labelHeFemale: 'כנועה',       reversed: true  },
  { id: 'E10r', factor: 'energy', labelEn: 'Undecisive',   labelHe: 'מהוסס',      labelHeFemale: 'מהוססת',      reversed: true  },

  // ── FACTOR 2: PSYCHOPATHY ─────────────────────────────────────────
  { id: 'P1',   factor: 'psychopathy', labelEn: 'Sickening',    labelHe: 'מחליא',  labelHeFemale: 'מחליאה',   reversed: false },
  { id: 'P2',   factor: 'psychopathy', labelEn: 'Corrupt',      labelHe: 'מושחת',  labelHeFemale: 'מושחתת',   reversed: false },
  { id: 'P3',   factor: 'psychopathy', labelEn: 'Disingenuous', labelHe: 'רמאי',   labelHeFemale: 'רמאית',    reversed: false },
  { id: 'P4',   factor: 'psychopathy', labelEn: 'Violent',      labelHe: 'אלים',   labelHeFemale: 'אלימה',    reversed: false },
  { id: 'P5',   factor: 'psychopathy', labelEn: 'Sadistic',     labelHe: 'סדיסט',  labelHeFemale: 'סדיסטית',  reversed: false },
  { id: 'P6',   factor: 'psychopathy', labelEn: 'Nasty',        labelHe: 'נבזי',   labelHeFemale: 'נבזית',    reversed: false },
  { id: 'P7',   factor: 'psychopathy', labelEn: 'Disgusting',   labelHe: 'חולני',  labelHeFemale: 'חולנית',   reversed: false },
  { id: 'P8',   factor: 'psychopathy', labelEn: 'Agonizing',    labelHe: 'מאמלל',  labelHeFemale: 'מאמללת',   reversed: false },
  { id: 'P9',   factor: 'psychopathy', labelEn: 'Abusive',      labelHe: 'מתעלל',  labelHeFemale: 'מתעללת',   reversed: false },
  { id: 'P10',  factor: 'psychopathy', labelEn: 'Cruel',        labelHe: 'אכזר',   labelHeFemale: 'אכזרית',   reversed: false },

  // ── FACTOR 3: ORGANIZATION ────────────────────────────────────────
  { id: 'O1',   factor: 'organization', labelEn: 'Orderly',              labelHe: 'מסודר',    labelHeFemale: 'מסודרת',    reversed: false },
  { id: 'O2',   factor: 'organization', labelEn: 'Organized',            labelHe: 'מאורגן',   labelHeFemale: 'מאורגנת',   reversed: false },
  { id: 'O3',   factor: 'organization', labelEn: 'Performance-Oriented', labelHe: 'ביצועי',   labelHeFemale: 'ביצועית',   reversed: false },
  { id: 'O4',   factor: 'organization', labelEn: 'Consistent',           labelHe: 'עקבי',     labelHeFemale: 'עקבית',     reversed: false },
  { id: 'O5',   factor: 'organization', labelEn: 'Accurate',             labelHe: 'מדויק',    labelHeFemale: 'מדויקת',    reversed: false },
  { id: 'O6r',  factor: 'organization', labelEn: 'Childish',             labelHe: 'ילדותי',   labelHeFemale: 'ילדותית',   reversed: true  },
  { id: 'O7r',  factor: 'organization', labelEn: 'Eccentric',            labelHe: 'תמהוני',   labelHeFemale: 'תמהונית',   reversed: true  },
  { id: 'O8r',  factor: 'organization', labelEn: 'Whimsical',            labelHe: 'גחמני',    labelHeFemale: 'גחמנית',    reversed: true  },
  { id: 'O9r',  factor: 'organization', labelEn: 'Infantile',            labelHe: 'תינוקי',   labelHeFemale: 'תינוקית',   reversed: true  },
  { id: 'O10r', factor: 'organization', labelEn: 'Stupid',               labelHe: 'מטופש',    labelHeFemale: 'מטופשת',    reversed: true  },

  // ── FACTOR 4: IRRITABILITY ────────────────────────────────────────
  { id: 'I1',   factor: 'irritability', labelEn: 'Cranky',       labelHe: 'רגזן',    labelHeFemale: 'רגזנית',    reversed: false },
  { id: 'I2',   factor: 'irritability', labelEn: 'Hot-Blooded',  labelHe: 'חם מזג',  labelHeFemale: 'חמת מזג',   reversed: false },
  { id: 'I3',   factor: 'irritability', labelEn: 'Aggressive',   labelHe: 'תוקפני',  labelHeFemale: 'תוקפנית',   reversed: false },
  { id: 'I4',   factor: 'irritability', labelEn: 'Hot-Headed',   labelHe: 'חמום',    labelHeFemale: 'חמומה',     reversed: false },
  { id: 'I5',   factor: 'irritability', labelEn: 'Bellicose',    labelHe: 'משתלח',   labelHeFemale: 'משתלחת',    reversed: false },
  { id: 'I6',   factor: 'irritability', labelEn: 'Screaming',    labelHe: 'צרחני',   labelHeFemale: 'צרחנית',    reversed: false },
  { id: 'I7',   factor: 'irritability', labelEn: 'Flashy',       labelHe: 'צעקני',   labelHeFemale: 'צעקנית',    reversed: false },
  { id: 'I8r',  factor: 'irritability', labelEn: 'Tolerant',     labelHe: 'סובלני',  labelHeFemale: 'סובלנית',   reversed: true  },
  { id: 'I9r',  factor: 'irritability', labelEn: 'Calm',         labelHe: 'רגוע',    labelHeFemale: 'רגועה',     reversed: true  },
  { id: 'I10r', factor: 'irritability', labelEn: 'Patient',      labelHe: 'סבלני',   labelHeFemale: 'סבלנית',    reversed: true  },

  // ── FACTOR 5: INTELLECT ───────────────────────────────────────────
  { id: 'T1',   factor: 'intellect', labelEn: 'Intelligent',    labelHe: 'אינטליגנטי',  labelHeFemale: 'אינטליגנטית',  reversed: false },
  { id: 'T2',   factor: 'intellect', labelEn: 'Clever',         labelHe: 'פיקח',         labelHeFemale: 'פיקחית',        reversed: false },
  { id: 'T3',   factor: 'intellect', labelEn: 'Insightful',     labelHe: 'בעל תובנה',    labelHeFemale: 'בעלת תובנה',    reversed: false },
  { id: 'T4',   factor: 'intellect', labelEn: 'Sharp',          labelHe: 'חד',           labelHeFemale: 'חדה',           reversed: false },
  { id: 'T5',   factor: 'intellect', labelEn: 'Wise',           labelHe: 'נבון',         labelHeFemale: 'נבונה',         reversed: false },
  { id: 'T6',   factor: 'intellect', labelEn: 'Cognitive',      labelHe: 'שכלי',         labelHeFemale: 'שכלית',         reversed: false },
  { id: 'T7',   factor: 'intellect', labelEn: 'Rationalistic',  labelHe: 'רציונליסטי',  labelHeFemale: 'רציונליסטית',  reversed: false },
  { id: 'T8',   factor: 'intellect', labelEn: 'Sober-Minded',   labelHe: 'מפוכח',        labelHeFemale: 'מפוכחת',        reversed: false },
  { id: 'T9',   factor: 'intellect', labelEn: 'Intellectual',   labelHe: 'אינטלקטואלי', labelHeFemale: 'אינטלקטואלית', reversed: false },
  { id: 'T10r', factor: 'intellect', labelEn: 'Silly',          labelHe: 'טפשי',         labelHeFemale: 'טפשית',         reversed: true  },

  // ── FACTOR 6: SUPPORTIVENESS (follower questionnaire only) ────────
  { id: 'S1r',  factor: 'supportiveness', labelEn: 'Destructive',  labelHe: 'דורסני',   labelHeFemale: 'דורסנית',   reversed: true  },
  { id: 'S2',   factor: 'supportiveness', labelEn: 'Refreshing',   labelHe: 'מרענן',    labelHeFemale: 'מרעננת',    reversed: false },
  { id: 'S3r',  factor: 'supportiveness', labelEn: 'Dense',        labelHe: 'אטום',     labelHeFemale: 'אטומה',     reversed: true  },
  { id: 'S4r',  factor: 'supportiveness', labelEn: 'Inaccessible', labelHe: 'חסום',     labelHeFemale: 'חסומה',     reversed: true  },
  { id: 'S5',   factor: 'supportiveness', labelEn: 'Supportive',   labelHe: 'תומך',     labelHeFemale: 'תומכת',     reversed: false },
  { id: 'S6r',  factor: 'supportiveness', labelEn: 'Egoistic',     labelHe: 'אגואיסטי', labelHeFemale: 'אגואיסטית', reversed: true  },
  { id: 'S7',   factor: 'supportiveness', labelEn: 'Understanding', labelHe: 'מבין',    labelHeFemale: 'מבינה',     reversed: false },
  { id: 'S8r',  factor: 'supportiveness', labelEn: 'Exhausting',   labelHe: 'מתיש',     labelHeFemale: 'מתישה',     reversed: true  },
  { id: 'S9r',  factor: 'supportiveness', labelEn: 'Loathsome',    labelHe: 'מאוס',     labelHeFemale: 'מאוסה',     reversed: true  },
  { id: 'S10r', factor: 'supportiveness', labelEn: 'Disparaging',  labelHe: 'מזלזל',    labelHeFemale: 'מזלזלת',    reversed: true  },

  // ── FACTOR 7: WEAKNESS (follower questionnaire only) ─────────────
  { id: 'W1',   factor: 'weakness', labelEn: 'Controlled',    labelHe: 'נשלט',    labelHeFemale: 'נשלטת',    reversed: false },
  { id: 'W2',   factor: 'weakness', labelEn: 'Confused',      labelHe: 'מבולבל',  labelHeFemale: 'מבולבלת',  reversed: false },
  { id: 'W3',   factor: 'weakness', labelEn: 'Weakly',        labelHe: 'חלשלוש',  labelHeFemale: 'חלשלושה',  reversed: false },
  { id: 'W4',   factor: 'weakness', labelEn: 'Wimpish',       labelHe: 'רכרוכי',  labelHeFemale: 'רכרוכית',  reversed: false },
  { id: 'W5',   factor: 'weakness', labelEn: 'Defeatist',     labelHe: 'תבוסתן',  labelHeFemale: 'תבוסתנית', reversed: false },
  { id: 'W6',   factor: 'weakness', labelEn: 'Obsequious',    labelHe: 'נגרר',    labelHeFemale: 'נגררת',    reversed: false },
  { id: 'W7',   factor: 'weakness', labelEn: 'Dependent',     labelHe: 'תלותי',   labelHeFemale: 'תלותית',   reversed: false },
  { id: 'W8',   factor: 'weakness', labelEn: 'Terrified',     labelHe: 'מבוהל',   labelHeFemale: 'מבוהלת',   reversed: false },
  { id: 'W9',   factor: 'weakness', labelEn: 'Absent-Minded', labelHe: 'מעופף',   labelHeFemale: 'מעופפת',   reversed: false },
  { id: 'W10',  factor: 'weakness', labelEn: 'Subservient',   labelHe: 'שפוט',    labelHeFemale: 'שפוטה',    reversed: false },
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
