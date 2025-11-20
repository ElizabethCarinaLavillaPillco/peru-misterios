<?php
// =============================================================
// app/Models/Package.php (CORREGIDO)
// =============================================================

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'short_description',
        'price',
        'discount_price',
        'total_days',
        'total_nights',
        'featured_image',
        'images',
        'is_featured',
        'is_active',
        'category_id',
        'difficulty_level',
        'max_group_size',
        'included',
        'not_included',
        'rating',
        'total_reviews',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'images' => 'array',
        'included' => 'array',
        'not_included' => 'array',
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'rating' => 'decimal:1',
        'total_days' => 'integer',
        'total_nights' => 'integer',
        'max_group_size' => 'integer',
        'total_reviews' => 'integer',
    ];

    protected $appends = ['final_price'];

    /**
     * Relación con categoría
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Relación con tours (many-to-many)
     */
    public function tours()
    {
        return $this->belongsToMany(Tour::class, 'package_tour')
            ->withPivot('day_number', 'order', 'notes')
            ->withTimestamps()
            ->orderBy('package_tour.day_number')
            ->orderBy('package_tour.order');
    }

    /**
     * Relación con reservas
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Accessor para precio final
     */
    public function getFinalPriceAttribute()
    {
        return $this->discount_price ?? $this->price;
    }

    /**
     * Accessor para obtener el itinerario completo del paquete agrupado por días
     */
    public function getItineraryAttribute()
    {
        if (!$this->relationLoaded('tours')) {
            $this->load('tours');
        }

        return $this->tours
            ->groupBy('pivot.day_number')
            ->map(function ($tours, $day) {
                return [
                    'day' => $day,
                    'title' => "Día $day",
                    'tours' => $tours->map(function ($tour) {
                        return [
                            'id' => $tour->id,
                            'name' => $tour->name,
                            'slug' => $tour->slug,
                            'description' => $tour->description,
                            'short_description' => $tour->short_description,
                            'location' => $tour->location,
                            'duration_days' => $tour->duration_days,
                            'duration_nights' => $tour->duration_nights,
                            'featured_image' => $tour->featured_image,
                            'notes' => $tour->pivot->notes,
                            'order' => $tour->pivot->order,
                        ];
                    })->sortBy('order')->values()
                ];
            })->values();
    }
}