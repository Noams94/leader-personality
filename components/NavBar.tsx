'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Link, useRouter } from '@/i18n/navigation';

interface NavBarProps {
  locale: string;
  t: {
    home: string;
    research: string;
    about: string;
    assessment: string;
    language: string;
  };
}

export default function NavBar({ locale, t }: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isRtl = locale === 'he';

  const navLinks = [
    { href: '/',           label: t.home },
    { href: '/research',   label: t.research },
    { href: '/about',      label: t.about },
  ];

  const toggleLanguage = () => {
    const nextLocale = locale === 'en' ? 'he' : 'en';
    // Get the path without locale prefix
    const pathWithoutLocale = pathname.replace(/^\/(en|he)/, '') || '/';
    router.push(pathWithoutLocale as '/', { locale: nextLocale });
  };

  const isActive = (href: string) => {
    const localePrefix = `/${locale}`;
    const fullPath = pathname;
    if (href === '/') {
      return fullPath === localePrefix || fullPath === `${localePrefix}/`;
    }
    return fullPath.startsWith(`${localePrefix}${href}`);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className={`flex items-center justify-between h-16 ${isRtl ? 'flex-row-reverse' : ''}`}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:bg-blue-700 transition-colors">
              LP
            </div>
            <span className="font-semibold text-gray-900 hidden sm:block text-sm">
              {locale === 'he' ? 'אישיות מנהיגותית' : 'Leader Personality'}
            </span>
          </Link>

          {/* Desktop nav */}
          <div className={`hidden md:flex items-center gap-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side: language + CTA */}
          <div className={`hidden md:flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={toggleLanguage}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50 border border-gray-200"
            >
              {t.language}
            </button>
            <Link
              href="/assessment"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              {t.assessment}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="text-sm text-gray-500 border border-gray-200 rounded-lg px-2 py-1"
            >
              {t.language}
            </button>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-50"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                  isActive(link.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/assessment"
              onClick={() => setMenuOpen(false)}
              className="block mx-4 mt-2 py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-semibold text-center"
            >
              {t.assessment}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
