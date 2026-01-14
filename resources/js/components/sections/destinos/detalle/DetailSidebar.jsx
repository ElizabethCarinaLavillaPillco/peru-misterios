import React from 'react';
import { useMemo, useState } from "react";
import { IoPricetagOutline, IoPeopleOutline, IoCalendarOutline, IoStar } from "react-icons/io5";

const PEN = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  maximumFractionDigits: 0,
});

export default function DetailSidebar({
  item = {},
  onAdd,                 // opcional: callback cuando agrega al carrito/paquetes
  onReserve,             // opcional: callback reservar directo
}) {
  const {
    precio = 0,
    cupos = 4,
    fechaProxima = "15 de agosto",
    mapaUrl,             // opcional: URL de Google Maps
    ciudad = "",
  } = item;

  // UI state
  const [personas, setPersonas] = useState(2);
  const [fecha, setFecha] = useState(""); // YYYY-MM-DD (si quieres precargar, pásalo por props)

  const total = useMemo(() => Math.max(1, personas) * (Number(precio) || 0), [personas, precio]);

  return (
    <aside
      className="
        rounded-2xl border border-amber-200/60 bg-white shadow-sm p-4
        font-metropolis
      "
      aria-label="Resumen y acciones del paquete"
    >
      {/* Precio y controles */}
      <section className="rounded-xl border border-amber-200/60 p-4">
        <p className="text-xs uppercase tracking-wide text-pm-gray-dark/80">Total estimado</p>
        <div className="mt-1 flex items-baseline gap-2">
          <p className="font-russo text-3xl tracking-wide text-pm-black">{PEN.format(total)}</p>
          <span className="text-xs text-pm-gray-dark/80">Impuestos incluidos</span>
        </div>

        {/* Controles rápidos */}
        <div className="mt-4 grid grid-cols-1 gap-3">
          <label className="flex items-center justify-between rounded-xl border border-amber-200/60 bg-white px-3 py-2">
            <span className="flex items-center gap-2 text-sm text-pm-black">
              <IoPeopleOutline size={18} />
              Personas
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPersonas((n) => Math.max(1, n - 1))}
                className="h-8 w-8 rounded-full border border-amber-200/60 text-pm-black hover:bg-amber-50"
                aria-label="Disminuir personas"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                value={personas}
                onChange={(e) => setPersonas(Math.max(1, Number(e.target.value) || 1))}
                className="w-12 text-center outline-none"
                aria-label="Cantidad de personas"
              />
              <button
                type="button"
                onClick={() => setPersonas((n) => n + 1)}
                className="h-8 w-8 rounded-full border border-amber-200/60 text-pm-black hover:bg-amber-50"
                aria-label="Aumentar personas"
              >
                +
              </button>
            </div>
          </label>

          <label className="flex items-center justify-between rounded-xl border border-amber-200/60 bg-white px-3 py-2">
            <span className="flex items-center gap-2 text-sm text-pm-black">
              <IoCalendarOutline size={18} />
              Fecha
            </span>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="rounded-md border border-amber-200/60 px-2 py-1 text-sm outline-none"
              aria-label="Seleccionar fecha"
            />
          </label>
        </div>

        {/* CTA principal */}
        <button
          onClick={() => (onAdd ? onAdd({ ...item, personas, fecha, total }) : null)}
          className="
            mt-3 w-full rounded-full
            bg-[var(--pm-gold,#E5A400)] px-5 py-2.5
            text-sm font-bold text-black shadow hover:brightness-110
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A400]/60
            transition
          "
        >
          Agregar a tus paquetes
        </button>

        {/* Info de disponibilidad */}
        <div className="mt-4 rounded-lg bg-[#FFF9E8] p-3 text-sm text-pm-black border border-amber-200/60">
          <p>
            Quedan <b>{cupos}</b> cupos para el <b>{fechaProxima}</b> {ciudad ? `en ${ciudad}` : ""}.
          </p>
          <p className="mt-1 text-pm-gray-dark/90">
            Pago 100% seguro: tarjeta, Yape o transferencia.
          </p>
        </div>
      </section>

      {/* Opiniones */}
      <section className="mt-6 rounded-xl border border-amber-200/60 p-4">
        <p className="font-semibold text-pm-black">Opiniones de viajeros</p>
        <div className="mt-3 flex gap-3">
          <div className="h-10 w-10 rounded-full bg-amber-100 grid place-items-center font-bold text-pm-black">
            C
          </div>
          <div className="text-sm">
            <p className="font-medium text-pm-black">Carolina S. · España</p>
            <div className="mt-0.5 flex items-center gap-1 text-[#E9A500]">
              {Array.from({ length: 5 }).map((_, i) => (
                <IoStar key={i} size={14} />
              ))}
            </div>
            <p className="mt-1 text-pm-gray-dark/90">
              "Una experiencia inolvidable. Nuestro guía fue muy amable y conocedor."
            </p>
          </div>
        </div>
      </section>

      

      {/* Mapa */}
      <section className="mt-6 overflow-hidden rounded-xl border border-amber-200/60">
        <div className="h-48 bg-gradient-to-br from-white to-amber-50 grid place-content-center text-pm-gray-dark/80">
          Mapa{ciudad ? ` · ${ciudad}` : ""}
        </div>
        <a
          href={mapaUrl || "#"}
          target={mapaUrl ? "_blank" : undefined}
          rel={mapaUrl ? "noopener noreferrer" : undefined}
          className="
            m-3 block w-auto rounded-full border border-pm-gold px-5 py-2 text-center
            text-sm font-semibold text-pm-gold hover:bg-pm-gold hover:text-black transition
          "
        >
          Ver en el mapa
        </a>
      </section>

      {/* CTA secundaria: reservar */}
      <button
        onClick={() => (onReserve ? onReserve({ ...item, personas, fecha, total }) : null)}
        className="
          mt-3 w-full rounded-full bg-stone-900 px-5 py-2.5
          text-sm font-bold text-white hover:bg-stone-950
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/50
          transition
        "
      >
        Reservar ahora
      </button>

      {/* Info de precio base */}
      <div className="mt-3 flex items-center gap-2 text-xs text-pm-gray-dark/80">
        <IoPricetagOutline size={16} />
        <span>
          Precio base por persona: <b>{PEN.format(precio)}</b>
        </span>
      </div>
    </aside>
  );
}
