import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabaseServer';
import { scoreAssessment, scoreFollowerAssessment } from '@/lib/scoring';
import type { Responses, Role } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      role:             Role;
      respondentGender: string;
      leaderGender:     string;
      locale:           string;
      responses:        Responses;
      demographics:     Record<string, string> | null;
    };

    const { role, respondentGender, leaderGender, locale, responses, demographics } = body;

    // Compute factor scores server-side (same logic as results page)
    const scores = role === 'follower'
      ? scoreFollowerAssessment(responses)
      : scoreAssessment(responses);

    const supabase = getSupabaseClient();
    if (!supabase) {
      // Supabase not configured yet — fail silently so UX is unaffected
      return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
    }

    const { error } = await supabase.from('submissions').insert({
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
    });

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
