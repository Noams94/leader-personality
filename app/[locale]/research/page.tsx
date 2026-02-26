import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'research' });
  return { title: t('title'), description: t('whyDesc') };
}

const SECTOR_TABLE = [
  { key: 'business', energy: 4.12, psychopathy: 1.18, organization: 4.35, irritability: 1.79, intellect: 4.26 },
  { key: 'military', energy: 4.35, psychopathy: 1.42, organization: 4.52, irritability: 2.18, intellect: 4.10 },
  { key: 'religious',energy: 3.98, psychopathy: 1.05, organization: 4.15, irritability: 1.45, intellect: 4.38 },
] as const;

const FACTOR_DETAIL_KEYS = [
  { key: 'Energy',       emoji: '⚡' },
  { key: 'Psychopathy',  emoji: '⚠️' },
  { key: 'Organization', emoji: '🗂️' },
  { key: 'Irritability', emoji: '🌡️' },
  { key: 'Intellect',    emoji: '🧠' },
] as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100">{title}</h2>
      {children}
    </section>
  );
}

export default function ResearchPage() {
  const t = useTranslations('research');

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      {/* Page header */}
      <div className="mb-14">
        <div className="text-sm font-medium text-blue-600 mb-2">{t('phdBadge')}</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
        <p className="text-xl text-gray-500 leading-relaxed">{t('subtitle')}</p>
      </div>

      {/* Why Lexical */}
      <Section title={t('whyTitle')}>
        <p className="text-gray-600 leading-relaxed text-base">{t('whyDesc')}</p>
        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-5">
          <div className="flex gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="font-semibold text-blue-900 text-sm mb-1">{t('insightBoxTitle')}</p>
              <p className="text-blue-800 text-sm leading-relaxed">{t('insightBoxText')}</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Why Not Big Five */}
      <Section title={t('bigFiveTitle')}>
        <p className="text-gray-600 leading-relaxed mb-6">{t('bigFiveDesc')}</p>
        <div className="space-y-3">
          {[t('bigFiveFactor1'), t('bigFiveFactor2')].map((item, i) => (
            <div key={i} className="flex gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4">
              <span className="text-amber-500 font-bold text-base mt-0.5">{i + 1}.</span>
              <p className="text-amber-900 text-sm leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Study Design */}
      <Section title={t('studyTitle')}>
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            { title: t('study2Title'), desc: t('study2Desc'), badge: t('study2Badge') },
            { title: t('study4Title'), desc: t('study4Desc'), badge: t('study4Badge') },
          ].map(s => (
            <div key={s.badge} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <span className="inline-block text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-3">
                {s.badge}
              </span>
              <h3 className="font-bold text-gray-900 mb-3 text-base">{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Benchmark Table */}
      <Section title={t('comparisonTitle')}>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100">
                <th className="py-3 px-4 font-semibold text-gray-700 text-start">{t('sectorTableHeader')}</th>
                <th className="py-3 px-4 font-semibold text-gray-700 text-center">{t('energyLabel')}</th>
                <th className="py-3 px-4 font-semibold text-gray-700 text-center">{t('psychopathyLabel')}</th>
                <th className="py-3 px-4 font-semibold text-gray-700 text-center">{t('organizationLabel')}</th>
                <th className="py-3 px-4 font-semibold text-gray-700 text-center">{t('irritabilityLabel')}</th>
                <th className="py-3 px-4 font-semibold text-gray-700 text-center">{t('intellectLabel')}</th>
              </tr>
            </thead>
            <tbody>
              {SECTOR_TABLE.map((row, i) => (
                <tr key={row.key} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="py-3 px-4 font-semibold text-gray-800">
                    {t(row.key as 'business')}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-600">{row.energy.toFixed(2)}</td>
                  <td className="py-3 px-4 text-center text-gray-600">{row.psychopathy.toFixed(2)}</td>
                  <td className="py-3 px-4 text-center text-gray-600">{row.organization.toFixed(2)}</td>
                  <td className="py-3 px-4 text-center text-gray-600">{row.irritability.toFixed(2)}</td>
                  <td className="py-3 px-4 text-center text-gray-600">{row.intellect.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">{t('sectorTableFootnote')}</p>
      </Section>

      {/* Five Factor summary */}
      <Section title={t('fiveFactorTitle')}>
        <div className="grid grid-cols-1 gap-4">
          {FACTOR_DETAIL_KEYS.map(f => (
            <div key={f.key} className="flex gap-4 p-5 bg-white border border-gray-100 rounded-xl shadow-sm">
              <div className="text-2xl flex-shrink-0 mt-0.5">{f.emoji}</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">
                  {t(`factor${f.key}Name` as 'factorEnergyName')}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {t(`factor${f.key}Desc` as 'factorEnergyDesc')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
