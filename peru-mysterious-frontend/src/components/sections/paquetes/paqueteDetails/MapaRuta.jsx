// src/components/paquetes/paqueteDetails/MapaRuta.jsx
import Image from "next/image";
import Link from "next/link";

/**
 * props:
 * - waypoints: [{ name: "Cusco", lat: -13.532, lng: -71.967 }, ...]
 * - previewImg: "/img/mapas/camino-inca-preview.jpg"  // opcional, para fallback visual
 */
export default function MapaRuta({ waypoints = [], previewImg }) {
  const key = process.env.NEXT_PUBLIC_MAPS_EMBED_API_KEY;
  const origin = waypoints[0];
  const destination = waypoints[waypoints.length - 1];
  const via = waypoints.slice(1, -1);

  // URL para abrir la ruta en Maps en una pestaña (funciona sin API key)
  const mapsUrl = (() => {
    const base = "https://www.google.com/maps/dir/";
    const params = waypoints.map(w => `${w.lat},${w.lng}`).join("/");
    return `${base}${params}`;
  })();

  // Embed Directions (requiere API key). Si no hay, se muestra fallback.
  const embedUrl = key && origin && destination
    ? `https://www.google.com/maps/embed/v1/directions?key=${key}&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&mode=walking${
        via.length ? "&waypoints=" + via.map(v => `${v.lat},${v.lng}`).join("|") : ""
      }`
    : null;

  return (
    <section className="mt-8">
      <h2 className="font-russo text-2xl text-[var(--pm-black,#1E1E1E)] mb-3">Mapa y ruta</h2>

      <div className="rounded-2xl border border-[var(--pm-gold,#E5A400)]/30 bg-white shadow-sm overflow-hidden">
        {embedUrl ? (
          <iframe
            title="Mapa de ruta"
            src={embedUrl}
            className="w-full h-[360px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="relative h-72">
            {/* Fallback visual (imagen de mapa pre-renderizada) */}
            {previewImg ? (
              <Image src={previewImg} alt="Vista de la ruta" fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-sm text-[var(--pm-gray-dark,#373435)]">
                <p>Agrega <code>NEXT_PUBLIC_MAPS_EMBED_API_KEY</code> para ver el mapa incrustado, o provee un <code>previewImg</code>.</p>
              </div>
            )}
          </div>
        )}

        {/* Lista de puntos */}
        <div className="p-4 grid sm:grid-cols-2 gap-3 text-sm">
          <ul className="space-y-1">
            {waypoints.map((w, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[var(--pm-gold,#E5A400)]" />
                <span className="font-semibold">{i === 0 ? "Inicio:" : i === waypoints.length - 1 ? "Fin:" : "Paso:"}</span>
                <span>{w.name}</span>
              </li>
            ))}
          </ul>

          <div className="sm:text-right">
            <Link
              href={mapsUrl}
              target="_blank"
              className="inline-flex items-center rounded-full border border-[var(--pm-gold,#E5A400)] px-4 py-2 font-bold
                         text-[var(--pm-black,#1E1E1E)] hover:bg-[var(--pm-gold,#E5A400)] hover:text-black transition"
            >
              Abrir en Google Maps
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
