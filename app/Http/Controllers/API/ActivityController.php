<?php
// app/Http/Controllers/API/ActivityController.php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ActivityController extends Controller
{
    // ========================================
    // MÉTODOS PÚBLICOS
    // ========================================

    /**
     * Lista actividades activas (público)
     */
    public function index(Request $request)
    {
        try {
            $query = Activity::with('category')
                ->where('is_active', true)
                ->orderBy('is_featured', 'desc')
                ->orderBy('created_at', 'desc');

            // Filtro por categoría
            if ($request->has('category_id') && $request->category_id) {
                $query->where('category_id', $request->category_id);
            }

            // Filtro por dificultad
            if ($request->has('difficulty_level') && $request->difficulty_level) {
                $query->where('difficulty_level', $request->difficulty_level);
            }

            // Filtro por precio
            if ($request->has('min_price') && $request->min_price) {
                $query->where('price', '>=', $request->min_price);
            }
            if ($request->has('max_price') && $request->max_price) {
                $query->where('price', '<=', $request->max_price);
            }

            // Búsqueda
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('location', 'like', "%{$search}%")
                      ->orWhere('short_description', 'like', "%{$search}%");
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
                        $query->orderBy('rating', 'desc');
                        break;
                    case 'popular':
                        $query->orderBy('views', 'desc');
                        break;
                }
            }

            $activities = $query->paginate(12);

            return response()->json([
                'success' => true,
                'data' => $activities
            ]);
        } catch (\Exception $e) {
            Log::error('Error al listar actividades públicas: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar las actividades'
            ], 500);
        }
    }

    /**
     * Muestra una actividad por slug (público)
     */
    public function show($slug)
    {
        try {
            $activity = Activity::with('category')
                ->where('slug', $slug)
                ->where('is_active', true)
                ->firstOrFail();

            // Incrementar vistas
            $activity->increment('views');

            return response()->json([
                'success' => true,
                'data' => $activity
            ]);
        } catch (\Exception $e) {
            Log::error('Error al mostrar actividad: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Actividad no encontrada'
            ], 404);
        }
    }

    // ========================================
    // MÉTODOS ADMIN
    // ========================================

    /**
     * Lista todas las actividades (admin)
     */
    public function adminIndex(Request $request)
    {
        try {
            $query = Activity::with('category')
                ->orderBy('created_at', 'desc');

            // Filtro por estado
            if ($request->has('is_active') && $request->is_active !== '') {
                $query->where('is_active', $request->is_active);
            }

            // Búsqueda
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('location', 'like', "%{$search}%");
                });
            }

            $activities = $query->get();

            return response()->json([
                'success' => true,
                'data' => $activities
            ]);
        } catch (\Exception $e) {
            Log::error('Error al listar actividades (admin): ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar las actividades'
            ], 500);
        }
    }

    /**
     * Muestra una actividad por ID (admin)
     */
    public function showById($id)
    {
        try {
            $activity = Activity::with('category')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $activity
            ]);
        } catch (\Exception $e) {
            Log::error('Error al obtener actividad por ID: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Actividad no encontrada'
            ], 404);
        }
    }

    /**
     * Estadísticas de actividades (admin)
     */
    public function stats()
    {
        try {
            $totalActivities = Activity::count();
            $activeActivities = Activity::where('is_active', true)->count();
            $featuredActivities = Activity::where('is_featured', true)->count();
            $totalViews = Activity::sum('views');

            return response()->json([
                'success' => true,
                'total_activities' => $totalActivities,
                'active' => $activeActivities,
                'featured' => $featuredActivities,
                'total_views' => $totalViews ?? 0
            ]);
        } catch (\Exception $e) {
            Log::error('Error al obtener estadísticas de actividades: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar estadísticas'
            ], 500);
        }
    }

    /**
     * Crea una nueva actividad
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'category_id' => 'nullable|exists:categories,id',
                'short_description' => 'nullable|string|max:500',
                'description' => 'required|string',
                'featured_image' => 'nullable|url',
                'gallery_images' => 'nullable|array',
                'location' => 'required|string|max:255',
                'price' => 'required|numeric|min:0',
                'duration_hours' => 'nullable|integer|min:1',
                'duration_text' => 'nullable|string|max:100',
                'difficulty_level' => 'required|in:easy,moderate,challenging,difficult',
                'min_age' => 'nullable|integer|min:0',
                'max_group_size' => 'nullable|integer|min:1',
                'included' => 'nullable|array',
                'not_included' => 'nullable|array',
                'requirements' => 'nullable|array',
                'recommendations' => 'nullable|array',
                'available_days' => 'nullable|array',
                'start_time' => 'nullable|date_format:H:i',
                'end_time' => 'nullable|date_format:H:i',
                'is_featured' => 'boolean',
                'is_active' => 'boolean',
            ]);

            // Generar slug único
            $baseSlug = Str::slug($validated['title']);
            $slug = $baseSlug;
            $counter = 1;

            while (Activity::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }

            $validated['slug'] = $slug;
            $activity = Activity::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Actividad creada exitosamente',
                'data' => $activity->load('category')
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errores de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error al crear actividad: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la actividad'
            ], 500);
        }
    }

    /**
     * Actualiza una actividad existente
     */
    public function update(Request $request, $id)
    {
        try {
            $activity = Activity::findOrFail($id);

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'category_id' => 'nullable|exists:categories,id',
                'short_description' => 'nullable|string|max:500',
                'description' => 'required|string',
                'featured_image' => 'nullable|url',
                'gallery_images' => 'nullable|array',
                'location' => 'required|string|max:255',
                'price' => 'required|numeric|min:0',
                'duration_hours' => 'nullable|integer|min:1',
                'duration_text' => 'nullable|string|max:100',
                'difficulty_level' => 'required|in:easy,moderate,challenging,difficult',
                'min_age' => 'nullable|integer|min:0',
                'max_group_size' => 'nullable|integer|min:1',
                'included' => 'nullable|array',
                'not_included' => 'nullable|array',
                'requirements' => 'nullable|array',
                'recommendations' => 'nullable|array',
                'available_days' => 'nullable|array',
                'start_time' => 'nullable|date_format:H:i',
                'end_time' => 'nullable|date_format:H:i',
                'is_featured' => 'boolean',
                'is_active' => 'boolean',
            ]);

            // Si cambió el título, regenerar slug
            if ($activity->title !== $validated['title']) {
                $baseSlug = Str::slug($validated['title']);
                $slug = $baseSlug;
                $counter = 1;

                while (Activity::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                    $slug = $baseSlug . '-' . $counter;
                    $counter++;
                }
                $validated['slug'] = $slug;
            }

            $activity->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Actividad actualizada exitosamente',
                'data' => $activity->load('category')
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errores de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error al actualizar actividad: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la actividad'
            ], 500);
        }
    }

    /**
     * Elimina una actividad
     */
    public function destroy($id)
    {
        try {
            $activity = Activity::findOrFail($id);
            $activity->delete();

            return response()->json([
                'success' => true,
                'message' => 'Actividad eliminada exitosamente'
            ]);
        } catch (\Exception $e) {
            Log::error('Error al eliminar actividad: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la actividad'
            ], 500);
        }
    }
}
