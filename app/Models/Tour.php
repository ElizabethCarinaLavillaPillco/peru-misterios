<?php


// ============================================
// app/Models/Tour.php
// ============================================

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Tour extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'destination_id', 
        'name',
        'slug',
        'description',
        'short_description',
        'price',
        'discount_price',
        'duration_days',
        'duration_nights',
        'difficulty_level',
        'max_group_size',
        'included',
        'not_included',
        'itinerary',
        'languages',
        'location',
        'featured_image',
        'gallery',
        'is_featured',
        'is_active',
        'rating',
        'total_reviews',
    ];

    protected $casts = [
        'included' => 'array',
        'not_included' => 'array',
        'itinerary' => 'array',
        'languages' => 'array',
        'gallery' => 'array',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'rating' => 'decimal:1',
    ];

    // Relaciones
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    // En app/Models/Tour.php
    public function packages()
    {
        return $this->belongsToMany(Package::class, 'package_tour')
            ->withPivot('day_number', 'order', 'notes')
            ->withTimestamps();
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
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

    // Accessors
    public function getFinalPriceAttribute()
    {
        return $this->discount_price ?? $this->price;
    }

    public function getHasDiscountAttribute()
    {
        return $this->discount_price && $this->discount_price < $this->price;
    }

    // Auto-generar slug
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($tour) {
            if (!$tour->slug) {
                $tour->slug = Str::slug($tour->name);
            }
        });
    }
    public function updateRating()
    {
        $reviews = $this->reviews()->where('is_approved', true)->get();
        
        if ($reviews->count() > 0) {
            $this->rating = round($reviews->avg('rating'), 1);
            $this->total_reviews = $reviews->count();
        } else {
            $this->rating = 0;
            $this->total_reviews = 0;
        }
        
        $this->save();
    }

    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }
}
