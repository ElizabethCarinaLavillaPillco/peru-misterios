<?php
// app/Http/Controllers/API/FavoriteController.php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class FavoriteController extends Controller
{
    /**
     * Listar todos los favoritos del usuario autenticado
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            $favorites = Favorite::with(['tour' => function($query) {
                $query->select('id', 'name', 'slug', 'featured_image', 'price', 'discount_price', 'duration_days', 'duration_nights', 'location');
            }])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

            return response()->json([
                'success' => true,
                'data' => $favorites
            ]);
        } catch (\Exception $e) {
            Log::error('Error cargando favoritos: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar favoritos',
                'error' => config('app.debug') ? $e->getMessage() : 'Error interno'
            ], 500);
        }
    }

    /**
     * Agregar tour a favoritos
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tour_id' => 'required|integer|exists:tours,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            // Verificar si ya existe
            $existing = Favorite::where('user_id', $user->id)
                ->where('tour_id', $request->tour_id)
                ->first();

            if ($existing) {
                return response()->json([
                    'success' => false,
                    'message' => 'Este tour ya está en tus favoritos'
                ], 409);
            }

            $favorite = Favorite::create([
                'user_id' => $user->id,
                'tour_id' => $request->tour_id,
            ]);

            $favorite->load(['tour' => function($query) {
                $query->select('id', 'name', 'slug', 'featured_image', 'price', 'discount_price');
            }]);

            return response()->json([
                'success' => true,
                'message' => 'Tour agregado a favoritos',
                'data' => $favorite
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error agregando favorito: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al agregar favorito',
                'error' => config('app.debug') ? $e->getMessage() : 'Error interno'
            ], 500);
        }
    }

    /**
     * Eliminar tour de favoritos
     */
    public function destroy(Request $request, $tourId)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            $favorite = Favorite::where('user_id', $user->id)
                ->where('tour_id', $tourId)
                ->first();

            if (!$favorite) {
                return response()->json([
                    'success' => false,
                    'message' => 'Favorito no encontrado'
                ], 404);
            }

            $favorite->delete();

            return response()->json([
                'success' => true,
                'message' => 'Tour eliminado de favoritos'
            ]);
        } catch (\Exception $e) {
            Log::error('Error eliminando favorito: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar favorito',
                'error' => config('app.debug') ? $e->getMessage() : 'Error interno'
            ], 500);
        }
    }

    /**
     * Verificar si un tour es favorito
     */
    public function check(Request $request, $tourId)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'success' => true,
                    'is_favorite' => false
                ]);
            }

            $isFavorite = Favorite::where('user_id', $user->id)
                ->where('tour_id', $tourId)
                ->exists();

            return response()->json([
                'success' => true,
                'is_favorite' => $isFavorite
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => true,
                'is_favorite' => false
            ]);
        }
    }

    /**
     * Obtener IDs de todos los favoritos del usuario
     */
    public function ids(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'success' => true,
                    'data' => []
                ]);
            }

            $favoriteIds = Favorite::where('user_id', $user->id)
                ->pluck('tour_id')
                ->toArray();

            return response()->json([
                'success' => true,
                'data' => $favoriteIds
            ]);
        } catch (\Exception $e) {
            Log::error('Error obteniendo IDs de favoritos: ' . $e->getMessage());
            
            return response()->json([
                'success' => true,
                'data' => []
            ]);
        }
    }
}