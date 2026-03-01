'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/app/lib/cn';
import { getSectionIds, type Locale } from '@/app/lib/sections';

type FaqItem = {
  q: string;
  a: string;
};

function isBullet(line: string) {
  const t = line.trimStart();
  return t.startsWith('● ') || t.startsWith('• ') || t.startsWith('- ');
}

function stripBullet(line: string) {
  return line.replace(/^\s*(?:●|•|-)\s+/, '').trim();
}

function renderInlineLinks(text: string) {
  const parts: Array<string | { url: string }> = [];
  const re = /(https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+)(?!\.)/g;

  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const start = m.index;
    const url = m[1];
    if (start > last) parts.push(text.slice(last, start));
    parts.push({ url });
    last = start + url.length;
  }
  if (last < text.length) parts.push(text.slice(last));

  return parts.map((p, i) => {
    if (typeof p === 'string') return <span key={i}>{p}</span>;
    return (
      <a
        key={i}
        href={p.url}
        target="_blank"
        rel="noreferrer"
        className={cn('underline underline-offset-4', 'text-brand-blue hover:text-brand-navy')}
      >
        {p.url}
      </a>
    );
  });
}

function Answer({ text }: { text: string }) {
  const lines = useMemo(
    () =>
      text
        .split('\n')
        .map((l) => l.replace(/\s+$/g, '')),
    [text]
  );

  const blocks = useMemo(() => {
    const out: ReactNode[] = [];
    let bullets: string[] = [];

    const flushBullets = () => {
      if (!bullets.length) return;
      out.push(
        <ul key={`ul-${out.length}`} className="ml-5 list-disc space-y-1 text-ink-muted">
          {bullets.map((b, idx) => (
            <li key={idx} className="text-sm sm:text-base leading-relaxed">
              {renderInlineLinks(b)}
            </li>
          ))}
        </ul>
      );
      bullets = [];
    };

    for (const raw of lines) {
      const line = raw.trim();
      if (!line) {
        flushBullets();
        continue;
      }

      if (isBullet(line)) {
        bullets.push(stripBullet(line));
        continue;
      }

      flushBullets();

      const heading = /:\s*$/.test(line);
      out.push(
        <p
          key={`p-${out.length}`}
          className={cn(
            'text-sm sm:text-base leading-relaxed',
            heading ? 'font-semibold text-brand-navy' : 'text-ink-muted'
          )}
        >
          {renderInlineLinks(line)}
        </p>
      );
    }

    flushBullets();
    return out;
  }, [lines]);

  return <div className="space-y-3">{blocks}</div>;
}

function FaqCard({
  item,
  open,
  onToggle
}: {
  item: FaqItem;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className={cn(
        'text-left w-full rounded-2xl border border-black/5 bg-white p-6',
        'shadow-[0_10px_30px_rgba(0,0,0,0.06)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/60'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-lg font-semibold text-brand-navy leading-snug">
          {item.q}
        </h3>

        <span
          className={cn(
            'mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full',
            'bg-surface-muted text-brand-navy/80',
            'transition-transform duration-300',
            open ? 'rotate-45' : 'rotate-0'
          )}
          aria-hidden="true"
        >
          +
        </span>
      </div>

      <div
        className={cn(
          'grid transition-all duration-300',
          open ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'
        )}
      >
        <div className="overflow-hidden">
          <Answer text={item.a} />
        </div>
      </div>
    </button>
  );
}

export default function Faq() {
  const t = useTranslations('Faq');
  const locale = useLocale() as Locale;
  const ids = getSectionIds(locale);

  const items = useMemo(() => {
    const raw = t.raw('items');
    return Array.isArray(raw) ? (raw as FaqItem[]) : [];
  }, [t]);

  // ✅ una abierta a la vez
  const [active, setActive] = useState<number | null>(null);
  useEffect(() => setActive(null), [locale]);

  // ✅ Fade-in UNA vez
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

  return (
    <section id={ids.faq} className="bg-surface overflow-x-clip">
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
            <p className="text-xs uppercase tracking-[0.22em] text-brand-blue/80">{t('kicker')}</p>

            <h2 className="mt-4 font-display text-3xl sm:text-4xl font-semibold tracking-tight text-brand-navy">
              {t('title')}
            </h2>

            <p className="mt-5 text-ink-muted leading-relaxed whitespace-pre-line">{t('subtitle')}</p>
          </div>

          <div className="mt-12 sm:mt-14">
            <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
              {items.map((it, idx) => (
                <FaqCard
                  key={`${it.q}-${idx}`}
                  item={it}
                  open={active === idx}
                  onToggle={() => setActive((cur) => (cur === idx ? null : idx))}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}