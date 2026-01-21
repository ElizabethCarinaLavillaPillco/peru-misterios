<?php
// app/Models/Destination.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Destination extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'short_description',
        'featured_image',
        'gallery',
        'is_active',
        'order',
    ];

    protected $casts = [
        'gallery' => 'array',
        'is_active' => 'boolean',
    ];

    // Relación con tours
    public function tours()
    {
        return $this->hasMany(Tour::class);
    }

    // Scope para destinos activos
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Auto-generar slug
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($destination) {
            if (!$destination->slug) {
                $destination->slug = Str::slug($destination->name);
            }
        });
    }
}