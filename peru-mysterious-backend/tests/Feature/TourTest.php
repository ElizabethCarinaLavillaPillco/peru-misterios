<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Tour;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TourTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function puede_listar_todos_los_tours()
    {
        Tour::factory()->count(5)->create();

        $response = $this->getJson('/api/tours');

        $response->assertStatus(200)
                 ->assertJsonCount(5, 'data');
    }

    /** @test */
    public function puede_obtener_un_tour_por_slug()
    {
        $tour = Tour::factory()->create([
            'slug' => 'machu-picchu-tour',
        ]);

        $response = $this->getJson("/api/tours/{$tour->slug}");

        $response->assertStatus(200)
                 ->assertJson([
                     'slug' => 'machu-picchu-tour',
                 ]);
    }

    /** @test */
    public function retorna_404_si_el_tour_no_existe()
    {
        $response = $this->getJson('/api/tours/tour-inexistente');

        $response->assertStatus(404);
    }

    /** @test */
    public function un_admin_puede_crear_un_tour()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $category = Category::factory()->create();

        $response = $this->actingAs($admin, 'sanctum')
                         ->postJson('/api/admin/tours', [
                             'title' => 'Tour a Cusco',
                             'slug' => 'tour-a-cusco',
                             'description' => 'Descripción del tour',
                             'price' => 500,
                             'duration' => 3,
                             'category_id' => $category->id,
                             'max_people' => 10,
                             'difficulty' => 'moderate',
                         ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('tours', [
            'slug' => 'tour-a-cusco',
        ]);
    }

    /** @test */
    public function un_usuario_normal_no_puede_crear_tours()
    {
        $user = User::factory()->create(['role' => 'user']);
        $category = Category::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
                         ->postJson('/api/admin/tours', [
                             'title' => 'Tour a Cusco',
                             'slug' => 'tour-a-cusco',
                             'description' => 'Descripción',
                             'price' => 500,
                             'duration' => 3,
                             'category_id' => $category->id,
                         ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function un_admin_puede_actualizar_un_tour()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $tour = Tour::factory()->create(['title' => 'Tour Original']);

        $response = $this->actingAs($admin, 'sanctum')
                         ->putJson("/api/admin/tours/{$tour->id}", [
                             'title' => 'Tour Actualizado',
                             'price' => 600,
                         ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('tours', [
            'id' => $tour->id,
            'title' => 'Tour Actualizado',
        ]);
    }

    /** @test */
    public function un_admin_puede_eliminar_un_tour()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $tour = Tour::factory()->create();

        $response = $this->actingAs($admin, 'sanctum')
                         ->deleteJson("/api/admin/tours/{$tour->id}");

        $response->assertStatus(200);

        $this->assertSoftDeleted('tours', [
            'id' => $tour->id,
        ]);
    }

    /** @test */
    public function puede_obtener_estadisticas_de_tours()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        Tour::factory()->count(10)->create();

        $response = $this->actingAs($admin, 'sanctum')
                         ->getJson('/api/admin/tours/stats');

        $response->assertStatus(200)
                 ->assertJsonStructure(['total_tours', 'active_tours']);
    }
}