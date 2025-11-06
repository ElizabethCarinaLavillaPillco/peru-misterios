<?php
// database/seeders/CategorySeeder.php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Aventura',
                'slug' => 'aventura',
                'description' => 'Tours de aventura extrema y emocionantes experiencias',
                'is_active' => true,
            ],
            [
                'name' => 'Cultural',
                'slug' => 'cultural',
                'description' => 'Descubre la rica historia y cultura del Perú',
                'is_active' => true,
            ],
            [
                'name' => 'Naturaleza',
                'slug' => 'naturaleza',
                'description' => 'Explora la impresionante belleza natural del Perú',
                'is_active' => true,
            ],
            [
                'name' => 'Gastronomía',
                'slug' => 'gastronomia',
                'description' => 'Experiencias culinarias únicas',
                'is_active' => true,
            ],
            [
                'name' => 'Paquetes Completos',
                'slug' => 'paquetes-completos',
                'description' => 'Tours todo incluido con itinerarios completos',
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}