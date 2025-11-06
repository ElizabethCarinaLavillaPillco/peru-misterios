import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  IoEarth,
  IoCartOutline,
  IoPersonCircleOutline,
  IoMenu,
  IoClose,
  IoChevronDown,
  IoSunnyOutline,
} from "react-icons/io5";

import InviteFriendsModal from "@/components/invite/InviteFriendsModal";
import { authAPI } from "@/lib/api";

// Links principales
const navLinks = [
  {
    name: "Destinos",
    subLinks: [
      { name: "Cusco", to: "/destinos" },
      { name: "Arequipa", to: "/destinos" },
      { name: "Puno", to: "/destinos" },
      { name: "Ica", to: "/destinos" },
      { name: "Huaraz", to: "/destinos" },
      { name: "Manu", to: "/destinos" },
    ],
  },
  { name: "Paquetes", to: "/paquetes" },
  {
    name: "Hoteles",
    to: "/hoteles",
    subLinks: [
      { name: "Cusco", to: "/hoteles/cusco" },
      { name: "Lima", to: "/hoteles/lima" },
    ],
  },
  {
    name: "Actividades",
    to: "/actividades",
    subLinks: [{ name: "Blog", to: "/actividades/blog" }],
  },
];

const secondaryNavLinks = [
  { name: "Nosotros", to: "/nosotros" },
  { name: "Contacto", to: "/contacto" },
  { name: "Ayuda", to: "/ayuda" },
];

// Desktop dropdown
function DesktopDropdown({ link, isOpen, onToggle, onClose, idx }) {
  return (
    <li className="relative">
      <button
        onClick={onToggle}
        className="group flex items-center gap-1 text-[15px] font-medium text-white/90 hover:text-pm-gold transition"
      >
        {link.name}
        <IoChevronDown
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && link.subLinks && (
        <div className="absolute left-0 mt-4 w-60 rounded-2xl bg-white text-pm-black shadow-xl p-2">
          {link.subLinks.map((s) => (
            <Link
              key={s.name}
              to={s.to}
              onClick={onClose}
              className="block px-4 py-2 text-[15px] text-neutral-700 hover:text-pm-gold transition"
            >
              {s.name}
            </Link>
          ))}
        </div>
      )}
    </li>
  );
}

// Item móvil
function MobileNavItem({ item }) {
  const [open, setOpen] = useState(false);

  if (item.subLinks) {
    return (
      <div className="border-b border-white/10">
        <button
          onClick={() => setOpen(!open)}
          className="flex w-full justify-between py-4 text-base text-white"
        >
          {item.name}
          <IoChevronDown className={`${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="pl-3 pb-3 flex flex-col gap-2">
            {item.subLinks.map((s) => (
              <Link key={s.name} to={s.to} className="text-white/70 hover:text-pm-gold">
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
      to={item.to || "#"}
      className="block py-4 text-base text-white border-b border-white/10"
    >
      {item.name}
    </Link>
  );
}

// NAVBAR
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const { pathname } = useLocation();

  const { isAuthenticated, user, logout } = useAuthStore();



  return (
    <>
      <header className="sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-4">
          <div className="flex justify-between items-center rounded-full bg-pm-black/70 border border-white/10 px-4 h-16">

            {/* MENU MOBILE */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden text-white"
            >
              <IoMenu size={26} />
            </button>

            {/* LINKS DESKTOP */}
            <ul className="hidden md:flex items-center gap-7">
              {navLinks.map((link, i) =>
                link.subLinks ? (
                  <DesktopDropdown
                    key={link.name}
                    link={link}
                    idx={i}
                    isOpen={openMenu === link.name}
                    onToggle={() =>
                      setOpenMenu(openMenu === link.name ? null : link.name)
                    }
                    onClose={() => setOpenMenu(null)}
                  />
                ) : (
                  <li key={link.name}>
                    <Link
                      to={link.to}
                      className="text-white/90 hover:text-pm-gold"
                    >
                      {link.name}
                    </Link>
                  </li>
                )
              )}
            </ul>

            {/* ICONOS DERECHA */}
            <div className="hidden md:flex items-center gap-3">
              {/* INVITE */}
              <button
                onClick={() => setInviteOpen(true)}
                className="px-4 py-1.5 rounded-full border border-pm-gold text-pm-gold hover:bg-pm-gold hover:text-black"
              >
                Invita a tus amigos
              </button>

              {/* NOT LOGGED → LOGIN Y REGISTER */}
              {!isAuthenticated && (
                <>
                  <Link to="/login" className="text-white hover:text-pm-gold">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-white hover:text-pm-gold"
                  >
                    Registro
                  </Link>
                </>
              )}

              {/* LOGGED → MI CUENTA */}
              {isAuthenticated && (
                <Link to="/mi-cuenta">
                  <IoPersonCircleOutline size={22} className="text-white hover:text-pm-gold" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Drawer móvil */}
      <aside
        className={`md:hidden fixed top-0 left-0 h-full w-[92%] max-w-sm bg-pm-black text-white p-6 transition-transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center">
          <img src="/logo-peru-mysterious-blanco.png" width={140} />

          <button onClick={() => setIsMenuOpen(false)}>
            <IoClose size={24} />
          </button>
        </div>

        <nav className="mt-6">
          {navLinks.map((item) => (
            <MobileNavItem key={item.name} item={item} />
          ))}

          {/* Login / Register mobile */}
          {!isAuthenticated && (
            <>
              <Link to="/login" className="block py-4 text-white">
                Login
              </Link>
              <Link to="/register" className="block py-4 text-white">
                Registro
              </Link>
            </>
          )}

          {isAuthenticated && (
            <Link to="/mi-cuenta" className="block py-4 text-white">
              Mi Cuenta
            </Link>
          )}
        </nav>
      </aside>

      <InviteFriendsModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </>
  );
}
