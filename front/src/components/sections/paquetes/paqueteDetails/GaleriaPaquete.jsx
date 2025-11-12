// src/components/sections/paquetes/paqueteDetails/GaleriaPaquete.jsx
export default function GaleriaPaquete({ imagenPrincipal, imagenes = [] }) {
  // Simple, rápido y accesible (sin dependencias). 1 grande + 3 miniaturas.
  const thumbs = imagenes.slice(0, 3);
  
  return (
    <section aria-label="Galería" className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow md:col-span-2">
        <img 
          src={imagenPrincipal} 
          alt="Imagen principal del paquete" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-rows-3 gap-3">
        {thumbs.map((src, i) => (
          <div key={i} className="relative h-24 md:h-24 rounded-xl overflow-hidden shadow">
            <img 
              src={src} 
              alt={`Imagen ${i + 2} del paquete`} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}