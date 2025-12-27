import React from "react";
export default function MapEmbed({ src, query }) {
  // Usa src directo si está definido, si no genera con query
  const url = src
    ? src
    : `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200">
      <iframe
        title={`Mapa: ${query || "Ubicación"}`}
        src={url}
        width="100%"
        height="420"
        style={{ border: 0, display: "block" }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
