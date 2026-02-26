import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import AssessmentWizard from '@/components/AssessmentWizard';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'assessment' });
  return { title: t('title') };
}

export default async function AssessmentPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'assessment' });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-sm font-medium text-blue-600 mb-2">
            Leader · Follower · 5–7 Factors
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{t('title')}</h1>
          <p className="text-gray-500 leading-relaxed max-w-lg mx-auto">{t('subtitle')}</p>
        </div>

        <AssessmentWizard
          locale={locale}
          t={{
            roleTitle:            t('roleTitle'),
            roleSubtitle:         t('roleSubtitle'),
            leaderCard:           t('leaderCard'),
            leaderCardDesc:       t('leaderCardDesc'),
            followerCard:         t('followerCard'),
            followerCardDesc:     t('followerCardDesc'),
            instructionsLeader:   t('instructionsLeader'),
            instructionsFollower: t('instructionsFollower'),
            progress:             t.raw('progress') as string,
            next:                 t('next'),
            back:                 t('back'),
            submit:               t('submit'),
            scale1:               t('scale1'),
            scale5:               t('scale5'),
          }}
        />
      </div>
    </div>
  );
}
