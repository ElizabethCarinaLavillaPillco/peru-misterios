import  React from "react";
import HotelHeader from "@/components/hotels/HotelHeader";
import HotelSection from "@/components/hotels/HotelSection";
import RoomCard from "@/components/hotels/RoomCard";
import MapEmbed from "@/components/hotels/MapEmbed";

import { IoCheckmarkCircleOutline, IoAlertCircleOutline } from "react-icons/io5";


export default function CuscoPage() {
  const rooms = [
    {
      name: "Habitación Simple",
      type: "Simple",
      images: [
        "https://www.perumysterious.com/wp-content/uploads/2024/10/Simple.webp",
      ],
      priceUSD: 90,
      size: "35 m²",
      bedType: "King",
      occupancy: "1 huésped",
      hasPrivateBathroom: true,
      hasTV: true,
      includesBreakfast: true,
      includes: ["Desayuno", "Wi-Fi", "Baño privado", "TV"],
    },
    {
      name: "Habitación Doble",
      type: "Doble",
      images: [
        "https://www.perumysterious.com/wp-content/uploads/2024/10/Doble.webp",
      ],
      priceUSD: 120,
      bedType: "queen",
      occupancy: "2 huéspedes",
      hasPrivateBathroom: true,
      hasTV: true,
      includesBreakfast: true,
      includes: ["Wifi gratis", "Agua caliente", "Toallas", "TV"],
    },
    {
      name: "Habitación Triple",
      type: "Triple",
      images: [
        "https://www.perumysterious.com/wp-content/uploads/2024/10/Triple.webp",
      ],
      priceUSD: 150,
      bedType: "Queen",
      occupancy: "3 Huéspedes",
       hasPrivateBathroom: true,
      hasTV: true,
      includesBreakfast: true,
      includes: ["Desayuno", "Wi-Fi", "Calefacción", "TV", "Ducha Caliente"],
    },
    {
      name: "Habitación Matrimonial",
      type: "Matrimonial",
      images: [
        "https://www.perumysterious.com/wp-content/uploads/2024/10/Matrimonial.webp",
        "https://www.perumysterious.com/wp-content/uploads/2024/10/Triple.webp",
        "https://www.perumysterious.com/wp-content/uploads/2024/10/Doble.webp",
      ],
      priceUSD: 200,
      bedType: "Queen",
      occupancy: "2 Huéspedes",
       hasPrivateBathroom: true,
      hasTV: true,
      includesBreakfast: true,
      includes: ["Desayuno", "Wi-Fi", "Calefacción", "TV", "Ducha Caliente"],
    },
    {
      name: "Dormitorio",
      type: "Simple",
      images: [
        "https://www.perumysterious.com/wp-content/uploads/2024/10/Matrimonial.webp",
      ],
      priceUSD: 60,
      bedType: "Queen",
      occupancy: "1 Huésped",
       hasPrivateBathroom: true,
      hasTV: true,
      includesBreakfast: true,
      includes: ["Desayuno", "Wi-Fi", "Calefacción", "TV", "Ducha Caliente"],
    },
  ];

  return (
    <main className="bg-[#FFF4D1] text-neutral-900">
      <HotelHeader
        variant="light"
        city="Cusco"
        subtitle="Historia, cultura y confort a pasos del Centro Histórico."
        coverUrl="https://38.media.tumblr.com/2db4e409286506dfda2ee9724745f6cc/tumblr_nr8vn7n3Lw1qza2pqo1_1280.gif"
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
            description="Opciones pensadas para viajeros que buscan comodidad con encanto local."
          >
            {/* 🔁 Flex wrap + centro */}
            <div className="flex flex-wrap justify-center gap-6">
              {rooms.map((r, i) => (
                // ancho consistente por tarjeta
                <div key={i} className="card w-full sm:max-w-[22rem]">
                  <RoomCard {...r} />
                </div>
              ))}
            </div>
          </HotelSection>
        </div>

      {/* Sobre el hotel */}
      {/* Sobre el hotel */}
<div className="animate-fade-up">
  <HotelSection
    variant="light"
    id="about"
    title="Sobre el hotel"
    description="Casona restaurada que combina detalles coloniales con servicios modernos."
  >
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Columna izquierda: contenido (ocupa más espacio) */}
      <div className="lg:col-span-2 rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-800">
        <p className="mb-6 leading-relaxed">
          Nuestro hostal combina el encanto del Cusco histórico con comodidades
          actuales: habitaciones luminosas, detalles en madera y un equipo siempre
          dispuesto a ayudarte.
        </p>

        {/* Servicios básicos */}
        <h3 className="text-lg font-extrabold text-amber-700 mb-3">Servicios incluidos</h3>
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 mb-6">
          <li>✔ Recepción 24/7</li>
          <li>✔ Traslado al aeropuerto (bajo solicitud)</li>
          <li>✔ Custodia de equipaje</li>
          <li>✔ Té de coca de cortesía</li>
        </ul>

        {/* Servicios complementarios */}
        <h3 className="text-lg font-extrabold text-amber-700 mb-3">
          Servicios complementarios
        </h3>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm">
          {[
            "Wi-fi de alta velocidad",
            "TV cable con pantalla plana LED Full HD",
            "Calefactor (a pedido)",
            "Baño privado y agua caliente las 24 hrs.",
            "Secadora de cabello (a pedido)",
            "Room service",
            "Camas hoteleras",
            "Wi-Fi en todo el Hostal",
            "Recepción las 24 hrs",
            "Personal Bilingüe",
            "Desayuno buffet, americano y continental",
            "Storage (custodia de equipaje gratuito)",
            "Internet e impresión de boarding pass",
            "Asistencia con información turística",
            "Snacks",
            "Llamadas nacionales gratuitas",
            "Comedor a disposición",
            "Servicio médico (a pedido)",
            "Habitaciones de no fumadores (Ley 29517)",
          ].map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2 rounded-lg border border-neutral-200/70 bg-white/60 p-2 hover:border-amber-300 hover:bg-amber-50/60 transition"
            >
              <span className="text-amber-500 font-bold">✔</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Columna derecha: imagen más compacta */}
      <div className="relative">
        <div className="overflow-hidden rounded-xl border border-amber-400 shadow-md">
          <img
            src="https://tse3.mm.bing.net/th/id/OIP.DJhApXsAWCLmGCis0XMMJgHaLF?rs=1&pid=ImgDetMain&o=7&rm=3"
            alt="Ambientes del hostal en Cusco"
            className="aspect-[4/8] w-full object-cover"  // 👈 más vertical y compacto
            loading="lazy"
          />
          <div className="absolute bottom-2 left-2 rounded-md bg-white/90 px-2 py-1 text-xs font-semibold text-neutral-800 shadow">
            Ambientes del hostal
          </div>
        </div>
      </div>
    </div>
  </HotelSection>
</div>

      {/* Mapa */}
      <div className="animate-fade-up">
        <HotelSection variant="light" id="map" title="Ubicación">
          <MapEmbed src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3727.8206585020826!2d-71.97877682509717!3d-13.513602886853839!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x916dd672cdfacffd%3A0x5de1c7cd25c57811!2sHOSTAL%20CUSCO%20INTERNACIONAL!5e1!3m2!1ses!2spe!4v1755622779278!5m2!1ses!2spe" />
        </HotelSection>
      </div>

      {/* CTA reserva */}
      {/* CTA reserva */}
<div className="animate-fade-up">
  <HotelSection variant="light" id="reserva" title="¿Listo para reservar?">
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-6">
      {/* Texto resumido */}
      <p className="text-neutral-700 leading-relaxed">
        Todas las reservas deben realizarse vía correo electrónico a nuestra
        central de reservas{" "}
        <a
          href="mailto:internationalhouse202@gmail.com"
          className="font-semibold text-amber-700 hover:underline"
        >
          internationalhouse202@gmail.com
        </a>
        . Cada solicitud será confirmada por escrito, indicando el estado, fecha
        límite de pago y condiciones según temporada.
      </p>

      {/* Políticas resumidas */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
          <h3 className="font-bold text-amber-700 mb-2 text-sm uppercase">
            FITs (1–5 habitaciones)
          </h3>
          <p className="text-sm text-neutral-700">
            Reconfirmación y pago con{" "}
            <span className="font-semibold">10 días</span> de anticipación +
            lista de pasajeros. De no cumplirse, la reserva será anulada.
          </p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
          <h3 className="font-bold text-amber-700 mb-2 text-sm uppercase">
            Grupos (6+ habitaciones)
          </h3>
          <p className="text-sm text-neutral-700">
            Pre-pago del{" "}
            <span className="font-semibold">50% con 45 días</span> de
            anticipación. Lista final + saldo pendiente antes de los 30 días.  
            Cancelaciones entre 30–20 días: penalidad de 1 noche por habitación.
          </p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
          <h3 className="font-bold text-amber-700 mb-2 text-sm uppercase">
            Último minuto
          </h3>
          <p className="text-sm text-neutral-700">
            Solicitudes a partir de{" "}
            <span className="font-semibold">10 días antes</span> del arribo
            quedan sujetas a disponibilidad. Pueden cancelarse sin penalidad en
            las primeras 48h.
          </p>
        </div>
      </div>

      {/* CTA botones */}
        <div className="flex flex-wrap gap-3">
          <a
            href="mailto:internationalhouse202@gmail.com?subject=Reserva%20Cusco"
            className="rounded-xl bg-amber-700 px-5 py-2 font-semibold text-black transition hover:bg-amber-400"
          >
            Contactar reservas
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
