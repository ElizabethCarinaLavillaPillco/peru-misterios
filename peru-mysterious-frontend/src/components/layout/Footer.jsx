// src/components/layout/Footer.jsx

import { Link } from "react-router-dom";
import {
  IoTimeOutline,
  IoCallOutline,
  IoMailOutline,
  IoLocationOutline,
  IoLogoFacebook,
  IoLogoTiktok,
  IoLogoYoutube,
  IoLogoInstagram,
} from "react-icons/io5";

export default function Footer() {
  const navLinks = [
    { name: "Destinos", href: "/tours" },
    { name: "Hoteles", href: "/hoteles" },
    { name: "Contacto", href: "/contacto" },
    { name: "Nosotros", href: "/nosotros" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <footer className="bg-pm-black text-white/85 font-metropolis">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Logo + medios de pago */}
          <div className="flex flex-col">
            <img
              src="/logo-peru-mysterious-blanco.png"
              alt="Logo Perú Mysterious"
              className="w-[200px] h-auto object-contain"
            />
            <p className="text-xs tracking-widest mt-1 ml-1 text-white/70">
              TOUR OPERATOR
            </p>

            <div className="mt-6">
              <img
                src="/images/payment-methods.png"
                alt="Métodos de pago aceptados"
                className="w-[200px] h-auto object-contain"
              />
            </div>
          </div>

          {/* Col 2: Horarios */}
          <div>
            <h4 className="font-russo-one text-lg text-white mb-4">
              HORARIOS DE OFICINA
            </h4>

            <div className="flex items-center gap-3 text-white/85">
              <IoTimeOutline />
              <span>Lunes a Viernes: 08:00 – 18:00</span>
            </div>

            <p className="font-semibold mt-4">Sábados y Domingos:</p>
            <div className="flex items-center gap-3 mt-2 text-white/85">
              <IoTimeOutline />
              <span>08:00 – 18:00</span>
            </div>
          </div>

          {/* Col 3: Menú */}
          <div>
            <h4 className="font-russo-one text-lg text-white mb-4">
              MENÚ DE NAVEGACIÓN
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="inline-flex items-center gap-2 hover:text-pm-gold transition-colors"
                  >
                    <span className="text-pm-gold">•</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contacto */}
          <div>
            <h4 className="font-russo-one text-lg text-white mb-4">
              CONTÁCTANOS
            </h4>

            <div className="flex items-start gap-3 mb-3">
              <IoCallOutline className="mt-1" />
              <div className="flex flex-col gap-1">
                <a href="tel:+51949141112" className="hover:text-pm-gold transition-colors block">
                  +51 949 141 112
                </a>
                <a href="tel:+51931614600" className="hover:text-pm-gold transition-colors block">
                  +51 931 614 600
                </a>
                <a href="tel:+51954255744" className="hover:text-pm-gold transition-colors block">
                  +51 954 255 744
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 mb-3">
              <IoMailOutline className="mt-1" />
              <div className="flex flex-col gap-1">
                <a
                  href="mailto:info@perumysterious.com"
                  className="hover:text-pm-gold transition-colors block"
                >
                  info@perumysterious.com
                </a>
                <a
                  href="mailto:reservas@perumysterious.com"
                  className="hover:text-pm-gold transition-colors block"
                >
                  reservas@perumysterious.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <IoLocationOutline className="mt-1" />
              <p>Av. Tullumayo 257</p>
            </div>
          </div>
        </div>

        {/* Redes sociales */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex justify-center items-center gap-4">
            <a
              href="https://facebook.com/perumysterious"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="p-2 rounded-full ring-1 ring-white/10 hover:ring-pm-gold hover:text-pm-gold transition-colors"
            >
              <IoLogoFacebook size={22} />
            </a>
            <a
              href="https://tiktok.com/@perumysterious"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="p-2 rounded-full ring-1 ring-white/10 hover:ring-pm-gold hover:text-pm-gold transition-colors"
            >
              <IoLogoTiktok size={22} />
            </a>
            <a
              href="https://youtube.com/@perumysterious"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="p-2 rounded-full ring-1 ring-white/10 hover:ring-pm-gold hover:text-pm-gold transition-colors"
            >
              <IoLogoYoutube size={22} />
            </a>
            <a
              href="https://instagram.com/perumysterious"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-2 rounded-full ring-1 ring-white/10 hover:ring-pm-gold hover:text-pm-gold transition-colors"
            >
              <IoLogoInstagram size={22} />
            </a>
          </div>

          {/* Copy */}
          <p className="text-center text-white/60 text-sm mt-8">
            &copy; {new Date().getFullYear()} Perú Mysterious. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}