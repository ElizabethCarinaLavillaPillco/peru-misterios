<?php
// app/Models/Activity.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'short_description',
        'description',
        'featured_image',
        'gallery_images',
        'category_id',
        'location',
        'price',
        'duration_hours',
        'duration_text',
        'difficulty_level',
        'min_age',
        'max_group_size',
        'included',
        'not_included',
        'requirements',
        'recommendations',
        'available_days',
        'start_time',
        'end_time',
        'is_featured',
        'is_active',
        'views',
        'rating',
        'reviews_count',
    ];

    protected $casts = [
        'gallery_images' => 'array',
        'included' => 'array',
        'not_included' => 'array',
        'requirements' => 'array',
        'recommendations' => 'array',
        'available_days' => 'array',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'price' => 'decimal:2',
        'rating' => 'decimal:2',
        'views' => 'integer',
        'reviews_count' => 'integer',
    ];

    // Relaciones
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }
}
