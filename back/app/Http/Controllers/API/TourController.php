<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Tour;
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
        try {
            $query = Tour::with('category')->where('is_active', true);

            // Filtrar por categoría
            if ($request->has('category')) {
                $query->where('category_id', $request->category);
            }

            // Filtrar por ubicación/destino
            if ($request->has('location')) {
                $query->where('location', 'like', '%' . $request->location . '%');
            }

            // Filtrar por precio
            if ($request->has('min_price')) {
                $query->where('price', '>=', $request->min_price);
            }
            if ($request->has('max_price')) {
                $query->where('price', '<=', $request->max_price);
            }

            // Filtrar por dificultad
            if ($request->has('difficulty')) {
                $query->where('difficulty_level', $request->difficulty);
            }

            // Búsqueda
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%")
                      ->orWhere('location', 'like', "%{$search}%");
                });
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
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar tours',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Ver un tour (público)
     */
    public function show($slug)
    {
        try {
            $tour = Tour::with(['category', 'reviews'])
                ->where('slug', $slug)
                ->orWhere('id', $slug)
                ->first();

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
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar el tour',
                'error' => $e->getMessage()
            ], 500);
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
            
            // Generar slug si no existe
            if (!isset($data['slug']) || empty($data['slug'])) {
                $data['slug'] = Str::slug($data['name']);
            }

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
                $data['slug'] = Str::slug($data['name']);
            }

            $tour->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Tour actualizado exitosamente',
                'data' => $tour->load('category')
            ]);
        } catch (\Exception $e) {
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
                'tours_by_difficulty' => Tour::groupBy('difficulty_level')
                    ->selectRaw('difficulty_level, count(*) as count')
                    ->pluck('count', 'difficulty_level'),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}