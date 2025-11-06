// src/pages/Home.jsx

import HeroSection from '@/components/sections/home/HeroSection';
import DestinosPopulares from '@/components/sections/home/DestinosPopulares';
import ToursDestacados from '@/components/sections/home/ToursDestacados';
import WhyChooseUs from '@/components/sections/home/WhyChooseUs';
import Testimonios from '@/components/sections/home/Testimonios';
import { Certificaciones } from '@/components/sections/home/Certificaciones';
import { FinalCta } from '@/components/sections/home/FinalCta';

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