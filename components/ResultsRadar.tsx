'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface ResultsRadarProps {
  scores: Partial<Record<string, number>>;
  factorOrder: string[];
  locale: string;
  yourScoreLabel: string;
  benchmarkLabel?: string;
  benchmarks?: Partial<Record<string, number>>;
}

const FACTOR_LABELS: Record<string, Record<string, string>> = {
  en: {
    energy:         'Energy',
    psychopathy:    'Psychopathy',
    organization:   'Organization',
    irritability:   'Irritability',
    intellect:      'Intellect',
    supportiveness: 'Supportiveness',
    weakness:       'Weakness',
  },
  he: {
    energy:         'אנרגיה',
    psychopathy:    'פסיכופתיות',
    organization:   'ארגון',
    irritability:   'עצבנות',
    intellect:      'אינטלקט',
    supportiveness: 'תומכנות',
    weakness:       'חולשה',
  },
};

export default function ResultsRadar({
  scores,
  factorOrder,
  locale,
  yourScoreLabel,
  benchmarkLabel,
  benchmarks,
}: ResultsRadarProps) {
  const labels = FACTOR_LABELS[locale] ?? FACTOR_LABELS.en;

  const data = factorOrder.map(factor => {
    const point: Record<string, string | number> = {
      subject:         labels[factor] ?? factor,
      [yourScoreLabel]: scores[factor] ?? 0,
      fullMark:        5,
    };
    if (benchmarkLabel && benchmarks?.[factor] != null) {
      point[benchmarkLabel] = benchmarks[factor]!;
    }
    return point;
  });

  const showBenchmark = Boolean(benchmarkLabel && benchmarks);

  return (
    <ResponsiveContainer width="100%" height={380}>
      <RadarChart data={data} margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
        <PolarGrid gridType="polygon" stroke="#e5e7eb" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }}
        />
        <Tooltip
          formatter={(value: number | undefined) => (value != null ? value.toFixed(2) : '')}
          contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }}
        />
        <Radar
          name={yourScoreLabel}
          dataKey={yourScoreLabel}
          stroke="#2563eb"
          fill="#2563eb"
          fillOpacity={0.35}
          strokeWidth={2}
        />
        {showBenchmark && benchmarkLabel && (
          <Radar
            name={benchmarkLabel}
            dataKey={benchmarkLabel}
            stroke="#dc2626"
            fill="#dc2626"
            fillOpacity={0.1}
            strokeWidth={2}
            strokeDasharray="6 3"
          />
        )}
        <Legend wrapperStyle={{ paddingTop: 16, fontSize: 13 }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
