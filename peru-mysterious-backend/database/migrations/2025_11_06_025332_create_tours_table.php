<?php
// ============================================
// database/migrations/2024_01_04_000000_create_tours_table.php
// ============================================

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tours', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->text('short_description')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('discount_price', 10, 2)->nullable();
            $table->integer('duration_days');
            $table->integer('duration_nights');
            $table->string('difficulty_level')->default('moderate'); // easy, moderate, challenging
            $table->integer('max_group_size')->default(15);
            $table->json('included')->nullable(); // ['Transporte', 'Guía', 'Comidas']
            $table->json('not_included')->nullable();
            $table->json('itinerary')->nullable(); // [{ day: 1, title: '', description: '' }]
            $table->json('languages')->nullable(); // ['Español', 'Inglés']
            $table->string('location');
            $table->string('featured_image')->nullable();
            $table->json('gallery')->nullable(); // ['img1.jpg', 'img2.jpg']
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->decimal('rating', 2, 1)->default(0);
            $table->integer('total_reviews')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tours');
    }
};