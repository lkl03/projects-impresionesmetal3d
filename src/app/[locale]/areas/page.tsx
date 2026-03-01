import { use } from 'react';
import { setRequestLocale } from 'next-intl/server';
import AreasGallery from '../../../app/components/site/AreasGallery';

export default function AreasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return <AreasGallery />;
}