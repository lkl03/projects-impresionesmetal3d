'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '../ui/button';
import { getSectionIds, hash, type Locale } from '@/app/lib/sections';

type Variant = 'mobile' | 'desktop';

export default function Hero() {
  const t = useTranslations('Hero');
  const locale = useLocale() as Locale;
  const ids = getSectionIds(locale);

  // ✅ Kickers rotativos (array desde messages)
  const kickers = useMemo(() => {
    const raw = t.raw('kickers');
    const list = Array.isArray(raw) ? (raw as string[]) : [];
    return list.length ? list : [t('kicker')];
  }, [t]);

  const [kickerIndex, setKickerIndex] = useState(0);

  // Reset al cambiar locale
  useEffect(() => {
    setKickerIndex(0);
  }, [locale]);

  // ✅ Rotación cada 6s (como pediste)
  useEffect(() => {
    if (kickers.length <= 1) return;
    const id = window.setInterval(() => {
      setKickerIndex((i) => (i + 1) % kickers.length);
    }, 6000);

    return () => window.clearInterval(id);
  }, [kickers.length]);

  // ✅ Detectar mobile/desktop (sin bajar assets equivocados)
  const [variant, setVariant] = useState<Variant | null>(null);
  const [saveData, setSaveData] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const coarse = window.matchMedia('(pointer: coarse)');

    const apply = () => {
      const isMobile = mq.matches || coarse.matches;
      setVariant(isMobile ? 'mobile' : 'desktop');

      // Data Saver (si está disponible)
      const anyNav = navigator as any;
      const conn = anyNav?.connection;
      const sd = Boolean(conn?.saveData);
      setSaveData(sd);
    };

    apply();
    mq.addEventListener?.('change', apply);
    coarse.addEventListener?.('change', apply);

    return () => {
      mq.removeEventListener?.('change', apply);
      coarse.removeEventListener?.('change', apply);
    };
  }, []);

  const poster = '/hero-poster.jpg';

  // ✅ Si todavía no sabemos variant, o si el usuario tiene data-saver, mostramos poster (cero video)
  const shouldShowVideo = variant !== null && !saveData;

  const videoSrc = variant === 'mobile' ? '/hero-mobile.mp4' : '/hero.mp4';
  const isMobile = variant === 'mobile';

  return (
    <section id={ids.home} className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      {shouldShowVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          playsInline
          // ✅ mobile: sin loop (reproduce una vez y listo)
          loop={!isMobile}
          // ✅ no cambia mucho con autoplay, pero ok
          preload="metadata"
          poster={poster}
        >
          {/* ✅ 1 solo source para evitar que el browser elija otro formato pesado */}
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : (
        // Fallback poster mientras detectamos variant o si hay data saver
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${poster})` }}
          aria-hidden="true"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/70" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center text-white">
          <p
            key={kickerIndex}
            className="text-xs sm:text-sm uppercase tracking-[0.22em] text-white/80 min-h-[1.25rem] motion-safe:animate-fade-in motion-safe:animate-duration-500"
          >
            {kickers[kickerIndex]}
          </p>

          <h1 className="mt-4 font-display text-4xl sm:text-5xl 2xl:text-6xl 3xl:text-7xl font-semibold tracking-tight">
            {t('title')}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-white/85">
            {t('subtitle')}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="primary" href={hash(ids.about)}>
              {t('ctaMore')}
            </Button>
            <Button asChild variant="secondary" href={hash(ids.contact)}>
              {t('ctaContact')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}





