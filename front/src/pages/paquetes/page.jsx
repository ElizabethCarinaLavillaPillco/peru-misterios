// app/paquetes/page.jsx
import  React from "react";

import EncabezadoPaquetes from "../../components/sections/paquetes/EncabezadoPaquetes";
import FiltroPaquetes from "../../components/sections/paquetes/FiltroPaquetes";
import PaqueteCard from "../../components/sections/paquetes/PaqueteCard";
import PlanificarViajeCta from "../../components/sections/paquetes/PlanificarViajeCta";


// Simulación de data (cámbiala por fetch/DB)
const DATA = [
  { slug: "camino-inca", titulo: "Camino Inca Clásico a Machu Picchu", dias: "4 días / 3 noches", idioma: "Español / Inglés", dificultad: "Moderado a desafiante", max: 12, desde: 795, imagen: "/img/paquetes/camino-inca.jpg", categoria: "aventura" },
  { slug: "aventura-cusco", titulo: "Aventura en Cusco", dias: "5 días / 4 noches", idioma: "Español / Inglés", dificultad: "Moderado", max: 10, desde: 850, imagen: "/img/paquetes/aventura-cusco.jpg", categoria: "aventura" },
  { slug: "misterios-selva", titulo: "Misterios de la Selva: Iquitos", dias: "6 días / 5 noches", idioma: "Español", dificultad: "Fácil", max: 15, desde: 950, imagen: "/img/paquetes/selva-iquitos.jpg", categoria: "mistico" },
];

export default function Page({ searchParams }) {
  const { q, precioMax, categoria, duracion, dificultad } = searchParams;

  // Filtro simple (ajústalo a tu lógica real)
  const items = DATA.filter(p => {
    const okQ = q ? p.titulo.toLowerCase().includes(q.toLowerCase()) : true;
    const okCat = categoria ? p.categoria === categoria : true;
    const okPrecio = precioMax ? p.desde <= Number(precioMax) : true;
    const okDif = dificultad ? p.dificultad.toLowerCase().includes(dificultad) : true;
    const okDur = duracion ? p.dias.toLowerCase().includes(duracion) : true;
    return okQ && okCat && okPrecio && okDif && okDur;
  });

  return (
    <>
      <EncabezadoPaquetes />
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        <aside className="order-2 md:order-1">
          <FiltroPaquetes />
        </aside>

        <main className="order-1 md:order-2">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(p => (
              <PaqueteCard key={p.slug} item={p} />
            ))}
          </div>

          <div className="mt-10">
            <PlanificarViajeCta />
          </div>
        </main>
      </div>
    </>
  );
}
