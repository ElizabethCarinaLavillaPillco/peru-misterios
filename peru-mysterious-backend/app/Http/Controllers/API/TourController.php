<?php
// app/Http/Controllers/API/TourController.php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Tour;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class TourController extends Controller
{
    /**
     * Listar tours (público)
     */
    public function index(Request $request)
    {
        $query = Tour::with('category')->active();

        // Filtros
        if ($request->has('category')) {
            $query->whereHas('category', function($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        if ($request->has('featured')) {
            $query->featured();
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
            });
        }

        if ($request->has('difficulty')) {
            $query->where('difficulty_level', $request->difficulty);
        }

        // Ordenar
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $tours = $query->paginate($request->get('per_page', 12));

        return response()->json([
            'success' => true,
            'data' => $tours
        ]);
    }

    /**
     * Mostrar un tour específico
     */
    public function show($slug)
    {
        $tour = Tour::with(['category', 'reviews' => function($q) {
            $q->where('is_approved', true)->with('user')->latest();
        }])->where('slug', $slug)->active()->first();

        if (!$tour) {
            return response()->json([
                'success' => false,
                'message' => 'Tour no encontrado'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $tour
        ]);
    }

    /**
     * Crear tour (admin)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:1',
            'duration_nights' => 'required|integer|min:0',
            'location' => 'required|string',
            'difficulty_level' => 'in:easy,moderate,challenging',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();
        $data['slug'] = Str::slug($request->name);

        $tour = Tour::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Tour creado exitosamente',
            'data' => $tour
        ], 201);
    }

    /**
     * Actualizar tour (admin)
     */
    public function update(Request $request, $id)
    {
        $tour = Tour::find($id);

        if (!$tour) {
            return response()->json([
                'success' => false,
                'message' => 'Tour no encontrado'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'category_id' => 'sometimes|exists:categories,id',
            'name' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric|min:0',
            'duration_days' => 'sometimes|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();
        if ($request->has('name')) {
            $data['slug'] = Str::slug($request->name);
        }

        $tour->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Tour actualizado exitosamente',
            'data' => $tour
        ]);
    }

    /**
     * Eliminar tour (admin)
     */
    public function destroy($id)
    {
        $tour = Tour::find($id);

        if (!$tour) {
            return response()->json([
                'success' => false,
                'message' => 'Tour no encontrado'
            ], 404);
        }

        $tour->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tour eliminado exitosamente'
        ]);
    }

    /**
     * Estadísticas de tours (admin)
     */
    public function stats()
    {
        $stats = [
            'total_tours' => Tour::count(),
            'active_tours' => Tour::active()->count(),
            'featured_tours' => Tour::featured()->count(),
            'total_bookings' => Tour::withCount('bookings')->get()->sum('bookings_count'),
            'average_rating' => round(Tour::where('total_reviews', '>', 0)->avg('rating'), 1),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
