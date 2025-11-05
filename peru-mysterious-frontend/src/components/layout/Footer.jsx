import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-pm-black text-gray-300 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Logo */}
        <div>
          <img
            src="/logo-peru-mysterious-blanco.png"
            alt="Peru Mysterious"
            className="h-12 mb-4"
          />
          <p className="text-sm">
            Somos una agencia turística comprometida con mostrar
            la magia y cultura del Perú.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-bold text-white mb-3">Secciones</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-pm-gold">Inicio</Link></li>
            <li><Link to="/destinos" className="hover:text-pm-gold">Destinos</Link></li>
            <li><Link to="/tours" className="hover:text-pm-gold">Tours</Link></li>
            <li><Link to="/blog" className="hover:text-pm-gold">Blog</Link></li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="font-bold text-white mb-3">Contacto</h3>
          <ul className="space-y-2">
            <li>📍 Cusco, Perú</li>
            <li>📞 +51 999 999 999</li>
            <li>✉️ contacto@perumysterious.com</li>
          </ul>
        </div>

        {/* Redes */}
        <div>
          <h3 className="font-bold text-white mb-3">Síguenos</h3>
          <div className="flex gap-4 text-xl">
            <a href="#"><i className="ri-facebook-circle-fill"></i></a>
            <a href="#"><i className="ri-instagram-fill"></i></a>
            <a href="#"><i className="ri-tiktok-fill"></i></a>
          </div>
        </div>

      </div>

      <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-700 pt-5">
        © {new Date().getFullYear()} Peru Mysterious — Todos los derechos reservados.
      </div>
    </footer>
  );
}
