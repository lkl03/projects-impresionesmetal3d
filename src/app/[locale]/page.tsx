import {use} from 'react';
import {setRequestLocale} from 'next-intl/server';
import Hero from '../components/site/Hero';
import About from '../components/site/About';
import Services from '../components/site/Services';
import WorkGallery from '../components/site/WorkGallery';
import Faq from '../components/site/Faq';
import Contact from '../components/site/Contact';
import Footer from '../components/site/Footer';

export default function HomePage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = use(params);
  setRequestLocale(locale);

  return (
    <main>
      <Hero />
      <Services />
      <WorkGallery />
      <Faq />
      <Footer />
    </main>
  );
}