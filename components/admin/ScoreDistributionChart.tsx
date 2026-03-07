'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { BENCHMARKS } from '@/lib/benchmarks';
import type { LeaderFactor } from '@/lib/types';

interface Props {
  data: { factor: string; average: number; n: number }[];
}

const FACTOR_LABELS: Record<string, string> = {
  energy: 'Energy',
  psychopathy: 'Psychopathy',
  organization: 'Organization',
  irritability: 'Irritability',
  intellect: 'Intellect',
};

export default function ScoreDistributionChart({ data }: Props) {
  if (data.every((d) => d.n === 0)) {
    return <p className="text-sm text-gray-400 py-8 text-center">No score data yet</p>;
  }

  const chartData = data.map((d) => ({
    factor: FACTOR_LABELS[d.factor] || d.factor,
    'Sample Mean': d.average,
    'Benchmark': BENCHMARKS[d.factor as LeaderFactor] ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={chartData} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="factor" tick={{ fontSize: 12 }} />
        <YAxis domain={[1, 5]} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(value) => Number(value).toFixed(2)} />
        <Legend />
        <Bar dataKey="Sample Mean" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={32} />
        <Bar dataKey="Benchmark" fill="#dc2626" radius={[4, 4, 0, 0]} barSize={32} opacity={0.5} />
      </BarChart>
    </ResponsiveContainer>
  );
}
