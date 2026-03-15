"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

interface Props {
  factorLabels: { energy: string; psychopathy: string; organization: string; irritability: string; intellect: string };
  sectorLabels: { business: string; military: string; religious: string };
}

const SECTOR_SCORES = {
  energy:       { business: 4.12, military: 4.35, religious: 3.98 },
  psychopathy:  { business: 1.18, military: 1.42, religious: 1.05 },
  organization: { business: 4.35, military: 4.52, religious: 4.15 },
  irritability: { business: 1.79, military: 2.18, religious: 1.45 },
  intellect:    { business: 4.26, military: 4.10, religious: 4.38 },
} as const;

const FACTOR_KEYS = ["energy", "psychopathy", "organization", "irritability", "intellect"] as const;

const COLORS = {
  business: "#2563eb",
  military: "#059669",
  religious: "#d97706",
};

export default function SectorChart({ factorLabels, sectorLabels }: Props) {
  const chartData = FACTOR_KEYS.map((key) => ({
    factor: factorLabels[key],
    [sectorLabels.business]:  SECTOR_SCORES[key].business,
    [sectorLabels.military]:  SECTOR_SCORES[key].military,
    [sectorLabels.religious]: SECTOR_SCORES[key].religious,
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData} barGap={2} barCategoryGap="20%">
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis
          dataKey="factor"
          tick={{ fontSize: 12, fill: "#6b7280" }}
          axisLine={{ stroke: "#e5e7eb" }}
          tickLine={false}
        />
        <YAxis
          domain={[0, 5]}
          ticks={[0, 1, 2, 3, 4, 5]}
          tick={{ fontSize: 12, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(value) => Number(value).toFixed(2)}
          contentStyle={{
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            fontSize: "13px",
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: "13px", paddingTop: "12px" }}
        />
        <Bar
          dataKey={sectorLabels.business}
          fill={COLORS.business}
          radius={[4, 4, 0, 0]}
          barSize={28}
        />
        <Bar
          dataKey={sectorLabels.military}
          fill={COLORS.military}
          radius={[4, 4, 0, 0]}
          barSize={28}
        />
        <Bar
          dataKey={sectorLabels.religious}
          fill={COLORS.religious}
          radius={[4, 4, 0, 0]}
          barSize={28}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
