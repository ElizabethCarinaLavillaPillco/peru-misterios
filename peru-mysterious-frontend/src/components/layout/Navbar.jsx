import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const navLinks = [
    { name: "Inicio", to: "/" },
    { name: "Nosotros", to: "/nosotros" },
    { name: "Destinos", to: "/destinos" },
    { name: "Tours", to: "/tours" },
    { name: "Blog", to: "/blog" },
  ];

  const moreItems = [
    { name: "Contacto", to: "/contacto" },
    { name: "Preguntas frecuentes", to: "/preguntas" },
    { name: "Políticas", to: "/politicas" },
  ];

  return (
    <header className="w-full bg-pm-black text-white fixed top-0 z-50 shadow">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo-peru-mysterious-blanco.png"
            alt="Peru Mysterious"
            className="h-10 w-auto"
          />
        </Link>

        {/* NAV LINKS (DESKTOP) */}
        <ul className="hidden md:flex items-center gap-6 font-metropolis">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.to}
                className="hover:text-pm-gold transition"
              >
                {link.name}
              </Link>
            </li>
          ))}

          {/* More Dropdown */}
          <li className="relative">
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className="hover:text-pm-gold transition"
            >
              Más ▾
            </button>

            {isMoreOpen && (
              <ul className="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-md overflow-hidden">
                {moreItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.to}
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsMenuOpen(true)}
        >
          <FaBars />
        </button>
      </nav>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50">
          <div className="absolute right-0 top-0 h-full w-64 bg-pm-black p-6 shadow-lg flex flex-col gap-6">

            {/* Close */}
            <button
              className="text-white text-2xl self-end"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaTimes />
            </button>

            <ul className="flex flex-col gap-4 text-lg">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="block hover:text-pm-gold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              {/* ✅ Rutas públicas */}
          {!isAuthenticated && (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-pm-gold transition"
              >
                Iniciar sesión
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 bg-pm-gold text-white rounded-lg hover:bg-pm-gold-dark transition"
              >
                Crear cuenta
              </Link>
            </>
          )}

              {/* Extra items */}
              <div className="pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-300 mb-2">Más</p>
                {moreItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.to}
                      className="block hover:text-pm-gold"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </div>
            </ul>

          </div>
        </div>
      )}
    </header>
  );
}
