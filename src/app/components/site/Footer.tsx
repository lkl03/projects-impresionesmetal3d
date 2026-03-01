'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/app/lib/cn';
import { Button } from '../ui/button';

function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 4 5 11l1.4 1.4L11 7.8V20h2V7.8l4.6 4.6L19 11l-7-7Z" />
    </svg>
  );
}

export default function Footer() {
  const t = useTranslations('Footer');
  const locale = useLocale();

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
      { threshold: 0.15 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const year = new Date().getFullYear();

  const whatsappHref =
    'https://wa.me/5491133647947?text=Hola!%20Vengo%20de%20la%20web%20de%20Bioprotece.%20Estoy%20interesado%20en...';
  const emailValue = 'impresion3d@bioprotece.com';
  const emailHref = `mailto:${emailValue}`;

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <footer className="bg-white">
      <div
        ref={enterRef}
        className={cn(
          'border-t-10 border-brand-blue',
          entered
            ? 'opacity-100 motion-safe:animate-fade-in motion-safe:animate-duration-700'
            : 'opacity-0'
        )}
      >
        <div className="mx-auto w-full max-w-screen-2xl 3xl:max-w-[1760px] px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col gap-10 md:flex-row items-center md:items-start md:justify-between">
            {/* Left: Logo */}
            <div className="md:basis-1/3">
              <a href="#inicio" className="inline-flex items-center gap-3">
                <Image
                  src="/logo-color.png"
                  alt="Bioprotece3D"
                  width={180}
                  height={48}
                  className="h-20 w-auto"
                />
              </a>
            </div>

            {/* Middle: Contact details */}
            <div className="md:basis-1/3">
              <p className="font-display text-sm font-semibold text-brand-navy text-center">
                {t('contactTitle')}
              </p>

              <div className="mt-4 space-y-3 text-sm text-ink-muted text-center">
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-[0.18em] text-ink-muted/80">
                    {t('emailLabel')}
                  </span>
                  <a
                    href={emailHref}
                    className="text-brand-navy hover:opacity-90 transition-opacity"
                  >
                    {emailValue}
                  </a>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-[0.18em] text-ink-muted/80">
                    {t('whatsappLabel')}
                  </span>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-navy hover:opacity-90 transition-opacity"
                  >
                    {t('whatsappValue')}
                  </a>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-[0.18em] text-ink-muted/80">
                    {t('addressLabel')}
                  </span>
                  <span className="text-ink-muted">
                    {t('addressValue')}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-[0.18em] text-ink-muted/80">
                    {t('hoursLabel')}
                  </span>
                  <span className="text-ink-muted">
                    {t('hoursValue')}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Back to top */}
            <div className="md:basis-1/3 md:flex md:justify-end self-start md:self-auto">
              <div className="flex flex-col items-start md:items-end gap-3">
                <Button
                  type="button"
                  context="light"
                  variant="secondary"
                  onClick={scrollToTop}
                  className="cursor-pointer"
                >
                  <ArrowUpIcon className="h-5 w-5" />
                  {t('backToTop')}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="bg-[#212121]">
          <div className="mx-auto w-full max-w-screen-2xl 3xl:max-w-[1760px] px-4 sm:px-6 lg:px-8 py-2">
            <p className="text-center text-xs text-white/80">
              ©{year} | {t('creditsPrefix')}{' '}
              <a
                href="https://eterlab.co/"
                target="_blank"
                rel="noreferrer"
                className="italic text-white/90 hover:text-white transition-colors"
              >
                eterlab.
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
