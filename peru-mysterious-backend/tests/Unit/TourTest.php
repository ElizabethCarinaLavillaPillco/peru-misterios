<?php

namespace Tests\Unit;

use App\Models\Category;
use App\Models\Tour;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TourTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function un_tour_pertenece_a_una_categoria()
    {
        $category = Category::factory()->create();
        $tour = Tour::factory()->create(['category_id' => $category->id]);

        $this->assertInstanceOf(Category::class, $tour->category);
        $this->assertEquals($category->id, $tour->category->id);
    }

    /** @test */
    public function un_tour_tiene_precio_formateado()
    {
        $tour = Tour::factory()->make(['price' => 500]);

        $this->assertEquals('S/ 500.00', $tour->formatted_price);
    }

    /** @test */
    public function un_tour_puede_ser_destacado()
    {
        $tour = Tour::factory()->create(['featured' => true]);

        $this->assertTrue($tour->featured);
    }
}