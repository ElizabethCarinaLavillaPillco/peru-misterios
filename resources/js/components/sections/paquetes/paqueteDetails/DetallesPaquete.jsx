import React from 'react';
import EncabezadoPaquete from "./EncabezadoPaquete";
import GaleriaPaquete from "./GaleriaPaquete";
import Itinerario from "./Itinerario";
import InfoTabs from "./InfoTabs";
import MapaRuta from "./MapaRuta";

/**
 * data esperada:
 * {
 *   titulo, ciudad, categoria, rating, duracion,
 *   imagenPrincipal, imagenes: [..],
 *   incluye: [..], noIncluye: [..], queLlevar: [..],
 *   itinerario: [{ titulo, descripcion, hitos[], comida, alojamiento }, ...],
 *   waypoints: [{ name, lat, lng }, ...],
 *   previewImg: "/img/mapas/preview.jpg" // opcional
 * }
 */
export default function DetallesPaquete({ data }) {
  return (
    <div className="space-y-6">
      <EncabezadoPaquete
        titulo={data.titulo}
        ciudad={data.ciudad}
        categoria={data.categoria}
        rating={data.rating}
        duracion={data.duracion}
      />

      <GaleriaPaquete
        imagenPrincipal={data.imagenPrincipal}
        imagenes={data.imgenes || data.imagenes || []}
      />

      <Itinerario dias={data.itinerario || []} />

      <InfoTabs
        incluye={data.incluye || []}
        noIncluye={data.noIncluye || []}
        queLlevar={data.queLlevar || []}
      />

      <MapaRuta waypoints={data.waypoints || []} previewImg={data.previewImg} />
    </div>
  );
}
