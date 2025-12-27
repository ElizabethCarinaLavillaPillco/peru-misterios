<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function un_usuario_puede_registrarse(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Juan Pérez',
            'email' => 'juan@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'data' => [
                         'user' => ['id', 'name', 'email'],
                         'token'
                     ]
                 ]);

        $this->assertDatabaseHas('users', [
            'email' => 'juan@example.com',
        ]);
    }

    #[Test]
    public function el_registro_requiere_campos_obligatorios(): void
    {
        $response = $this->postJson('/api/register', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    #[Test]
    public function el_email_debe_ser_unico(): void
    {
        User::factory()->create(['email' => 'juan@example.com']);

        $response = $this->postJson('/api/register', [
            'name' => 'Juan Pérez',
            'email' => 'juan@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
    }

    #[Test]
    public function un_usuario_puede_iniciar_sesion(): void
    {
        $user = User::factory()->create([
            'email' => 'juan@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'juan@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'data' => [
                         'user' => ['id', 'name', 'email'],
                         'token'
                     ]
                 ]);
    }

    #[Test]
    public function el_login_falla_con_credenciales_incorrectas(): void
    {
        $user = User::factory()->create([
            'email' => 'juan@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'juan@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401);
    }

    #[Test]
    public function un_usuario_autenticado_puede_obtener_su_perfil(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
                         ->getJson('/api/me');

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'data' => [
                         'id' => $user->id,
                         'email' => $user->email,
                     ]
                 ]);
    }

    #[Test]
    public function un_usuario_autenticado_puede_cerrar_sesion(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
                         ->postJson('/api/logout');

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'message' => 'Sesión cerrada exitosamente'
                 ]);
    }

    #[Test]
    public function un_usuario_puede_actualizar_su_perfil(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
                         ->putJson('/api/profile', [
                             'name' => 'Nuevo Nombre',
                             'email' => 'nuevo@example.com',
                         ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Nuevo Nombre',
            'email' => 'nuevo@example.com',
        ]);
    }

    #[Test]
    public function un_usuario_puede_cambiar_su_contrasena(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('oldpassword'),
        ]);

        $response = $this->actingAs($user, 'sanctum')
                         ->postJson('/api/change-password', [
                             'current_password' => 'oldpassword',
                             'new_password' => 'newpassword123',
                             'new_password_confirmation' => 'newpassword123',
                         ]);

        $response->assertStatus(200);
    }
}