<?php

namespace Database\Factories;

use App\Models\Tour;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookingFactory extends Factory
{
    public function definition(): array
    {
        $numberOfPeople = fake()->numberBetween(1, 5);
        $pricePerPerson = fake()->randomFloat(2, 100, 1000);
        $subtotal = $numberOfPeople * $pricePerPerson;
        $tax = $subtotal * 0.18;
        $total = $subtotal + $tax;
        
        return [
            'booking_number' => 'PM-' . strtoupper(fake()->unique()->lexify('??????')),
            'user_id' => User::factory(),
            'tour_id' => Tour::factory(),
            'travel_date' => fake()->dateTimeBetween('+1 week', '+3 months'),
            'number_of_people' => $numberOfPeople,
            'price_per_person' => $pricePerPerson,
            'subtotal' => $subtotal,
            'tax' => $tax,
            'total' => $total,
            'status' => fake()->randomElement(['pending', 'confirmed', 'completed', 'cancelled']),
            'payment_status' => fake()->randomElement(['pending', 'paid', 'refunded']),
            'payment_method' => fake()->randomElement(['card', 'cash', 'transfer']),
            'special_requests' => fake()->optional()->sentence(),
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'payment_status' => 'pending',
        ]);
    }

    public function confirmed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'confirmed',
            'payment_status' => 'paid',
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => fake()->sentence(),
        ]);
    }
}