<?php
// app/Http/Controllers/API/DestinationController.php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class DestinationController extends Controller
{
    /**
     * Listar destinos (público)
     */
    public function index(Request $request)
    {
        try {
            $query = Destination::with(['tours' => function($q) {
                $q->where('is_active', true)->limit(6);
            }])->where('is_active', true);

            $destinations = $query->orderBy('order', 'asc')
                                 ->orderBy('name', 'asc')
                                 ->get();

            return response()->json([
                'success' => true,
                'data' => $destinations
            ]);
        } catch (\Exception $e) {
            Log::error('Error al cargar destinos: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar destinos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Ver un destino por slug (público)
     */
    public function show($slug)
    {
        try {
            $destination = Destination::with(['tours' => function($q) {
                $q->where('is_active', true)->with('category');
            }])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->first();

            if (!$destination) {
                return response()->json([
                    'success' => false,
                    'message' => 'Destino no encontrado'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $destination
            ]);
        } catch (\Exception $e) {
            Log::error('Error al cargar destino: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar destino',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Listar todos los destinos (admin)
     */
    public function adminIndex()
    {
        try {
            $destinations = Destination::withCount('tours')
                                      ->orderBy('order', 'asc')
                                      ->orderBy('name', 'asc')
                                      ->get();

            return response()->json([
                'success' => true,
                'data' => $destinations
            ]);
        } catch (\Exception $e) {
            Log::error('Error al cargar destinos (admin): ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar destinos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Ver destino por ID (admin)
     */
    public function showById($id)
    {
        try {
            $destination = Destination::with('tours')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $destination
            ]);
        } catch (\Exception $e) {
            Log::error('Error al cargar destino por ID: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Destino no encontrado',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Crear destino (admin)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'featured_image' => 'nullable|string',
            'gallery' => 'nullable|array',
            'is_active' => 'boolean',
            'order' => 'nullable|integer',
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

            while (Destination::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }

            $data['slug'] = $slug;

            $destination = Destination::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Destino creado exitosamente',
                'data' => $destination
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error al crear destino: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al crear destino',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar destino (admin)
     */
    public function update(Request $request, $id)
    {
        try {
            $destination = Destination::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'description' => 'nullable|string',
                'short_description' => 'nullable|string|max:500',
                'is_active' => 'boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->all();

            // Actualizar slug si cambia el nombre
            if (isset($data['name']) && $data['name'] !== $destination->name) {
                $baseSlug = Str::slug($data['name']);
                $slug = $baseSlug;
                $counter = 1;

                while (Destination::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                    $slug = $baseSlug . '-' . $counter;
                    $counter++;
                }

                $data['slug'] = $slug;
            }

            $destination->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Destino actualizado exitosamente',
                'data' => $destination
            ]);
        } catch (\Exception $e) {
            Log::error('Error al actualizar destino: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar destino',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar destino (admin)
     */
    public function destroy($id)
    {
        try {
            $destination = Destination::findOrFail($id);
            
            // Verificar si tiene tours asociados
            if ($destination->tours()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar el destino porque tiene tours asociados'
                ], 400);
            }

            $destination->delete();

            return response()->json([
                'success' => true,
                'message' => 'Destino eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            Log::error('Error al eliminar destino: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar destino',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Estadísticas (admin)
     */
    public function stats()
    {
        try {
            $stats = [
                'total_destinations' => Destination::count(),
                'active_destinations' => Destination::where('is_active', true)->count(),
                'destinations_with_tours' => Destination::has('tours')->count(),
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