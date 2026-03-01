'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { cn } from '@/app/lib/cn';
import { getSectionIds, hash, type Locale } from '@/app/lib/sections';

export default function Header() {
  const t = useTranslations('Nav');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  const ids = useMemo(() => getSectionIds(locale), [locale]);

  const links = useMemo(
    () => [
      { href: hash(ids.home), label: t('home') },
      { href: hash(ids.about), label: t('about') },
      { href: hash(ids.services), label: t('services') },
      { href: hash(ids.work), label: t('work') },
      { href: hash(ids.faq), label: t('faq') },
    ],
    [t, ids]
  );

  const navText = scrolled ? 'text-brand-navy/80' : 'text-white/85';
  const divider = scrolled ? 'bg-black/10' : 'bg-white/20';

  function switchLocale(next: Locale) {
    router.replace(pathname, { locale: next });
  }

  // ✅ Home puede ser "/" o "/es" o "/en" dependiendo de tu config.
  const isHome = pathname === '/' || pathname === `/${locale}`;

  function onNavClick(href: string) {
    setMobileOpen(false);

    // href viene como "#faq", "#trabajos", etc.
    const hashOnly = href.startsWith('#') ? href : `#${href}`;

    if (isHome) {
      // En home: solo actualizamos el hash
      requestAnimationFrame(() => {
        window.location.hash = hashOnly.replace('#', '');
      });
      return;
    }

    // En cualquier otra página (ej: /areas): volvemos a la home con hash
    router.push('/' + hashOnly); // => "/#faq" (locale-aware via next-intl router)
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'transition-colors duration-300',
        scrolled ? 'bg-white/92 backdrop-blur border-b border-black/5' : 'bg-transparent',
        'motion-safe:animate-fade-in'
      )}
    >
      <div className="mx-auto w-full max-w-screen-2xl 3xl:max-w-[1760px] px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        {/* DESKTOP (>= sm): logo centrado + nav debajo */}
        <div className="hidden sm:flex flex-col items-center gap-3">
          {/* ✅ Logo: NO usar <a href="#home"> porque en /areas te queda /areas#home */}
          <button
            type="button"
            onClick={() => onNavClick(hash(ids.home))}
            aria-label="Bioprotece3D"
            className={cn(
              'cursor-pointer select-none transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99]',
              'motion-safe:animate-fade-in-up'
            )}
          >
            <Image
              src={scrolled ? '/logo-color.png' : '/logo-white.png'}
              alt="Bioprotece3D"
              width={180}
              height={48}
              priority
              className={cn('h-10 w-auto sm:h-11', 'transition-opacity duration-300')}
            />
          </button>

          <nav
            className={cn(
              'flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm',
              navText,
              'motion-safe:animate-fade-in-up'
            )}
          >
            {/* ✅ Desktop links: usar button para que SIEMPRE ejecute onNavClick */}
            {links.map((l) => (
              <button
                key={l.href}
                type="button"
                onClick={() => onNavClick(l.href)}
                className={cn(
                  'cursor-pointer relative py-1 transition-opacity hover:opacity-90',
                  'after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:transition-all after:duration-300',
                  scrolled ? 'after:bg-brand-navy/40 hover:after:w-full' : 'after:bg-white/50 hover:after:w-full'
                )}
              >
                {l.label}
              </button>
            ))}

            <span className={cn('mx-2 h-4 w-px', divider)} />

            {/* Language switch (desktop) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => switchLocale('es')}
                aria-current={locale === 'es' ? 'page' : undefined}
                className={cn(
                  'cursor-pointer font-display text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-90',
                  locale === 'es'
                    ? scrolled
                      ? 'text-brand-navy'
                      : 'text-white'
                    : scrolled
                      ? 'text-brand-navy/50'
                      : 'text-white/50'
                )}
              >
                ES
              </button>

              <span className={cn('text-xs', scrolled ? 'text-black/20' : 'text-white/30')}>|</span>

              <button
                type="button"
                onClick={() => switchLocale('en')}
                aria-current={locale === 'en' ? 'page' : undefined}
                className={cn(
                  'cursor-pointer font-display text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-90',
                  locale === 'en'
                    ? scrolled
                      ? 'text-brand-navy'
                      : 'text-white'
                    : scrolled
                      ? 'text-brand-navy/50'
                      : 'text-white/50'
                )}
              >
                EN
              </button>
            </div>
          </nav>
        </div>

        {/* MOBILE (< sm): logo izquierda + ES/EN visible + hamburger derecha */}
        <div className="sm:hidden flex items-center justify-between gap-3">
          {/* ✅ Mobile logo también debe usar onNavClick */}
          <button
            type="button"
            onClick={() => onNavClick(hash(ids.home))}
            aria-label="Bioprotece3D"
            className="cursor-pointer flex items-center"
          >
            <span className="relative block h-9 w-[140px]">
              <Image
                src="/logo-white.png"
                alt="Bioprotece3D"
                fill
                priority
                className={cn(
                  'object-contain transition-opacity duration-300',
                  scrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
                )}
              />
              <Image
                src="/logo-color.png"
                alt="Bioprotece3D"
                fill
                priority
                className={cn(
                  'object-contain transition-opacity duration-300',
                  scrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
                )}
              />
            </span>
          </button>

          <div className="flex items-center gap-3">
            {/* Language switch always visible */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => switchLocale('es')}
                aria-current={locale === 'es' ? 'page' : undefined}
                className={cn(
                  'cursor-pointer font-display text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-90',
                  locale === 'es'
                    ? scrolled
                      ? 'text-brand-navy'
                      : 'text-white'
                    : scrolled
                      ? 'text-brand-navy/50'
                      : 'text-white/50'
                )}
              >
                ES
              </button>

              <span className={cn('text-xs', scrolled ? 'text-black/20' : 'text-white/30')}>|</span>

              <button
                type="button"
                onClick={() => switchLocale('en')}
                aria-current={locale === 'en' ? 'page' : undefined}
                className={cn(
                  'cursor-pointer font-display text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-90',
                  locale === 'en'
                    ? scrolled
                      ? 'text-brand-navy'
                      : 'text-white'
                    : scrolled
                      ? 'text-brand-navy/50'
                      : 'text-white/50'
                )}
              >
                EN
              </button>
            </div>

            {/* Hamburger */}
            <button
              type="button"
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className={cn(
                'cursor-pointer rounded-full p-2 transition-colors',
                scrolled ? 'hover:bg-black/5' : 'hover:bg-white/10'
              )}
            >
              <div className="grid gap-1.5">
                <span
                  className={cn(
                    'block h-0.5 w-6 transition-all duration-300',
                    scrolled ? 'bg-brand-navy' : 'bg-white',
                    mobileOpen ? 'translate-y-2 rotate-45' : ''
                  )}
                />
                <span
                  className={cn(
                    'block h-0.5 w-6 transition-all duration-300',
                    scrolled ? 'bg-brand-navy' : 'bg-white',
                    mobileOpen ? 'opacity-0' : 'opacity-100'
                  )}
                />
                <span
                  className={cn(
                    'block h-0.5 w-6 transition-all duration-300',
                    scrolled ? 'bg-brand-navy' : 'bg-white',
                    mobileOpen ? '-translate-y-2 -rotate-45' : ''
                  )}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay + side drawer */}
      <div className={cn('sm:hidden fixed inset-0 z-[60]', mobileOpen ? 'pointer-events-auto' : 'pointer-events-none')}>
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setMobileOpen(false)}
          className={cn(
            'absolute inset-0 h-full w-full transition-opacity duration-300',
            mobileOpen ? 'opacity-100' : 'opacity-0',
            'bg-black/40'
          )}
        />

        <aside
          className={cn(
            'absolute right-0 top-0 h-full w-[82%] max-w-[340px]',
            'bg-white text-brand-navy shadow-2xl',
            'transition-transform duration-300',
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
            <span className="font-display text-sm tracking-[0.2em] uppercase text-brand-navy/70">Menu</span>
            <button
              type="button"
              aria-label="Cerrar menú"
              onClick={() => setMobileOpen(false)}
              className="cursor-pointer rounded-full p-2 hover:bg-black/5"
            >
              <span className="block h-0.5 w-5 bg-brand-navy rotate-45 translate-y-[1px]" />
              <span className="block h-0.5 w-5 bg-brand-navy -rotate-45 -translate-y-[1px]" />
            </button>
          </div>

          <nav className="px-5 py-6">
            <ul className="flex flex-col gap-4">
              {links.map((l) => (
                <li key={l.href}>
                  <button
                    type="button"
                    onClick={() => onNavClick(l.href)}
                    className="cursor-pointer w-full text-left font-display text-lg text-brand-navy hover:opacity-80 transition-opacity"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </header>
  );
}

