'use client';

import { useState, useMemo } from 'react';
import { useRouter } from '@/i18n/navigation';
import { ITEMS, LEADER_FACTOR_KEYS, FOLLOWER_FACTOR_KEYS } from '@/lib/items';
import type { Responses, Role } from '@/lib/types';

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
  const [role, setRole]         = useState<Role | null>(null);
  const [itemIndex, setItemIndex] = useState(0);
  const [responses, setResponses] = useState<Responses>({});
  const [seed]                  = useState(() => Math.floor(Math.random() * 1000));
  const [fading, setFading]     = useState(false);
  const isRtl = locale === 'he';

  // Flat shuffled list: shuffle within each factor, then concatenate
  const allItems = useMemo(() => {
    if (!role) return [];
    const keys = role === 'follower' ? FOLLOWER_FACTOR_KEYS : LEADER_FACTOR_KEYS;
    return keys.flatMap((factor, fi) =>
      seededShuffle(ITEMS.filter(i => i.factor === factor), seed + fi)
    );
  }, [role, seed]);

  const totalItems  = allItems.length;
  const currentItem = allItems[itemIndex] ?? null;
  const isLast      = itemIndex === totalItems - 1;
  const currentValue = currentItem ? responses[currentItem.id] : undefined;

  const handleSelect = (value: number) => {
    if (fading || !currentItem) return;

    const newResponses = { ...responses, [currentItem.id]: value };
    setResponses(newResponses);

    if (isLast) {
      // Brief pause so the selected button is visible, then navigate
      setTimeout(() => {
        sessionStorage.setItem('assessmentResponses', JSON.stringify(newResponses));
        sessionStorage.setItem('assessmentRole', role!);
        router.push('/results');
      }, 450);
      return;
    }

    // Fade out → advance → fade in
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
              50 פריטים · 5 גורמים →
            </div>
          </button>

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
              70 פריטים · 7 גורמים →
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (!currentItem) return null;

  const accentBg    = role === 'follower' ? 'bg-purple-600'    : 'bg-blue-600';
  const accentHover = role === 'follower' ? 'hover:bg-purple-500' : 'hover:bg-blue-500';
  const accentRing  = role === 'follower' ? 'ring-purple-400'  : 'ring-blue-400';
  const instructions = role === 'leader' ? t.instructionsLeader : t.instructionsFollower;
  const progressPercent = ((itemIndex + 1) / totalItems) * 100;
  const label = locale === 'he' ? currentItem.labelHe : currentItem.labelEn;

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
            <span>{t.scale1}</span>
            <span>{t.scale5}</span>
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
            {t.back}
          </button>
        </div>
      </div>

    </div>
  );
}
