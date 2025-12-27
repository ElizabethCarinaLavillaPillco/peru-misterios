<?php
// =============================================================
// database/migrations/2024_01_XX_create_packages_table.php
// =============================================================

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->text('short_description')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('discount_price', 10, 2)->nullable();
            $table->integer('total_days');
            $table->integer('total_nights');
            $table->string('featured_image')->nullable();
            $table->json('images')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->unsignedBigInteger('category_id')->nullable();
            $table->string('difficulty_level')->default('moderate');
            $table->integer('max_group_size')->default(15);
            $table->json('included')->nullable();
            $table->json('not_included')->nullable();
            $table->decimal('rating', 2, 1)->nullable();
            $table->integer('total_reviews')->default(0);
            $table->timestamps();

            $table->foreign('category_id')->references('id')->on('categories')->onDelete('set null');
        });

        // Tabla pivote para packages y tours
        Schema::create('package_tour', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('package_id');
            $table->unsignedBigInteger('tour_id');
            $table->integer('day_number');
            $table->integer('order')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('package_id')->references('id')->on('packages')->onDelete('cascade');
            $table->foreign('tour_id')->references('id')->on('tours')->onDelete('cascade');
            
            $table->unique(['package_id', 'tour_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('package_tour');
        Schema::dropIfExists('packages');
    }
};