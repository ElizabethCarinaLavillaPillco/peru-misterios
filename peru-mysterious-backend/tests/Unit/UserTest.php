<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function un_usuario_tiene_un_nombre_completo()
    {
        $user = User::factory()->make([
            'name' => 'Juan Pérez',
        ]);

        $this->assertEquals('Juan Pérez', $user->name);
    }

    /** @test */
    public function un_usuario_puede_ser_admin()
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->assertTrue($admin->isAdmin());
    }

    /** @test */
    public function un_usuario_normal_no_es_admin()
    {
        $user = User::factory()->create(['role' => 'user']);

        $this->assertFalse($user->isAdmin());
    }
}