// src/components/layout/Navbar.jsx

import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  IoEarth,
  IoCartOutline,
  IoPersonCircleOutline,
  IoMenu,
  IoClose,
  IoChevronDown,
  IoSunnyOutline,
} from "react-icons/io5";
import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";

/* Links principales */
const navLinks = [
  {
    name: "Destinos",
    subLinks: [
      { name: "Cusco", href: "/destinos/cusco" },
      { name: "Arequipa", href: "/destinos/arequipa" },
      { name: "Puno", href: "/destinos/puno" },
      { name: "Ica", href: "/destinos/ica" },
      { name: "Huaraz", href: "/destinos/huaraz" },
      { name: "Manu", href: "/destinos/manu" },
    ],
  },
  { name: "Paquetes", href: "/tours?category=paquetes-completos" },
  {
    name: "Hoteles",
    href: "/hoteles",
    subLinks: [
      { name: "Cusco", href: "/hoteles/cusco" },
      { name: "Lima", href: "/hoteles/lima" },
    ],
  },
  {
    name: "Actividades",
    href: "/actividades",
    subLinks: [{ name: "Blog", href: "/blog" }],
  },
];

const secondaryNavLinks = [
  { name: "Nosotros", href: "/nosotros" },
  { name: "Contacto", href: "/contacto" },
  { name: "Ayuda", href: "/ayuda" },
];

