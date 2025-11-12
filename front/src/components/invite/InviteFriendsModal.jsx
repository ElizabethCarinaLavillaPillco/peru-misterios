"use client";

import { useEffect, useRef, useState } from "react";

export default function InviteFriendsModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("¡Hola! Mira este proyecto de viajes, creo que te encantará. ✨");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const dialogRef = useRef(null);

  // Cerrar con ESC y bloquear scroll
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && open) onClose?.();
    }
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // Click fuera para cerrar
  function onBackdrop(e) {
    if (e.target === dialogRef.current) onClose?.();
  }

  // Validación simple
  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      alert("Ingresa un correo válido.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), message }),
      });
      if (!res.ok) throw new Error("No se pudo enviar la invitación");
      setSent(true);
      setEmail("");
      // Ojo: no cerramos automáticamente; dejamos el éxito visible
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al enviar. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div
      ref={dialogRef}
      onMouseDown={onBackdrop}
      aria-modal="true"
      role="dialog"
      aria-labelledby="invite-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="w-[95%] max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-amber-200/50"
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2
            id="invite-title"
            className="font-russo text-xl text-pm-black tracking-wide"
          >
            Invitar amigos
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-full border border-amber-200/70 px-3 py-1 text-sm text-pm-black hover:bg-amber-50 transition"
          >
            Cerrar
          </button>
        </div>

        {/* Success state */}
        {sent && (
          <div className="mb-4 rounded-xl border border-amber-300/60 bg-[#FFF9E8] p-3 text-sm text-pm-black">
            🎉 ¡Invitación enviada con éxito!
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-pm-black">
              Correo del invitado <span className="text-[var(--pm-gold,#E5A400)]">*</span>
            </label>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@correo.com"
              className="w-full rounded-xl border border-amber-200/60 bg-white px-3 py-2 text-pm-black placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#E5A400]/60"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-pm-black">
              Mensaje (opcional)
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-amber-200/60 bg-white px-3 py-2 text-pm-black placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#E5A400]/60"
            />
          </div>

          <div className="flex items-start gap-2 text-sm">
            <input id="consent" type="checkbox" required className="mt-1" />
            <label htmlFor="consent" className="text-pm-black">
              Confirmo que tengo permiso para invitar a esta persona.
            </label>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-[var(--pm-gold,#E5A400)] px-5 py-2 text-sm font-bold text-black shadow hover:brightness-110 disabled:opacity-60 transition"
            >
              {loading ? "Enviando..." : "Enviar invitación"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-amber-300 px-5 py-2 text-sm font-semibold text-pm-black hover:bg-amber-50 transition"
            >
              Cancelar
            </button>
          </div>

          {/* Pequeño disclaimer */}
          <p className="text-xs text-pm-gray-dark/80">
            Usamos tu mensaje para crear un correo elegante con tu invitación.
          </p>
        </form>
      </div>
    </div>
  );
}
