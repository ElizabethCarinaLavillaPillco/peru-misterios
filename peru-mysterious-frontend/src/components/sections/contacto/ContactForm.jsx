import React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

const adultos = Array.from({ length: 10 }, (_, i) => i + 1);
const ninos = Array.from({ length: 11 }, (_, i) => i);
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^[+()\d\s-]{7,}$/; // sencillo y tolerante

export default function ContactForm() {
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(null); // {ok?:string, error?:string}
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");
  const [origin, setOrigin] = useState("");
  const firstErrorRef = useRef(null);

  const today = useMemo(() => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
  }, []);

  useEffect(() => {
    // contexto útil para el backend
    try {
      setOrigin(`${window.location.pathname}${window.location.search}`);
    } catch {}
  }, []);

  // estilos consistentes PM (fondo claro)
  const baseInput =
    "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-pm-black placeholder:text-gray-500 outline-none transition focus:ring-2 focus:ring-pm-gold/70";
  const selectCls = baseInput + " pr-10";
  const labelCls = "text-sm font-extrabold text-pm-black";
  const helpCls = "mt-1 text-xs text-gray-700";
  const errText = "mt-1 text-xs text-red-600";
  const errRing = "ring-2 ring-red-400";

  function getFormValues(form) {
    const fd = new FormData(form);
    const p = Object.fromEntries(fd.entries());
    p.nombre = p.nombre?.trim() || "";
    p.correo = p.correo?.trim() || "";
    p.telefono = p.telefono?.trim() || "";
    p.pais = p.pais?.trim() || "";
    p.region = p.region?.trim() || "";
    p.destino = p.destino?.trim() || "";
    p.mensaje = (msg ?? "").trim();
    p.adultos = p.adultos ? Number(p.adultos) : "";
    p.ninos = p.ninos ? Number(p.ninos) : "";
    p.canal = p.canal || "email";
    p.consent = fd.get("consent") === "on";
    p.hp = p.hp?.trim() || ""; // honeypot
    p.origen = origin || "";
    return p;
  }

  function validate(p) {
    const e = {};
    if (p.hp) e.global = "Detección anti-spam activada.";
    if (!p.nombre) e.nombre = "Ingresa tu nombre.";
    else if (p.nombre.length < 2) e.nombre = "El nombre es muy corto.";
    if (!p.correo) e.correo = "Ingresa tu correo.";
    else if (!emailRe.test(p.correo)) e.correo = "Correo no válido.";
    if (!p.fecha) e.fecha = "Selecciona una fecha.";
    else if (new Date(p.fecha) < new Date(today)) e.fecha = "La fecha no puede ser pasada.";
    if (p.adultos === "" || Number.isNaN(p.adultos)) e.adultos = "Selecciona adultos.";
    if (p.ninos === "" || Number.isNaN(p.ninos)) e.ninos = "Selecciona niños.";
    if (p.adultos !== "" && p.ninos !== "" && p.adultos + p.ninos <= 0) e.ninos = "Debe haber al menos 1 pasajero.";
    if (!p.destino) e.destino = "Indica un destino.";
    if (p.mensaje && p.mensaje.length < 10) e.mensaje = "Mínimo 10 caracteres.";
    if ((p.canal === "whatsapp" || p.canal === "llamada") && !phoneRe.test(p.telefono))
      e.telefono = "Ingresa un teléfono válido (incluye código de país si aplica).";
    if (!p.consent) e.consent = "Debes aceptar la política de privacidad.";
    return e;
  }

  function scrollToFirstError(e) {
    const firstKey = Object.keys(e)[0];
    if (!firstKey) return;
    const el = document.getElementById(firstKey);
    if (el) {
      firstErrorRef.current = el;
      setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
    }
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    setSending(true);
    setOk(null);
    setErrors({});
    const form = ev.currentTarget;
    const payload = getFormValues(form);
    const v = validate(payload);
    if (Object.keys(v).length) {
      setErrors(v);
      scrollToFirstError(v);
      setSending(false);
      return;
    }
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Error");
      setOk({ ok: "¡Mensaje enviado! Te contactaremos pronto." });
      form.reset();
      setMsg("");
      // auto-ocultar mensaje de éxito
      setTimeout(() => setOk(null), 6000);
    } catch {
      setOk({ error: "No se pudo enviar. Inténtalo nuevamente." });
    } finally {
      setSending(false);
    }
  }

  return (
    <section
      className="
        rounded-2xl p-[1px]
        bg-gradient-to-br from-pm-gold/20 via-white to-white
        selection:bg-pm-gold selection:text-black
      "
    >
      <div className="rounded-2xl border border-black/10 bg-white p-6 md:p-8 shadow-sm text-pm-black">
        <h2 className="mb-2 text-3xl font-extrabold tracking-tight">Contacto</h2>
        <p className="mb-5 text-sm text-gray-700">
          Cuéntanos sobre tu viaje y te responderemos a la brevedad.
        </p>

        <form onSubmit={onSubmit} className="space-y-6" aria-busy={sending}>
          {/* Nombre / Correo */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="nombre">Nombre</label>
              <input id="nombre" name="nombre" className={`${baseInput} ${errors.nombre ? errRing : ""}`} aria-invalid={!!errors.nombre} />
              {errors.nombre && <p className={errText}>{errors.nombre}</p>}
            </div>
            <div>
              <label className={labelCls} htmlFor="correo">Correo</label>
              <input id="correo" type="email" name="correo" className={`${baseInput} ${errors.correo ? errRing : ""}`} aria-invalid={!!errors.correo} />
              {errors.correo && <p className={errText}>{errors.correo}</p>}
            </div>
          </div>

          {/* Preferencia de contacto / Teléfono */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className={labelCls} htmlFor="canal">Preferencia de contacto</label>
              <select id="canal" name="canal" defaultValue="email" className={selectCls}>
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="llamada">Llamada</option>
              </select>
              <p className={helpCls}>Si eliges WhatsApp o llamada, agrega tu teléfono.</p>
            </div>
            <div className="md:col-span-2">
              <label className={labelCls} htmlFor="telefono">Teléfono (opcional)</label>
              <input id="telefono" name="telefono" placeholder="+51 999 999 999" className={`${baseInput} ${errors.telefono ? errRing : ""}`} aria-invalid={!!errors.telefono} />
              {errors.telefono && <p className={errText}>{errors.telefono}</p>}
            </div>
          </div>

          {/* País / Región / Destino */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className={labelCls} htmlFor="pais">País</label>
              <input id="pais" name="pais" className={baseInput} />
            </div>
            <div>
              <label className={labelCls} htmlFor="region">Región / Ciudad</label>
              <input id="region" name="region" className={baseInput} />
            </div>
            <div>
              <label className={labelCls} htmlFor="destino">Destino</label>
              <input id="destino" name="destino" className={`${baseInput} ${errors.destino ? errRing : ""}`} aria-invalid={!!errors.destino} />
              {errors.destino && <p className={errText}>{errors.destino}</p>}
            </div>
          </div>

          {/* Fecha / Adultos / Niños */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className={labelCls} htmlFor="fecha">Fecha</label>
              <input id="fecha" type="date" name="fecha" min={today} className={`${baseInput} ${errors.fecha ? errRing : ""}`} aria-invalid={!!errors.fecha} />
              {errors.fecha && <p className={errText}>{errors.fecha}</p>}
            </div>
            <div>
              <label className={labelCls} htmlFor="adultos">Adultos</label>
              <select id="adultos" name="adultos" defaultValue="" className={`${selectCls} ${errors.adultos ? errRing : ""}`} aria-invalid={!!errors.adultos}>
                <option value="" disabled>--Seleccionar--</option>
                {adultos.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              {errors.adultos && <p className={errText}>{errors.adultos}</p>}
            </div>
            <div>
              <label className={labelCls} htmlFor="ninos">Niños</label>
              <select id="ninos" name="ninos" defaultValue="" className={`${selectCls} ${errors.ninos ? errRing : ""}`} aria-invalid={!!errors.ninos}>
                <option value="" disabled>--Seleccionar--</option>
                {ninos.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              {errors.ninos && <p className={errText}>{errors.ninos}</p>}
            </div>
          </div>

          {/* Mensaje + contador */}
          <div>
            <label className={labelCls} htmlFor="mensaje">Mensaje</label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows={6}
              className={`${baseInput} resize-y ${errors.mensaje ? errRing : ""}`}
              placeholder="Cuéntanos detalles del viaje, fechas exactas, presupuesto, etc."
              aria-invalid={!!errors.mensaje}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              maxLength={1000}
            />
            <div className="mt-1 flex items-center justify-between">
              {errors.mensaje ? (
                <p className={errText}>{errors.mensaje}</p>
              ) : (
                <p className={helpCls}>Mínimo 10 caracteres para una mejor atención.</p>
              )}
              <span className="text-xs text-gray-600">{msg.length}/1000</span>
            </div>
          </div>

          {/* Consentimiento + honeypot */}
          <div className="flex items-start gap-3">
            <input id="consent" name="consent" type="checkbox" className="mt-1 h-4 w-4 rounded border-black/20 text-pm-gold focus:ring-pm-gold/70" aria-invalid={!!errors.consent} />
            <label htmlFor="consent" className="text-sm text-gray-800">
              Acepto la{" "}
              <a href="/politica-de-privacidad" className="font-semibold text-pm-gold hover:underline">
                Política de Privacidad
              </a>{" "}
              y el tratamiento de mis datos.
            </label>
          </div>
          {errors.consent && <p className={errText} id="consent-error">{errors.consent}</p>}

          {/* Honeypot invisible para bots */}
          <div aria-hidden="true" className="hidden">
            <label htmlFor="hp">No completar</label>
            <input id="hp" name="hp" className={baseInput} tabIndex={-1} autoComplete="off" />
            <input type="hidden" name="origen" value={origin} />
          </div>

          {/* Estados */}
          {errors.global && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
              {errors.global}
            </div>
          )}
          {ok?.ok && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800 text-sm" role="status" aria-live="polite">
              {ok.ok}
            </div>
          )}
          {ok?.error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm" role="alert" aria-live="assertive">
              {ok.error}
            </div>
          )}

          {/* Botón */}
          <button
            type="submit"
            disabled={sending}
            className="
              relative w-full rounded-xl bg-pm-gold py-3
              text-sm font-extrabold text-black tracking-wide
              transition hover:brightness-105 disabled:opacity-60
              focus:outline-none focus:ring-2 focus:ring-pm-gold/70
            "
          >
            {sending ? (
              <span className="inline-flex items-center justify-center gap-2">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                Enviando…
              </span>
            ) : (
              "Enviar"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
