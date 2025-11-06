// app/paquetes/layout.jsx
import  React from "react";
export const metadata = {
  title: "Paquetes | Perú Mysterious",
  description: "Explora paquetes de viaje por Perú.",
};

export default function PaquetesLayout({ children }) {
  return (
    <section className="font-metropolis text-[var(--pm-black,#1E1E1E)]">
      {children}
    </section>
  );
}
