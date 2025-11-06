import  React from "react";


import HeroAyuda from "@/components/sections/ayuda/HeroAyuda";
import BuscadorAyuda from "@/components/sections/ayuda/BuscadorAyuda";
import CategoriasAyuda from "@/components/sections/ayuda/CategoriasAyuda";
import FAQAyuda from "@/components/sections/ayuda/FAQAyuda";
import SoporteRapido from "@/components/sections/ayuda/SoporteRapido";

export default function AyudaPage() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10 space-y-10">
        <HeroAyuda />
        <BuscadorAyuda />
        <CategoriasAyuda />
        <FAQAyuda />
        <SoporteRapido />
      </div>
    </>
  );
}
