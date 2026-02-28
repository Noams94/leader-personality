'use client';

import { useState, useMemo } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { ITEMS, LEADER_FACTOR_KEYS, FOLLOWER_FACTOR_KEYS } from '@/lib/items';
import type { Responses, Role, Gender } from '@/lib/types';

type Screen = 'role' | 'gender' | 'leaderGender' | 'demographics' | 'quiz';

interface Demographics {
  age: string;
  industry: string;
  orgSize: string;
  experience: string;
}

// ─── Demographic option arrays ─────────────────────────────────────────────────

const AGE_OPTS: Record<string, string[]> = {
  en: ['Under 25', '25–34', '35–44', '45–54', '55–64', '65+'],
  he: ['עד 25', '25–34', '35–44', '45–54', '55–64', '65+'],
};

const INDUSTRY_OPTS: Record<string, string[]> = {
  en: ['Technology', 'Finance & Banking', 'Healthcare', 'Education', 'Manufacturing',
       'Retail & Commerce', 'Government & Public Sector', 'Military & Security',
       'Non-profit / Religious', 'Other'],
  he: ['טכנולוגיה', 'פיננסים ובנקאות', 'בריאות', 'חינוך', 'תעשייה וייצור',
       'מסחר וקמעונאות', 'ממשלה ורשויות', 'ביטחון וצבא', 'מלכ"ר / דת', 'אחר'],
};

const ORG_SIZE_OPTS = ['1–10', '11–50', '51–200', '201–1000', '1001+'];

const EXPERIENCE_OPTS: Record<string, string[]> = {
  en: ['Less than 1 year', '1–3 years', '4–7 years', '8–15 years', '15+ years'],
  he: ['פחות משנה', '1–3 שנים', '4–7 שנים', '8–15 שנים', '15+ שנים'],
};

// ─── Hebrew gender-aware instruction generator ─────────────────────────────────

function getHebInstruction(role: Role, respondentGender: Gender, leaderGender: Gender): string {
  const suffix = '(1 = כלל לא, 5 = במידה רבה מאוד).';
  if (role === 'leader') {
    if (respondentGender === 'male') {
      return `עבור כל תואר, דרג עד כמה הוא מתאר אותך כמנהיג ${suffix}`;
    } else if (respondentGender === 'female') {
      return `עבור כל תואר, דרגי עד כמה הוא מתאר אותך כמנהיגה ${suffix}`;
    } else {
      return `עבור כל תואר, דרגו עד כמה הוא מתאר אתכם כמנהיג/ה ${suffix}`;
    }
  } else {
    const verb = respondentGender === 'male' ? 'דרג'
      : respondentGender === 'female' ? 'דרגי'
      : 'דרגו';
    const pronoun = respondentGender === 'other' ? 'שלכם' : 'שלך';
    const leaderNoun = leaderGender === 'male' ? 'המנהל'
      : leaderGender === 'female' ? 'המנהלת'
      : 'המנהל/ת';
    return `עבור כל תואר, ${verb} עד כמה הוא מתאר את ${leaderNoun} ${pronoun} ${suffix}`;
  }
}

// ─── Helper: seeded shuffle ────────────────────────────────────────────────────

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Helper component: GenderCard ─────────────────────────────────────────────

