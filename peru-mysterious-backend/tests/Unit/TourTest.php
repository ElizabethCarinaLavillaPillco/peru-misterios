<?php

namespace Tests\Unit;

use App\Models\Category;
use App\Models\Tour;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class TourTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function un_tour_pertenece_a_una_categoria(): void
    {
        $category = Category::factory()->create();
        $tour = Tour::factory()->create(['category_id' => $category->id]);

        $this->assertInstanceOf(Category::class, $tour->category);
        $this->assertEquals($category->id, $tour->category->id);
    }

    #[Test]
    public function un_tour_tiene_precio_final(): void
    {
        $tour = Tour::factory()->create([
            'price' => 500,
            'discount_price' => null,
        ]);

        $this->assertEquals(500, $tour->final_price);
    }

    #[Test]
    public function un_tour_puede_ser_destacado(): void
    {
        $tour = Tour::factory()->featured()->create();

        $this->assertTrue($tour->is_featured);
    }

    #[Test]
    public function un_tour_tiene_descuento(): void
    {
        $tour = Tour::factory()->create([
            'price' => 500,
            'discount_price' => 400,
        ]);

        $this->assertTrue($tour->has_discount);
        $this->assertEquals(400, $tour->final_price);
    }
}