'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { cn } from '@/app/lib/cn';
import { Button } from '@/app/components/ui/button';
import Footer from '@/app/components/site/Footer';

type Group = {
  id: string;
  title: string;
  short: string;
  items: string[];
  image: { src: string; alt: string };
};

function BulletList({ items }: { items: string[] }) {
  if (!items?.length) return null;
  return (
    <ul className="mt-4 ml-5 list-disc space-y-2 text-ink-muted">
      {items.map((it, i) => (
        <li key={i} className="text-sm sm:text-base leading-relaxed">
          {it}
        </li>
      ))}
    </ul>
  );
}

export default function AreasGallery() {
  const t = useTranslations('Areas');
  const router = useRouter();

  const groups: Group[] = useMemo(
    () => [
      {
        id: 'oil-gas',
        title: t('groups.oilGas.title'),
        short: t('groups.oilGas.short'),
        items: (t.raw('groups.oilGas.items') as string[]) ?? [],
        image: { src: '/services/oil-gas-alt.jpeg', alt: t('groups.oilGas.short') }
      },
      {
        id: 'automotriz',
        title: t('groups.automotive.title'),
        short: t('groups.automotive.short'),
        items: (t.raw('groups.automotive.items') as string[]) ?? [],
        image: { src: '/services/automotriz-alt.jpeg', alt: t('groups.automotive.short') }
      },
      {
        id: 'quimica',
        title: t('groups.chemical.title'),
        short: t('groups.chemical.short'),
        items: (t.raw('groups.chemical.items') as string[]) ?? [],
        image: { src: '/services/quimica-alt.webp', alt: t('groups.chemical.short') }
      },
      {
        id: 'aero',
        title: t('groups.aerospace.title'),
        short: t('groups.aerospace.short'),
        items: (t.raw('groups.aerospace.items') as string[]) ?? [],
        image: { src: '/services/aero-alt.jpeg', alt: t('groups.aerospace.short') }
      }
    ],
    [t]
  );

  return (
    <div className="min-h-screen bg-surface-muted">
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
              <Button context="light" variant="secondary" onClick={() => router.push('/')} className="cursor-pointer">
                {t('back')}
              </Button>
            </div>
          </div>

          <div className="mt-14 space-y-14">
            {groups.map((g, idx) => {
              const reverseOnDesktop = idx % 2 === 1;

              return (
                <section key={g.id} id={g.id} className="scroll-mt-28">
                  <div className={cn('grid gap-8 items-start', 'lg:grid-cols-2 lg:gap-12')}>
                    {/* Texto */}
                    <div className={cn('order-1', reverseOnDesktop ? 'lg:order-2' : 'lg:order-1')}>
                      <p className="text-xs font-display tracking-[0.22em] uppercase text-brand-blue/80">{g.short}</p>

                      <h2 className="mt-3 font-display text-2xl sm:text-3xl font-semibold text-brand-navy">{g.title}</h2>

                      <BulletList items={g.items} />
                    </div>

                    {/* Imagen */}
                    <div className={cn('order-2', reverseOnDesktop ? 'lg:order-1' : 'lg:order-2')}>
                      <div
                        className={cn(
                          'relative w-full overflow-hidden rounded-2xl',
                          'bg-white border border-black/5',
                          'shadow-[0_10px_30px_rgba(0,0,0,0.06)]'
                        )}
                      >
                        <div className="relative h-[220px] sm:h-[280px] lg:h-[360px]">
                          <Image
                            src={g.image.src}
                            alt={g.image.alt}
                            fill
                            sizes="(min-width: 1024px) 50vw, 100vw"
                            className="object-cover"
                            priority={idx === 0}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 h-px w-full bg-black/5" />
                </section>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}