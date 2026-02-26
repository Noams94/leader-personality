import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  return { title: locale === 'he' ? 'בית' : 'Home', description: t('heroSubtitle') };
}

const FACTOR_KEYS = ['energy', 'psychopathy', 'organization', 'irritability', 'intellect'] as const;

const SECTOR_DATA = [
  { key: 'business', icon: '🏢', energy: 4.12, psychopathy: 1.18, organization: 4.35, irritability: 1.79, intellect: 4.26 },
  { key: 'military', icon: '🎖️', energy: 4.35, psychopathy: 1.42, organization: 4.52, irritability: 2.18, intellect: 4.10 },
  { key: 'religious',icon: '✡️', energy: 3.98, psychopathy: 1.05, organization: 4.15, irritability: 1.45, intellect: 4.38 },
] as const;

export default function HomePage() {
  const t  = useTranslations('home');
  const tf = useTranslations('factors');

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.2),transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-28 sm:py-36 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium px-4 py-2 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full inline-block" />
            {t('heroBadge')}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            {t('heroTitle')}
          </h1>
          <p className="text-lg sm:text-xl text-blue-100/80 max-w-2xl mx-auto leading-relaxed mb-10">
            {t('heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/assessment"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-900/30 hover:shadow-xl transition-all text-base"
            >
              {t('heroCta')}
            </Link>
            <Link
              href="/research"
              className="px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl border border-white/20 transition-all text-base"
            >
              {t('heroSecondary')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── VIDEO EMBED ──────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{t('videoTitle')}</h2>
          <p className="text-gray-500">{t('videoDesc')}</p>
        </div>
        <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video border border-gray-200">
          <iframe
            src="https://www.youtube.com/embed/xWmRZXrGaYs"
            title={t('videoTitle')}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </section>

      {/* ── FIVE FACTORS ─────────────────────────────────────────── */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{t('factorsTitle')}</h2>
            <p className="text-gray-500 max-w-xl mx-auto">{t('factorsDesc')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FACTOR_KEYS.map(key => (
              <div
                key={key}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="text-3xl mb-3">{tf(`${key}.emoji`)}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{tf(`${key}.name`)}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{tf(`${key}.desc`)}</p>
              </div>
            ))}
            {/* CTA card as 6th slot */}
            <div className="bg-blue-600 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between">
              <div>
                <div className="text-3xl mb-3">📋</div>
                <h3 className="font-bold text-white text-lg mb-2">{t('ctaTitle')}</h3>
                <p className="text-blue-100 text-sm leading-relaxed">{t('ctaDesc')}</p>
              </div>
              <Link
                href="/assessment"
                className="mt-4 inline-block text-center bg-white text-blue-600 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-blue-50 transition-colors"
              >
                {t('ctaButton')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTOR COMPARISON ────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{t('sectorTitle')}</h2>
          <p className="text-gray-500 max-w-xl mx-auto">{t('sectorDesc')}</p>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100">
                <th className="py-4 px-5 font-semibold text-gray-700 text-start">{t('sectorTableHeader')}</th>
                <th className="py-4 px-4 font-semibold text-gray-700 text-center">⚡ {t('sectorBusiness') === 'Business' ? 'Energy' : 'אנרגיה'}</th>
                <th className="py-4 px-4 font-semibold text-gray-700 text-center">⚠️ {t('sectorBusiness') === 'Business' ? 'Psychopathy' : 'פסיכופתיות'}</th>
                <th className="py-4 px-4 font-semibold text-gray-700 text-center">🗂️ {t('sectorBusiness') === 'Business' ? 'Organization' : 'ארגון'}</th>
                <th className="py-4 px-4 font-semibold text-gray-700 text-center">🌡️ {t('sectorBusiness') === 'Business' ? 'Irritability' : 'עצבנות'}</th>
                <th className="py-4 px-4 font-semibold text-gray-700 text-center">🧠 {t('sectorBusiness') === 'Business' ? 'Intellect' : 'אינטלקט'}</th>
              </tr>
            </thead>
            <tbody>
              {SECTOR_DATA.map((s, idx) => (
                <tr key={s.key} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="py-4 px-5 font-semibold text-gray-800">
                    {s.icon} {t(`sector${s.key.charAt(0).toUpperCase() + s.key.slice(1)}` as 'sectorBusiness')}
                  </td>
                  <td className="py-4 px-4 text-center text-gray-600">{s.energy.toFixed(2)}</td>
                  <td className="py-4 px-4 text-center text-gray-600">{s.psychopathy.toFixed(2)}</td>
                  <td className="py-4 px-4 text-center text-gray-600">{s.organization.toFixed(2)}</td>
                  <td className="py-4 px-4 text-center text-gray-600">{s.irritability.toFixed(2)}</td>
                  <td className="py-4 px-4 text-center text-gray-600">{s.intellect.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">{t('sectorTableFootnote')}</p>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{t('ctaTitle')}</h2>
          <p className="text-blue-100 mb-8 text-lg">{t('ctaDesc')}</p>
          <Link
            href="/assessment"
            className="inline-block px-10 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:bg-blue-50 transition-colors text-base"
          >
            {t('ctaButton')} →
          </Link>
        </div>
      </section>
    </>
  );
}
