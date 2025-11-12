<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function un_admin_puede_listar_todos_los_usuarios()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        User::factory()->count(5)->create();

        $response = $this->actingAs($admin, 'sanctum')
                         ->getJson('/api/admin/users');

        $response->assertStatus(200);
    }

    /** @test */
    public function un_usuario_normal_no_puede_listar_usuarios()
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user, 'sanctum')
                         ->getJson('/api/admin/users');

        $response->assertStatus(403);
    }

    /** @test */
    public function un_admin_puede_crear_un_usuario()
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin, 'sanctum')
                         ->postJson('/api/admin/users', [
                             'name' => 'Nuevo Usuario',
                             'email' => 'nuevo@example.com',
                             'password' => 'password123',
                             'role' => 'user',
                         ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('users', [
            'email' => 'nuevo@example.com',
        ]);
    }

    /** @test */
    public function un_admin_puede_actualizar_un_usuario()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['name' => 'Nombre Original']);

        $response = $this->actingAs($admin, 'sanctum')
                         ->putJson("/api/admin/users/{$user->id}", [
                             'name' => 'Nombre Actualizado',
                         ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Nombre Actualizado',
        ]);
    }

    /** @test */
    public function un_admin_puede_eliminar_un_usuario()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create();

        $response = $this->actingAs($admin, 'sanctum')
                         ->deleteJson("/api/admin/users/{$user->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('users', [
            'id' => $user->id,
        ]);
    }

    /** @test */
    public function puede_obtener_estadisticas_de_usuarios()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        User::factory()->count(10)->create();

        $response = $this->actingAs($admin, 'sanctum')
                         ->getJson('/api/admin/users/stats');

        $response->assertStatus(200)
                 ->assertJsonStructure(['total_users', 'active_users']);
    }
}