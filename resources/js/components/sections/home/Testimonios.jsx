import React from 'react';

import Slider from "react-slick";
import { IoStar, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const testimoniosData = [
  {
    id: 1,
    avatarUrl: '/images/avatares/avatar1.jpg',
    name: 'Juan M',
    date: '2023-08-12',
    rating: 5,
    reviewText: 'Wonderful experience. Thank you for your good hospitality, good stay and good service, it was a wonderful...'
  },
  {
    id: 2,
    avatarUrl: '/images/avatares/avatar2.jpg',
    name: 'Daniela',
    date: '2023-08-12',
    rating: 4,
    reviewText: 'Nice experience. The service was good, I enjoyed many beautiful landscapes, it is a very cultural country, the peopl...'
  },
  {
    id: 3,
    avatarUrl: '/images/avatares/avatar3.jpg',
    name: 'Cristian A',
    date: '2023-08-12',
    rating: 5,
    reviewText: 'Excellent service. An excellent experience, thank you very much for the excellent service, my family and I hope t...'
  },
  {
    id: 4,
    avatarUrl: '/images/avatares/avatar4.jpg',
    name: 'Celi V',
    date: '2023-08-01',
    rating: 5,
    reviewText: 'Good quality of service. Very good quality of service, punctuality, attention, support and kindness. Good monitorin...'
  },
];

const TestimonioCard = ({ avatarUrl, name, date, rating, reviewText }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full flex flex-col mx-2 md:mx-4">
      <div className="flex items-center mb-4">
        <img 
          src={avatarUrl} 
          alt={name} 
          className="w-14 h-14 rounded-full object-cover"
        />
        <div className="ml-4">
          <h4 className="font-bold text-gray-800">{name}</h4>
          <p className="text-xs text-gray-400">{date}</p>
        </div>
      </div>
      <div className="flex text-amber-500 mb-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <IoStar key={index} className={index < rating ? 'text-amber-500' : 'text-gray-300'} />
        ))}
      </div>
      <p className="text-gray-600 text-sm flex-grow mb-4">"{reviewText}"</p>
      <a href="#" className="text-sm font-bold text-pm-gold mt-auto hover:text-pm-gold-dark self-start">Leer más</a>
    </div>
  );
};

const NextArrow = ({ onClick }) => (
  <button onClick={onClick} className="absolute top-1/2 -right-4 md:-right-8 transform -translate-y-1/2 text-3xl text-gray-400 hover:text-gray-800 z-10 p-2 rounded-full bg-white/50 hover:bg-white shadow-md transition-all">
    <IoChevronForward />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button onClick={onClick} className="absolute top-1/2 -left-4 md:-left-8 transform -translate-y-1/2 text-3xl text-gray-400 hover:text-gray-800 z-10 p-2 rounded-full bg-white/50 hover:bg-white shadow-md transition-all">
    <IoChevronBack />
  </button>
);

export default function Testimonios() {
  const settings = {
    dots: false,
    infinite: testimoniosData.length > 3,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-12 lg:px-16">
        <h2 className="text-4xl font-russo-one text-center text-gray-800 mb-12">
          Testimonios
        </h2>

        <Slider {...settings}>
          {testimoniosData.map((testimonio) => (
            <div key={testimonio.id} className="py-4">
              <TestimonioCard {...testimonio} />
            </div>
          ))}
        </Slider>

        <div className="text-center mt-12">
          <a 
            href="https://www.tripadvisor.com.pe/Attraction_Review-g294314-d23703306-Reviews-Peru_Mysterious-Cusco_Cusco_Region.html"
            className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors inline-block"
            target="_blank" 
            rel="noopener noreferrer"
          >
            Leer más reseñas en Tripadvisor
          </a>
        </div>
      </div>
    </section>
  );
}