<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function puede_listar_todas_las_categorias()
    {
        Category::factory()->count(3)->create();

        $response = $this->getJson('/api/categories');

        $response->assertStatus(200)
                 ->assertJsonCount(3);
    }

    /** @test */
    public function un_admin_puede_crear_una_categoria()
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin, 'sanctum')
                         ->postJson('/api/admin/categories', [
                             'name' => 'Aventura',
                             'slug' => 'aventura',
                         ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('categories', [
            'slug' => 'aventura',
        ]);
    }

    /** @test */
    public function un_usuario_normal_no_puede_crear_categorias()
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user, 'sanctum')
                         ->postJson('/api/admin/categories', [
                             'name' => 'Aventura',
                             'slug' => 'aventura',
                         ]);

        $response->assertStatus(403);
    }
}