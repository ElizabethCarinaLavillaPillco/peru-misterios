// src/pages/Home.jsx

import HeroSection from '@/components/home/HeroSection';
import DestinosPopulares from '@/components/home/DestinosPopulares';
import ToursDestacados from '@/components/home/ToursDestacados';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import Testimonios from '@/components/home/Testimonios';
import { Certificaciones } from '@/components/home/Certificaciones';
import { FinalCta } from '@/components/home/FinalCta';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection 
        background={{
          src: "/images/Machupicchu.jpg",
          alt: "Machu Picchu",
          fallback: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1920&q=80"
        }}
      />

      {/* Destinos Populares */}
      <DestinosPopulares 
        background={{
          type: "image",
          src: "/images/Machupicchu4.jpg"
        }}
      />

      {/* Tours Destacados */}
      <ToursDestacados />

      {/* Por qué elegirnos */}
      <WhyChooseUs />

      {/* Testimonios */}
      <Testimonios />

      {/* Certificaciones */}
      <Certificaciones />

      {/* CTA Final */}
      <FinalCta />
    </div>
  );
}