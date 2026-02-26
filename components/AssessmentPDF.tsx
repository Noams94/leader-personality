'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Line,
  Polygon,
  Circle,
} from '@react-pdf/renderer';
import type { FactorScores, FollowerScores, Role } from '@/lib/types';
import { BENCHMARKS, FACTOR_ORDER, FOLLOWER_FACTOR_ORDER } from '@/lib/benchmarks';
import { getComparisonLabel } from '@/lib/scoring';

const FACTOR_LABELS_EN: Record<string, string> = {
  energy:         'Energy',
  psychopathy:    'Psychopathy',
  organization:   'Organization',
  irritability:   'Irritability',
  intellect:      'Intellect',
  supportiveness: 'Supportiveness',
  weakness:       'Weakness',
};

// Only leader factors have benchmark data
const BENCHMARKED_FACTORS = new Set([
  'energy', 'psychopathy', 'organization', 'irritability', 'intellect',
]);

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    borderBottom: '2pt solid #1d4ed8',
    paddingBottom: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: '#64748b',
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#1d4ed8',
    marginBottom: 12,
    marginTop: 20,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 4,
  },
  table: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    padding: '8pt 10pt',
    borderRadius: 4,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: 'row',
    padding: '10pt 10pt',
    borderBottom: '0.5pt solid #e2e8f0',
    alignItems: 'center',
  },
  colFactor: { flex: 2,   fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#0f172a' },
  colScore:  { flex: 1,   fontSize: 11, color: '#374151', textAlign: 'center' },
  colBench:  { flex: 1,   fontSize: 11, color: '#374151', textAlign: 'center' },
  colStatus: { flex: 1.5, fontSize: 10, textAlign: 'center' },
  headerText:{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#475569' },
  above: { color: '#16a34a', fontFamily: 'Helvetica-Bold' },
  below: { color: '#dc2626', fontFamily: 'Helvetica-Bold' },
  match: { color: '#2563eb', fontFamily: 'Helvetica-Bold' },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 9,
    color: '#374151',
  },
  interpretBox: {
    marginTop: 20,
    padding: 14,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    borderLeft: '3pt solid #1d4ed8',
  },
  interpretTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 6,
  },
  interpretText: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 32,
    left: 48,
    right: 48,
    borderTop: '0.5pt solid #e2e8f0',
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 9,
    color: '#94a3b8',
  },
});

const STATUS_LABEL: Record<string, string> = {
  above: '▲ Above Benchmark',
  below: '▼ Below Benchmark',
  match: '● At Benchmark',
};

// ─── Native SVG Radar Chart ───────────────────────────────────────────────────

/** Convert an array of values to an SVG polygon points string on a polar grid. */
function radarPoints(
  vals: number[],
  cx: number, cy: number,
  rMax: number, vMax: number,
  n: number,
): string {
  return vals
    .map((v, i) => {
      const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
      const d = (v / vMax) * rMax;
      return `${(cx + d * Math.cos(a)).toFixed(2)},${(cy + d * Math.sin(a)).toFixed(2)}`;
    })
    .join(' ');
}

interface RadarProps {
  scoreValues:     number[];
  benchmarkValues?: number[];
  factorLabels:    string[];
}

function RadarChartPDF({ scoreValues, benchmarkValues, factorLabels }: RadarProps) {
  const n    = scoreValues.length;
  const cx   = 220;
  const cy   = 200;
  const rMax = 130;
  const vMax = 5;
  const lbR  = rMax + 22;   // label radius
  const ang  = (i: number) => -Math.PI / 2 + (2 * Math.PI * i) / n;

  const scoreStr = radarPoints(scoreValues,                cx, cy, rMax, vMax, n);
  const benchStr = benchmarkValues
    ? radarPoints(benchmarkValues, cx, cy, rMax, vMax, n)
    : null;

  return (
    <Svg width={440} height={410}>

      {/* ── Grid rings (1–5) ── */}
      {[1, 2, 3, 4, 5].map(v => (
        <Polygon
          key={`ring-${v}`}
          points={radarPoints(Array(n).fill(v), cx, cy, rMax, vMax, n)}
          fill="none"
          stroke="#d1d5db"
          strokeWidth={0.5}
        />
      ))}

      {/* ── Axis lines ── */}
      {Array.from({ length: n }, (_, i) => (
        <Line
          key={`axis-${i}`}
          x1={cx} y1={cy}
          x2={cx + rMax * Math.cos(ang(i))}
          y2={cy + rMax * Math.sin(ang(i))}
          stroke="#d1d5db"
          strokeWidth={0.5}
        />
      ))}

      {/* ── Benchmark polygon (dashed red) ── */}
      {benchStr && (
        <Polygon
          points={benchStr}
          fill="#dc2626"
          fillOpacity={0.07}
          stroke="#dc2626"
          strokeWidth={1.5}
          strokeDasharray="5 2"
        />
      )}

      {/* ── Score polygon (solid blue) ── */}
      <Polygon
        points={scoreStr}
        fill="#2563eb"
        fillOpacity={0.28}
        stroke="#2563eb"
        strokeWidth={2}
      />

      {/* ── Score dots ── */}
      {scoreValues.map((v, i) => {
        const a = ang(i);
        const d = (v / vMax) * rMax;
        return (
          <Circle key={`dot-${i}`} cx={cx + d * Math.cos(a)} cy={cy + d * Math.sin(a)} r={3.5} fill="#2563eb" />
        );
      })}

      {/* ── Axis labels ── */}
      {factorLabels.map((label, i) => {
        const a   = ang(i);
        const cos = Math.cos(a);
        const lx  = cx + lbR * cos;
        const ly  = cy + lbR * Math.sin(a);
        const anchor =
          Math.abs(cos) < 0.15 ? 'middle' : cos > 0 ? 'start' : 'end';
        return (
          <Text
            key={`lbl-${i}`}
            x={lx}
            y={ly + 4}
            style={{
              fontSize: 9,
              fill: '#374151',
              fontFamily: 'Helvetica',
              textAnchor: anchor,
            } as object}
          >
            {label}
          </Text>
        );
      })}
    </Svg>
  );
}

