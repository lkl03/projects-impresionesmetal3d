export type Locale = 'es' | 'en';

export const SECTION_IDS = {
  es: {
    home: 'inicio',
    about: 'nosotros',
    services: 'servicios',
    work: 'trabajos',
    faq: 'faq',
    contact: 'contacto'
  },
  en: {
    home: 'home',
    about: 'about',
    services: 'services',
    work: 'work',
    faq: 'faq',
    contact: 'contact'
  }
} as const;

export function getSectionIds(locale: string) {
  const key = (locale === 'en' ? 'en' : 'es') as Locale;
  return SECTION_IDS[key];
}

export function hash(id: string) {
  return `#${id}`;
}
