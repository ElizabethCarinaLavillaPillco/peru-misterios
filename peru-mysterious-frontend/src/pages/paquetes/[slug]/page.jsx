// app/paquetes/[slug]/page.jsx
import  React from "react";
import DetallesPaquete from "@/components/sections/paquetes/paqueteDetails/DetallesPaquete";
import ResumenReserva from "@/components/sections/paquetes/paqueteDetails/ResumenReserva";

// --- MOCK de datos: reemplaza estas funciones por fetch a tu API, CMS o lectura de JSON ---
async function getAllPaquetes() {
  // Ejemplo mínimo con slugs. Reemplaza por tu fuente real.
  return [
    {
      slug: "camino-inca",
      titulo: "Camino Inca Clásico a Machu Picchu",
    },
    {
      slug: "arequipa-aventura",
      titulo: "Arequipa Aventura",
    },
  ];
}

async function getPaqueteBySlug(slug) {
  // Aquí retornamos el mismo mock que ya tenías cuando el slug coincide.
  if (slug === "camino-inca") {
    return {
      slug: "camino-inca",
      titulo: "Camino Inca Clásico a Machu Picchu",
      ciudad: "Cusco",
      categoria: "aventura",
      rating: 4.9,
      duracion: "4 días / 3 noches",
      imagenPrincipal: "/img/paquetes/camino-inca.jpg",
      imagenes: [
        "/img/paquetes/camino-inca-2.jpg",
        "/img/paquetes/camino-inca-3.jpg",
        "/img/paquetes/camino-inca-4.jpg",
      ],
      incluye: [
        "Guía certificado",
        "Entradas a Machu Picchu",
        "Traslados",
        "Alojamiento",
        "Desayunos",
      ],
      noIncluye: ["Vuelos internacionales", "Propinas", "Cenas"],
      queLlevar: [
        "Pasaporte",
        "Ropa cómoda",
        "Bloqueador",
        "Impermeable",
        "Zapatillas de trekking",
      ],
      itinerario: [
        {
          titulo: "Día 1: Cusco – Km82 – Wayllabamba",
          descripcion:
            "Reunión con el guía, traslado al Km82 e inicio de caminata.",
          hitos: ["Recojo del hotel", "Ingreso al control", "Almuerzo andino"],
          comida: "Almuerzo/Cena",
          alojamiento: "Campamento",
        },
        {
          titulo: "Día 2: Wayllabamba – Pacaymayo",
          descripcion:
            "Ascenso al Abra Warmiwañusca con vistas panorámicas.",
          hitos: ["Desayuno energizante", "Cima del abra", "Cena en campamento"],
          comida: "Desayuno/Almuerzo/Cena",
          alojamiento: "Campamento",
        },
        {
          titulo: "Día 3: Pacaymayo – Wiñaywayna",
          descripcion:
            "Visita Runkurakay, Sayacmarca y Phuyupatamarca.",
          hitos: ["Sitios arqueológicos", "Fotografías", "Charla del guía"],
          comida: "Desayuno/Almuerzo/Cena",
          alojamiento: "Campamento",
        },
        {
          titulo: "Día 4: Wiñaywayna – Machu Picchu – Cusco",
          descripcion:
            "Salida temprano a Inti Punku y tour guiado en Machu Picchu.",
          hitos: ["Amanecer en Inti Punku", "Tour guiado", "Retorno a Cusco"],
          comida: "Desayuno",
          alojamiento: "—",
        },
      ],
      waypoints: [
        { name: "Cusco", lat: -13.532, lng: -71.967 },
        { name: "Km82", lat: -13.241, lng: -72.568 },
        { name: "Wayllabamba", lat: -13.236, lng: -72.564 },
        { name: "Machu Picchu", lat: -13.163, lng: -72.545 },
      ],
      previewImg: "/img/mapas/camino-inca-preview.jpg",
    };
  }

  // Si no existe el slug, retorna null
  return null;
}
// --- FIN MOCK ---

// Required when `output: "export"` para que Next sepa qué rutas dinámicas generar.
export async function generateStaticParams() {
  const paquetes = await getAllPaquetes();
  // devolver [{ slug: 'camino-inca' }, ...]
  return paquetes.map((p) => ({ slug: p.slug }));
}

// Página que recibe params (use `params.slug` para cargar el paquete)
export default async function PaqueteDetallePage({ params }) {
  const { slug } = params;

  // Trae datos por slug (reemplaza por fetch real)
  const data = await getPaqueteBySlug(slug);

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
        <h1 className="text-2xl font-semibold">Paquete no encontrado</h1>
        <p>El paquete con slug <strong>{slug}</strong> no existe.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10 grid lg:grid-cols-[1fr_360px] gap-8">
      <main>
        <DetallesPaquete data={data} />
      </main>

      <aside>
        <ResumenReserva
          precioBase={795}
          noches={4}
          viajeros={2}
          extras={[{ nombre: "Seguro de viaje", precio: 120 }]}
        />
      </aside>
    </div>
  );
}
