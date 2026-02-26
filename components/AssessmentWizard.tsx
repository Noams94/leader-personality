'use client';

import { useState, useMemo } from 'react';
import { useRouter } from '@/i18n/navigation';
import { ITEMS, LEADER_FACTOR_KEYS, FOLLOWER_FACTOR_KEYS } from '@/lib/items';
import type { Responses, Role } from '@/lib/types';
import LikertItem from './LikertItem';

interface AssessmentWizardProps {
  locale: string;
  t: {
    roleTitle: string;
    roleSubtitle: string;
    leaderCard: string;
    leaderCardDesc: string;
    followerCard: string;
    followerCardDesc: string;
    instructionsLeader: string;
    instructionsFollower: string;
    progress: string;
    next: string;
    back: string;
    submit: string;
    scale1: string;
    scale5: string;
  };
}

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

export default function AssessmentWizard({ locale, t }: AssessmentWizardProps) {
  const router = useRouter();
  const [role, setRole] = useState<Role | null>(null);
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<Responses>({});
  const [seed] = useState(() => Math.floor(Math.random() * 1000));
  const isRtl = locale === 'he';

  const factorKeys = role === 'follower' ? FOLLOWER_FACTOR_KEYS : LEADER_FACTOR_KEYS;
  const totalSteps = factorKeys.length;
  const currentFactor = role ? factorKeys[step] : null;

  const stepItems = useMemo(
    () => currentFactor ? seededShuffle(ITEMS.filter(i => i.factor === currentFactor), seed + step) : [],
    [currentFactor, seed, step]
  );

  const stepAnswered = stepItems.filter(i => responses[i.id] !== undefined).length;
  const stepComplete = stepAnswered === stepItems.length;

  const handleChange = (id: string, value: number) => {
    setResponses(prev => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(s => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      sessionStorage.setItem('assessmentResponses', JSON.stringify(responses));
      sessionStorage.setItem('assessmentRole', role!);
      router.push('/results');
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(s => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ── Role selection screen ────────────────────────────────────────
  if (!role) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-4xl mb-4">🧭</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.roleTitle}</h2>
          <p className="text-gray-500">{t.roleSubtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Manager card */}
          <button
            type="button"
            onClick={() => setRole('leader')}
            className="group text-start p-8 bg-white rounded-2xl border-2 border-gray-100
              hover:border-blue-500 hover:shadow-lg transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="text-5xl mb-4">👔</div>
            <h3 className="font-bold text-gray-900 text-xl mb-2 group-hover:text-blue-600 transition-colors">
              {t.leaderCard}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">{t.leaderCardDesc}</p>
            <div className="mt-4 text-xs font-semibold text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
              50 items · 5 factors →
            </div>
          </button>

          {/* Employee card */}
          <button
            type="button"
            onClick={() => setRole('follower')}
            className="group text-start p-8 bg-white rounded-2xl border-2 border-gray-100
              hover:border-purple-500 hover:shadow-lg transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <div className="text-5xl mb-4">👥</div>
            <h3 className="font-bold text-gray-900 text-xl mb-2 group-hover:text-purple-600 transition-colors">
              {t.followerCard}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">{t.followerCardDesc}</p>
            <div className="mt-4 text-xs font-semibold text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">
              70 items · 7 factors →
            </div>
          </button>
        </div>
      </div>
    );
  }

  // ── Assessment step ──────────────────────────────────────────────
  const instructions = role === 'leader' ? t.instructionsLeader : t.instructionsFollower;
  const progressText = t.progress
    .replace('{step}', String(step + 1))
    .replace('{total}', String(totalSteps));
  const progressPercent = ((step + (stepComplete ? 1 : stepAnswered / stepItems.length)) / totalSteps) * 100;
  const accentColor = role === 'follower' ? 'bg-purple-600' : 'bg-blue-600';
  const accentHover = role === 'follower' ? 'hover:bg-purple-700' : 'hover:bg-blue-700';

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>{progressText}</span>
          <span>{stepAnswered} / {stepItems.length}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${accentColor} rounded-full transition-all duration-300`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Instructions */}
      <p className="text-gray-600 text-sm mb-6 italic">{instructions}</p>

      {/* Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-2 mb-8">
        {stepItems.map(item => (
          <LikertItem
            key={item.id}
            item={item}
            value={responses[item.id]}
            onChange={handleChange}
            locale={locale}
            scale1Label={t.scale1}
            scale5Label={t.scale5}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className={`flex items-center ${isRtl ? 'flex-row-reverse' : ''} justify-between gap-4`}>
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 0}
          className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 font-medium
            hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          {t.back}
        </button>

        {/* Step dot indicators */}
        <div className="flex gap-1.5 flex-wrap justify-center">
          {factorKeys.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i < step
                  ? (role === 'follower' ? 'bg-purple-600' : 'bg-blue-600')
                  : i === step
                  ? (role === 'follower' ? 'bg-purple-400' : 'bg-blue-400')
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={!stepComplete}
          className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-150
            ${stepComplete
              ? `${accentColor} ${accentHover} shadow-md hover:shadow-lg`
              : 'bg-gray-300 cursor-not-allowed'
            }
          `}
        >
          {step === totalSteps - 1 ? t.submit : t.next}
        </button>
      </div>
    </div>
  );
}
