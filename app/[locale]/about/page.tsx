import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return { title: t('title') };
}

export default function AboutPage() {
  const t = useTranslations('about');

  const sectors = [
    { icon: '🏢', name: t('sectorBusiness'),  sub: t('sectorBusinessSub')  },
    { icon: '🎖️', name: t('sectorMilitary'),  sub: t('sectorMilitarySub')  },
    { icon: '✡️', name: t('sectorReligious'), sub: t('sectorReligiousSub') },
  ];

  const tags = [t('tag1'), t('tag2'), t('tag3'), t('tag4')];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      {/* Profile header */}
      <div className="flex flex-col sm:flex-row gap-8 items-start mb-16">
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex-shrink-0 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
          נ
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-blue-600 mb-1">{t('credential')}</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-lg text-gray-500">{t('subtitle')}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map(tag => (
              <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Main content */}
        <div className="md:col-span-3 space-y-12">
          {/* Research focus */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('researchFocusTitle')}</h2>
            <p className="text-gray-600 leading-relaxed">{t('researchFocusDesc')}</p>
          </section>

          {/* Key findings */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('keyFindingsTitle')}</h2>
            <div className="space-y-3">
              {[t('finding1'), t('finding2'), t('finding3'), t('finding4')].map((finding, i) => (
                <div key={i} className="flex gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{finding}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Sectors */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('sectorsTitle')}</h2>
            <p className="text-gray-600 leading-relaxed mb-6">{t('sectorsDesc')}</p>
            <div className="grid grid-cols-3 gap-4">
              {sectors.map(s => (
                <div key={s.name} className="text-center p-4 bg-slate-50 rounded-xl border border-gray-100">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className="font-semibold text-gray-800 text-sm">{s.name}</div>
                  <div className="text-gray-400 text-xs">{s.sub}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-2 space-y-6">
          {/* Contact card */}
          <div className="bg-blue-600 rounded-2xl p-6 text-white">
            <h3 className="font-bold text-lg mb-2">{t('contactTitle')}</h3>
            <p className="text-blue-100 text-sm mb-5 leading-relaxed">{t('contactDesc')}</p>
            <a
              href="mailto:keshet.noam@gmail.com"
              className="block text-center bg-white text-blue-600 font-semibold py-2.5 px-4 rounded-xl text-sm hover:bg-blue-50 transition-colors"
            >
              {t('contactButton')}
            </a>
          </div>

          {/* Assessment CTA */}
          <div className="bg-slate-50 border border-gray-100 rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 mb-2">{t('assessmentCtaTitle')}</h3>
            <p className="text-gray-500 text-sm mb-4 leading-relaxed">{t('assessmentCtaDesc')}</p>
            <Link
              href="/assessment"
              className="block text-center bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-xl text-sm hover:bg-blue-700 transition-colors"
            >
              {t('assessmentCtaButton')}
            </Link>
          </div>

          {/* Citation */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              {t('citationTitle')}
            </h4>
            <p className="text-gray-600 text-xs leading-relaxed">
              {t('citationPre')}
              <em>{t('citationJournal')}</em>
              {t('citationPost')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
