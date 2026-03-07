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
  data: { date: string; count: number }[];
}

export default function SubmissionsByDateChart({ data }: Props) {
  if (data.length === 0) {
    return <p className="text-sm text-gray-400 py-8 text-center">No data yet</p>;
  }

  // Show last 30 days max
  const displayData = data.slice(-30).map((d) => ({
    ...d,
    label: d.date.slice(5), // MM-DD
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={displayData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip
          labelFormatter={(label) => `Date: ${label}`}
          formatter={(value) => [value, 'Submissions']}
        />
        <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
