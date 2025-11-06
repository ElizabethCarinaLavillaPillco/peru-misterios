import React from "react";
  import { IoSearchOutline, IoClose } from "react-icons/io5";

/* ===== Base de artículos ===== */
const BASE = [
  { id: "reserva",  title: "¿Cómo reservo un tour?",          href: "#faq-reserva"  },
  { id: "pago",     title: "Medios de pago aceptados",        href: "#faq-pago"     },
  { id: "cancel",   title: "Política de cancelación",         href: "#faq-cancel"   },
  { id: "equipaje", title: "¿Qué llevar a Machu Picchu?",     href: "#faq-equipaje" },
  { id: "idiomas",  title: "Idiomas disponibles",             href: "#faq-idiomas"  },
];

/* ===== Sinónimos / palabras clave por categoría ===== */
const SYN = {
  reserva: ["reservar", "reserva", "booking", "fecha", "confirmar", "confirmación", "cambiar fecha"],
  pago: ["pagar", "tarjeta", "visa", "mastercard", "débito", "credito", "crédito", "yape", "plin", "transferencia", "efectivo", "recibo", "comprobante"],
  cancel: ["cancelar", "devolución", "reembolso", "anular", "modificar", "cambio"],
  equipaje: ["mochila", "ropa", "clima", "lluvia", "poncho", "zapatillas", "trekking"],
  idiomas: ["english", "inglés", "francés", "portugués", "alemán", "guide", "guía", "idioma"],
};

/* ===== Utilidades ===== */
const norm = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();

function scoreItem(item, queryTokens) {
  if (!queryTokens.length) return 0;
  const t = norm(item.title);
  const syn = SYN[item.id] ? SYN[item.id].map(norm) : [];
  let score = 0;

  for (const tok of queryTokens) {
    if (!tok) continue;
    if (t.includes(tok)) score += 3;            // match en título
    if (item.id.includes(tok)) score += 2;      // match en ID
    if (syn.some((s) => s.includes(tok))) score += 2; // match en sinónimos
  }
  return score;
}

