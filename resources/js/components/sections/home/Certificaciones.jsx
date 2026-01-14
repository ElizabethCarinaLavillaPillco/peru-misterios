import React from 'react';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';


const certificacionesData = [
  {
    logoUrl: '/images/certificaciones/mincetur.png',
    pdfUrl: '/certificados/certificado-mincetur.pdf',
    altText: 'Certificado MINCETUR'
  },
  {
    logoUrl: '/images/certificaciones/sernanp.png',
    pdfUrl: '/certificados/certificado-sernanp.pdf',
    altText: 'Certificado SERNANP'
  },
  {
    logoUrl: '/images/certificaciones/municipalidad-cusco.png',
    pdfUrl: '/certificados/certificado-municipalidad.pdf',
    altText: 'Certificado Municipalidad Provincial del Cusco'
  },
];

const NextArrow = ({ onClick }) => (
  <button onClick={onClick} className="absolute top-1/2 -right-10 transform -translate-y-1/2 text-2xl text-amber-600 hover:text-gray-800 z-10">
    <IoChevronForward />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button onClick={onClick} className="absolute top-1/2 -left-10 transform -translate-y-1/2 text-2xl text-amber-600 hover:text-gray-800 z-10">
    <IoChevronBack />
  </button>
);

function Certificaciones() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-12">
        <h2 className="text-2xl font-russo-one text-center text-gray-800 mb-8">
          CERTIFICADOS POR:
        </h2>

        <Slider {...settings}>
          {certificacionesData.map((cert) => (
            <div key={cert.altText} className="px-8">
              <a 
                href={cert.pdfUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex justify-center items-center h-24 filter grayscale hover:grayscale-0 transition-all duration-300"
              >
                <img 
                  src={cert.logoUrl} 
                  alt={cert.altText}
                  className="max-w-[150px] max-h-[60px] object-contain"
                />
              </a>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
export default Certificaciones;
