<?php


// ============================================
// app/Models/CartItem.php
// ============================================

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'tour_id',
        'travel_date',
        'number_of_people',
    ];

    protected $casts = [
        'travel_date' => 'date',
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

    // Calcular subtotal
    public function getSubtotalAttribute()
    {
        return $this->tour->final_price * $this->number_of_people;
    }
}