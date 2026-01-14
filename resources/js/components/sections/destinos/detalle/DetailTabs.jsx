import React from 'react';
import { useEffect, useMemo, useRef, useState } from "react";

/* ---------- Subcomponentes ---------- */
function Panel({ id, labelledBy, hidden, children }) {
  return (
    <div
      id={id}
      role="tabpanel"
      aria-labelledby={labelledBy}
      hidden={hidden}
      className="p-5 md:p-6 space-y-4"
    >
      {!hidden && children}
    </div>
  );
}

function Bloque({ title, children }) {
  return (
    <section className="rounded-xl border border-amber-200/60 bg-white p-4 shadow-sm">
      <h3 className="font-russo text-pm-black text-lg tracking-wide">
        <span className="inline-block rounded-full bg-[var(--pm-gold,#E5A400)]/20 px-2 py-0.5 mr-2 align-middle" />
        <span className="align-middle">{title}</span>
      </h3>
      <div className="mt-3 text-sm leading-relaxed text-pm-gray-dark/90">{children}</div>
    </section>
  );
}

/* ---------- Tabs ---------- */
export default function DetailTabs({ item = {}, defaultTab = "itinerario" }) {
  const tabs = useMemo(
    () => [
      { id: "descripcion", label: "Descripción" },
      { id: "itinerario", label: "Itinerario" },
      { id: "incluye", label: "Incluye" },
      { id: "noincluye", label: "No incluye" },
      { id: "faqs", label: "FAQ's" },
    ],
    []
  );

  const [tab, setTab] = useState(
    tabs.find((t) => t.id === defaultTab)?.id || tabs[0].id
  );

  const listRef = useRef(null);
  const btnRefs = useRef([]);

  // Accesibilidad: mover foco con flechas
  useEffect(() => {
    const node = listRef.current;
    if (!node) return;
    const onKey = (e) => {
      const idx = tabs.findIndex((t) => t.id === tab);
      if (idx < 0) return;
      if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === "ArrowRight") {
        const next = (idx + 1) % tabs.length;
        btnRefs.current[next]?.focus();
        setTab(tabs[next].id);
      } else if (e.key === "ArrowLeft") {
        const prev = (idx - 1 + tabs.length) % tabs.length;
        btnRefs.current[prev]?.focus();
        setTab(tabs[prev].id);
      } else if (e.key === "Home") {
        btnRefs.current[0]?.focus();
        setTab(tabs[0].id);
      } else if (e.key === "End") {
        btnRefs.current[tabs.length - 1]?.focus();
        setTab(tabs[tabs.length - 1].id);
      }
    };
    node.addEventListener("keydown", onKey);
    return () => node.removeEventListener("keydown", onKey);
  }, [tab, tabs]);

  const isActive = (id) => id === tab;

  return (
    <section
      className="rounded-2xl border border-amber-200/60 bg-white shadow-sm"
      aria-label="Información detallada del paquete"
    >
      {/* Header de tabs */}
      <div
        ref={listRef}
        role="tablist"
        aria-orientation="horizontal"
        className="flex flex-wrap gap-2 p-3 md:p-4 border-b border-amber-200/60"
      >
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => (btnRefs.current[i] = el)}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={isActive(t.id)}
            aria-controls={`panel-${t.id}`}
            tabIndex={isActive(t.id) ? 0 : -1}
            onClick={() => setTab(t.id)}
            className={[
              "px-3.5 py-2 rounded-full text-sm font-semibold transition",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5A400]/60",
              isActive(t.id)
                ? "bg-[var(--pm-gold,#E5A400)] text-black shadow"
                : "bg-amber-50 text-pm-black hover:bg-amber-100"
            ].join(" ")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Panels */}
      <Panel
        id="panel-descripcion"
        labelledBy="tab-descripcion"
        hidden={!isActive("descripcion")}
      >
        <div className="prose max-w-none prose-p:leading-relaxed prose-p:text-pm-gray-dark/90">
          <p>{item.descripcion || item.resumen || "Descripción no disponible."}</p>
        </div>
      </Panel>

      <Panel
        id="panel-itinerario"
        labelledBy="tab-itinerario"
        hidden={!isActive("itinerario")}
      >
        <Bloque title="Día 1 · Actividades principales">
          Recojo/encuentro, traslados y visitas guiadas. Pausas para fotos y
          recomendaciones del guía. Tiempo libre y retorno.
        </Bloque>

        {item.dias > 1 && (
          <Bloque title="Día 2 · Continuación">
            Segundo día con foco en atractivos complementarios, miradores y
            experiencias locales.
          </Bloque>
        )}
      </Panel>

      <Panel
        id="panel-incluye"
        labelledBy="tab-incluye"
        hidden={!isActive("incluye")}
      >
        <ul className="list-disc pl-6 text-sm text-pm-gray-dark/90 marker:text-[var(--pm-gold,#E5A400)]">
          <li>Transporte turístico</li>
          <li>Guía oficial bilingüe</li>
          <li>Entradas según programa</li>
        </ul>
      </Panel>

      <Panel
        id="panel-noincluye"
        labelledBy="tab-noincluye"
        hidden={!isActive("noincluye")}
      >
        <ul className="list-disc pl-6 text-sm text-pm-gray-dark/90 marker:text-[var(--pm-gold,#E5A400)]">
          <li>Alimentación no mencionada</li>
          <li>Propinas y gastos personales</li>
          <li>Seguro de viaje</li>
        </ul>
      </Panel>

      <Panel id="panel-faqs" labelledBy="tab-faqs" hidden={!isActive("faqs")}>
        <div className="text-sm text-pm-gray-dark/90 space-y-3">
          <p>
            <b>¿Con cuánta anticipación reservo?</b> Ideal 2–4 semanas en temporada alta.
          </p>
          <p>
            <b>¿Nivel de exigencia?</b> {item.dificultad || "Moderada"}; se recomienda ropa y calzado cómodos.
          </p>
        </div>
      </Panel>
    </section>
  );
}