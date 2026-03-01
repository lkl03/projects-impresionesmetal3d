'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/app/lib/cn';
import { getSectionIds, type Locale } from '@/app/lib/sections';

type Item = {
  src: string;
  span?: string;
  alt?: string;
};

function ZoomIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
      <path d="M11 8v6" />
      <path d="M8 11h6" />
    </svg>
  );
}

function GalleryTile({
  item,
  index,
  onOpen,
  supportsHover
}: {
  item: Item;
  index: number;
  onOpen: (i: number) => void;
  supportsHover: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      className={cn(
        'group relative overflow-hidden rounded-2xl',
        'bg-white border border-black/5',
        'shadow-[0_10px_30px_rgba(0,0,0,0.06)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/60',
        'transition-transform duration-300 hover:-translate-y-0.5',
        // ✅ Scroll-driven animation SIEMPRE presente (respetando reduced-motion)
        'motion-safe:timeline-view',
        'motion-safe:[animation:var(--animate-slide-in-left),var(--animate-slide-out-right)]',
        'motion-safe:[animation-range:entry_0%_contain_35%,exit_65%_exit_100%]',
        'motion-safe:[animation-timing-function:linear,linear]',
        'motion-safe:[animation-fill-mode:both,both]',
        item.span
      )}
      aria-label={item.alt ?? `Work ${index + 1}`}
    >
      <div className="absolute inset-0">
        <Image
          src={item.src}
          alt={item.alt ?? `Work ${index + 1}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className={cn(
            'object-cover',
            'transition-transform duration-700',
            supportsHover ? 'group-hover:scale-[1.02]' : ''
          )}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-transparent opacity-90" />

      <div className="absolute right-3 top-3">
        <div
          className={cn(
            'opacity-0 translate-y-1',
            supportsHover ? 'group-hover:opacity-100 group-hover:translate-y-0' : 'opacity-0',
            'transition-all duration-300'
          )}
        >
          <div
            className={cn(
              'inline-flex h-10 w-10 items-center justify-center rounded-full',
              'bg-white/90 text-brand-navy',
              'border border-black/10 shadow-[0_10px_25px_rgba(0,0,0,0.12)]'
            )}
            aria-hidden="true"
          >
            <ZoomIcon className="h-5 w-5" />
          </div>
        </div>
      </div>

      <span className="sr-only">Open</span>
    </button>
  );
}

export default function WorkGallery() {
  const t = useTranslations('Work');
  const locale = useLocale() as Locale;
  const ids = getSectionIds(locale);

  // ✅ Fade-in UNA vez al entrar en viewport
  const [entered, setEntered] = useState(false);
  const enterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = enterRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          obs.disconnect();
        }
      },
      { threshold: 0.18 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Hover real (desktop/laptop)
  const [supportsHover, setSupportsHover] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const apply = () => setSupportsHover(mq.matches);
    apply();
    mq.addEventListener?.('change', apply);
    return () => mq.removeEventListener?.('change', apply);
  }, []);

  // ✅ 4 items: grande left + 3 right (desktop)
  const items: Item[] = useMemo(
    () => [
      { src: '/work/01.webp', span: 'lg:col-span-2 lg:row-span-3' }, // grande izquierda
      { src: '/work/02.webp' }, // derecha arriba
      { src: '/work/03.webp' }, // derecha medio
      { src: '/work/04.webp' }  // derecha abajo
    ],
    []
  );

  // Lightbox
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const altBase = locale === 'es' ? 'Trabajo' : 'Work';

  function close() {
    setOpenIndex(null);
  }
  function prev() {
    if (openIndex === null) return;
    setOpenIndex((openIndex - 1 + items.length) % items.length);
  }
  function next() {
    if (openIndex === null) return;
    setOpenIndex((openIndex + 1) % items.length);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (openIndex === null) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex]);

  const fullBleed = 'relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen';

  return (
    <section id={ids.work} className="bg-white overflow-x-clip">
      <div
        ref={enterRef}
        className={cn(
          entered
            ? 'opacity-100 motion-safe:animate-fade-in motion-safe:animate-duration-700'
            : 'opacity-0'
        )}
      >
        <div className="mx-auto w-full max-w-screen-2xl 3xl:max-w-[1760px] px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.22em] text-brand-blue/80">
              {t('kicker')}
            </p>

            <h2 className="mt-4 font-display text-3xl sm:text-4xl font-semibold tracking-tight text-brand-navy">
              {t('title')}
            </h2>

            <p className="mt-5 text-ink-muted leading-relaxed whitespace-pre-line">
              {t('subtitle')}
            </p>
          </div>

          {/* Gallery full-bleed */}
          <div className={cn('mt-12 sm:mt-14', fullBleed)}>
            <div className="px-4 sm:px-6 lg:px-8">
              <div
                className={cn(
                  'grid gap-3 sm:gap-4',
                  // mobile/sm prolijo
                  'grid-cols-1 sm:grid-cols-2',
                  'auto-rows-[220px] sm:auto-rows-[260px]',
                  // desktop: 3 columnas, 3 filas -> grande a la izquierda + 3 apiladas
                  'lg:grid-cols-3 lg:auto-rows-[220px]'
                )}
              >
                {items.map((it, idx) => (
                  <GalleryTile
                    key={it.src}
                    item={{ ...it, alt: `${altBase} ${idx + 1}` }}
                    index={idx}
                    onOpen={setOpenIndex}
                    supportsHover={supportsHover}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Lightbox */}
        {openIndex !== null && (
          <div role="dialog" aria-modal="true" className="fixed inset-0 z-[80] bg-black/90">
            <button
              type="button"
              onClick={close}
              className="absolute inset-0 z-[81] cursor-zoom-out"
              aria-label={locale === 'es' ? 'Cerrar' : 'Close'}
            />

            <div className="absolute inset-0 z-[82] flex items-center justify-center p-4 sm:p-8 pointer-events-none">
              <div className="relative w-full h-full max-w-6xl max-h-[82vh] pointer-events-auto">
                <Image
                  src={items[openIndex].src}
                  alt={`${altBase} ${openIndex + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div className="absolute inset-0 z-[90] pointer-events-none">
              <button
                type="button"
                onClick={prev}
                className={cn(
                  'pointer-events-auto absolute left-3 top-1/2 -translate-y-1/2',
                  'h-12 w-12 rounded-full',
                  'bg-white/10 border border-white/15',
                  'text-white text-2xl',
                  'hover:bg-white/15 transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50'
                )}
                aria-label={locale === 'es' ? 'Anterior' : 'Previous'}
              >
                ‹
              </button>

              <button
                type="button"
                onClick={next}
                className={cn(
                  'pointer-events-auto absolute right-3 top-1/2 -translate-y-1/2',
                  'h-12 w-12 rounded-full',
                  'bg-white/10 border border-white/15',
                  'text-white text-2xl',
                  'hover:bg-white/15 transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50'
                )}
                aria-label={locale === 'es' ? 'Siguiente' : 'Next'}
              >
                ›
              </button>

              <div className="pointer-events-auto absolute bottom-[20%] sm:bottom-5 left-1/2 -translate-x-1/2">
                <button
                  type="button"
                  onClick={close}
                  className={cn(
                    'cursor-pointer rounded-full px-6 py-3 text-sm sm:text-base font-medium',
                    'bg-white/10 border border-white/20 text-white',
                    'hover:bg-white/15 transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
                    'w-[min(360px,calc(100vw-2rem))]'
                  )}
                >
                  {locale === 'es' ? 'Cerrar' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


