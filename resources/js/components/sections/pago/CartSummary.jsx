import { useMemo } from "react";

export default function CartSummary({
  items,
  onToggle,
  onQty,
  onRemoveChecked,
  subtotal,
  igv,
  useIGV,
  setUseIGV,
  total,
  onPay,
  method,
  // NUEVO:
  variant = "pago",      // "pago" | "reserva"
  onContinue,            // usado cuando variant === "reserva"
}) {
  // Derivar si hay seleccionados, para UX del botón "Eliminar seleccionados"
  const hasChecked = useMemo(() => items?.some(i => i.checked), [items]);

  return (
    <section
      aria-label="Resumen de la compra"
      className="space-y-4 font-metropolis text-pm-black"
    >
      {/* === Resumen / Tabla === */}
      <div className="
        rounded-2xl border border-amber-200/40 bg-white shadow-sm
        transition hover:shadow-md
      ">
        <div className="
          flex items-center justify-between px-4 py-3
          border-b border-amber-200/40
        ">
          <h3 className="font-semibold tracking-wide text-pm-black">
            Resumen de la compra
          </h3>

          {variant === "pago" && (
            <button
              onClick={onRemoveChecked}
              disabled={!hasChecked}
              className="
                inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm
                border border-red-400/40
                text-red-700/90 bg-red-50/60
                hover:bg-red-100 active:scale-[.99]
                disabled:opacity-40 disabled:cursor-not-allowed
                transition
                focus:outline-none focus:ring-2 focus:ring-red-300/50
              "
              aria-disabled={!hasChecked}
              title={hasChecked ? "Eliminar seleccionados" : "No hay ítems seleccionados"}
            >
              Eliminar seleccionados
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gradient-to-b from-white to-[#fff7e0]/40 text-pm-gray-dark">
              <tr className="border-y border-amber-200/40">
                <Th>Editar</Th>
                <Th>Tours</Th>
                <Th className="text-right">Precio</Th>
                <Th className="text-center">Cantidad</Th>
                <Th className="text-right">Total</Th>
              </tr>
            </thead>

            <tbody>
              {items.map((it, idx) => (
                <tr
                  key={it.id}
                  className={`
                    border-t border-amber-200/30
                    ${idx % 2 === 1 ? "bg-black/[0.015]" : "bg-transparent"}
                  `}
                >
                  <Td>
                    <input
                      type="checkbox"
                      checked={!!it.checked}
                      onChange={() => onToggle?.(it.id)}
                      className="size-4 accent-pm-gold rounded-sm"
                      aria-label={`Seleccionar ${it.name}`}
                    />
                  </Td>

                  <Td className="font-medium">{it.name}</Td>

                  <Td className="text-right">
                    S/ {formatMoney(it.precio)}
                  </Td>

                  <Td className="text-center">
                    <input
                      type="number"
                      min={0}
                      inputMode="numeric"
                      value={it.qty}
                      onChange={(e) => onQty?.(it.id, e.target.value)}
                      className="
                        w-24 rounded-full border border-amber-200/50
                        bg-white px-3 py-1.5 text-center
                        focus:outline-none focus:ring-2 focus:ring-pm-gold/50
                      "
                      aria-label={`Cantidad para ${it.name}`}
                    />
                  </Td>

                  <Td className="text-right font-semibold text-pm-black">
                    S/ {formatMoney((Number(it.precio) * Number(it.qty)) || 0)}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* === Totales === */}
      <div className="
        rounded-2xl border border-amber-200/40 bg-white shadow-sm
        p-4 transition hover:shadow-md
      ">
        <Row label="SUB TOTAL">
          <span>S/ {formatMoney(subtotal)}</span>
        </Row>

        <label className="
          mt-2 flex items-center justify-between gap-3 text-sm
        ">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={useIGV}
              onChange={(e) => setUseIGV?.(e.target.checked)}
              className="size-4 accent-pm-gold rounded-sm"
              aria-label="Incluir IGV"
            />
            <span className="text-pm-gray-dark">
              IVA / IGV (18%)
            </span>
          </div>
          <span className="font-medium">
            S/ {formatMoney(igv)}
          </span>
        </label>

        <div className="mt-3 flex items-center justify-between text-lg">
          <span className="font-semibold tracking-wide">TOTAL A PAGAR</span>
          <span className="
            rounded-full border border-amber-200/50 bg-[#fff7e0]/70
            px-3 py-1.5 font-extrabold text-pm-black
          ">
            S/ {formatMoney(total)}
          </span>
        </div>

        {variant === "pago" ? (
          <button
            onClick={onPay}
            className="
              mt-4 w-full inline-flex items-center justify-center gap-2
              rounded-full bg-pm-gold px-5 py-3 text-pm-black font-semibold
              shadow hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0
              transition
              focus:outline-none focus:ring-2 focus:ring-pm-gold/50
            "
          >
            Pagar con {labelFromMethod(method)}
          </button>
        ) : (
          <button
            onClick={onContinue}
            className="
              mt-4 w-full inline-flex items-center justify-center gap-2
              rounded-full border border-pm-gold/40 bg-white px-5 py-3 text-pm-black font-semibold
              hover:bg-pm-gold/10 hover:-translate-y-0.5 active:translate-y-0
              transition
              focus:outline-none focus:ring-2 focus:ring-pm-gold/50
            "
          >
            Continuar al pago
          </button>
        )}
      </div>

      {/* Nota pequeña de seguridad / métodos */}
      <p className="text-xs text-pm-gray-dark/80 px-1">
        Tus pagos son procesados de forma segura. Verifica cantidades y método antes de continuar.
      </p>
    </section>
  );
}

/* ======= Sub-componentes ======= */
function Th({ className = "", children }) {
  return (
    <th
      className={`
        px-4 py-2 text-left text-[13px] uppercase tracking-wide font-semibold
        text-pm-gray-dark/90
        ${className}
      `}
    >
      {children}
    </th>
  );
}

function Td({ className = "", children }) {
  return (
    <td className={`px-4 py-2 align-middle ${className}`}>
      {children}
    </td>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex justify-between text-sm py-1.5">
      <span className="font-medium text-pm-gray-dark">{label}</span>
      {children}
    </div>
  );
}

function formatMoney(n) {
  const num = Number(n) || 0;
  return num.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function labelFromMethod(m) {
  switch (m) {
    case "card": return "Tarjeta";
    case "yape": return "Yape";
    case "qr": return "Código QR";
    case "deposito": return "Transferencia";
    case "pagoefectivo": return "PagoEfectivo";
    case "paypal": return "PayPal";
    default: return "Método seleccionado";
  }
}