/* Resalta coincidencias del query en el texto */
function Highlight({ text, query }) {
  if (!query) return <>{text}</>;
  const q = query.trim();
  try {
    const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
    const parts = text.split(re);
    return (
      <>
        {parts.map((part, i) =>
          re.test(part) ? (
            <mark key={i} className="bg-pm-gold/40 text-pm-black rounded px-0.5">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  } catch {
    return <>{text}</>;
  }
}

export default function BuscadorAyuda() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(-1);
  const [recent, setRecent] = useState([]);
  const linkRefs = useRef([]);

  /* Cargar historial reciente */
  useEffect(() => {
    try {
      const raw = localStorage.getItem("helpSearchRecent");
      if (raw) setRecent(JSON.parse(raw));
    } catch {}
  }, []);

  /* Guardar al abrir un resultado con Enter o click */
  const pushRecent = (value) => {
    const val = value.trim();
    if (!val) return;
    const next = [val, ...recent.filter((r) => r !== val)].slice(0, 6);
    setRecent(next);
    try {
      localStorage.setItem("helpSearchRecent", JSON.stringify(next));
    } catch {}
  };

  const clearRecent = () => {
    setRecent([]);
    try {
      localStorage.removeItem("helpSearchRecent");
    } catch {}
  };

  /* Tokens normalizados para ranking */
  const tokens = useMemo(() => norm(q).split(/\s+/).filter(Boolean), [q]);

  /* Resultados con ranking por relevancia */
  const results = useMemo(() => {
    if (!tokens.length) return BASE.slice(0, 4);
    const scored = BASE.map((item) => ({ item, s: scoreItem(item, tokens) }))
      .filter(({ s }) => s > 0)
      .sort((a, b) => b.s - a.s);
    return scored.map(({ item }) => item);
  }, [tokens]);

  const onKey = (e) => {
    if (!results.length) return;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        setActive((v) => (v + 1) % results.length);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        setActive((v) => (v <= 0 ? results.length - 1 : v - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (active >= 0 && linkRefs.current[active]) {
          pushRecent(q);
          linkRefs.current[active].click();
        } else if (results[0]) {
          pushRecent(q);
          window.location.assign(results[0].href);
        }
        break;
      case "Escape":
        setQ("");
        setActive(-1);
        break;
      default:
        break;
    }
  };

  const POPULARES = [
    { label: "Reservas", q: "reserva" },
    { label: "Pagos", q: "pago tarjeta" },
    { label: "Cancelaciones", q: "cancelar reembolso" },
    { label: "Equipaje", q: "equipaje trekking" },
    { label: "Idiomas", q: "idiomas guía ingles" },
  ];

  return (
    <section
      className="
        space-y-5 text-pm-black
        selection:bg-pm-gold selection:text-black
      "
      aria-label="Buscador de ayuda"
    >
      {/* Campo de búsqueda */}
      <div className="relative">
        <IoSearchOutline
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          aria-hidden="true"
        />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(-1);
          }}
          onKeyDown={onKey}
          placeholder="Busca: reserva, pagos, cancelación, equipaje…"
          aria-label="Buscar preguntas frecuentes"
          className="
            w-full rounded-2xl border border-black/10 bg-white
            pl-10 pr-12 py-3 text-pm-black placeholder:text-gray-500
            outline-none focus:ring-2 focus:ring-pm-gold/70
          "
        />
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              setActive(-1);
            }}
            aria-label="Limpiar búsqueda"
            className="
              absolute right-2.5 top-1/2 -translate-y-1/2
              grid h-8 w-8 place-items-center rounded-full
              text-gray-600 hover:text-pm-black hover:bg-black/5 transition
              focus:outline-none focus:ring-2 focus:ring-pm-gold/70
            "
          >
            <IoClose size={18} />
          </button>
        )}
      </div>

      {/* Sugerencias / estado */}
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs text-gray-700" aria-live="polite">
          {q
            ? results.length
              ? `${results.length} resultado(s) para “${q}”. Usa flechas y Enter.`
              : `Sin resultados para “${q}”.`
            : "Sugerencias rápidas:"}
        </p>

        {/* Populares */}
        {!q && (
          <div className="flex flex-wrap gap-2">
            {POPULARES.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setQ(p.q)}
                className="
                  rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold
                  hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-pm-gold/70
                "
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Historial reciente */}
      {!!recent.length && !q && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-700">Recientes:</span>
          {recent.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setQ(r)}
              className="
                rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs
                hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-pm-gold/70
              "
            >
              {r}
            </button>
          ))}
          <button
            type="button"
            onClick={clearRecent}
            className="ml-1 text-xs text-gray-600 underline-offset-2 hover:underline"
          >
            limpiar
          </button>
        </div>
      )}

      {/* Resultados como chips */}
      <div role="listbox" aria-label="Resultados" className="flex flex-wrap gap-2">
        {results.length ? (
          results.map((r, i) => (
            <a
              key={r.id}
              href={r.href}
              ref={(el) => (linkRefs.current[i] = el)}
              onClick={() => pushRecent(q)}
              role="option"
              aria-selected={active === i}
              className={`
                text-sm px-3 py-1.5 rounded-full
                border border-black/10 bg-white text-pm-black
                hover:bg-black/5 transition
                focus:outline-none focus:ring-2 focus:ring-pm-gold/70
                ${active === i ? "ring-2 ring-pm-gold/70" : ""}
              `}
            >
              <Highlight text={r.title} query={q} />
            </a>
          ))
        ) : (
          <div className="text-sm text-gray-700">
            ¿No encontraste lo que buscas? Revisa la sección completa de{" "}
            <a href="/ayuda" className="font-semibold text-pm-gold hover:underline">
              Ayuda
            </a>{" "}
            o{" "}
            <a href="#faq-contacto" className="font-semibold text-pm-gold hover:underline">
              contáctanos
            </a>
            .
          </div>
        )}
      </div>
    </section>
  );
}
