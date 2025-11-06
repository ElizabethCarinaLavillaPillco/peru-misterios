import { Link } from "react-router-dom";

const PEN = (n) => new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(n);

export default function ResumenReserva({ precioBase = 0, noches = 0, viajeros = 1, extras = [] }) {
  const subtotal = precioBase * viajeros;
  const extrasTotal = extras.reduce((acc, e) => acc + (e.precio ?? 0), 0);
  const total = subtotal + extrasTotal;

  return (
    <aside
      className="rounded-2xl border border-[var(--pm-gold,#E5A400)]/30 bg-white p-6 shadow-sm
                 sticky top-20"
      aria-label="Resumen de reserva"
    >
      <h2 className="font-russo text-2xl text-[var(--pm-black,#1E1E1E)]">Resumen</h2>
      <p className="mt-1 text-sm text-[var(--pm-gray-dark,#373435)]">{noches} noches • {viajeros} viajeros</p>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt>Precio base</dt>
          <dd className="font-semibold">{PEN(precioBase)} x {viajeros}</dd>
        </div>

        {extras.map((e, i) => (
          <div key={i} className="flex justify-between">
            <dt>{e.nombre}</dt>
            <dd className="font-semibold">{PEN(e.precio)}</dd>
          </div>
        ))}

        <div className="border-t border-[var(--pm-gold,#E5A400)]/30 pt-2 flex justify-between text-base">
          <dt>Total</dt>
          <dd className="font-russo text-xl text-[var(--pm-black,#1E1E1E)]">{PEN(total)}</dd>
        </div>
      </dl>

      <Link
        href="/contacto"
        className="
                  inline-flex items-center justify-center whitespace-nowrap shrink-0
                  rounded-full bg-[var(--pm-gold,#E5A400)]
                  px-4 py-2 text-sm font-bold !text-black shadow
                  hover:brightness-110 transition-colors
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pm-gold,#E5A400)]
                  min-w-[300px]
                "
      >
        Reservar ahora
      </Link>

      <p className="mt-2 text-xs text-[var(--pm-gray-dark,#373435)]">
        Sin pagos ahora. Te contactaremos para confirmar disponibilidad y personalizar tu itinerario.
      </p>
    </aside>
  );
}
