import { useState, useMemo } from "react";
import EditUserModal from "./EditUserModal";
import {
  IoCardOutline,
  IoQrCodeOutline,
  IoCashOutline,
  IoLogoPaypal,
  IoPencilOutline,
} from "react-icons/io5";

const methods = [
  {
    id: "card",
    label: "Tarjeta de crédito o débito",
    icon: IoCardOutline,
    badges: [
      "/images/cards/visa.png",
      "/images/cards/mastercard.png",
      "/images/cards/amex.png",
      "/images/cards/diners.png",
    ],
  },
  { id: "yape", label: "Billeteras digitales (Yape)", img: "/images/yape.png" },
  {
    id: "qr",
    label: "Código QR",
    icon: IoQrCodeOutline,
    badges: [
      "/images/qr/bcp.png",
      "/images/qr/interbank.png",
      "/images/qr/scotiabank.png",
      "/images/qr/bbva.png",
    ],
  },
  {
    id: "deposito",
    label: "Transferencia / Depósito",
    icon: IoCashOutline,
    badges: ["/images/pagos/pagoseguro.png"],
  },
  { id: "pagoefectivo", label: "PagoEfectivo", img: "/images/pagoefectivo.png" },
  { id: "paypal", label: "PayPal", icon: IoLogoPaypal },
];

export default function PaymentMethods({ selected, onSelect, user, onUpdateUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const current = useMemo(() => methods.find(m => m.id === selected), [selected]);

  return (
    <section className="space-y-4 font-metropolis text-pm-black">
      {/* Datos del usuario */}
      <div className="rounded-2xl border border-amber-200/40 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full border border-amber-200/50 bg-[#fff7e0]/70">
            🙂{/* avatar placeholder */}
          </div>
          <div>
            <p className="text-xs text-pm-gray-dark/80">Tus datos</p>
            <p className="font-semibold">{user?.name || "Usuario"}</p>
            <p className="text-sm text-pm-gray-dark">{user?.email || "—"}</p>
          </div>

          <button
            type="button"
            className="ml-auto inline-flex items-center gap-2 rounded-full border border-pm-gold/40 bg-white px-3 py-1.5 text-sm font-semibold hover:bg-pm-gold/10 transition focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
            onClick={() => setIsEditing(true)}
          >
            <IoPencilOutline />
            Modificar mis datos
          </button>
        </div>
      </div>

      {/* Métodos de pago */}
      <div className="rounded-2xl border border-amber-200/40 bg-white shadow-sm">
        <div className="border-b border-amber-200/40 px-4 py-3 font-semibold tracking-wide">
          2 · Selecciona el medio de pago
        </div>

        <ul role="listbox" aria-label="Medios de pago" className="divide-y divide-amber-200/40">
          {methods.map((m) => {
            const isActive = selected === m.id;
            const Icon = m.icon;
            return (
              <li key={m.id}>
                <label
                  className={`flex cursor-pointer items-center gap-3 px-4 py-4 transition
                    ${isActive
                      ? "bg-[#fff7e0]/60 ring-2 ring-pm-gold/40"
                      : "hover:bg-black/5"}
                  `}
                >
                  <input
                    type="radio"
                    name="paymethod"
                    checked={isActive}
                    onChange={() => onSelect?.(m.id)}
                    className="accent-pm-gold"
                    aria-label={m.label}
                  />

                  {Icon ? <Icon size={22} className="text-pm-gray-dark" /> : null}
                  {m.img ? (
                    <Image
                      src={m.img}
                      alt={m.label}
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  ) : null}

                  <span className="font-medium">{m.label}</span>

                  <span className="ml-auto flex items-center gap-2">
                    {m.badges?.map((src) => (
                      <img
                        key={src}
                        src={src}
                        alt="brand"
                        width={32}
                        height={20}
                        className="object-contain"
                      />
                    ))}
                  </span>
                </label>

                {/* Subformularios */}
                {isActive && m.id === "card" && (
                  <div className="px-4 pb-4">
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Input placeholder="Número de tarjeta" inputMode="numeric" />
                      <Input placeholder="Nombre en la tarjeta" />
                      <Input placeholder="MM/AA" inputMode="numeric" />
                      <Input placeholder="CVV" inputMode="numeric" />
                    </div>
                    <p className="mt-2 text-xs text-pm-gray-dark/80">
                      Tus datos se procesan de forma segura.
                    </p>
                  </div>
                )}

                {isActive && m.id === "paypal" && (
                  <div className="px-4 pb-4">
                    <button
                      type="button"
                      className="mt-3 inline-flex items-center justify-center rounded-full bg-pm-gold px-5 py-2.5 text-pm-black font-semibold shadow hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 transition focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                    >
                      Conectar con PayPal
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Modal de edición */}
      <EditUserModal
        open={isEditing}
        onClose={() => setIsEditing(false)}
        user={user}
        onSave={onUpdateUser}
      />
    </section>
  );
}

/* --- UI helpers --- */
function Input(props) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-amber-200/50 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
    />
  );
}
