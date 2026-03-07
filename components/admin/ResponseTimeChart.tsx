'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface Props {
  data: { factor: string; avgSeconds: number; n: number }[];
}

const FACTOR_LABELS: Record<string, string> = {
  energy: 'Energy',
  psychopathy: 'Psychopathy',
  organization: 'Organization',
  irritability: 'Irritability',
  intellect: 'Intellect',
};

export default function ResponseTimeChart({ data }: Props) {
  if (data.every((d) => d.n === 0)) {
    return <p className="text-sm text-gray-400 py-8 text-center">No response time data yet</p>;
  }

  const chartData = data.map((d) => ({
    factor: FACTOR_LABELS[d.factor] || d.factor,
    seconds: d.avgSeconds,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="factor" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} unit="s" />
        <Tooltip formatter={(value) => [`${Number(value).toFixed(2)}s`, 'Avg Time']} />
        <Bar dataKey="seconds" fill="#7c3aed" radius={[4, 4, 0, 0]} barSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}
