// peru-mysterious-frontend/src/pages/destinos/3/page.jsx
  import  React from "react"; 

import DetailHeader from "@/components/sections/destinos/detalle/DetailHeader";
import DetailGallery from "@/components/sections/destinos/detalle/DetailGallery";
import DetailTabs from "@/components/sections/destinos/detalle/DetailTabs";
import DetailSidebar from "@/components/sections/destinos/detalle/DetailSidebar";
import PlanificaViaje from "@/components/sections/destinos/PlanificaViaje";
import RelatedPosts from "@/components/sections/destinos/detalle/RelatedPosts";

const item = {
  id: 3,
  titulo: "City Tour Cusco",
  ciudad: "Cusco",
  precio: 250,
  dias: 1,
  dificultad: "Fácil",
  img: "/images/cusco.jpg",
  fotos: ["/images/cusco.jpg", "/images/laguna69.jpg", "/images/gastro.jpg", "/images/cusco.jpg"],
  resumen: "Historia viva y arquitectura inca…",
  descripcion:
    "Recorrido por Qoricancha, Sacsayhuamán, Q’enqo, Puka Pukara y Tambomachay con guía oficial.",
};

const RELATED = [
  { id: 1, titulo: "Tour Gastronómico", ciudad: "Lima", precio: 320, img: "/images/gastro.jpg", resumen: "Delicias culinarias peruanas…" },
  { id: 2, titulo: "Laguna 69 Trek", ciudad: "Huaraz", precio: 850, img: "/images/laguna69.jpg", resumen: "Aventura en la Cordillera Blanca…" },
];

export default function Page() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-[1fr_360px] gap-6">
      <div className="space-y-6">
        <DetailHeader item={item} />
        <DetailGallery fotos={item.fotos?.length ? item.fotos : [item.img]} />
        <p className="text-gray-700">{item.descripcion || item.resumen}</p>
        <DetailTabs item={item} />
        <RelatedPosts items={RELATED} />
      </div>
      <aside className="space-y-6">
        <DetailSidebar item={item} />
        <PlanificaViaje />
      </aside>
    </div>
  );
}
