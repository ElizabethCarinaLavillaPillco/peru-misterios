<?php

namespace Database\Factories;

use App\Models\Tour;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CartItemFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'tour_id' => Tour::factory(),
            'travel_date' => fake()->dateTimeBetween('+1 week', '+3 months'),
            'number_of_people' => fake()->numberBetween(1, 5),
        ];
    }
}