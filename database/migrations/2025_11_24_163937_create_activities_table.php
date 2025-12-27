<?php
// database/migrations/2024_01_11_000000_create_activities_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('short_description')->nullable();
            $table->longText('description');
            $table->string('featured_image')->nullable();
            $table->json('gallery_images')->nullable(); // Array de URLs de imágenes

            // Información de la actividad
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');
            $table->string('location');
            $table->decimal('price', 10, 2);
            $table->integer('duration_hours')->nullable(); // Duración en horas
            $table->string('duration_text')->nullable(); // "2-3 horas", "Medio día", etc.
            $table->enum('difficulty_level', ['easy', 'moderate', 'challenging', 'difficult'])->default('moderate');
            $table->integer('min_age')->nullable();
            $table->integer('max_group_size')->nullable();

            // Qué incluye
            $table->json('included')->nullable(); // Array de strings
            $table->json('not_included')->nullable(); // Array de strings
            $table->json('requirements')->nullable(); // Array de requisitos
            $table->json('recommendations')->nullable(); // Array de recomendaciones

            // Disponibilidad
            $table->json('available_days')->nullable(); // ['monday', 'tuesday', ...]
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();

            // SEO y control
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('views')->default(0);
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('reviews_count')->default(0);

            $table->timestamps();

            // Índices
            $table->index('slug');
            $table->index('category_id');
            $table->index('is_active');
            $table->index('is_featured');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
