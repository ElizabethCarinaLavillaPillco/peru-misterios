<?php

namespace Tests\Feature;

use App\Models\CartItem;
use App\Models\Tour;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function un_usuario_puede_ver_su_carrito()
    {
        $user = User::factory()->create();
        $tour = Tour::factory()->create();
        
        CartItem::factory()->create([
            'user_id' => $user->id,
            'tour_id' => $tour->id,
        ]);

        $response = $this->actingAs($user, 'sanctum')
                         ->getJson('/api/cart');

        $response->assertStatus(200)
                 ->assertJsonCount(1);
    }

    /** @test */
    public function un_usuario_puede_agregar_un_tour_al_carrito()
    {
        $user = User::factory()->create();
        $tour = Tour::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
                         ->postJson('/api/cart', [
                             'tour_id' => $tour->id,
                             'quantity' => 2,
                             'travel_date' => now()->addDays(10)->format('Y-m-d'),
                         ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('cart_items', [
            'user_id' => $user->id,
            'tour_id' => $tour->id,
            'quantity' => 2,
        ]);
    }

    /** @test */
    public function un_usuario_puede_actualizar_la_cantidad_en_el_carrito()
    {
        $user = User::factory()->create();
        $cartItem = CartItem::factory()->create([
            'user_id' => $user->id,
            'quantity' => 1,
        ]);

        $response = $this->actingAs($user, 'sanctum')
                         ->putJson("/api/cart/{$cartItem->id}", [
                             'quantity' => 3,
                         ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('cart_items', [
            'id' => $cartItem->id,
            'quantity' => 3,
        ]);
    }

    /** @test */
    public function un_usuario_puede_eliminar_un_item_del_carrito()
    {
        $user = User::factory()->create();
        $cartItem = CartItem::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')
                         ->deleteJson("/api/cart/{$cartItem->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('cart_items', [
            'id' => $cartItem->id,
        ]);
    }

    /** @test */
    public function un_usuario_puede_vaciar_su_carrito()
    {
        $user = User::factory()->create();
        CartItem::factory()->count(3)->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')
                         ->deleteJson('/api/cart');

        $response->assertStatus(200);

        $this->assertDatabaseCount('cart_items', 0);
    }

    /** @test */
    public function un_usuario_no_puede_acceder_al_carrito_de_otro_usuario()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $cartItem = CartItem::factory()->create(['user_id' => $user2->id]);

        $response = $this->actingAs($user1, 'sanctum')
                         ->deleteJson("/api/cart/{$cartItem->id}");

        $response->assertStatus(404);
    }
}