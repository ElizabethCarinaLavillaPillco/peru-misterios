<?php
// =============================================================
// ARCHIVO: app/Http/Controllers/API/FavoriteController.php
// =============================================================

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FavoriteController extends Controller
{
    /**
     * Listar todos los favoritos del usuario autenticado
     */
    public function index(Request $request)
    {
        try {
            $favorites = Favorite::with('tour')
                ->where('user_id', $request->user()->id)
                ->latest()
                ->get();

            return response()->json([
                'success' => true,
                'data' => $favorites
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar favoritos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Agregar tour a favoritos
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tour_id' => 'required|exists:tours,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Verificar si ya existe
            $existing = Favorite::where('user_id', $request->user()->id)
                ->where('tour_id', $request->tour_id)
                ->first();

            if ($existing) {
                return response()->json([
                    'success' => false,
                    'message' => 'Este tour ya está en tus favoritos'
                ], 409);
            }

            $favorite = Favorite::create([
                'user_id' => $request->user()->id,
                'tour_id' => $request->tour_id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Tour agregado a favoritos',
                'data' => $favorite->load('tour')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al agregar favorito',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar tour de favoritos
     */
    public function destroy(Request $request, $tourId)
    {
        try {
            $favorite = Favorite::where('user_id', $request->user()->id)
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
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar favorito',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verificar si un tour es favorito
     */
    public function check(Request $request, $tourId)
    {
        $isFavorite = Favorite::where('user_id', $request->user()->id)
            ->where('tour_id', $tourId)
            ->exists();

        return response()->json([
            'success' => true,
            'is_favorite' => $isFavorite
        ]);
    }

    /**
     * Obtener IDs de todos los favoritos del usuario
     */
    public function ids(Request $request)
    {
        $favoriteIds = Favorite::where('user_id', $request->user()->id)
            ->pluck('tour_id')
            ->toArray();

        return response()->json([
            'success' => true,
            'data' => $favoriteIds
        ]);
    }
}
