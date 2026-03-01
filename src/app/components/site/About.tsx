'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/app/lib/cn';
import { getSectionIds, hash, type Locale } from '@/app/lib/sections';
import { Button } from '../ui/button';

type Slide = { src: string; alt: string };

export default function About() {
  const t = useTranslations('About');
  const locale = useLocale() as Locale;
  const ids = getSectionIds(locale);

  // ✅ fade-in on scroll (1 vez)
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

  const slides: Slide[] = useMemo(
    () => [
      { src: '/about/01.webp', alt: 'Bioprotece3D - Planta / Proceso' },
      { src: '/about/02.webp', alt: 'Bioprotece3D - Piezas metálicas' },
      { src: '/about/03.webp', alt: 'Bioprotece3D - Tecnología / Equipo' }
    ],
    []
  );

  const [index, setIndex] = useState(0);

  // ✅ autoplay (resetea cuando el user interactúa)
  const timerRef = useRef<number | null>(null);
  const AUTOPLAY_MS = 6000; // UX sweet spot

  function clearTimer() {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }

  function scheduleNext() {
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
  }

  // schedule al montar y cada vez que cambia el index (mantiene loop “vivo”)
  useEffect(() => {
    scheduleNext();
    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, slides.length]);

  function goTo(i: number) {
    setIndex(i);
    scheduleNext();
  }
  function prev() {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
    scheduleNext();
  }
  function next() {
    setIndex((i) => (i + 1) % slides.length);
    scheduleNext();
  }

  const body = t('body');

  return (
    <section id={ids.about} className="bg-surface">
      <div
        ref={enterRef}
        className={cn(
          entered
            ? 'opacity-100 motion-safe:animate-fade-in motion-safe:animate-duration-700'
            : 'opacity-0'
        )}
      >
        <div className="mx-auto w-full max-w-screen-2xl 3xl:max-w-[1760px] px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-stretch">
            {/* LEFT (60%) */}
            <div className="lg:basis-3/5">
              {/* ✅ centrado en mobile, left en desktop */}
              <p className="text-xs uppercase tracking-[0.22em] text-brand-blue/80 text-center lg:text-left">
                {t('kicker')}
              </p>

              <h2 className="mt-4 font-display text-3xl sm:text-4xl font-semibold tracking-tight text-brand-navy text-center lg:text-left">
                {t('title')}
              </h2>

              <p className="mt-5 text-ink-muted leading-relaxed whitespace-pre-line text-center lg:text-left">
                {body}
              </p>

              {/* Cards (Vision / Mision) */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div
                  className={cn(
                    'rounded-2xl border border-black/5 bg-white p-6',
                    'shadow-[0_10px_30px_rgba(0,0,0,0.06)]'
                  )}
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-ink-muted text-center lg:text-left">
                    {t('visionLabel')}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-semibold text-brand-navy text-center lg:text-left">
                    {t('visionTitle')}
                  </h3>
                  <p className="mt-3 text-sm sm:text-base text-ink-muted leading-relaxed whitespace-pre-line text-center lg:text-left">
                    {t('visionBody')}
                  </p>
                </div>

                <div
                  className={cn(
                    'rounded-2xl border border-black/5 bg-white p-6',
                    'shadow-[0_10px_30px_rgba(0,0,0,0.06)]'
                  )}
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-ink-muted text-center lg:text-left">
                    {t('missionLabel')}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-semibold text-brand-navy text-center lg:text-left">
                    {t('missionTitle')}
                  </h3>
                  <p className="mt-3 text-sm sm:text-base text-ink-muted leading-relaxed whitespace-pre-line text-center lg:text-left">
                    {t('missionBody')}
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:items-center justify-center lg:justify-start">
                <Button
                  asChild
                  context="light"
                  variant="primary"
                  href={hash(ids.services)}
                  className="cursor-pointer"
                >
                  {t('ctaServices')}
                </Button>

                <Button
                  asChild
                  context="light"
                  variant="secondary"
                  href="/bioprotece3d-brochure.pdf"
                  download="Bioprotece3D-Brochure.pdf"
                  className="cursor-pointer"
                >
                  {t('ctaBrochure')}
                </Button>

                <span className="text-xs text-ink-muted text-center lg:text-left sm:ml-2">
                  {t('ctaHint')}
                </span>
              </div>
            </div>

            {/* RIGHT (40%) - Slideshow */}
            <div className="lg:basis-2/5">
              <div
                className={cn(
                  'relative overflow-hidden rounded-3xl border border-black/5 bg-black/5',
                  'shadow-[0_16px_60px_rgba(0,0,0,0.12)]',
                  'h-[320px] sm:h-[420px] lg:h-full min-h-[420px]'
                )}
              >
                {/* Slides stacked + crossfade */}
                {slides.map((s, i) => (
                  <Image
                    key={s.src}
                    src={s.src}
                    alt={s.alt}
                    fill
                    priority={i === 0}
                    className={cn(
                      'object-cover',
                      'transition-opacity duration-700',
                      i === index ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                ))}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />

                {/* Controls */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        aria-label={`Ir a slide ${i + 1}`}
                        onClick={() => goTo(i)}
                        className={cn(
                          'h-2.5 w-2.5 rounded-full transition-opacity cursor-pointer',
                          i === index
                            ? 'bg-white opacity-100'
                            : 'bg-white/60 opacity-70 hover:opacity-100'
                        )}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Anterior"
                      onClick={prev}
                      className="cursor-pointer rounded-full bg-white/15 hover:bg-white/25 text-white px-3 py-2 transition-colors"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      aria-label="Siguiente"
                      onClick={next}
                      className="cursor-pointer rounded-full bg-white/15 hover:bg-white/25 text-white px-3 py-2 transition-colors"
                    >
                      ›
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


