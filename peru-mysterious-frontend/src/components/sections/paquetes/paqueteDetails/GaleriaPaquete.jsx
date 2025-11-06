// src/components/paquetes/paqueteDetails/GaleriaPaquete.jsx
import Image from "next/image";

export default function GaleriaPaquete({ imagenPrincipal, imagenes = [] }) {
  // Simple, rápido y accesible (sin dependencias). 1 grande + 3 miniaturas.
  const thumbs = imagenes.slice(0, 3);
  return (
    <section aria-label="Galería" className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow md:col-span-2">
        <Image src={imagenPrincipal} alt="Imagen del paquete" fill className="object-cover" />
      </div>

      <div className="grid grid-rows-3 gap-3">
        {thumbs.map((src, i) => (
          <div key={i} className="relative h-24 md:h-24 rounded-xl overflow-hidden shadow">
            <Image src={src} alt={`Imagen ${i + 2} del paquete`} fill className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
