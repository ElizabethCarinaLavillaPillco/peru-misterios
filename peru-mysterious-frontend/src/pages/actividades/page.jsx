import { Link } from "react-router-dom";

export default function ActividadesIndex() {
  return (
    <main className="min-h-[70vh] bg-[#FFF4D1] text-neutral-900">
      <section className="mx-auto max-w-6xl px-4 py-12 animate-fade-up">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Actividades
            </h1>
            <p className="mt-2 text-neutral-700">
              Elige una categoría y arma tu itinerario ideal.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-white/80 px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
          >
            ← Ir al inicio
          </Link>
        </div>

        {/* tarjetas de categorías */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <CategoryCard
            title="Aventura"
            to="/paquetes/aventura"
            img="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1600&auto=format&fit=crop"
          />
          <CategoryCard
            title="Cultural"
            to="/paquetes/cultural"
            img="https://images.unsplash.com/photo-1544735716-392fea41f468?q=80&w=1600&auto=format&fit=crop"
          />
          <CategoryCard
            title="Gastronomía"
            to="/paquetes"
            img="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1600&auto=format&fit=crop"
          />
          <CategoryCard
            title="Blog"
            to="/actividades/blog"
            img="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop"
          />
        </div>
      </section>
    </main>
  );
}

function CategoryCard({ title, to, img }) {
  return (
    <Link
      to={to}
      className="card group relative overflow-hidden rounded-2xl border border-amber-200/70 bg-white/90 shadow-sm backdrop-blur transition will-change-transform hover:-translate-y-1 hover:shadow-xl"
    >
      <img
        src={img}
        alt={title}
        className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <div className="absolute bottom-0 p-5">
        <h3 className="text-2xl font-semibold text-white drop-shadow">{title}</h3>
        <span className="mt-2 inline-block rounded-full bg-amber-500 px-4 py-1 text-sm font-semibold text-black">
          Ver más →
        </span>
      </div>
    </Link>
  );
}