<?php
// app/Http/Controllers/API/TourController.php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Tour;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class TourController extends Controller
{
    /**
     * Listar tours (público)
     */
    public function index(Request $request)
    {
        try {
            $query = Tour::with('category')->where('is_active', true);

            // Filtrar por categoría
            if ($request->has('category') && $request->category) {
                $query->where('category_id', $request->category);
            }

            // Filtrar por ubicación/destino
            if ($request->has('location') && $request->location) {
                $query->where('location', 'like', '%' . $request->location . '%');
            }

            // Filtrar por precio mínimo
            if ($request->has('min_price') && $request->min_price) {
                $query->where('price', '>=', $request->min_price);
            }

            // Filtrar por precio máximo
            if ($request->has('max_price') && $request->max_price) {
                $query->where('price', '<=', $request->max_price);
            }

            // Filtrar por dificultad
            if ($request->has('difficulty') && $request->difficulty) {
                $query->where('difficulty_level', $request->difficulty);
            }

            // Filtrar por rating mínimo
            if ($request->has('min_rating') && $request->min_rating) {
                $query->where('average_rating', '>=', $request->min_rating);
            }

            // Búsqueda por texto
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%")
                      ->orWhere('short_description', 'like', "%{$search}%")
                      ->orWhere('location', 'like', "%{$search}%");
                });
            }

            // Ordenamiento
            if ($request->has('sort_by')) {
                switch ($request->sort_by) {
                    case 'price_asc':
                        $query->orderBy('price', 'asc');
                        break;
                    case 'price_desc':
                        $query->orderBy('price', 'desc');
                        break;
                    case 'rating':
                        $query->orderBy('average_rating', 'desc');
                        break;
                    case 'popular':
                        $query->orderBy('views', 'desc');
                        break;
                    case 'duration':
                        $query->orderBy('duration_days', 'asc');
                        break;
                    default:
                        $query->orderBy('created_at', 'desc');
                }
            } else {
                // Orden por defecto: destacados primero, luego por fecha
                $query->orderBy('is_featured', 'desc')
                      ->orderBy('created_at', 'desc');
            }

            $tours = $query->paginate($request->get('per_page', 12));

            return response()->json([
                'success' => true,
                'data' => $tours
            ]);
        } catch (\Exception $e) {
            Log::error('Error al cargar tours: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar tours',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Ver un tour por slug (público)
     */
    public function show($slug)
    {
        try {
            $tour = Tour::with(['category'])
                ->where(function($query) use ($slug) {
                    $query->where('slug', $slug)
                          ->orWhere('id', $slug);
                })
                ->where('is_active', true)
                ->first();

            if (!$tour) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tour no encontrado'
                ], 404);
            }

            // Incrementar vistas
            $tour->increment('views');

            return response()->json([
                'success' => true,
                'data' => $tour
            ]);
        } catch (\Exception $e) {
            Log::error('Error al cargar el tour: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar el tour',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Ver un tour por ID (admin) - NUEVO
     */
    public function showById($id)
    {
        try {
            $tour = Tour::with('category')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $tour
            ]);
        } catch (\Exception $e) {
            Log::error('Error al cargar tour por ID: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Tour no encontrado',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Crear tour (admin)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'short_description' => 'nullable|string|max:500',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'duration_days' => 'required|integer|min:1',
            'duration_nights' => 'required|integer|min:0',
            'difficulty_level' => 'required|in:easy,moderate,challenging,difficult',
            'max_group_size' => 'required|integer|min:1',
            'location' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $request->all();

            // Generar slug único
            $baseSlug = Str::slug($data['name']);
            $slug = $baseSlug;
            $counter = 1;

            while (Tour::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }

            $data['slug'] = $slug;

            // Asegurarse de que category_id sea null si no se proporciona
            if (!isset($data['category_id']) || empty($data['category_id'])) {
                $data['category_id'] = null;
            }

            $tour = Tour::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Tour creado exitosamente',
                'data' => $tour->load('category')
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error al crear el tour: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el tour',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar tour (admin)
     */
    public function update(Request $request, $id)
    {
        try {
            $tour = Tour::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'price' => 'sometimes|numeric|min:0',
                'duration_days' => 'sometimes|integer|min:1',
                'duration_nights' => 'sometimes|integer|min:0',
                'max_group_size' => 'sometimes|integer|min:1',
                'category_id' => 'nullable|exists:categories,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->all();

            // Actualizar slug si se cambia el nombre
            if (isset($data['name']) && $data['name'] !== $tour->name) {
                $baseSlug = Str::slug($data['name']);
                $slug = $baseSlug;
                $counter = 1;

                while (Tour::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                    $slug = $baseSlug . '-' . $counter;
                    $counter++;
                }

                $data['slug'] = $slug;
            }

            $tour->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Tour actualizado exitosamente',
                'data' => $tour->load('category')
            ]);
        } catch (\Exception $e) {
            Log::error('Error al actualizar el tour: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el tour',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar tour (admin)
     */
    public function destroy($id)
    {
        try {
            $tour = Tour::findOrFail($id);
            $tour->delete();

            return response()->json([
                'success' => true,
                'message' => 'Tour eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            Log::error('Error al eliminar el tour: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el tour',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Estadísticas de tours (admin)
     */
    public function stats()
    {
        try {
            $stats = [
                'total_tours' => Tour::count(),
                'active_tours' => Tour::where('is_active', true)->count(),
                'featured_tours' => Tour::where('is_featured', true)->count(),
                'total_views' => Tour::sum('views'),
                'tours_by_difficulty' => Tour::groupBy('difficulty_level')
                    ->selectRaw('difficulty_level, count(*) as count')
                    ->pluck('count', 'difficulty_level'),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            Log::error('Error al obtener estadísticas: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
