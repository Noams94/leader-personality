import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'article' });
  return { title: t('title'), description: t('abstract') };
}

const SECTIONS = ['section1', 'section2', 'section3', 'section4'] as const;

export default function ArticlePage() {
  const t = useTranslations('article');

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      {/* Back link */}
      <Link
        href="/about"
        className="inline-flex items-center text-sm text-blue-500 hover:text-blue-600 font-medium mb-10 transition-colors"
      >
        {t('backToAbout')}
      </Link>

      {/* Header */}
      <header className="mb-12">
        <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full inline-block" />
          {t('opinionBadge')}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter text-gray-900 leading-tight mb-4">
          {t('title')}
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed mb-6">
          {t('subtitle')}
        </p>
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span className="font-medium text-gray-600">{t('author')}</span>
          <span>·</span>
          <span>{t('date')}</span>
        </div>
      </header>

      {/* Abstract callout */}
      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-5 mb-12">
        <p className="text-gray-700 leading-relaxed text-sm">
          {t('abstract')}
        </p>
      </div>

      {/* Article body */}
      <div className="space-y-10">
        {SECTIONS.map((key) => (
          <section key={key}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {t(`${key}Title`)}
            </h2>
            {t(`${key}Text`).split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-gray-600 leading-relaxed mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>

      {/* Footer */}
      <hr className="my-12 border-gray-100" />
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <Link
          href="/about"
          className="text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors"
        >
          {t('backToAbout')}
        </Link>
        <Link
          href="/assessment"
          className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl text-sm hover:-translate-y-0.5 transition-all duration-300 ease-in-out"
        >
          Take the Assessment →
        </Link>
      </div>
    </div>
  );
}
