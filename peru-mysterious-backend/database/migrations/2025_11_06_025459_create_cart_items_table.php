<?php
// ============================================
// database/migrations/2024_01_06_000000_create_cart_items_table.php
// ============================================

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('tour_id')->constrained()->onDelete('cascade');
            $table->date('travel_date');
            $table->integer('number_of_people')->default(1);
            $table->timestamps();
            
            // Un usuario no puede tener el mismo tour duplicado en el carrito
            $table->unique(['user_id', 'tour_id', 'travel_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};
