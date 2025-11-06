import { useEffect, useRef, useState, useCallback } from "react";

export default function EditUserModal({ open, onClose, user, onSave }) {
  const [form, setForm] = useState(user || {});
  const panelRef = useRef(null);
  const titleId = "edit-user-modal-title";

  // Sincroniza el formulario cuando cambie el usuario
  useEffect(() => setForm(user || {}), [user]);

  // Cerrar con ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Bloquear scroll del body mientras el modal esté abierto
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Cerrar al hacer click fuera del panel
  const onBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) onClose?.();
  }, [onClose]);

  if (!open) return null;

  const save = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    onSave?.(form);
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-[fadeIn_.18s_ease-out]"
      onMouseDown={onBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        ref={panelRef}
        className="relative w-full max-w-md rounded-2xl border border-amber-200/40 bg-white shadow-lg p-5 md:p-6 animate-[scaleIn_.18s_ease-out]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3.5 top-3.5 grid place-items-center rounded-full bg-white/85 border border-amber-200/40 w-9 h-9 shadow hover:bg-white active:scale-[.98] focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
        >
          <span className="text-xl leading-none">×</span>
        </button>

        {/* Título */}
        <h2 id={titleId} className="font-russo text-xl md:text-2xl text-pm-black">
          Modificar mis datos
          <span className="block h-1 w-14 bg-pm-gold rounded-full mt-2" />
        </h2>

        {/* Formulario */}
        <form onSubmit={save} className="mt-4 space-y-3 font-metropolis text-pm-black">
          <label className="block">
            <span className="mb-1 block text-sm text-pm-gray-dark">Nombre completo</span>
            <input
              className="w-full rounded-xl border border-amber-200/50 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
              placeholder="Nombre completo"
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm text-pm-gray-dark">Correo</span>
            <input
              type="email"
              className="w-full rounded-xl border border-amber-200/50 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
              placeholder="correo@ejemplo.com"
              value={form.email || ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm text-pm-gray-dark">Teléfono (con código de país)</span>
            <input
              type="tel"
              inputMode="tel"
              className="w-full rounded-xl border border-amber-200/50 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
              placeholder="+51 9XX XXX XXX"
              value={form.phone || ""}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm text-pm-gray-dark">Ciudad / País</span>
            <input
              className="w-full rounded-xl border border-amber-200/50 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
              placeholder="Ciudad / País"
              value={form.location || ""}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </label>

          <label className="mt-1 flex items-center gap-2 text-sm text-pm-gray-dark">
            <input
              type="checkbox"
              className="size-4 accent-pm-gold rounded-sm"
              checked={!!form.useForInvoice}
              onChange={(e) => setForm({ ...form, useForInvoice: e.target.checked })}
            />
            Usar estos datos para la factura
          </label>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center rounded-full border border-pm-gold/40 bg-white px-5 py-2.5 text-pm-black font-semibold hover:bg-pm-gold/10 hover:-translate-y-0.5 active:translate-y-0 transition focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="inline-flex items-center rounded-full bg-pm-gold px-5 py-2.5 text-pm-black font-semibold shadow hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 transition focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>

      {/* Keyframes para las animaciones usadas */}
      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(.98) } to { opacity: 1; transform: scale(1) } }
      `}</style>
    </div>
  );
}
