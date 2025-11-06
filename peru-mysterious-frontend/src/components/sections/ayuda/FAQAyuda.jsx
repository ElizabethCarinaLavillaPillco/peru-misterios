// components/sections/ayuda/FAQAyuda.jsx
import  React from "react";
import { IoChevronDown } from "react-icons/io5";

/* ===== Data ===== */
const FAQS = [
  { id: "faq-reserva", q: "¿Cómo reservo un tour?", a: "Elige tu destino y fecha, completa tus datos y confirma. Te enviaremos un correo con el resumen y formas de pago. También puedes escribirnos por WhatsApp para asistencia." },
  { id: "faq-pago", q: "¿Qué medios de pago aceptan?", a: "Aceptamos tarjetas de crédito/débito (Visa, MasterCard), transferencias bancarias en Perú y pagos vía Yape/Plin según disponibilidad del operador." },
  { id: "faq-cancel", q: "¿Cuál es la política de cancelación?", a: "Hasta 7 días antes del inicio: reembolso del 80%. Entre 7 y 3 días: 50%. Menos de 72h: no reembolsable. Algunos tickets (ej. ingreso a Machu Picchu) no son reembolsables." },
  { id: "faq-equipaje", q: "¿Qué debo llevar a Machu Picchu o trekkings?", a: "Documento de identidad, protector solar, agua, poncho para lluvia, zapatillas de trekking, dinero en efectivo para compras locales y tickets/boletos impresos o digitales." },
  { id: "faq-idiomas", q: "¿Los tours incluyen guía en otros idiomas?", a: "Sí, ofrecemos guías en español e inglés. Otros idiomas bajo solicitud y disponibilidad (francés, portugués, alemán)." },
];

/* ===== Item (contraste forzado) ===== */
function Item({ item, open, onToggle, highlight }) {
  const panelRef = useRef(null);
  const [maxH, setMaxH] = useState(open ? "9999px" : "0px");
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (!panelRef.current) return;
    if (open) {
      const h = panelRef.current.scrollHeight;
      requestAnimationFrame(() => setMaxH(`${h + 24}px`));
    } else {
      setMaxH("0px");
    }
  }, [open, item.a]);

  useEffect(() => {
    if (!highlight) return;
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 1200);
    const el = document.getElementById(item.id);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    return () => clearTimeout(t);
  }, [highlight, item.id]);

  const btnId = `btn-${item.id}`;
  const panelId = `panel-${item.id}`;

  return (
    <div
      id={item.id}
      className={`
        relative overflow-hidden rounded-2xl transition-colors
        border shadow-sm bg-white text-pm-black border-black/10
        ${open ? "border-pm-gold/40" : ""}
        ${flash ? "ring-2 ring-pm-gold/70" : ""}
      `}
    >
      {open && (
        <span aria-hidden="true" className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-pm-gold/90 to-pm-gold/40" />
      )}

      <button
        id={btnId}
        aria-controls={panelId}
        aria-expanded={open}
        onClick={onToggle}
        className="
          group w-full flex items-center justify-between gap-4
          px-5 py-4 text-left
          focus:outline-none focus:ring-2 focus:ring-pm-gold/70 focus:ring-offset-2 focus:ring-offset-white
        "
      >
        <span className="text-base sm:text-lg font-extrabold leading-snug !text-pm-black">
          {item.q}
        </span>
        <IoChevronDown
          className={`h-5 w-5 shrink-0 text-pm-gold transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        ref={panelRef}
        style={{ maxHeight: maxH }}
        className="overflow-hidden transition-[max-height] duration-300 ease-out"
      >
        <div className="px-5 pb-5 text-[15px] sm:text-base leading-relaxed text-gray-700">
          {item.a}
        </div>
      </div>
    </div>
  );
}

/* ===== Componente principal ===== */
export default function FAQAyuda() {
  const defaultOpen = useMemo(() => new Set(FAQS.slice(0, 2).map((i) => i.id)), []);
  const [openIds, setOpenIds] = useState(defaultOpen);
  const [hash, setHash] = useState("");

  useEffect(() => {
    const applyHash = () => {
      const raw = window.location.hash.replace("#", "");
      setHash(raw);
      if (!raw) return;
      setOpenIds((prev) => {
        const next = new Set(prev);
        next.add(raw);
        return next;
      });
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const toggle = (id) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const expandAll = () => setOpenIds(new Set(FAQS.map((i) => i.id)));
  const collapseAll = () => setOpenIds(new Set());

  return (
    <section
      id="faq"
      className="
        space-y-5 text-pm-black
        selection:bg-pm-gold selection:text-black
      "
    >
      <header>
        <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight text-pm-black">
          Preguntas frecuentes
        </h2>
        <p className="mt-1 text-sm sm:text-[15px] text-gray-700">
          Encuentra respuestas rápidas sobre reservas, pagos, políticas y más.
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={expandAll}
            className="
              rounded-full px-3 py-1.5 text-xs sm:text-sm font-semibold
              bg-pm-gold text-black hover:brightness-105
              focus:outline-none focus:ring-2 focus:ring-pm-gold/70
            "
          >
            Expandir todo
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="
              rounded-full px-3 py-1.5 text-xs sm:text-sm font-semibold
              border bg-white text-pm-black border-black/10 hover:bg-black/5
              focus:outline-none focus:ring-2 focus:ring-pm-gold/70
            "
          >
            Contraer todo
          </button>
        </div>
      </header>

      <div className="grid gap-3">
        {FAQS.map((i) => (
          <Item
            key={i.id}
            item={i}
            open={openIds.has(i.id)}
            onToggle={() => toggle(i.id)}
            highlight={hash === i.id}
          />
        ))}
      </div>
    </section>
  );
}
