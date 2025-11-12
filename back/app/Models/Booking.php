<?php


// ============================================
// app/Models/Booking.php
// ============================================

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_number',
        'user_id',
        'tour_id',
        'travel_date',
        'number_of_people',
        'price_per_person',
        'subtotal',
        'tax',
        'total',
        'status',
        'payment_status',
        'payment_method',
        'special_requests',
        'cancellation_reason',
        'cancelled_at',
    ];

    protected $casts = [
        'travel_date' => 'date',
        'price_per_person' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'tax' => 'decimal:2',
        'total' => 'decimal:2',
        'cancelled_at' => 'datetime',
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

    public function review()
    {
        return $this->hasOne(Review::class);
    }

    // Generar número de reserva único
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($booking) {
            if (!$booking->booking_number) {
                $booking->booking_number = 'PM-' . strtoupper(uniqid());
            }
        });
    }
}