function GenderCard({
  emoji, label, onClick, hoverBorderClass, focusRingClass,
}: {
  emoji: string;
  label: string;
  onClick: () => void;
  hoverBorderClass: string;
  focusRingClass: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-center gap-4 w-full text-start p-5 bg-white
        rounded-2xl border-2 border-gray-100 ${hoverBorderClass} hover:shadow-md
        transition-all duration-200 focus:outline-none focus:ring-2 ${focusRingClass}`}
    >
      <span className="text-3xl">{emoji}</span>
      <span className="font-semibold text-gray-900 text-base group-hover:text-gray-600 transition-colors">
        {label}
      </span>
    </button>
  );
}

// ─── Helper component: DemoSelect ─────────────────────────────────────────────

function DemoSelect({
  label, options, value, onChange, isRtl,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  isRtl: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        dir={isRtl ? 'rtl' : 'ltr'}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white
          text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
      >
        <option value="">—</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function AssessmentWizard() {
  const t      = useTranslations('assessment');
  const locale = useLocale();
  const router = useRouter();
  const isRtl  = locale === 'he';

  // Screen state machine
  const [screen, setScreen]                   = useState<Screen>('role');
  const [role, setRole]                       = useState<Role>('leader');
  const [respondentGender, setRespondentGender] = useState<Gender>('other');
  const [leaderGender, setLeaderGender]       = useState<Gender>('other');
  const [demographics, setDemographics]       = useState<Demographics>({
    age: '', industry: '', orgSize: '', experience: '',
  });

  // Quiz state
  const [itemIndex, setItemIndex] = useState(0);
  const [responses, setResponses] = useState<Responses>({});
  const [seed]                    = useState(() => Math.floor(Math.random() * 1000));
  const [fading, setFading]       = useState(false);

  // Compute item list only when quiz starts (deps stable during quiz)
  const allItems = useMemo(() => {
    if (screen !== 'quiz') return [];
    const keys = role === 'follower' ? FOLLOWER_FACTOR_KEYS : LEADER_FACTOR_KEYS;
    return keys.flatMap((factor, fi) =>
      seededShuffle(ITEMS.filter(i => i.factor === factor), seed + fi)
    );
  }, [screen, role, seed]);

  const totalItems   = allItems.length;
  const currentItem  = allItems[itemIndex] ?? null;
  const isLast       = itemIndex === totalItems - 1;
  const currentValue = currentItem ? responses[currentItem.id] : undefined;

  // Accent colours (role-based, stable after role screen)
  const isFollower    = role === 'follower';
  const accentBg      = isFollower ? 'bg-purple-600'         : 'bg-blue-600';
  const accentHover   = isFollower ? 'hover:bg-purple-500'   : 'hover:bg-blue-500';
  const accentRing    = isFollower ? 'ring-purple-400'        : 'ring-blue-400';
  const hoverBorder   = isFollower ? 'hover:border-purple-500' : 'hover:border-blue-500';
  const focusRing     = isFollower ? 'focus:ring-purple-500' : 'focus:ring-blue-500';

  // ── Screen: Role ──────────────────────────────────────────────────────────────
  if (screen === 'role') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-4xl mb-4">🧭</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('roleTitle')}</h2>
          <p className="text-gray-500">{t('roleSubtitle')}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Leader card */}
          <button
            type="button"
            onClick={() => { setRole('leader'); setScreen('gender'); }}
            className="group text-start p-8 bg-white rounded-2xl border-2 border-gray-100
              hover:border-blue-500 hover:shadow-lg transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="text-5xl mb-4">👔</div>
            <h3 className="font-bold text-gray-900 text-xl mb-2 group-hover:text-blue-600 transition-colors">
              {t('leaderCard')}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">{t('leaderCardDesc')}</p>
            <div className="mt-4 text-xs font-semibold text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
              {t('leaderCardHint')} →
            </div>
          </button>

          {/* Follower card */}
          <button
            type="button"
            onClick={() => { setRole('follower'); setScreen('gender'); }}
            className="group text-start p-8 bg-white rounded-2xl border-2 border-gray-100
              hover:border-purple-500 hover:shadow-lg transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <div className="text-5xl mb-4">👥</div>
            <h3 className="font-bold text-gray-900 text-xl mb-2 group-hover:text-purple-600 transition-colors">
              {t('followerCard')}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">{t('followerCardDesc')}</p>
            <div className="mt-4 text-xs font-semibold text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">
              {t('followerCardHint')} →
            </div>
          </button>
        </div>
      </div>
    );
  }

  // ── Screen: Respondent gender ─────────────────────────────────────────────────
  if (screen === 'gender') {
    const genderOpts: { value: Gender; emoji: string; label: string }[] = [
      { value: 'male',   emoji: '👨', label: t('genderMale')   },
      { value: 'female', emoji: '👩', label: t('genderFemale') },
      { value: 'other',  emoji: '🙋', label: t('genderOther')  },
    ];
    return (
      <div className="max-w-sm mx-auto">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">👤</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('genderTitle')}</h2>
          <p className="text-gray-500 text-sm leading-relaxed">{t('genderSubtitle')}</p>
        </div>

        <div className="flex flex-col gap-3">
          {genderOpts.map(opt => (
            <GenderCard
              key={opt.value}
              emoji={opt.emoji}
              label={opt.label}
              onClick={() => {
                setRespondentGender(opt.value);
                setScreen(isFollower ? 'leaderGender' : 'demographics');
              }}
              hoverBorderClass={hoverBorder}
              focusRingClass={focusRing}
            />
          ))}
        </div>

        <button
          className="mt-5 w-full text-center text-xs text-gray-400 hover:text-gray-500 py-2 transition-colors"
          onClick={() => setScreen('role')}
        >
          ← {t('back')}
        </button>
      </div>
    );
  }

  // ── Screen: Leader gender (follower only) ─────────────────────────────────────
  if (screen === 'leaderGender') {
    const leaderGenderOpts: { value: Gender; emoji: string; label: string }[] = [
      { value: 'male',   emoji: '👨‍💼', label: t('leaderGenderMale')   },
      { value: 'female', emoji: '👩‍💼', label: t('leaderGenderFemale') },
      { value: 'other',  emoji: '🤷',   label: t('leaderGenderOther')  },
    ];
    return (
      <div className="max-w-sm mx-auto">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">👔</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('leaderGenderTitle')}</h2>
          <p className="text-gray-500 text-sm leading-relaxed">{t('leaderGenderSubtitle')}</p>
        </div>

        <div className="flex flex-col gap-3">
          {leaderGenderOpts.map(opt => (
            <GenderCard
              key={opt.value}
              emoji={opt.emoji}
              label={opt.label}
              onClick={() => {
                setLeaderGender(opt.value);
                setScreen('demographics');
              }}
              hoverBorderClass={hoverBorder}
              focusRingClass={focusRing}
            />
          ))}
        </div>

        <button
          className="mt-5 w-full text-center text-xs text-gray-400 hover:text-gray-500 py-2 transition-colors"
          onClick={() => setScreen('gender')}
        >
          ← {t('back')}
        </button>
      </div>
    );
  }

  // ── Screen: Demographics (optional) ──────────────────────────────────────────
  if (screen === 'demographics') {
    const ageOpts        = AGE_OPTS[locale]        ?? AGE_OPTS.en;
    const industryOpts   = INDUSTRY_OPTS[locale]   ?? INDUSTRY_OPTS.en;
    const experienceOpts = EXPERIENCE_OPTS[locale]  ?? EXPERIENCE_OPTS.en;
    const expLabel       = isFollower ? t('experienceFollowerLabel') : t('experienceLeaderLabel');
    const prevScreen: Screen = isFollower ? 'leaderGender' : 'gender';

    const goToQuiz = () => setScreen('quiz');
    const skipAll  = () => {
      setDemographics({ age: '', industry: '', orgSize: '', experience: '' });
      setScreen('quiz');
    };

    return (
      <div className="max-w-sm mx-auto">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">📋</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t('demographicsTitle')}</h2>
          <p className="text-gray-500 text-sm leading-relaxed">{t('demographicsSubtitle')}</p>
        </div>

        <div className="flex flex-col gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <DemoSelect
            label={t('ageLabel')}
            options={ageOpts}
            value={demographics.age}
            onChange={v => setDemographics(d => ({ ...d, age: v }))}
            isRtl={isRtl}
          />
          <DemoSelect
            label={t('industryLabel')}
            options={industryOpts}
            value={demographics.industry}
            onChange={v => setDemographics(d => ({ ...d, industry: v }))}
            isRtl={isRtl}
          />
          <DemoSelect
            label={t('orgSizeLabel')}
            options={ORG_SIZE_OPTS}
            value={demographics.orgSize}
            onChange={v => setDemographics(d => ({ ...d, orgSize: v }))}
            isRtl={isRtl}
          />
          <DemoSelect
            label={expLabel}
            options={experienceOpts}
            value={demographics.experience}
            onChange={v => setDemographics(d => ({ ...d, experience: v }))}
            isRtl={isRtl}
          />
        </div>

        <div className="flex flex-col gap-2 mt-6">
          <button
            onClick={goToQuiz}
            className={`w-full py-3 rounded-xl font-semibold text-sm text-white ${accentBg} ${accentHover} transition-colors shadow-sm`}
          >
            {t('demographicsContinue')} →
          </button>
          <button
            onClick={skipAll}
            className="w-full py-2 rounded-xl text-sm text-gray-400 hover:text-gray-500 transition-colors"
          >
            {t('demographicsSkip')}
          </button>
        </div>

        <button
          className="mt-3 w-full text-center text-xs text-gray-400 hover:text-gray-500 py-1 transition-colors"
          onClick={() => setScreen(prevScreen)}
        >
          ← {t('back')}
        </button>
      </div>
    );
  }

  // ── Screen: Quiz ──────────────────────────────────────────────────────────────
  if (screen !== 'quiz' || !currentItem) return null;

  const handleSelect = (value: number) => {
    if (fading || !currentItem) return;
    const newResponses = { ...responses, [currentItem.id]: value };
    setResponses(newResponses);

    if (isLast) {
      setTimeout(() => {
        sessionStorage.setItem('assessmentResponses',       JSON.stringify(newResponses));
        sessionStorage.setItem('assessmentRole',            role);
        sessionStorage.setItem('assessmentRespondentGender', respondentGender);
        sessionStorage.setItem('assessmentLeaderGender',    leaderGender);
        if (Object.values(demographics).some(v => v)) {
          sessionStorage.setItem('assessmentDemographics', JSON.stringify(demographics));
        }
        router.push('/results');
      }, 450);
      return;
    }

    setFading(true);
    setTimeout(() => {
      setItemIndex(i => i + 1);
      setFading(false);
    }, 200);
  };

  const handleBack = () => {
    if (itemIndex === 0 || fading) return;
    setFading(true);
    setTimeout(() => {
      setItemIndex(i => i - 1);
      setFading(false);
    }, 150);
  };

  const progressPercent = ((itemIndex + 1) / totalItems) * 100;

  // Gender of the person being described:
  //   • leader role  → respondent's own gender (they rate themselves)
  //   • follower role → leader's gender (they rate their supervisor)
  const adjectiveGender = isFollower ? leaderGender : respondentGender;
  const label = locale !== 'he'
    ? currentItem.labelEn
    : adjectiveGender === 'female' && currentItem.labelHeFemale
      ? currentItem.labelHeFemale
      : currentItem.labelHe;

  // Gender-aware instructions
  const instructions = locale === 'he'
    ? getHebInstruction(role, respondentGender, leaderGender)
    : (isFollower ? t('instructionsFollower') : t('instructionsLeader'));

  return (
    <div className="max-w-md mx-auto">

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>{itemIndex + 1} / {totalItems}</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${accentBg} rounded-full transition-all duration-300`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Instructions */}
      <p className="text-center text-xs text-gray-400 mb-6 italic leading-relaxed px-2">
        {instructions}
      </p>

      {/* Item card — fades between items */}
      <div className={`transition-opacity duration-200 ${fading ? 'opacity-0' : 'opacity-100'}`}>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 px-8 py-12 mb-6 text-center">

          {/* The adjective */}
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-12 tracking-tight">
            {label}
          </h2>

          {/* Scale endpoint labels */}
          <div className={`flex justify-between text-xs text-gray-400 mb-3 px-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <span>{t('scale1')}</span>
            <span>{t('scale5')}</span>
          </div>

          {/* 1–5 buttons */}
          <div className="flex gap-3 justify-center">
            {[1, 2, 3, 4, 5].map(v => (
              <button
                key={v}
                onClick={() => handleSelect(v)}
                className={`
                  w-12 h-12 sm:w-14 sm:h-14 rounded-full font-bold text-lg select-none
                  transition-all duration-150
                  ${currentValue === v
                    ? `${accentBg} ${accentHover} text-white shadow-md scale-110 ring-2 ring-offset-2 ${accentRing}`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95'
                  }
                `}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Back button */}
        <div className={`flex ${isRtl ? 'justify-end' : 'justify-start'}`}>
          <button
            onClick={handleBack}
            disabled={itemIndex === 0}
            className="px-4 py-2 rounded-xl text-sm text-gray-400
              hover:text-gray-600 hover:bg-gray-100
              disabled:opacity-0 disabled:pointer-events-none
              transition-all duration-150"
          >
            {t('back')}
          </button>
        </div>
      </div>

    </div>
  );
}
