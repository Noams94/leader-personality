import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabaseServer';
import { scoreAssessment, scoreFollowerAssessment } from '@/lib/scoring';
import { ITEMS } from '@/lib/items';
import type { Responses, Role, Gender } from '@/lib/types';

// ─── In-memory rate limiter (per-IP, resets on redeploy) ────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX   = 5;       // max submissions per window
const RATE_LIMIT_WINDOW = 3600000; // 1 hour in ms

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// ─── Validation helpers ─────────────────────────────────────────────────────
const VALID_ROLES: Role[]     = ['leader', 'follower'];
const VALID_GENDERS: Gender[] = ['male', 'female', 'other'];
const VALID_LOCALES           = ['en', 'he'];

function validateSubmission(body: Record<string, unknown>): string | null {
  const { role, respondentGender, leaderGender, locale, responses } = body;

  if (!VALID_ROLES.includes(role as Role))            return 'invalid role';
  if (!VALID_GENDERS.includes(respondentGender as Gender)) return 'invalid respondentGender';
  if (!VALID_GENDERS.includes(leaderGender as Gender))     return 'invalid leaderGender';
  if (!VALID_LOCALES.includes(locale as string))      return 'invalid locale';

  if (!responses || typeof responses !== 'object')    return 'responses must be an object';

  const resp = responses as Responses;
  const expectedCount = role === 'follower' ? 70 : 50;
  const expectedIds   = new Set(
    ITEMS.filter(i => {
      if (role === 'leader') return !['supportiveness', 'weakness'].includes(i.factor);
      return true;
    }).map(i => i.id)
  );

  const keys = Object.keys(resp);
  if (keys.length < expectedCount) return `expected ${expectedCount} responses, got ${keys.length}`;

  for (const [id, val] of Object.entries(resp)) {
    if (!expectedIds.has(id))                        return `unknown item id: ${id}`;
    if (typeof val !== 'number' || val < 1 || val > 5 || !Number.isInteger(val))
      return `invalid value for ${id}: must be integer 1-5`;
  }

  return null; // valid
}

// ─── Route handler ──────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
            || req.headers.get('x-real-ip')
            || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: 'rate_limited' },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Input validation
    const validationError = validateSubmission(body);
    if (validationError) {
      return NextResponse.json(
        { ok: false, error: validationError },
        { status: 400 }
      );
    }

    const { role, respondentGender, leaderGender, locale, responses, demographics, responseTimes } = body as {
      role:             Role;
      respondentGender: Gender;
      leaderGender:     Gender;
      locale:           string;
      responses:        Responses;
      demographics:     Record<string, string> | null;
      responseTimes:    Record<string, number> | null;
    };

    // Compute factor scores server-side (same logic as results page)
    const scores = role === 'follower'
      ? scoreFollowerAssessment(responses)
      : scoreAssessment(responses);

    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
    }

    const row: Record<string, unknown> = {
      locale,
      role,
      respondent_gender:    respondentGender,
      leader_gender:        leaderGender,
      score_energy:         scores.energy,
      score_psychopathy:    scores.psychopathy,
      score_organization:   scores.organization,
      score_irritability:   scores.irritability,
      score_intellect:      scores.intellect,
      score_supportiveness: 'supportiveness' in scores ? scores.supportiveness : null,
      score_weakness:       'weakness'       in scores ? scores.weakness       : null,
      responses,
      demographics:         demographics ?? null,
    };

    // Only include response_times if the column exists (added later via migration)
    if (responseTimes) {
      row.response_times = responseTimes;
    }

    let { error } = await supabase.from('submissions').insert(row);

    // If response_times column doesn't exist yet, retry without it
    if (error?.message?.includes('response_times')) {
      delete row.response_times;
      ({ error } = await supabase.from('submissions').insert(row));
    }

    if (error) {
      console.error('[submit] Supabase error:', error.message);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[submit] Unexpected error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
