// app/paquetes/c/[categoria]/page.jsx
import  React from "react";
import Page from "../../page";

export default function CategoriaPage({ params, searchParams }) {
  // Inyectamos la categoría en searchParams para que el listado la filtre
  return <Page searchParams={{ ...searchParams, categoria: params.categoria }} />;
}

export async function generateMetadata({ params }) {
  return {
    title: `Paquetes ${params.categoria} | Perú Mysterious`,
  };
}
