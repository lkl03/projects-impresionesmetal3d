import * as React from 'react';
import { cn } from '@/app/lib/cn';

type Variant = 'primary' | 'secondary';
type Context = 'dark' | 'light';

type CommonProps = {
  variant?: Variant;
  context?: Context; // NEW
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButtonProps =
  CommonProps &
  { asChild?: false } &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonAsLinkProps =
  CommonProps &
  { asChild: true } &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export function Button(props: ButtonProps) {
  const {
    asChild,
    variant = 'primary',
    context = 'dark',
    className,
    children,
    ...rest
  } = props;

  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm sm:text-base font-medium ' +
    'transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/60 ' +
    'active:translate-y-[1px]';

  // Swap on hover:
  // - primary <-> secondary
  // Supports contexts:
  // - dark: for hero/video (white + transparent white)
  // - light: for white backgrounds (brand-navy + outline brand-navy)
  const variants: Record<Context, Record<Variant, string>> = {
    dark: {
      primary: [
        'bg-white text-brand-navy border border-transparent',
        'shadow-[0_12px_30px_rgba(0,0,0,0.18)]',
        // hover -> secondary
        'hover:bg-transparent hover:text-white hover:border-white/70',
        'hover:shadow-none'
      ].join(' '),
      secondary: [
        'bg-transparent text-white border border-white/70',
        // hover -> primary
        'hover:bg-white hover:text-brand-navy hover:border-transparent',
        'hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)]'
      ].join(' ')
    },
    light: {
      primary: [
        'bg-brand-navy text-white border border-transparent',
        'shadow-[0_12px_30px_rgba(0,0,0,0.10)]',
        // hover -> secondary (outline)
        'hover:bg-transparent hover:text-brand-navy hover:border-brand-navy/50',
        'hover:shadow-none'
      ].join(' '),
      secondary: [
        'bg-transparent text-brand-navy border border-brand-navy/50',
        // hover -> primary (filled)
        'hover:bg-brand-navy hover:text-white hover:border-transparent',
        'hover:shadow-[0_12px_30px_rgba(0,0,0,0.10)]'
      ].join(' ')
    }
  };

  const classes = cn(base, variants[context][variant], className);

  if (asChild) {
    return (
      <a
        className={classes}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  const buttonRest = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      type={buttonRest.type ?? 'button'}
      className={classes}
      {...buttonRest}
    >
      {children}
    </button>
  );
}



