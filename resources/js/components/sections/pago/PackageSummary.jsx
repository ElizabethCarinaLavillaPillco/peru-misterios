import React from 'react';
import { useMemo } from "react";
import CartSummary from "./CartSummary";
import {
  IoTrashOutline,
  IoDownloadOutline,
  IoChatbubbleEllipsesOutline,
  IoShieldCheckmarkOutline,
  IoReturnDownBackOutline,
} from "react-icons/io5";

export default function PackageSummary({
  items = [],
  onToggle,
  onQty,
  onRemoveChecked,
  subtotal = 0,
  igv = 0,
  useIGV = false,
  setUseIGV,
  total = 0,
  onContinue,
  onElegirMas,
  onDescargar,
}) {
  const hasChecked = useMemo(() => items?.some(i => i.checked), [items]);

  return (
    <div className="space-y-4 font-metropolis text-pm-black">
      {/* Cabecera personalizada con eliminar */}
      <div className="flex items-center justify-between rounded-2xl border border-amber-200/40 bg-white px-4 py-3 shadow-sm">
        <h3 className="font-semibold tracking-wide">
          Resumen de la compra
        </h3>

        <button
          type="button"
          onClick={onRemoveChecked}
          disabled={!hasChecked}
          className="
            inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm
            border border-red-400/40 text-red-700/90 bg-red-50/60
            hover:bg-red-100 active:scale-[.99]
            disabled:opacity-40 disabled:cursor-not-allowed
            transition focus:outline-none focus:ring-2 focus:ring-red-300/50
          "
          title={hasChecked ? "Eliminar seleccionados" : "No hay ítems seleccionados"}
        >
          <IoTrashOutline className="text-base" />
          Eliminar seleccionados
        </button>
      </div>

      {/* Tabla + totales usando CartSummary (sin su header interno) */}
      <CartSummary
        items={items}
        onToggle={onToggle}
        onQty={onQty}
        subtotal={subtotal}
        igv={igv}
        useIGV={useIGV}
        setUseIGV={setUseIGV}
        total={total}
        variant="reserva"        // quita botón de pagar
        onContinue={onContinue}  // muestra "Continuar al pago"
      />

      {/* Extras debajo de la tabla */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onDescargar}
          className="
            inline-flex w-full sm:w-auto items-center justify-center gap-2
            rounded-full border border-pm-gold/40 bg-white px-5 py-2.5
            text-pm-black font-semibold
            hover:bg-pm-gold/10 hover:-translate-y-0.5 active:translate-y-0
            transition focus:outline-none focus:ring-2 focus:ring-pm-gold/50
          "
          aria-label="Descargar paquete"
        >
          <IoDownloadOutline className="text-lg" />
          Descargar paquete
        </button>

        <div className="flex items-center justify-between sm:justify-end gap-4">
          <span className="text-sm text-pm-gray-dark">SUB TOTAL</span>
          <div className="rounded-full border border-amber-200/50 bg-[#fff7e0]/70 px-4 py-2 font-bold text-pm-black">
            S/ {formatMoney(subtotal)}
          </div>
        </div>
      </div>

      {/* Info rápida */}
      <div className="rounded-2xl border border-amber-200/40 bg-white p-4 shadow-sm">
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#fff7e0]/70 border border-amber-200/50">
              <IoShieldCheckmarkOutline />
            </span>
            <p className="leading-5">Compra tu paquete de manera segura.</p>
          </li>

          <li className="flex items-start gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#fff7e0]/70 border border-amber-200/50">
              <IoChatbubbleEllipsesOutline />
            </span>
            <p className="leading-5">
              ¿Tienes dudas?{" "}
              <button
                type="button"
                className="text-pm-gold font-semibold underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-pm-gold/40 rounded"
              >
                Chatea con un asesor
              </button>
            </p>
          </li>

          <li className="flex items-start gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#fff7e0]/70 border border-amber-200/50">
              <IoReturnDownBackOutline />
            </span>
            <p className="leading-5">Cancelación flexible contactando a nuestros asesores.</p>
          </li>
        </ul>
      </div>

      {/* Botón Elegir más Tours */}
      <div>
        <button
          type="button"
          onClick={onElegirMas}
          className="
            w-full inline-flex items-center justify-center
            rounded-full border border-pm-gold/40 bg-white px-5 py-3
            text-pm-black font-semibold
            hover:bg-pm-gold/10 hover:-translate-y-0.5 active:translate-y-0
            transition focus:outline-none focus:ring-2 focus:ring-pm-gold/50
          "
        >
          Elegir más Tours
        </button>
      </div>
    </div>
  );
}

/* Utils */
function formatMoney(n) {
  const num = Number(n) || 0;
  return num.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
