import { verifyAdminSession } from '@/lib/adminAuth';
import { getSupabaseClient } from '@/lib/supabaseServer';
import { ITEMS } from '@/lib/items';

function escapeCsv(val: unknown): string {
  if (val == null) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return new Response('Supabase not configured', { status: 500 });
  }

  const { data: submissions, error } = await supabase
    .from('submissions')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    return new Response(`Database error: ${error.message}`, { status: 500 });
  }

  const allItemIds = ITEMS.map((i) => i.id);

  // CSV headers
  const baseHeaders = [
    'id', 'created_at', 'locale', 'role',
    'respondent_gender', 'leader_gender',
    'score_energy', 'score_psychopathy', 'score_organization',
    'score_irritability', 'score_intellect',
    'score_supportiveness', 'score_weakness',
  ];
  const demoHeaders = ['demo_age', 'demo_industry', 'demo_orgSize', 'demo_experience'];
  const responseHeaders = allItemIds;
  const rtHeaders = allItemIds.map((id) => `${id}_ms`);

  const headers = [...baseHeaders, ...demoHeaders, ...responseHeaders, ...rtHeaders];

  // Build rows
  const rows = (submissions || []).map((sub: Record<string, unknown>) => {
    const responses = (sub.responses as Record<string, number>) || {};
    const demographics = (sub.demographics as Record<string, unknown>) || {};
    const responseTimes = (sub.response_times as Record<string, number>) || {};

    const baseVals = baseHeaders.map((h) => escapeCsv(sub[h]));
    const demoVals = [
      escapeCsv(demographics.age),
      escapeCsv(demographics.industry),
      escapeCsv(demographics.orgSize),
      escapeCsv(demographics.experience),
    ];
    const responseVals = allItemIds.map((id) => escapeCsv(responses[id]));
    const rtVals = allItemIds.map((id) => escapeCsv(responseTimes[id]));

    return [...baseVals, ...demoVals, ...responseVals, ...rtVals].join(',');
  });

  const csv = [headers.join(','), ...rows].join('\n');
  const date = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="submissions-${date}.csv"`,
    },
  });
}
