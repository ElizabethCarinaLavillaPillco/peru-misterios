<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Tour;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function un_usuario_puede_ver_sus_reservas()
    {
        $user = User::factory()->create();
        Booking::factory()->count(3)->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')
                         ->getJson('/api/my-bookings');

        $response->assertStatus(200)
                 ->assertJsonCount(3);
    }

    /** @test */
    public function un_usuario_puede_crear_una_reserva()
    {
        $user = User::factory()->create();
        $tour = Tour::factory()->create(['price' => 500]);

        $response = $this->actingAs($user, 'sanctum')
                         ->postJson('/api/bookings', [
                             'tour_id' => $tour->id,
                             'travel_date' => now()->addDays(15)->format('Y-m-d'),
                             'number_of_people' => 2,
                         ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('bookings', [
            'user_id' => $user->id,
            'tour_id' => $tour->id,
            'number_of_people' => 2,
            'total_price' => 1000, // 500 * 2
        ]);
    }

    /** @test */
    public function un_usuario_puede_cancelar_su_reserva()
    {
        $user = User::factory()->create();
        $booking = Booking::factory()->create([
            'user_id' => $user->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($user, 'sanctum')
                         ->postJson("/api/bookings/{$booking->id}/cancel");

        $response->assertStatus(200);

        $this->assertDatabaseHas('bookings', [
            'id' => $booking->id,
            'status' => 'cancelled',
        ]);
    }

    /** @test */
    public function un_admin_puede_ver_todas_las_reservas()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        Booking::factory()->count(5)->create();

        $response = $this->actingAs($admin, 'sanctum')
                         ->getJson('/api/admin/bookings');

        $response->assertStatus(200)
                 ->assertJsonCount(5, 'data');
    }

    /** @test */
    public function un_admin_puede_actualizar_el_estado_de_una_reserva()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $booking = Booking::factory()->create(['status' => 'pending']);

        $response = $this->actingAs($admin, 'sanctum')
                         ->putJson("/api/admin/bookings/{$booking->id}/status", [
                             'status' => 'confirmed',
                         ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('bookings', [
            'id' => $booking->id,
            'status' => 'confirmed',
        ]);
    }

    /** @test */
    public function un_usuario_no_puede_ver_las_reservas_de_otros()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $booking = Booking::factory()->create(['user_id' => $user2->id]);

        $response = $this->actingAs($user1, 'sanctum')
                         ->getJson("/api/bookings/{$booking->id}");

        $response->assertStatus(403);
    }
}