// components/sections/contacto/ContactInfo.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IoMailOutline,
  IoCallOutline,
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoTiktok,
  IoLogoYoutube,
} from "react-icons/io5";

const EMAILS = [
  "info@perumysterious.com",
  "operaciones@perumysterious.com",
  "reservas@perumysterious.com",
];

const PHONES = [
  { label: "+51 931 614 600", person: "Rosmery", href: "tel:+51931614600" },
  { label: "+51 949 141 112", person: "Armando", href: "tel:+51949141112" },
];

const SOCIALS = [
  { name: "Facebook", href: "https://facebook.com", Icon: IoLogoFacebook },
  { name: "Instagram", href: "https://instagram.com", Icon: IoLogoInstagram },
  { name: "TikTok", href: "https://tiktok.com", Icon: IoLogoTiktok },
  { name: "YouTube", href: "https://youtube.com", Icon: IoLogoYoutube },
];

/* Botón de copiar con feedback */
function CopyButton({ value, className = "" }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // Silencioso
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className={`${className} rounded-full border border-black/10 bg-white px-2.5 py-1 text-xs font-semibold text-pm-black hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-pm-gold/70`}
      aria-label={`Copiar ${value}`}
    >
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}

export default function ContactInfo() {
  const orgName = "Perú Mysterious";
  const siteUrl = "https://www.perumysterious.com"; // Cámbialo si corresponde

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: orgName,
    url: siteUrl,
    email: EMAILS[0],
    telephone: PHONES[0]?.label,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: EMAILS[0],
        telephone: PHONES[0]?.label,
        areaServed: "PE",
        availableLanguage: ["es", "en"],
      },
    ],
  };

  return (
    <aside
      className="
        rounded-2xl p-[1px]
        bg-gradient-to-b from-pm-gold/20 via-white to-white
        selection:bg-pm-gold selection:text-black
      "
    >
      {/* Tarjeta interna */}
      <div className="rounded-2xl border border-black/10 bg-white p-6 lg:p-7 shadow-sm text-pm-black">
        <h3 className="text-lg font-extrabold tracking-wide">DATOS DE CONTACTO</h3>

        {/* Emails */}
        <ul className="mt-4 space-y-3 text-sm">
          {EMAILS.map((mail) => (
            <li key={mail} className="flex flex-wrap items-center gap-2.5">
              <span
                className="grid h-8 w-8 place-items-center rounded-lg bg-white ring-1 ring-pm-gold/50"
                aria-hidden="true"
              >
                <IoMailOutline className="h-4 w-4 text-pm-gold" />
              </span>
              <a
                href={`mailto:${mail}`}
                className="font-medium hover:underline break-all"
              >
                {mail}
              </a>
              <CopyButton value={mail} />
            </li>
          ))}
        </ul>

        {/* Teléfonos */}
        <ul className="mt-4 space-y-3 text-sm">
          {PHONES.map(({ label, person, href }) => (
            <li key={label} className="flex flex-wrap items-center gap-2.5">
              <span
                className="grid h-8 w-8 place-items-center rounded-lg bg-white ring-1 ring-pm-gold/50"
                aria-hidden="true"
              >
                <IoCallOutline className="h-4 w-4 text-pm-gold" />
              </span>
              <a href={href} className="font-medium hover:underline">
                {label}
              </a>
              <span className="text-gray-700">({person})</span>
              <CopyButton value={label} />
            </li>
          ))}
        </ul>

        {/* Social */}
        <div className="mt-6">
          <h4 className="font-bold">Síguenos en:</h4>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {SOCIALS.map(({ name, href, Icon }) => (
              <a
                key={name}
                aria-label={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group grid h-11 w-11 place-items-center rounded-full
                  border border-black/10 bg-white shadow
                  hover:shadow-md focus:outline-none focus:ring-2 focus:ring-pm-gold/70
                "
                title={name}
              >
                <Icon className="h-5 w-5 text-pm-black group-hover:text-pm-gold transition-colors" />
              </a>
            ))}
          </div>
        </div>

        {/* Badges opcionales */}
        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-gray-600">
          <span className="rounded-full border border-black/10 bg-white px-2.5 py-1">
            Respuesta en horas laborales
          </span>
          <span className="rounded-full border border-black/10 bg-white px-2.5 py-1">
            Español e inglés
          </span>
        </div>
      </div>

      {/* SEO JSON-LD */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </aside>
  );
}
