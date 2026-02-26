'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import dynamic from 'next/dynamic';
import { Link } from '@/i18n/navigation';
import { scoreAssessment, scoreFollowerAssessment, getComparisonLabel } from '@/lib/scoring';
import { BENCHMARKS, FACTOR_ORDER, FOLLOWER_FACTOR_ORDER } from '@/lib/benchmarks';
import type { FactorScores, FollowerScores, Role } from '@/lib/types';

const ResultsRadar = dynamic(() => import('@/components/ResultsRadar'), { ssr: false });

const FACTOR_LABELS_EN: Record<string, string> = {
  energy: 'Energy', psychopathy: 'Psychopathy', organization: 'Organization',
  irritability: 'Irritability', intellect: 'Intellect',
  supportiveness: 'Supportiveness', weakness: 'Weakness',
};
const FACTOR_LABELS_HE: Record<string, string> = {
  energy: 'אנרגיה', psychopathy: 'פסיכופתיות', organization: 'ארגון',
  irritability: 'עצבנות', intellect: 'אינטלקט',
  supportiveness: 'תומכנות', weakness: 'חולשה',
};
const FACTOR_EMOJIS: Record<string, string> = {
  energy: '⚡', psychopathy: '⚠️', organization: '🗂️', irritability: '🌡️', intellect: '🧠',
  supportiveness: '🤝', weakness: '😟',
};

// Only these 5 factors have benchmark data (Study 4, leader self-reports)
const BENCHMARKED_FACTORS = new Set(['energy', 'psychopathy', 'organization', 'irritability', 'intellect']);

function ScoreBar({ score, benchmark }: { score: number; benchmark?: number }) {
  return (
    <div className="relative h-2 bg-gray-200 rounded-full overflow-visible mt-2">
      <div
        className="h-full bg-blue-600 rounded-full"
        style={{ width: `${(score / 5) * 100}%` }}
      />
      {benchmark != null && (
        <div
          className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-red-500 rounded-full"
          style={{ left: `${(benchmark / 5) * 100}%` }}
          title={`Benchmark: ${benchmark}`}
        />
      )}
    </div>
  );
}

