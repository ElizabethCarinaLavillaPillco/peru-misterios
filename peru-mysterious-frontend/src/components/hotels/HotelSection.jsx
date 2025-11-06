import React from "react";

export default function HotelSection({ id, title, description, children, variant = "light" }) {
  const light = variant === "light";
  return (
    <section id={id} className={`mx-auto max-w-6xl px-4 py-12 ${light ? "text-neutral-900" : "text-white"}`}>
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold">{title}</h2>
        {description && (
          <p className={`mt-2 max-w-3xl ${light ? "text-neutral-600" : "text-neutral-300"}`}>{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}
