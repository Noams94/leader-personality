'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import type { FactorScores, FollowerScores, Role } from '@/lib/types';
import { BENCHMARKS, FACTOR_ORDER, FOLLOWER_FACTOR_ORDER } from '@/lib/benchmarks';
import { getComparisonLabel } from '@/lib/scoring';

const FACTOR_LABELS_EN: Record<string, string> = {
  energy: 'Energy',
  psychopathy: 'Psychopathy',
  organization: 'Organization',
  irritability: 'Irritability',
  intellect: 'Intellect',
  supportiveness: 'Supportiveness',
  weakness: 'Weakness',
};

// Only leader factors have benchmark data
const BENCHMARKED_FACTORS = new Set(['energy', 'psychopathy', 'organization', 'irritability', 'intellect']);

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
  colFactor: { flex: 2, fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#0f172a' },
  colScore:  { flex: 1, fontSize: 11, color: '#374151', textAlign: 'center' },
  colBench:  { flex: 1, fontSize: 11, color: '#374151', textAlign: 'center' },
  colStatus: { flex: 1.5, fontSize: 10, textAlign: 'center' },
  headerText: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#475569' },
  above:  { color: '#16a34a', fontFamily: 'Helvetica-Bold' },
  below:  { color: '#dc2626', fontFamily: 'Helvetica-Bold' },
  match:  { color: '#2563eb', fontFamily: 'Helvetica-Bold' },
  chartContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  chartImage: {
    width: 400,
    height: 280,
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

interface AssessmentPDFProps {
  scores: FactorScores | FollowerScores;
  role?: Role;
  chartImageUrl?: string;
}

export function AssessmentPDF({ scores, role = 'leader', chartImageUrl }: AssessmentPDFProps) {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const isFollower = role === 'follower';
  const scoreMap = scores as Record<string, number>;
  const factorOrder = isFollower ? FOLLOWER_FACTOR_ORDER : FACTOR_ORDER;
  const pageTitle = isFollower ? 'Supervisor Personality Profile' : 'Leader Personality Profile';
  const pageSubtitle = isFollower
    ? 'Dr. Noam Keshet — Leader Personality Research · Follower Report · '
    : 'Dr. Noam Keshet — Leader Personality Research · ';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{pageTitle}</Text>
          <Text style={styles.subtitle}>{pageSubtitle}{date}</Text>
        </View>

        {/* Chart image (if captured) */}
        {chartImageUrl && (
          <>
            <Text style={styles.sectionTitle}>Profile Visualization</Text>
            <View style={styles.chartContainer}>
              <Image src={chartImageUrl} style={styles.chartImage} />
            </View>
          </>
        )}

        {/* Scores table */}
        <Text style={styles.sectionTitle}>Factor Scores</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, { flex: 2 }]}>Factor</Text>
            <Text style={[styles.headerText, { flex: 1, textAlign: 'center' }]}>Score</Text>
            <Text style={[styles.headerText, { flex: 1, textAlign: 'center' }]}>Benchmark</Text>
            <Text style={[styles.headerText, { flex: 1.5, textAlign: 'center' }]}>Status</Text>
          </View>
          {factorOrder.map(factor => {
            const score = scoreMap[factor] ?? 0;
            const hasBench = BENCHMARKED_FACTORS.has(factor);
            const bench = hasBench ? (BENCHMARKS as Record<string, number>)[factor] : null;
            const status = bench != null ? getComparisonLabel(score, bench) : null;
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

        {/* Interpretation note */}
        <View style={styles.interpretBox}>
          <Text style={styles.interpretTitle}>Score Interpretation</Text>
          <Text style={styles.interpretText}>
            {isFollower
              ? 'Scores are means on a 1–5 Likert scale. Supportiveness and Weakness emerged uniquely in follower ratings; no population benchmarks exist for these two dimensions. For the five shared factors, scores are compared to business leader self-reports (Study 4).'
              : 'Scores are means on a 1–5 Likert scale. Higher scores indicate stronger presence of that trait. For Psychopathy and Irritability, scores significantly above benchmark indicate a concern worth investigating further. Benchmark values are derived from Study 4 of Dr. Keshet\'s PhD dissertation (Business sector leaders).'}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Based on: Keshet, N. S., Oreg, S., Berson, Y., Hoogeboom, M. A., & de Vries, R. E. (2026). Basic dimensions of leader personality: a lexical study in Hebrew. Journal of Research in Personality, 120, 1-13.
          </Text>
          <Text style={styles.footerText}>LeaderPersonality.com</Text>
        </View>
      </Page>
    </Document>
  );
}
