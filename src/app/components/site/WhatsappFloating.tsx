'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/app/lib/cn';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12.05 2.02A9.94 9.94 0 0 0 2.1 11.97c0 1.76.46 3.48 1.34 5L2 22l5.2-1.36a9.98 9.98 0 0 0 4.85 1.25h.01A9.94 9.94 0 0 0 22 11.97 9.95 9.95 0 0 0 12.05 2.02Zm0 18.08h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.08.8.82-3.0-.2-.32a8.16 8.16 0 1 1 6.95 3.85Zm4.77-6.14c-.26-.13-1.52-.75-1.76-.84-.23-.09-.4-.13-.57.13-.17.26-.65.84-.8 1.01-.15.17-.29.2-.55.07-.26-.13-1.08-.4-2.06-1.28-.76-.68-1.27-1.52-1.42-1.78-.15-.26-.02-.4.11-.53.12-.12.26-.29.39-.44.13-.15.17-.26.26-.44.09-.17.04-.33-.02-.46-.07-.13-.57-1.37-.78-1.88-.2-.48-.4-.41-.57-.42h-.48c-.17 0-.46.07-.7.33-.24.26-.91.89-.91 2.17 0 1.28.93 2.52 1.06 2.69.13.17 1.83 2.8 4.43 3.92.62.27 1.11.43 1.49.55.63.2 1.2.17 1.65.1.5-.07 1.52-.62 1.74-1.22.22-.6.22-1.11.15-1.22-.07-.11-.24-.17-.5-.3Z" />
    </svg>
  );
}

export default function WhatsAppFloating() {
  const t = useTranslations('WhatsAppFloat');

  const whatsappHref =
    'https://wa.me/5491133647947?text=Hola!%20Vengo%20de%20la%20web%20de%20Bioprotece.%20Estoy%20interesado%20en...';

  // ✅ z debajo del lightbox (work gallery usa z-[80]), pero arriba del header (z-50)
  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noreferrer"
      className={cn(
        'fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-[70]',
        'select-none cursor-pointer',
        'inline-flex items-center gap-3',
        'rounded-full px-4 py-3 sm:px-5',
        'shadow-[0_14px_40px_rgba(0,0,0,0.18)]',
        'transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/60',
        // WhatsApp green (oficial aprox)
        'bg-[#25D366] text-white',
        'mb-[14px] sm:mb-0'
      )}
      aria-label={t('aria')}
    >
      <span
        className={cn(
          'grid place-items-center rounded-full',
          'h-9 w-9 sm:h-10 sm:w-10',
          'bg-white/15'
        )}
        aria-hidden="true"
      >
        {/* ✅ icono más chico */}
        <WhatsAppIcon className="h-5 w-5 sm:h-5 sm:w-5" />
      </span>

      <span className="leading-tight">
        <span className="block text-sm sm:text-[0.95rem] font-semibold">
          {t('title')}
        </span>
        <span className="block text-xs sm:text-sm text-white/90">
          {t('subtitle')}
        </span>
      </span>
    </a>
  );
}