// ─── Main PDF Document ────────────────────────────────────────────────────────

interface AssessmentPDFProps {
  scores: FactorScores | FollowerScores;
  role?:  Role;
}

export function AssessmentPDF({ scores, role = 'leader' }: AssessmentPDFProps) {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const isFollower  = role === 'follower';
  const scoreMap    = scores as Record<string, number>;
  const factorOrder = isFollower ? FOLLOWER_FACTOR_ORDER : FACTOR_ORDER;
  const pageTitle   = isFollower ? 'Supervisor Personality Profile' : 'Leader Personality Profile';
  const pageSubtitle = isFollower
    ? 'Dr. Noam Keshet — Leader Personality Research · Follower Report · '
    : 'Dr. Noam Keshet — Leader Personality Research · ';

  // Radar data
  const radarScores = factorOrder.map(f => scoreMap[f] ?? 0);
  const radarBench  = !isFollower
    ? FACTOR_ORDER.map(f => (BENCHMARKS as Record<string, number>)[f] ?? 0)
    : undefined;
  const radarLabels = factorOrder.map(f => FACTOR_LABELS_EN[f] ?? f);

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.title}>{pageTitle}</Text>
          <Text style={styles.subtitle}>{pageSubtitle}{date}</Text>
        </View>

        {/* ── Radar chart (native SVG — no screenshot) ── */}
        <Text style={styles.sectionTitle}>Profile Visualization</Text>
        <View style={styles.chartContainer}>
          <RadarChartPDF
            scoreValues={radarScores}
            benchmarkValues={radarBench}
            factorLabels={radarLabels}
          />
        </View>

        {/* ── Legend ── */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#2563eb' }]} />
            <Text style={styles.legendText}>
              {isFollower ? 'Supervisor Score' : 'Your Score'}
            </Text>
          </View>
          {!isFollower && (
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#dc2626' }]} />
              <Text style={styles.legendText}>Business Leader Benchmark</Text>
            </View>
          )}
        </View>

        {/* ── Scores table ── */}
        <Text style={styles.sectionTitle}>Factor Scores</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, { flex: 2 }]}>Factor</Text>
            <Text style={[styles.headerText, { flex: 1, textAlign: 'center' }]}>Score</Text>
            <Text style={[styles.headerText, { flex: 1, textAlign: 'center' }]}>Benchmark</Text>
            <Text style={[styles.headerText, { flex: 1.5, textAlign: 'center' }]}>Status</Text>
          </View>
          {factorOrder.map(factor => {
            const score    = scoreMap[factor] ?? 0;
            const hasBench = BENCHMARKED_FACTORS.has(factor);
            const bench    = hasBench ? (BENCHMARKS as Record<string, number>)[factor] : null;
            const status   = bench != null ? getComparisonLabel(score, bench) : null;
            return (
              <View key={factor} style={styles.tableRow}>
                <Text style={styles.colFactor}>{FACTOR_LABELS_EN[factor] ?? factor}</Text>
                <Text style={styles.colScore}>{score.toFixed(2)}</Text>
                <Text style={styles.colBench}>{bench != null ? bench.toFixed(2) : '—'}</Text>
                <Text style={[styles.colStatus, status ? styles[status] : {}]}>
                  {status ? STATUS_LABEL[status] : 'No reference data'}
                </Text>
              </View>
            );
          })}
        </View>

        {/* ── Interpretation note ── */}
        <View style={styles.interpretBox}>
          <Text style={styles.interpretTitle}>Score Interpretation</Text>
          <Text style={styles.interpretText}>
            {isFollower
              ? 'Scores are means on a 1–5 Likert scale. Supportiveness and Weakness emerged uniquely in follower ratings; no population benchmarks exist for these two dimensions. For the five shared factors, scores are compared to business leader self-reports (Study 4).'
              : 'Scores are means on a 1–5 Likert scale. Higher scores indicate stronger presence of that trait. For Psychopathy and Irritability, scores significantly above benchmark indicate a concern worth investigating further. Benchmark values are derived from Study 4 of Dr. Keshet\'s PhD dissertation (Business sector leaders).'}
          </Text>
        </View>

        {/* ── Footer ── */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Based on: Keshet et al. (2026). Basic dimensions of leader personality: a lexical study in Hebrew. Journal of Research in Personality, 120, 1-13.
          </Text>
          <Text style={styles.footerText}>LeaderPersonality.com</Text>
        </View>

      </Page>
    </Document>
  );
}