function PDFDownloadButton({ scores, role, label, generatingLabel }: {
  scores: FactorScores | FollowerScores;
  role: Role;
  label: string;
  generatingLabel: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const { pdf } = await import('@react-pdf/renderer');
      const { AssessmentPDF } = await import('@/components/AssessmentPDF');
      const React = (await import('react')).default;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const blob = await pdf(
        React.createElement(AssessmentPDF, { scores: scores as FactorScores, role }) as any
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'leadership-personality-profile.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-semibold text-sm
        hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      {loading ? generatingLabel : label}
    </button>
  );
}

export default function ResultsPage() {
  const t = useTranslations('results');
  const locale = useLocale();
  const [scores, setScores] = useState<FactorScores | FollowerScores | null>(null);
  const [role, setRole] = useState<Role>('leader');
  const factorLabels = locale === 'he' ? FACTOR_LABELS_HE : FACTOR_LABELS_EN;

  useEffect(() => {
    const stored = sessionStorage.getItem('assessmentResponses');
    const storedRole = sessionStorage.getItem('assessmentRole') as Role | null;
    if (stored) {
      try {
        const responses = JSON.parse(stored);
        const parsedRole: Role = storedRole === 'follower' ? 'follower' : 'leader';
        setRole(parsedRole);
        setScores(
          parsedRole === 'follower'
            ? scoreFollowerAssessment(responses)
            : scoreAssessment(responses)
        );
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  if (!scores) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 text-center">
        <div className="text-5xl mb-4">📋</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">{t('noData')}</h1>
        <Link
          href="/assessment"
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
        >
          {t('goToAssessment')}
        </Link>
      </div>
    );
  }

  const isFollower = role === 'follower';
  const factorOrder = isFollower ? FOLLOWER_FACTOR_ORDER : FACTOR_ORDER;
  const scoreMap = scores as Record<string, number>;

  const titleKey    = isFollower ? 'followerTitle'    : 'leaderTitle';
  const subtitleKey = isFollower ? 'followerSubtitle' : 'leaderSubtitle';
  const profileVizDescKey = isFollower ? 'followerProfileVizDesc' : 'profileVizDesc';
  const interpretDescKey  = isFollower ? 'followerInterpretDesc'  : 'interpretDesc';

  const badgeColor = isFollower ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700';
  const scoreColor = isFollower ? 'text-purple-600' : 'text-blue-600';
  const interpretBg     = isFollower ? 'bg-purple-50 border-purple-100' : 'bg-blue-50 border-blue-100';
  const interpretTitle  = isFollower ? 'text-purple-900' : 'text-blue-900';
  const interpretText   = isFollower ? 'text-purple-800' : 'text-blue-800';

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <div className={`inline-flex items-center gap-2 ${badgeColor} text-xs font-semibold px-4 py-1.5 rounded-full mb-4`}>
            {t('assessmentComplete')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t(titleKey)}</h1>
          <p className="text-gray-500">{t(subtitleKey)}</p>
        </div>

        {/* Radar Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="font-bold text-gray-900 mb-1 text-center">{t('profileViz')}</h2>
          <p className="text-xs text-center text-gray-400 mb-4">{t(profileVizDescKey)}</p>
          <ResultsRadar
            scores={scoreMap}
            factorOrder={factorOrder as string[]}
            locale={locale}
            yourScoreLabel={t('yourScore')}
            benchmarkLabel={isFollower ? undefined : t('benchmark')}
            benchmarks={isFollower ? undefined : BENCHMARKS}
          />
        </div>

        {/* Score cards */}
        <div className="space-y-4 mb-8">
          {factorOrder.map(factor => {
            const score = scoreMap[factor] ?? 0;
            const bench: number | undefined = BENCHMARKED_FACTORS.has(factor)
              ? (BENCHMARKS as Record<string, number>)[factor]
              : undefined;

            const status = bench != null ? getComparisonLabel(score, bench) : null;
            const diff   = bench != null ? score - bench : 0;

            const statusColors = {
              above: 'bg-green-50 text-green-700 border-green-200',
              below: 'bg-red-50 text-red-700 border-red-200',
              match: 'bg-blue-50 text-blue-700 border-blue-200',
            };
            const statusLabels = {
              above: `▲ ${t('above')} (+${Math.abs(diff).toFixed(2)})`,
              below: `▼ ${t('below')} (−${Math.abs(diff).toFixed(2)})`,
              match: `● ${t('match')}`,
            };

            return (
              <div key={factor} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{FACTOR_EMOJIS[factor]}</span>
                    <div>
                      <h3 className="font-bold text-gray-900">{factorLabels[factor]}</h3>
                      <p className={`text-2xl font-bold mt-0.5 ${scoreColor}`}>{score.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="text-end">
                    {status != null ? (
                      <>
                        <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${statusColors[status]}`}>
                          {statusLabels[status]}
                        </span>
                        <p className="text-xs text-gray-400 mt-1.5">
                          {t('benchmarkPrefix')} {bench!.toFixed(2)}
                        </p>
                      </>
                    ) : (
                      <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full border bg-gray-50 text-gray-500 border-gray-200">
                        {t('noBenchmark')}
                      </span>
                    )}
                  </div>
                </div>
                <ScoreBar score={score} benchmark={bench} />
                <div className="flex justify-between text-xs text-gray-300 mt-1">
                  <span>1.0</span>
                  <span>5.0</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interpretation note */}
        <div className={`border rounded-2xl p-5 mb-4 ${interpretBg}`}>
          <h3 className={`font-bold mb-2 text-sm ${interpretTitle}`}>{t('interpretTitle')}</h3>
          <p className={`text-sm leading-relaxed ${interpretText}`}>{t(interpretDescKey)}</p>
        </div>

        {/* Research disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 flex gap-3 items-start">
          <span className="text-base mt-0.5 shrink-0">⚠️</span>
          <div>
            <h3 className="font-semibold text-amber-900 text-sm mb-1">{t('disclaimerTitle')}</h3>
            <p className="text-xs text-amber-800 leading-relaxed">{t('disclaimerText')}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <PDFDownloadButton
            scores={scores}
            role={role}
            label={t('downloadPdf')}
            generatingLabel={t('generating')}
          />
          <Link
            href="/assessment"
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors shadow-sm"
          >
            ↺ {t('retake')}
          </Link>
          <Link
            href="/research"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm"
          >
            {t('exploreResearch')}
          </Link>
        </div>

      </div>
    </div>
  );
}
