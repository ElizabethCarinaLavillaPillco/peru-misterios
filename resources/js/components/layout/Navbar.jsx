import React from 'react';

import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  IoEarth,
  IoCartOutline,
  IoPersonCircleOutline,
  IoMenu,
  IoClose,
  IoChevronDownOutline,
  IoSunnyOutline,
  IoHeartOutline,
  IoHeart,
} from "react-icons/io5";
import useAuthStore from "../../store/authStore";
import useCartStore from "../../store/cartStore";
import useFavoritesStore from "../../store/favoritesStore";

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
      { name: "Ver todos los tours", href: "/tours" },
    ],
  },
  {
    name: "Paquetes",
    href: "/packages"
  },
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

function DesktopDropdown({ link, isOpen, onToggle, onClose, idx }) {
  const btnId = "menubtn-" + idx;
  const menuId = "menu-" + idx;

  return (
    <li className="relative">
      <button
        id={btnId}
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={onToggle}
        className="group relative flex items-center gap-1 text-sm font-medium text-white/90 transition-colors hover:text-pm-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-pm-gold/60 rounded px-2 py-1"
      >
        {link.name}
        <IoChevronDownOutline 
          className={"ml-1 transition-transform duration-200 " + (isOpen ? "rotate-180" : "")}
          size={14}
        />
        <span
          className={"pointer-events-none absolute -bottom-2 left-2 right-2 h-[2px] bg-gradient-to-r from-pm-gold/0 via-pm-gold to-pm-gold/0 transition-all duration-300 " + (isOpen ? "w-full opacity-100" : "w-0 opacity-0")}
        />
      </button>

      {link.subLinks && isOpen && (
        <div
          id={menuId}
          role="menu"
          aria-labelledby={btnId}
          className="absolute left-0 mt-3 w-56 rounded-xl border border-white/10 bg-pm-black/95 text-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] backdrop-blur-md ring-1 ring-pm-gold/10 overflow-hidden z-50"
        >
          <div className="py-2">
            {link.href && (
              <Link
                to={link.href}
                role="menuitem"
                onClick={onClose}
                className="block px-4 py-2 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-pm-gold transition-colors"
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
                className="block px-4 py-2 text-sm font-medium text-white hover:bg-white/5 hover:text-pm-gold transition-colors"
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

function MobileNavItem({ item, onClose }) {
  const [open, setOpen] = useState(false);

  if (item.subLinks) {
    return (
      <div className="border-b border-white/10">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between py-4 text-base text-white/90 transition-colors hover:text-pm-gold"
          aria-expanded={open}
        >
          <span className="font-medium">{item.name}</span>
          <IoChevronDownOutline className={"transition-transform " + (open ? "rotate-180" : "")} />
        </button>

        {open && (
          <div className="pl-4 pb-3 flex flex-col gap-2">
            {item.href && (
              <Link
                to={item.href}
                onClick={onClose}
                className="text-sm font-medium text-white/70 transition-colors hover:text-pm-gold"
              >
                Ver todas {item.name.toLowerCase()}
              </Link>
            )}

            {item.subLinks.map((s) => (
              <Link
                key={s.name}
                to={s.href}
                onClick={onClose}
                className="text-sm text-white/60 transition-colors hover:text-pm-gold"
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
      className="block py-4 text-base font-medium text-white/90 transition-colors hover:text-pm-gold border-b border-white/10"
    >
      {item.name}
    </Link>
  );
}

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const shellRef = useRef(null);
  const firstMobileBtnRef = useRef(null);

  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  const { items } = useCartStore();
  const { favorites } = useFavoritesStore();

  const cartItemCount = items.length;
  const favoritesCount = favorites.length;

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
    if (isMenuOpen) {
      setTimeout(() => {
        if (firstMobileBtnRef.current) {
          firstMobileBtnRef.current.focus();
        }
      }, 0);
    }
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-pm-black/95 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div
          ref={shellRef}
          className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-3 pb-3"
          aria-label="Barra de navegación principal"
        >
          {/* Main Bar Container */}
          {/* CAMBIO APLICADO AQUÍ: border-pm-gold/30 y shadow dorado */}
          <div className="relative flex items-center justify-between rounded-full border border-pm-gold/30 bg-white/5 backdrop-blur-xl shadow-[0_0_15px_rgba(219,164,0,0.2)] px-4 sm:px-6 h-[64px]">
            
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden text-white transition-colors hover:text-pm-gold"
              aria-label="Abrir menú"
              ref={firstMobileBtnRef}
            >
              <IoMenu size={24} />
            </button>

            <ul className="hidden md:flex items-center gap-6" role="menubar">
              {navLinks.map((link, i) => {
                if (link.subLinks) {
                  return (
                    <DesktopDropdown
                      key={link.name}
                      link={link}
                      idx={i}
                      isOpen={openMenu === link.name}
                      onToggle={() => setOpenMenu((v) => (v === link.name ? null : link.name))}
                      onClose={() => setOpenMenu(null)}
                    />
                  );
                } else {
                  const isActive = typeof link.href === "string" && (location.pathname === link.href || location.pathname.startsWith(link.href + "/"));
                  return (
                    <li key={link.name}>
                      <Link
                        to={link.href || "#"}
                        aria-current={isActive ? "page" : undefined}
                        className={"text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pm-gold/60 rounded px-2 py-1 " + (isActive ? "text-pm-gold" : "text-white/80 hover:text-white")}
                      >
                        {link.name}
                      </Link>
                    </li>
                  );
                }
              })}
            </ul>

            <div className="hidden md:flex items-center gap-1">
              {isAuthenticated && (
                <Link
                  to="/mis-favoritos"
                  title="Mis Favoritos"
                  className="p-2 rounded-full transition-colors hover:bg-white/10 text-white/80 hover:text-pm-gold relative"
                >
                  {favoritesCount > 0 ? (
                    <IoHeart size={20} className="text-pm-gold" />
                  ) : (
                    <IoHeartOutline size={20} />
                  )}
                  {favoritesCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-pm-gold text-pm-black text-[10px] font-bold rounded-full flex items-center justify-center">
                      {favoritesCount}
                    </span>
                  )}
                </Link>
              )}

              <Link
                to="/cart"
                title="Carrito"
                className="p-2 rounded-full transition-colors hover:bg-white/10 text-white/80 hover:text-pm-gold relative"
              >
                <IoCartOutline size={20} />
                {cartItemCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-pm-gold text-pm-black text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              <button
                title="Cambiar idioma"
                className="p-2 rounded-full transition-colors hover:bg-white/10 text-white/80 hover:text-pm-gold"
              >
                <IoEarth size={18} />
              </button>

              <button
                title="Modo Claro/Oscuro"
                className="p-2 rounded-full transition-colors hover:bg-white/10 text-white/80 hover:text-pm-gold"
              >
                <IoSunnyOutline size={18} />
              </button>

              {isAuthenticated ? (
                <Link
                  to={user?.role === 'admin' ? '/admin' : '/mi-cuenta'}
                  title="Mi Cuenta"
                  className="p-2 rounded-full transition-colors hover:bg-white/10 text-white/80 hover:text-pm-gold"
                >
                  <IoPersonCircleOutline size={20} />
                </Link>
              ) : (
                <Link
                  to="/login"
                  title="Login"
                  className="p-2 rounded-full transition-colors hover:bg-white/10 text-white/80 hover:text-pm-gold"
                >
                  <IoPersonCircleOutline size={20} />
                </Link>
              )}

              <div className="relative">
                <button
                  title="Más opciones"
                  onClick={() => setIsMoreOpen((v) => !v)}
                  className="p-2 rounded-full transition-colors hover:bg-white/10 text-white/80 hover:text-pm-gold"
                >
                  <IoMenu size={20} />
                </button>
                {isMoreOpen && (
                  <div className="absolute right-0 mt-3 w-48 rounded-xl border border-white/10 bg-pm-black/95 text-white shadow-xl ring-1 ring-white/5 overflow-hidden backdrop-blur-md z-50">
                    <div className="py-1">
                      {secondaryNavLinks.map((s) => (
                        <Link
                          key={s.name}
                          to={s.href}
                          onClick={() => setIsMoreOpen(false)}
                          className="block px-4 py-2 text-sm font-medium transition-colors hover:bg-white/5 hover:text-pm-gold"
                        >
                          {s.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Link to="/" className="md:hidden flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pm-gold to-yellow-200 flex items-center justify-center text-pm-black font-bold text-xs">PM</div>
            </Link>
          </div>

          {/* Floating Center Logo (Desktop) */}
          {/* CAMBIO APLICADO AQUÍ: border-pm-gold y shadow dorado más fuerte */}
          <Link
            to="/"
            aria-label="Ir al inicio"
            className="group absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:inline-flex items-center justify-center w-[72px] h-[72px] rounded-full bg-pm-black border border-pm-gold shadow-[0_0_25px_rgba(219,164,0,0.6)] overflow-hidden z-[2] hover:scale-105 transition-transform duration-300"
          >
            <span className="pointer-events-none absolute inset-0 rounded-full">
              <span
                className="absolute inset-0 rounded-full opacity-40 blur-[4px]"
                style={{
                  background: "conic-gradient(from 90deg, rgba(219,164,0,0.0), rgba(219,164,0,1), rgba(219,164,0,0.0))",
                }}
              />
            </span>
            <img
              src="/images/logo-peru-mysterious-blanco.png" 
              alt="Perú Mysterious"
              className="relative z-10 object-contain w-[60%] h-[60%]"
            />
          </Link>
        </div>
      </header>

      <aside
        className={"md:hidden fixed top-0 left-0 z-[60] h-full w-[85%] max-w-sm bg-pm-black text-white p-6 transition-transform duration-300 ease-in-out shadow-2xl " + (isMenuOpen ? "translate-x-0" : "-translate-x-full")}
      >
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="font-serif text-xl font-bold text-pm-gold">
              PERU MYSTERIOUS
          </Link>
          <button
            onClick={() => setIsMenuOpen(false)}
            aria-label="Cerrar menú"
            className="p-2 rounded-full transition-colors hover:bg-white/10 text-white"
          >
            <IoClose size={24} />
          </button>
        </div>

        {isAuthenticated && (
          <div className="mt-6 flex gap-3 pb-6 border-b border-white/10">
            <Link
              to="/mis-favoritos"
              onClick={() => setIsMenuOpen(false)}
              className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-3 hover:bg-pm-gold hover:text-pm-gold-black hover:border-pm-gold transition-all relative"
            >
              <IoHeartOutline size={20} />
              <span className="text-sm font-medium">Favoritos</span>
              {favoritesCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-pm-gold rounded-full"></span>
              )}
            </Link>
            <Link
              to="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-3 hover:bg-pm-gold hover:text-pm-gold-black hover:border-pm-gold transition-all relative"
            >
              <IoCartOutline size={20} />
              <span className="text-sm font-medium">Carrito</span>
            </Link>
          </div>
        )}

        <nav className="mt-6 space-y-1">
          {navLinks.map((item) => (
            <MobileNavItem
              key={item.name}
              item={item}
              onClose={() => setIsMenuOpen(false)}
            />
          ))}
        </nav>

        <div className="mt-8 pt-6 border-t border-white/10">
          {secondaryNavLinks.map((s) => (
            <Link
              key={s.name}
              to={s.href}
              onClick={() => setIsMenuOpen(false)}
              className="block py-3 text-sm text-white/60 transition-colors hover:text-white"
            >
              {s.name}
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
}

export default Navbar;