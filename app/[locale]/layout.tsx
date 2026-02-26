import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import NavBar from '@/components/NavBar';
import '../globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Leader Personality | Dr. Noam Keshet',
    template: '%s | Leader Personality',
  },
  description:
    'A lexical approach to leader personality assessment — 50-item tool grounded in PhD research across business, military, and religious sectors.',
  openGraph: {
    siteName: 'Leader Personality',
    type: 'website',
  },
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'en' | 'he')) {
    notFound();
  }

  const messages = await getMessages();
  type NavT = { home: string; research: string; about: string; assessment: string; language: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nav = (messages as any).nav as NavT;

  return (
    <html lang={locale} dir={locale === 'he' ? 'rtl' : 'ltr'}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Hebrew:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <NextIntlClientProvider messages={messages}>
          <NavBar locale={locale} t={nav} />
          <main>{children}</main>
          <footer className="border-t border-gray-100 mt-20 py-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-sm text-gray-400">
              <p>
                © {new Date().getFullYear()} Dr. Noam Keshet — Leader Personality Research.
              </p>
              <p className="mt-1">
                Based on PhD dissertation research. All rights reserved.
              </p>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
