<?php
// app/Models/User.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'address',
        'avatar',
        'role',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    // Verificar si el usuario es admin
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    // Verificar si el usuario es cliente
    public function isClient(): bool
    {
        return $this->role === 'client';
    }

    // Scope para obtener solo admins
    public function scopeAdmins($query)
    {
        return $query->where('role', 'admin');
    }

    // Scope para obtener solo clientes
    public function scopeClients($query)
    {
        return $query->where('role', 'client');
    }

    // Scope para obtener usuarios activos
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}