/* Dropdown (desktop) – controlado por click */
function DesktopDropdown({ link, isOpen, onToggle, onClose, idx }) {
  const btnId = `menubtn-${idx}`;
  const menuId = `menu-${idx}`;

  return (
    <li className="relative">
      <button
        id={btnId}
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={onToggle}
        className="group relative flex items-center gap-1 text-[15px] font-medium text-white/90 transition-colors hover:text-pm-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-pm-gold/60 rounded"
      >
        {link.name}
        <IoChevronDown
          className={`ml-1 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          size={16}
        />
        <span
          className={`pointer-events-none absolute -bottom-2 left-0 h-[2px] bg-gradient-to-r from-pm-gold/0 via-pm-gold to-pm-gold/0 transition-all duration-300 ${
            isOpen ? "w-full opacity-100" : "w-0 opacity-0"
          }`}
        />
      </button>

      {link.subLinks && isOpen && (
        <div
          id={menuId}
          role="menu"
          aria-labelledby={btnId}
          className="absolute left-0 mt-4 w-60 rounded-2xl border border-white/10 bg-white/95 text-pm-black shadow-xl backdrop-blur-md ring-1 ring-black/5 overflow-hidden animate-in fade-in-50 slide-in-from-top-2"
        >
          <div className="py-2">
            {link.href && (
              <Link
                to={link.href}
                role="menuitem"
                onClick={onClose}
                className="block px-4 py-2 text-[15px] font-medium text-neutral-700 hover:bg-black/5 hover:text-pm-gold transition-colors"
              >
                Ver todas {link.name.toLowerCase()}
              </Link>
            )}

            {link.subLinks.map((s) => (
              <Link
                key={s.name}
                to={s.href}
                role="menuitem"
                onClick={onClose}
                className="block px-4 py-2 text-[15px] font-bold text-pm-gold hover:text-pm-gold-dark transition-colors hover:bg-black/5"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </li>
  );
}

/* Item móvil (con posible submenú) */
function MobileNavItem({ item, onClose }) {
  const [open, setOpen] = useState(false);

  if (item.subLinks) {
    return (
      <div className="border-b border-white/10">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between py-4 text-base text-white/90 transition-colors hover:text-white"
          aria-expanded={open}
        >
          <span>{item.name}</span>
          <IoChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="pl-3 pb-3 flex flex-col gap-2">
            {item.href && (
              <Link
                to={item.href}
                onClick={onClose}
                className="text-sm font-medium text-white/90 transition-colors hover:text-pm-gold"
              >
                Ver todas {item.name.toLowerCase()}
              </Link>
            )}

            {item.subLinks.map((s) => (
              <Link
                key={s.name}
                to={s.href}
                onClick={onClose}
                className="text-sm text-white/70 transition-colors hover:text-pm-gold"
              >
                {s.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={item.href || "#"}
      onClick={onClose}
      className="block py-4 text-base text-white/80 transition-colors hover:text-pm-gold border-b border-white/10"
    >
      {item.name}
    </Link>
  );
}

/* NAVBAR */
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const shellRef = useRef(null);
  const firstMobileBtnRef = useRef(null);
  
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  const { items } = useCartStore();
  const cartItemCount = items.length;

  useEffect(() => {
    const onDocClick = (e) => {
      if (shellRef.current && !shellRef.current.contains(e.target)) {
        setOpenMenu(null);
        setIsMoreOpen(false);
      }
    };
    const onEsc = (e) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setIsMoreOpen(false);
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = isMenuOpen ? "hidden" : prev || "";
    if (isMenuOpen) setTimeout(() => firstMobileBtnRef.current?.focus(), 0);
    return () => (document.body.style.overflow = prev || "");
  }, [isMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50">
        <div
          ref={shellRef}
          className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-4"
          aria-label="Barra de navegación principal"
        >
          <div
            className="
              relative flex items-center justify-between
              rounded-full border border-white/10
              bg-pm-black/70 backdrop-blur-xl
              shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]
              px-4 sm:px-6 h-16
            "
          >
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden text-white icon-outline transition-colors hover:text-pm-gold"
              aria-label="Abrir menú"
              ref={firstMobileBtnRef}
            >
              <IoMenu size={26} />
            </button>

            <ul className="hidden md:flex items-center gap-7" role="menubar">
              {navLinks.map((link, i) =>
                link.subLinks ? (
                  <DesktopDropdown
                    key={link.name}
                    link={link}
                    idx={i}
                    isOpen={openMenu === link.name}
                    onToggle={() =>
                      setOpenMenu((v) => (v === link.name ? null : link.name))
                    }
                    onClose={() => setOpenMenu(null)}
                  />
                ) : (
                  <li key={link.name}>
                    {(() => {
                      const isActive =
                        typeof link.href === "string" &&
                        (location.pathname === link.href || 
                         location.pathname.startsWith(link.href + "/"));

                      return (
                        <Link
                          to={link.href ?? "#"}
                          aria-current={isActive ? "page" : undefined}
                          className="
                            text-[15px] font-medium transition-colors focus:outline-none
                            focus-visible:ring-2 focus-visible:ring-pm-gold/60 rounded
                            text-white/90 hover:text-pm-gold
                            [&[aria-current='page']]:!text-white
                          "
                        >
                          {link.name}
                        </Link>
                      );
                    })()}
                  </li>
                )
              )}
            </ul>

            <div className="hidden md:flex items-center gap-2">
                {/* Carrito con Badge */}
                <Link
                  to="/cart"
                  title="Carrito"
                  className="p-2 rounded-full transition-colors hover:bg-white/10 text-white icon-outline relative"
                >
                  <IoCartOutline size={22} />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              
              <button 
                title="Cambiar idioma" 
                className="p-2 rounded-full transition-colors hover:bg-white/10 text-white icon-outline"
              >
                <IoEarth size={20} />
              </button>
              
              <button 
                title="Modo Claro/Oscuro" 
                className="p-2 rounded-full transition-colors hover:bg-white/10 text-white icon-outline"
              >
                <IoSunnyOutline size={20} />
              </button>
              
              {isAuthenticated ? (
                <Link 
                  to={user?.role === 'admin' ? '/admin' : '/mi-cuenta'} 
                  title="Mi Cuenta" 
                  className="p-2 rounded-full transition-colors hover:bg-white/10 text-white icon-outline"
                >
                  <IoPersonCircleOutline size={22} />
                </Link>
              ) : (
                <Link 
                  to="/login" 
                  title="Login" 
                  className="p-2 rounded-full transition-colors hover:bg-white/10 text-white icon-outline"
                >
                  <IoPersonCircleOutline size={22} />
                </Link>
              )}
              
              <div className="relative">
                <button
                  title="Más opciones"
                  onClick={() => setIsMoreOpen((v) => !v)}
                  className="p-2 rounded-full transition-colors hover:bg-white/10 text-white icon-outline"
                >
                  <IoMenu size={22} />
                </button>
                {isMoreOpen && (
                  <div className="absolute right-0 mt-3 w-48 rounded-2xl border border-white/10 bg-white/95 text-pm-black shadow-xl ring-1 ring-black/5 overflow-hidden">
                    <div className="py-1">
                      {secondaryNavLinks.map((s) => (
                        <Link
                          key={s.name}
                          to={s.href}
                          onClick={() => setIsMoreOpen(false)}
                          className="block px-4 py-2 text-sm transition-colors hover:bg-black/5 hover:text-pm-gold"
                        >
                          {s.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Link to="/" className="md:hidden">
              <img
                src="/logo-peru-mysterious-blanco.png"
                alt="Perú Mysterious"
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Medallón del logo */}
          <Link
            to="/"
            aria-label="Ir al inicio"
            className="
              group
              absolute left-1/2 top-1
              -translate-x-1/2
              hidden md:inline-flex
              items-center justify-center
              w-25 h-25 rounded-full
              bg-pm-black border border-blue/10
              shadow-[0_12px_40px_-12px_rgba(0,0,0,0.8)]
              overflow-hidden z-[1]
            "
          >
            <span className="pointer-events-none absolute inset-0 rounded-full">
              <span
                className="absolute inset-0 rounded-full opacity-20 blur-[2px]"
                style={{
                  background:
                    "conic-gradient(from 90deg, rgba(219,164,0,0.0), rgba(219,164,0,0.6), rgba(219,164,0,0.0))",
                }}
              />
            </span>
            <span className="absolute inset-[10px] rounded-full bg-gradient-to-b from-white/0 to-white/0 backdrop-blur" />
            <img
              src="/logo-peru-mysterious-blanco.png"
              alt="Perú Mysterious"
              className="relative z-10 object-contain p-3 w-[120px] h-[120px] transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </Link>
        </div>
      </header>

      {/* Drawer móvil */}
      <aside
        className={`md:hidden fixed top-0 left-0 z-50 h-full w-[92%] max-w-sm
          bg-gradient-to-b from-pm-black to-pm-black/95 text-white
          p-6 transition-transform duration-300 ease-in-out
          ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
          rounded-r-3xl border-r border-white/10`}
      >
        <div className="flex items-center justify-between">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            <img
              src="/logo-peru-mysterious-blanco.png"
              alt="Perú Mysterious"
              className="h-9 w-auto object-contain"
            />
          </Link>
          <button
            onClick={() => setIsMenuOpen(false)}
            aria-label="Cerrar menú"
            className="p-2 rounded-full transition-colors hover:bg-white/10 text-white icon-outline"
          >
            <IoClose size={24} />
          </button>
        </div>

        <nav className="mt-6">
          {navLinks.map((item) => (
            <MobileNavItem 
              key={item.name} 
              item={item} 
              onClose={() => setIsMenuOpen(false)}
            />
          ))}
        </nav>

        <div className="mt-4">
          {secondaryNavLinks.map((s) => (
            <Link
              key={s.name}
              to={s.href}
              onClick={() => setIsMenuOpen(false)}
              className="block py-3 text-sm text-white/80 transition-colors hover:text-pm-gold border-b border-white/10"
            >
              {s.name}
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
}