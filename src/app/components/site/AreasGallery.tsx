'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { cn } from '@/app/lib/cn';
import { Button } from '@/app/components/ui/button';
import type { Locale } from '@/app/lib/sections';
import Footer from '@/app/components/site/Footer';

type Tile = { src: string; alt: string };
type Group = { id: string; title: string; body: string; tiles: Tile[] };

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
  tile,
  index,
  onOpen,
  supportsHover
}: {
  tile: Tile;
  index: number;
  onOpen: (i: number) => void;
  supportsHover: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      className={cn(
        'cursor-pointer group relative h-full w-full overflow-hidden rounded-2xl',
        'bg-white border border-black/5',
        'shadow-[0_10px_30px_rgba(0,0,0,0.06)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/60',
        'transition-transform duration-300 hover:-translate-y-0.5'
      )}
      aria-label={tile.alt}
    >
      <div className="absolute inset-0">
        <Image
          src={tile.src}
          alt={tile.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className={cn('object-cover', 'transition-transform duration-700', supportsHover ? 'group-hover:scale-[1.02]' : '')}
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

export default function AreasGallery() {
  const t = useTranslations('Areas');
  const locale = useLocale() as Locale;
  const router = useRouter();

  const [supportsHover, setSupportsHover] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const apply = () => setSupportsHover(mq.matches);
    apply();
    mq.addEventListener?.('change', apply);
    return () => mq.removeEventListener?.('change', apply);
  }, []);

  // ✅ default image para todo
  const defaultSrc = '/work/01.webp';

  // ✅ 2 filas en lg (3 cols) => max 6 tiles por rubro
  const maxTilesPerGroup = 6;

  const groups: Group[] = useMemo(() => {
    const mkTiles = (prefix: string) =>
      Array.from({ length: maxTilesPerGroup }).map((_, i) => ({
        src: defaultSrc,
        alt: `${prefix} ${i + 1}`
      }));

    return [
      {
        id: 'oil-gas',
        title: t('groups.oilGas.title'),
        body: t('groups.oilGas.body'),
        tiles: mkTiles(t('groups.oilGas.short'))
      },
      {
        id: 'automotriz',
        title: t('groups.automotive.title'),
        body: t('groups.automotive.body'),
        tiles: mkTiles(t('groups.automotive.short'))
      },
      {
        id: 'quimica',
        title: t('groups.chemical.title'),
        body: t('groups.chemical.body'),
        tiles: mkTiles(t('groups.chemical.short'))
      },
      {
        id: 'aero',
        title: t('groups.aerospace.title'),
        body: t('groups.aerospace.body'),
        tiles: mkTiles(t('groups.aerospace.short'))
      }
    ];
  }, [t]);

  const allTiles = useMemo(() => groups.flatMap((g) => g.tiles), [groups]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function close() {
    setOpenIndex(null);
  }
  function prev() {
    if (openIndex === null) return;
    setOpenIndex((openIndex - 1 + allTiles.length) % allTiles.length);
  }
  function next() {
    if (openIndex === null) return;
    setOpenIndex((openIndex + 1) % allTiles.length);
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

  return (
    <div className="min-h-screen bg-surface-muted">
      {/* ✅ offwhite para que el header (blanco) se vea siempre */}
      <main className="overflow-x-clip">
        <div className='bg-ink p-16'></div>
        <div className="mx-auto w-full max-w-screen-2xl 3xl:max-w-[1760px] px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.22em] text-brand-blue/80">{t('kicker')}</p>
            <h1 className="mt-4 font-display text-3xl sm:text-4xl font-semibold tracking-tight text-brand-navy">
              {t('title')}
            </h1>
            <p className="mt-5 text-ink-muted leading-relaxed whitespace-pre-line">{t('subtitle')}</p>

            <div className="mt-8 flex justify-center">
              <Button
                context="light"
                variant="secondary"
                onClick={() => router.push('/')}
                className="cursor-pointer"
              >
                {t('back')}
              </Button>
            </div>
          </div>

          <div className="mt-14 space-y-16">
            {groups.map((g, groupIndex) => {
              const offset = groups.slice(0, groupIndex).reduce((acc, cur) => acc + cur.tiles.length, 0);

              return (
                <section key={g.id} id={g.id} className="scroll-mt-28">
                  <div className="max-w-4xl">
                    <h2 className="font-display text-2xl sm:text-3xl font-semibold text-brand-navy">{g.title}</h2>
                    <p className="mt-3 text-ink-muted leading-relaxed">{g.body}</p>
                  </div>

                  <div className={cn('mt-8 grid gap-3 sm:gap-4', 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3')}>
                    {g.tiles.map((tile, i) => (
                      <div key={`${g.id}-${i}`} className="relative h-[220px] sm:h-[260px]">
                        <GalleryTile
                          tile={tile}
                          index={offset + i}
                          onOpen={setOpenIndex}
                          supportsHover={supportsHover}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
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
                  src={allTiles[openIndex].src}
                  alt={allTiles[openIndex].alt}
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
      </main>

      {/* ✅ Footer al final */}
      <Footer />
    </div>
  );
}