'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/app/lib/cn';
import { getSectionIds, type Locale } from '@/app/lib/sections';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/app/components/ui/button';

type CardData = { title: string; body: string };
type Sector = { title: string; body: string; imageSrc: string };

function RevealCard({
  title,
  body,
  pinned,
  hovered,
  supportsHover,
  onTogglePinned,
  onHover,
  onLeave,
  className
}: {
  title: string;
  body: string;
  pinned: boolean;
  hovered: boolean;
  supportsHover: boolean;
  onTogglePinned: () => void;
  onHover: () => void;
  onLeave: () => void;
  className?: string;
}) {
  const show = pinned || (supportsHover && hovered);


  return (
    <button
      type="button"
      onClick={onTogglePinned}
      onMouseEnter={supportsHover ? onHover : undefined}
      onMouseLeave={supportsHover ? onLeave : undefined}
      aria-expanded={pinned}
      className={cn(
        'text-left w-full rounded-2xl border border-black/5 bg-white p-6',
        'shadow-[0_10px_30px_rgba(0,0,0,0.06)]',
        'transition-transform duration-300',
        supportsHover ? 'hover:-translate-y-0.5' : '',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/60',
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <h4 className="font-display text-lg font-semibold text-brand-navy leading-snug">
          {title}
        </h4>

        <span
          className={cn(
            'mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full',
            'bg-surface-muted text-brand-navy/80',
            'transition-transform duration-300',
            pinned ? 'rotate-45' : 'rotate-0'
          )}
          aria-hidden="true"
        >
          +
        </span>
      </div>

      <div
        className={cn(
          'grid transition-all duration-300',
          show ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0 mt-0'
        )}
      >
        <div className="overflow-hidden">
          <p className="text-sm sm:text-base text-ink-muted leading-relaxed whitespace-pre-line">
            {body}
          </p>
        </div>
      </div>
    </button>
  );
}

function ProcessCard({
  title,
  body,
  index,
  featured
}: {
  title: string;
  body: string;
  index: number;
  featured?: boolean;
}) {
  return (
    <div
      className={cn(
        'w-full md:w-[320px] lg:w-[360px]',
        'rounded-2xl border border-black/5 bg-white overflow-hidden text-center',
        'shadow-[0_10px_30px_rgba(0,0,0,0.06)]',
        'transition-transform duration-300',
        // ✅ Destacado SOLO en desktop
        featured
          ? [
              'md:-translate-y-6 md:scale-[1.03] md:relative md:z-10',
              'md:shadow-[0_20px_55px_rgba(0,0,0,0.12)]',
              'md:border-brand-blue/25'
            ].join(' ')
          : 'md:translate-y-2 md:relative md:z-0'
      )}
    >
      <div className="h-3.5 w-full bg-brand-blue" />

      <div
        className={cn(
          'p-6 sm:p-7',
          featured ? 'md:px-8 md:py-10' : 'md:px-7 md:py-8'
        )}
      >
        <p className="text-xs uppercase tracking-[0.22em] text-ink-muted">
          {String(index + 1).padStart(2, '0')}
        </p>

        <h4
          className={cn(
            'mt-2 font-display font-semibold text-brand-navy',
            featured ? 'text-xl' : 'text-lg'
          )}
        >
          {title}
        </h4>

        <p
          className={cn(
            'mt-3 text-ink-muted leading-relaxed whitespace-pre-line',
            featured ? 'text-base' : 'text-sm sm:text-base'
          )}
        >
          {body}
        </p>
      </div>
    </div>
  );
}

export default function Services() {
  const t = useTranslations('Services');
  const locale = useLocale() as Locale;
  const ids = getSectionIds(locale);

  // Hover real (desktop/laptop)
  const [supportsHover, setSupportsHover] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const apply = () => setSupportsHover(mq.matches);
    apply();
    mq.addEventListener?.('change', apply);
    return () => mq.removeEventListener?.('change', apply);
  }, []);

  const needs: CardData[] = useMemo(
    () => [
      { title: t('needsCards.0.title'), body: t('needsCards.0.body') },
      { title: t('needsCards.1.title'), body: t('needsCards.1.body') },
      { title: t('needsCards.2.title'), body: t('needsCards.2.body') }
    ],
    [t]
  );

  const processItems: CardData[] = useMemo(
    () => [
      { title: t('processCards.0.title'), body: t('processCards.0.body') },
      { title: t('processCards.1.title'), body: t('processCards.1.body') },
      { title: t('processCards.2.title'), body: t('processCards.2.body') }
    ],
    [t]
  );

  const sectors: Sector[] = useMemo(
    () => [
      { title: t('sectors.0.title'), body: t('sectors.0.body'), imageSrc: '/services/oil-gas-alt.jpeg' },
      { title: t('sectors.1.title'), body: t('sectors.1.body'), imageSrc: '/services/automotriz-alt.jpeg' },
      { title: t('sectors.2.title'), body: t('sectors.2.body'), imageSrc: '/services/quimica-alt.webp' },
      { title: t('sectors.3.title'), body: t('sectors.3.body'), imageSrc: '/services/aero-alt.jpeg' }
    ],
    [t]
  );

  // Needs pinned/hover
  const [pinnedNeeds, setPinnedNeeds] = useState<number>(0);
  const [hoveredNeeds, setHoveredNeeds] = useState<number | null>(null);

  // ✅ Fade-in al entrar en viewport, UNA sola vez
  const [entered, setEntered] = useState(false);
  const enterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = enterRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          obs.disconnect(); // ✅ una sola vez
        }
      },
      { threshold: 0.18 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const router = useRouter();

  return (
    <section id={ids.services} className="bg-surface-muted">
      {/* Wrapper que “aparece” cuando entra en viewport */}
      <div
        ref={enterRef}
        className={cn(
          'motion-reduce:opacity-100',
          entered
            ? 'opacity-100 motion-safe:animate-fade-in motion-safe:animate-duration-700'
            : 'opacity-0'
        )}
      >
        <div className="mx-auto w-full max-w-screen-2xl 3xl:max-w-[1760px] px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          {/* Opening centrado */}
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.22em] text-brand-blue/80">
              {t('kicker')}
            </p>

            <h2 className="mt-4 font-display text-3xl sm:text-4xl font-semibold tracking-tight text-brand-navy">
              {t('title')}
            </h2>

            <p className="mt-5 text-ink-muted leading-relaxed whitespace-pre-line">
              {t('body')}
            </p>
          </div>

          {/* Proceso debajo del opening + conectores */}
          <div className="mt-12">
            <div className="mx-auto max-w-4xl text-center">
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-brand-navy">
                {t('processTitle')}
              </h3>
              <p className="mt-3 text-ink-muted">
                {t('processBody')}
              </p>
            </div>

            <div className="relative sm:mt-15 mt-10">
              {/* Desktop timeline (línea + flecha) */}
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 hidden md:block h-px w-[92%] -translate-x-1/2 -translate-y-1/2 bg-brand-blue/25"
                aria-hidden="true"
              >
                <span
                  className={cn(
                    'absolute right-0 top-1/2 -translate-y-1/2',
                    'h-2.5 w-2.5 rotate-45',
                    'border-r border-t border-brand-blue/25'
                  )}
                />
              </div>

              {/* Mobile timeline (vertical) */}
              <div
                className="pointer-events-none absolute left-1/2 top-0 md:hidden h-full w-px -translate-x-1/2 bg-brand-blue/20"
                aria-hidden="true"
              >
                <span
                  className={cn(
                    'absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1',
                    'h-2.5 w-2.5 rotate-45',
                    'border-b border-r border-brand-blue/20'
                  )}
                />
              </div>

              {/* Cards: middle featured SOLO desktop */}
              <div className="flex flex-col items-center gap-6 md:flex-row md:items-stretch md:justify-center md:gap-8">
                {processItems.map((p, i) => (
                  <div key={p.title} className="relative w-full md:w-auto">
                    <ProcessCard
                      title={p.title}
                      body={p.body}
                      index={i}
                      featured={i === 1} // ✅ el medio destacado
                    />
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-ink-muted">
              {t('processHint')}
            </p>
          </div>

          {/* Flex: izquierda Needs, derecha Piezas */}
          <div className="sm:mt-20 mt-14 flex flex-col lg:flex-row gap-10 lg:gap-12 items-start">
            {/* Needs primero en mobile */}
            <div className="order-1 lg:order-1 lg:basis-1/2 w-full">
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-brand-navy sm:text-start text-center">
                {t('needsTitle')}
              </h3>
              <p className="mt-3 text-ink-muted sm:text-start text-center">
                {t('needsBody')}
              </p>

              <div className="mt-7 flex flex-col gap-4">
                {needs.map((n, idx) => (
                  <RevealCard
                    key={n.title}
                    title={n.title}
                    body={n.body}
                    pinned={pinnedNeeds === idx}
                    hovered={hoveredNeeds === idx}
                    supportsHover={supportsHover}
                    onTogglePinned={() => setPinnedNeeds((cur) => (cur === idx ? -1 : idx))}
                    onHover={() => setHoveredNeeds(idx)}
                    onLeave={() => setHoveredNeeds((cur) => (cur === idx ? null : cur))}
                  />
                ))}
              </div>
            </div>

            {/* Piezas después en mobile */}
            <div className="order-2 lg:order-2 lg:basis-1/2 w-full">
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-brand-navy sm:text-start text-center">
                {t('industriesTitle')}
              </h3>
              <p className="mt-3 text-ink-muted max-w-3xl sm:text-start text-center">
                {t('industriesBody')}
              </p>

              {/* Mobile carousel */}
              <div className="mt-8 lg:hidden -mx-4 px-4">
                <div
                  className={cn(
                    'flex gap-4 overflow-x-auto pb-2',
                    'snap-x snap-mandatory',
                    '[scrollbar-width:none] [-ms-overflow-style:none]'
                  )}
                >
                  <style jsx>{`
                    div::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>

                  {sectors.map((s) => (
                    <div
                      key={s.title}
                      className={cn(
                        'snap-start shrink-0 w-[82%] max-w-[340px]',
                        'rounded-2xl border border-black/5 bg-white overflow-hidden',
                        'shadow-[0_10px_30px_rgba(0,0,0,0.06)]'
                      )}
                    >
                      <div className="relative h-44 w-full bg-black/5">
                        <Image src={s.imageSrc} alt={s.title} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />
                      </div>

                      <div className="p-6">
                        <p className="font-display font-semibold text-brand-navy leading-tight">
                          {s.title}
                        </p>
                        <p className="mt-3 text-sm text-ink-muted leading-relaxed">
                          {s.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop grid 2x2 */}
              <div className="mt-8 hidden lg:grid gap-4 grid-cols-2">
                {sectors.map((s) => (
                  <div
                    key={s.title}
                    className={cn(
                      'rounded-2xl border border-black/5 bg-white overflow-hidden',
                      'shadow-[0_10px_30px_rgba(0,0,0,0.06)]',
                      'transition-transform duration-300 hover:-translate-y-0.5'
                    )}
                  >
                    <div className="relative h-60 w-full bg-black/5">
                      <Image src={s.imageSrc} alt={s.title} fill className="object-cover object-top" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />
                    </div>

                    <div className="p-6">
                      <p className="font-display font-semibold text-brand-navy leading-tight">
                        {s.title}
                      </p>
                      <p className="mt-3 text-sm text-ink-muted leading-relaxed">
                        {s.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex w-full justify-center">
  <Button
    context="light"
    variant="secondary"
    onClick={() => router.push('/areas')}
    className="cursor-pointer"
  >
    {t('seeMore')}
  </Button>
</div>
            </div>
          </div>

          {/* Clientes y alcance eliminado */}
        </div>
      </div>
    </section>
  );
}




