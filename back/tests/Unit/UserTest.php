<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function un_usuario_tiene_un_nombre_completo(): void
    {
        $user = User::factory()->make([
            'name' => 'Juan Pérez',
        ]);

        $this->assertEquals('Juan Pérez', $user->name);
    }

    #[Test]
    public function un_usuario_puede_ser_admin(): void
    {
        $admin = User::factory()->admin()->create();

        $this->assertTrue($admin->isAdmin());
    }

    #[Test]
    public function un_usuario_normal_no_es_admin(): void
    {
        $user = User::factory()->create(['role' => 'client']);

        $this->assertFalse($user->isAdmin());
    }
}