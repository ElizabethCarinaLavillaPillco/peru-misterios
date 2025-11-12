<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TourFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->sentence(3);
        $price = fake()->randomFloat(2, 50, 1000);
        
        return [
            'category_id' => Category::factory(),
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => fake()->paragraphs(3, true),
            'short_description' => fake()->sentence(),
            'price' => $price,
            'discount_price' => fake()->boolean(30) ? $price * 0.8 : null,
            'duration_days' => fake()->numberBetween(1, 10),
            'duration_nights' => fake()->numberBetween(0, 9),
            'difficulty_level' => fake()->randomElement(['easy', 'moderate', 'challenging']),
            'max_group_size' => fake()->numberBetween(5, 20),
            'included' => [
                'Transporte',
                'Guía turístico',
                'Entradas',
            ],
            'not_included' => [
                'Comidas',
                'Propinas',
            ],
            'itinerary' => [
                ['day' => 1, 'title' => 'Día 1', 'description' => 'Inicio del tour'],
                ['day' => 2, 'title' => 'Día 2', 'description' => 'Continuación'],
            ],
            'languages' => ['Español', 'Inglés'],
            'location' => fake()->city(),
            'featured_image' => 'https://via.placeholder.com/800x600',
            'gallery' => [
                'https://via.placeholder.com/800x600',
                'https://via.placeholder.com/800x600',
            ],
            'is_featured' => fake()->boolean(20),
            'is_active' => true,
            'rating' => fake()->randomFloat(1, 3, 5),
            'total_reviews' => fake()->numberBetween(0, 100),
        ];
    }

    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}