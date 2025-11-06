import { useMemo, useState } from "react";
import Stepper from "@/components/sections/pago/Stepper";
import PaymentMethods from "@/components/sections/pago/PaymentMethods";
import CartSummary from "@/components/sections/pago/CartSummary";
import TravelerForm from "@/components/sections/pago/TravelerForm";
import PackageSummary from "@/components/sections/pago/PackageSummary";

const INITIAL_ITEMS = [
  { id: 1, name: "City Tour", precio: 50, qty: 2 },
  { id: 2, name: "Valle Sagrado", precio: 100, qty: 2 },
  { id: 3, name: "Machupicchu 2D", precio: 500, qty: 2 },
  { id: 4, name: "Puno 3D", precio: 400, qty: 2 },
  { id: 5, name: "Arequipa 2D", precio: 300, qty: 2 },
];

const LOGGED_USER = {
  id: "u_123",
  name: "Ana Machacca",
  email: "ar.machacca@gmail.com",
  phone: "+51 999 999 999",
  location: "Cusco, Perú",
  useForInvoice: true,
};

export default function PagoPage() {
  const [step, setStep] = useState(1);
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [useIGV, setUseIGV] = useState(true);
  const [method, setMethod] = useState("card");
  const [user, setUser] = useState(LOGGED_USER);

  const subtotal = useMemo(
    () => items.reduce((acc, it) => acc + it.precio * it.qty, 0),
    [items]
  );
  const igv = useMemo(() => (useIGV ? +(subtotal * 0.18).toFixed(2) : 0), [subtotal, useIGV]);
  const total = useMemo(() => +(subtotal + igv).toFixed(2), [subtotal, igv]);

  const updateQty = (id, qty) =>
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, qty: Math.max(0, Number(qty) || 0) } : it
      )
    );

  const toggleItem = (id) =>
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it))
    );

  const removeChecked = () => setItems((prev) => prev.filter((it) => !it.checked));

  const onPay = () => {
    alert(
      `Pagando como ${user.name} (${user.email})\nMétodo: ${method}\nTotal: S/ ${total.toLocaleString(
        "es-PE"
      )}`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
      <Stepper current={step} onGoTo={setStep} />

      {/* PASO 1: RESERVA */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          <TravelerForm
            user={user}
            onUpdateUser={setUser}
            onNext={() => setStep(2)}
          />

          <PackageSummary
            items={items}
            onToggle={toggleItem}
            onQty={updateQty}
            onRemoveChecked={removeChecked}
            subtotal={subtotal}
            igv={igv}
            useIGV={useIGV}
            setUseIGV={setUseIGV}
            total={total}
            onContinue={() => setStep(2)}
            onElegirMas={() => (window.location.href = "/destinos")}
            onDescargar={() => alert("Descarga de paquete (pendiente)")}
          />
        </div>
      )}

      {/* PASO 2: PAGO */}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          <PaymentMethods
            selected={method}
            onSelect={setMethod}
            user={user}
            onUpdateUser={setUser}
          />

          <CartSummary
            items={items}
            onToggle={toggleItem}
            onQty={updateQty}
            onRemoveChecked={removeChecked}
            subtotal={subtotal}
            igv={igv}
            useIGV={useIGV}
            setUseIGV={setUseIGV}
            total={total}
            onPay={onPay}
            method={method}
          />
        </div>
      )}
    </div>
  );
}