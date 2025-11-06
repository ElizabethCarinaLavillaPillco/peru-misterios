import React from "react";
import HotelHeader from "@/components/hotels/HotelHeader";
import HotelSection from "@/components/hotels/HotelSection";
import RoomCard from "@/components/hotels/RoomCard";
import MapEmbed from "@/components/hotels/MapEmbed";

export default function LimaPage() {
  const rooms = [
    {
      name: "Vista Mar",
      type: "Superior",
      images: [
        "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop",
      ],
      priceUSD: 155,
      size: "30 m²",
      bedType: "King",
      occupancy: "2 adultos",
      includes: ["Desayuno buffet", "Wi-Fi", "A/C"],
    },
    {
      name: "Ejecutiva Miraflores",
      type: "Doble",
      images: [
        "https://images.unsplash.com/photo-1600607687920-4ce8c559d8df?q=80&w=1600&auto=format&fit=crop",
      ],
      priceUSD: 120,
      size: "24 m²",
      bedType: "2 Twin",
      occupancy: "2 adultos",
      includes: ["Desayuno", "Wi-Fi", "Escritorio"],
    },
    {
      name: "Familiar Costa",
      type: "Familiar",
      images: [
        "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=1600&auto=format&fit=crop",
      ],
      priceUSD: 185,
      size: "45 m²",
      bedType: "Queen + Sofá cama",
      occupancy: "3 adultos",
      includes: ["Desayuno", "Wi-Fi", "Kitchenette"],
    },
  ];

  return (
    <main className="bg-[#FFF4D1] text-neutral-900">
      <HotelHeader
        variant="light"
        city="Lima"
        subtitle="Conecta con la capital desde Miraflores, a pasos del Malecón."
        coverUrl="https://images.unsplash.com/photo-1574539472320-0f6b1a2b4a2c?q=80&w=1600&auto=format&fit=crop"
        ctas={[
          { label: "Ir al inicio", href: "/" },
          { label: "Ver habitaciones", href: "#rooms" },
          { label: "Ver mapa", href: "#map" },
        ]}
      />

      {/* Habitaciones */}
      <div className="animate-fade-up">
        <HotelSection
          variant="light"
          id="rooms"
          title="Habitaciones"
          description="Espacios modernos y luminosos pensados para viajeros de negocio y ocio."
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {rooms.map((r, i) => (
              <div key={i} className="card">
                <RoomCard {...r} />
              </div>
            ))}
          </div>
        </HotelSection>
      </div>

      {/* Servicios */}
      <div className="animate-fade-up">
        <HotelSection
          variant="light"
          id="about"
          title="Servicios destacados"
          description="Tu estadía con todo lo necesario para moverte por la ciudad."
        >
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-700">
            <ul className="grid grid-cols-1 gap-y-2 md:grid-cols-2">
              <li>✔ Desayuno buffet incluido</li>
              <li>✔ Cowork y salas de reunión</li>
              <li>✔ Traslado al aeropuerto (con costo)</li>
              <li>✔ Estacionamiento sujeto a disponibilidad</li>
            </ul>
          </div>
        </HotelSection>
      </div>

      {/* Mapa */}
      <div className="animate-fade-up">
        <HotelSection variant="light" id="map" title="Ubicación">
          <MapEmbed query="Miraflores, Lima, Peru" />
        </HotelSection>
      </div>

      {/* CTA reserva */}
      <div className="animate-fade-up">
        <HotelSection variant="light" id="reserva" title="¿Listo para reservar?">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <p className="text-neutral-700">Escríbenos y te ayudamos a elegir la mejor opción.</p>
            <div className="mt-4 flex gap-3">
              <a
                href="mailto:ventas@peru-mysterious.com?subject=Reserva%20Lima"
                className="rounded-xl bg-amber-500 px-5 py-2 font-semibold text-black transition hover:bg-amber-400"
              >
                Contactar ventas
              </a>
              <a
                href="/paquetes"
                className="rounded-xl border border-neutral-300 px-5 py-2 text-neutral-900 hover:bg-neutral-50"
              >
                Ver paquetes
              </a>
            </div>
          </div>
        </HotelSection>
      </div>
    </main>
  );
}
