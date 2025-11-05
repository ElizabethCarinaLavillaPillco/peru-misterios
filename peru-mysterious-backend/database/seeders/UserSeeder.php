<?php
// ============================================
// database/seeders/UserSeeder.php
// ============================================

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin principal
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@perumysterious.com',
            'password' => Hash::make('password123'),
            'phone' => '+51949141112',
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Cliente de ejemplo
        User::create([
            'name' => 'Cliente Demo',
            'email' => 'cliente@example.com',
            'password' => Hash::make('password123'),
            'phone' => '+51987654321',
            'role' => 'client',
            'is_active' => true,
        ]);

        // Más usuarios de prueba
        User::factory(10)->create([
            'role' => 'client',
            'is_active' => true,
        ]);
    }
}
