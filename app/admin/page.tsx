export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { verifyAdminSession } from '@/lib/adminAuth';
import { getSupabaseClient } from '@/lib/supabaseServer';
import { FACTOR_ORDER } from '@/lib/benchmarks';
import StatsCards from '@/components/admin/StatsCards';
import SubmissionsByDateChart from '@/components/admin/SubmissionsByDateChart';
import ScoreDistributionChart from '@/components/admin/ScoreDistributionChart';
import ResponseTimeChart from '@/components/admin/ResponseTimeChart';
import AdminHeader from '@/components/admin/AdminHeader';

interface Submission {
  id: string;
  created_at: string;
  role: string;
  locale: string;
  score_energy: number | null;
  score_psychopathy: number | null;
  score_organization: number | null;
  score_irritability: number | null;
  score_intellect: number | null;
  score_supportiveness: number | null;
  score_weakness: number | null;
  response_times: Record<string, number> | null;
  demographics: Record<string, string | number> | null;
}

function aggregateData(submissions: Submission[]) {
  const total = submissions.length;
  const byRole = { leader: 0, follower: 0 };
  const byLocale = { en: 0, he: 0 };
  const byDate: Record<string, number> = {};
  const today = new Date().toISOString().slice(0, 10);
  let todayCount = 0;

  // Score accumulators
  const scoreAccum: Record<string, { sum: number; count: number }> = {};
  for (const f of FACTOR_ORDER) {
    scoreAccum[f] = { sum: 0, count: 0 };
  }

  // Response time accumulator per factor
  const rtAccum: Record<string, { sum: number; count: number }> = {};
  for (const f of FACTOR_ORDER) {
    rtAccum[f] = { sum: 0, count: 0 };
  }

  // Item-to-factor mapping (E1→energy, P3→psychopathy, etc.)
  const itemToFactor: Record<string, string> = {};
  const prefixMap: Record<string, string> = {
    E: 'energy', P: 'psychopathy', O: 'organization', I: 'irritability', T: 'intellect',
    S: 'supportiveness', W: 'weakness',
  };

  for (const sub of submissions) {
    // By role
    if (sub.role === 'leader') byRole.leader++;
    else if (sub.role === 'follower') byRole.follower++;

    // By locale
    if (sub.locale === 'en') byLocale.en++;
    else if (sub.locale === 'he') byLocale.he++;

    // By date
    const date = sub.created_at?.slice(0, 10);
    if (date) {
      byDate[date] = (byDate[date] || 0) + 1;
      if (date === today) todayCount++;
    }

    // Scores (leader factors only for comparison)
    for (const f of FACTOR_ORDER) {
      const val = sub[`score_${f}` as keyof Submission] as number | null;
      if (val != null) {
        scoreAccum[f].sum += val;
        scoreAccum[f].count++;
      }
    }

    // Response times
    if (sub.response_times && typeof sub.response_times === 'object') {
      for (const [itemId, ms] of Object.entries(sub.response_times)) {
        if (typeof ms !== 'number') continue;
        // Get factor from item prefix
        const prefix = itemId.replace(/[0-9r]/g, '');
        const factor = prefixMap[prefix];
        if (factor && rtAccum[factor]) {
          rtAccum[factor].sum += ms;
          rtAccum[factor].count++;
        }
        // Lazy populate itemToFactor
        if (factor) itemToFactor[itemId] = factor;
      }
    }
  }

  // Build sorted date series
  const dateKeys = Object.keys(byDate).sort();
  const submissionsByDate = dateKeys.map(d => ({ date: d, count: byDate[d] }));

  // Build avg scores
  const avgScores = FACTOR_ORDER.map(f => ({
    factor: f,
    average: scoreAccum[f].count > 0
      ? Math.round((scoreAccum[f].sum / scoreAccum[f].count) * 100) / 100
      : 0,
    n: scoreAccum[f].count,
  }));

  // Build avg response times (convert ms → seconds)
  const avgResponseTimes = FACTOR_ORDER.map(f => ({
    factor: f,
    avgSeconds: rtAccum[f].count > 0
      ? Math.round((rtAccum[f].sum / rtAccum[f].count / 1000) * 100) / 100
      : 0,
    n: rtAccum[f].count,
  }));

  return {
    total,
    byRole,
    byLocale,
    todayCount,
    submissionsByDate,
    avgScores,
    avgResponseTimes,
  };
}

export default async function AdminDashboardPage() {
  const isAuth = await verifyAdminSession();
  if (!isAuth) redirect('/admin/login');

  const supabase = getSupabaseClient();
  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Supabase not configured. Check env vars.</p>
      </div>
    );
  }

  const { data: submissions, error } = await supabase
    .from('submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Database error: {error.message}</p>
      </div>
    );
  }

  const data = aggregateData((submissions as Submission[]) || []);

  return (
    <>
      <AdminHeader />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <StatsCards
          total={data.total}
          leaders={data.byRole.leader}
          followers={data.byRole.follower}
          today={data.todayCount}
          byLocale={data.byLocale}
        />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold mb-4">Submissions Over Time</h2>
          <SubmissionsByDateChart data={data.submissionsByDate} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold mb-4">Average Scores by Factor</h2>
          <p className="text-sm text-gray-500 mb-4">Blue = sample mean · Red dashed = business benchmark</p>
          <ScoreDistributionChart data={data.avgScores} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold mb-4">Response Time by Factor</h2>
          <p className="text-sm text-gray-500 mb-4">Average seconds per item in each factor</p>
          <ResponseTimeChart data={data.avgResponseTimes} />
        </div>

        <div className="flex justify-center">
          <a
            href="/api/admin/export"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 transition"
          >
            Download CSV Export
          </a>
        </div>
      </div>
    </>
  );
}
