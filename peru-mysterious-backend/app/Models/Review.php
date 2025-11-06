<?php


// ============================================
// app/Models/Review.php
// ============================================

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'tour_id',
        'booking_id',
        'rating',
        'comment',
        'is_approved',
    ];

    protected $casts = [
        'is_approved' => 'boolean',
    ];

    // Relaciones
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tour()
    {
        return $this->belongsTo(Tour::class);
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    // Actualizar rating del tour al crear/actualizar reseña
    protected static function boot()
    {
        parent::boot();

        static::saved(function ($review) {
            $review->tour->updateRating();
        });

        static::deleted(function ($review) {
            $review->tour->updateRating();
        });
    }
}
