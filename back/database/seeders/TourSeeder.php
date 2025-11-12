<?php

// ============================================
// database/seeders/TourSeeder.php
// ============================================

namespace Database\Seeders;

use App\Models\Tour;
use App\Models\Category;
use Illuminate\Database\Seeder;

class TourSeeder extends Seeder
{
    public function run(): void
    {
        $tours = [
            [
                'category_id' => Category::where('slug', 'cultural')->first()->id,
                'name' => 'Machu Picchu Maravilla del Mundo',
                'slug' => 'machu-picchu-maravilla-del-mundo',
                'description' => 'Descubre la majestuosa ciudadela inca de Machu Picchu, una de las Siete Maravillas del Mundo Moderno. Este tour te llevará a través de la historia, arquitectura y misterios de esta antigua ciudad.',
                'short_description' => 'Visita guiada a Machu Picchu con transporte y entrada incluida',
                'price' => 250.00,
                'discount_price' => 199.00,
                'duration_days' => 1,
                'duration_nights' => 0,
                'difficulty_level' => 'easy',
                'max_group_size' => 15,
                'included' => ['Transporte', 'Guía profesional', 'Entrada a Machu Picchu', 'Box lunch'],
                'not_included' => ['Propinas', 'Bebidas extras', 'Seguro de viaje'],
                'itinerary' => [
                    ['day' => 1, 'title' => 'Cusco - Machu Picchu - Cusco', 'description' => 'Recojo del hotel 4:00 AM, viaje en tren, tour guiado, almuerzo, retorno'],
                ],
                'languages' => ['Español', 'Inglés'],
                'location' => 'Cusco',
                'featured_image' => '/images/Machupicchu3.jpg',
                'gallery' => ['/images/Machupicchu.jpg', '/images/Machupicchu4.jpg', '/images/Machupicchu5.jpg'],
                'is_featured' => true,
                'is_active' => true,
                'rating' => 4.8,
                'total_reviews' => 124,
            ],
            [
                'category_id' => Category::where('slug', 'aventura')->first()->id,
                'name' => 'Montaña de 7 Colores - Vinicunca',
                'slug' => 'montana-7-colores-vinicunca',
                'description' => 'Experimenta la belleza natural de la Montaña de 7 Colores, también conocida como Vinicunca. Esta caminata te llevará a través de paisajes andinos impresionantes.',
                'short_description' => 'Trekking a la famosa montaña arcoíris',
                'price' => 80.00,
                'discount_price' => null,
                'duration_days' => 1,
                'duration_nights' => 0,
                'difficulty_level' => 'challenging',
                'max_group_size' => 12,
                'included' => ['Transporte', 'Guía', 'Desayuno', 'Almuerzo', 'Caballos de emergencia'],
                'not_included' => ['Bastones de trekking', 'Snacks personales'],
                'itinerary' => [
                    ['day' => 1, 'title' => 'Cusco - Vinicunca - Cusco', 'description' => 'Recojo 4:30 AM, desayuno, caminata 2 horas ida, 2 horas vuelta, almuerzo, retorno'],
                ],
                'languages' => ['Español', 'Inglés'],
                'location' => 'Cusco',
                'featured_image' => '/images/montana-de-colores.jpg',
                'gallery' => ['/images/montana-de-colores.jpg'],
                'is_featured' => true,
                'is_active' => true,
                'rating' => 4.7,
                'total_reviews' => 89,
            ],
            [
                'category_id' => Category::where('slug', 'naturaleza')->first()->id,
                'name' => 'Laguna Humantay - Full Day',
                'slug' => 'laguna-humantay-full-day',
                'description' => 'Visita la impresionante Laguna Humantay, ubicada al pie del nevado Salkantay. Sus aguas turquesas te dejarán sin aliento.',
                'short_description' => 'Excursión de un día a la hermosa laguna turquesa',
                'price' => 70.00,
                'discount_price' => 60.00,
                'duration_days' => 1,
                'duration_nights' => 0,
                'difficulty_level' => 'moderate',
                'max_group_size' => 15,
                'included' => ['Transporte', 'Guía', 'Desayuno', 'Almuerzo'],
                'not_included' => ['Caballos', 'Entrada S/10'],
                'itinerary' => [
                    ['day' => 1, 'title' => 'Cusco - Soraypampa - Humantay - Cusco', 'description' => 'Salida 4:00 AM, desayuno en ruta, caminata 1.5 horas, tiempo libre, retorno'],
                ],
                'languages' => ['Español', 'Inglés'],
                'location' => 'Cusco',
                'featured_image' => '/images/LagunaHumantay.jpg',
                'gallery' => ['/images/LagunaHumantay.jpg', '/images/LagunaHumantay2.jpg'],
                'is_featured' => false,
                'is_active' => true,
                'rating' => 4.6,
                'total_reviews' => 67,
            ],
            [
                'category_id' => Category::where('slug', 'paquetes-completos')->first()->id,
                'name' => 'Explore Perú en 7 días 6 noches',
                'slug' => 'explore-peru-7-dias',
                'description' => 'Paquete completo que incluye lo mejor de Perú: Lima, Cusco, Valle Sagrado, Machu Picchu y más.',
                'short_description' => 'Tour completo por los destinos más importantes de Perú',
                'price' => 549.00,
                'discount_price' => null,
                'duration_days' => 7,
                'duration_nights' => 6,
                'difficulty_level' => 'easy',
                'max_group_size' => 20,
                'included' => ['Hoteles 3*', 'Transporte', 'Guías', 'Entradas', 'Desayunos'],
                'not_included' => ['Vuelos', 'Almuerzos', 'Cenas', 'Propinas'],
                'itinerary' => [
                    ['day' => 1, 'title' => 'Lima City Tour', 'description' => 'Recojo del aeropuerto, tour por Lima colonial y moderna'],
                    ['day' => 2, 'title' => 'Lima - Cusco', 'description' => 'Vuelo a Cusco, aclimatación, tour por la ciudad'],
                    ['day' => 3, 'title' => 'Valle Sagrado', 'description' => 'Pisac, Ollantaytambo, Chinchero'],
                    ['day' => 4, 'title' => 'Machu Picchu', 'description' => 'Tren, visita guiada, retorno'],
                    ['day' => 5, 'title' => 'Laguna Humantay', 'description' => 'Excursión full day'],
                    ['day' => 6, 'title' => 'Montaña 7 Colores', 'description' => 'Trekking a Vinicunca'],
                    ['day' => 7, 'title' => 'Cusco - Lima', 'description' => 'Transfer al aeropuerto'],
                ],
                'languages' => ['Español', 'Inglés'],
                'location' => 'Lima - Cusco',
                'featured_image' => '/images/Machupicchu.jpg',
                'gallery' => ['/images/CuscoCatedral.jpg', '/images/LagunaHumantay.jpg'],
                'is_featured' => true,
                'is_active' => true,
                'rating' => 4.9,
                'total_reviews' => 156,
            ],
            [
                'category_id' => Category::where('slug', 'cultural')->first()->id,
                'name' => 'City Tour Cusco Medio Día',
                'slug' => 'city-tour-cusco-medio-dia',
                'description' => 'Recorre los principales atractivos de Cusco: Qoricancha, Sacsayhuamán, Qenqo, Puka Pukara y Tambomachay.',
                'short_description' => 'Tour de medio día por Cusco y ruinas cercanas',
                'price' => 35.00,
                'discount_price' => 29.00,
                'duration_days' => 1,
                'duration_nights' => 0,
                'difficulty_level' => 'easy',
                'max_group_size' => 20,
                'included' => ['Transporte', 'Guía profesional'],
                'not_included' => ['Boleto turístico S/70', 'Entrada Qoricancha S/15'],
                'itinerary' => [
                    ['day' => 1, 'title' => 'Cusco City Tour', 'description' => '13:30 - 18:30 hrs. Qoricancha, Sacsayhuamán, Qenqo, Puka Pukara, Tambomachay'],
                ],
                'languages' => ['Español', 'Inglés'],
                'location' => 'Cusco',
                'featured_image' => '/images/Sacsaywaman2.jpg',
                'gallery' => ['/images/CuscoCatedral.jpg', '/images/Sacsaywaman2.jpg'],
                'is_featured' => false,
                'is_active' => true,
                'rating' => 4.5,
                'total_reviews' => 42,
            ],
        ];

        foreach ($tours as $tour) {
            Tour::create($tour);
        }
    }
}
