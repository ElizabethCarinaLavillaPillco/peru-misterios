// sin "use client"
import React from "react";
import { Link } from "react-router-dom";
export const metadata = {
  title: "Blog de Actividades | Perú Mysterious",
  description: "Consejos, rutas y guías para aprovechar tus actividades en Perú.",
};

const POSTS = [
  {
    slug: "trekking-cusco-basicos",
    title: "Trekking en Cusco: lo básico que debes saber",
    excerpt:
      "Altura, clima y equipo necesario para rutas clásicas como Salkantay o Choquequirao.",
    cover:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "miraflores-en-bicicleta",
    title: "Miraflores en bicicleta: malecón y parques",
    excerpt:
      "Un recorrido suave para ver los mejores atardeceres de Lima.",
    cover:
      "https://images.unsplash.com/photo-1508606572321-901ea443707f?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "mercados-gastronomicos-lima",
    title: "Mercados gastronómicos imperdibles en Lima",
    excerpt:
      "Sabores locales, frutas exóticas y tips para comer como limeño.",
    cover:
      "https://images.unsplash.com/photo-1556767576-b3f0e07cdc54?q=80&w=1600&auto=format&fit=crop",
  },
];

export default function BlogActividadesPage() {
  return (
    <main className="min-h-[70vh] bg-[#FFF4D1] text-neutral-900">
      <section className="mx-auto max-w-6xl px-4 py-12 animate-fade-up">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Blog de Actividades
            </h1>
            <p className="mt-2 text-neutral-700">
              Guías rápidas y experiencias para planear mejor tu viaje.
            </p>
          </div>
          <Link
            href="/actividades"
            className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-white/80 px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
          >
            ← Volver a Actividades
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((p) => (
            <article
              key={p.slug}
              className="card overflow-hidden rounded-2xl border border-amber-200/70 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <img src={p.cover} alt={p.title} className="h-44 w-full object-cover" />
              <div className="p-5">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-neutral-600">{p.excerpt}</p>
                <div className="mt-4">
                  <Link
                    href={`/actividades/blog/${p.slug}`}
                    className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400"
                  >
                    Leer más
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
