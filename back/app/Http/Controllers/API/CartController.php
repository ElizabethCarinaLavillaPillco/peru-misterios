<?php
// app/Http/Controllers/API/CartController.php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Tour;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    public function index(Request $request)
    {
        try {
            $cartItems = CartItem::with(['tour' => function($query) {
                $query->select('id', 'name', 'slug', 'featured_image', 'price', 'discount_price', 'duration_days', 'duration_nights');
            }])
            ->where('user_id', $request->user()->id)
            ->get()
            ->map(function($item) {
                $tour = $item->tour;
                $pricePerPerson = $tour->discount_price ?? $tour->price;
                $subtotal = $pricePerPerson * $item->number_of_people;

                return [
                    'id' => $item->id,
                    'tour_id' => $item->tour_id,
                    'tour' => $tour,
                    'travel_date' => $item->travel_date,
                    'number_of_people' => $item->number_of_people,
                    'price_per_person' => $pricePerPerson,
                    'subtotal' => $subtotal,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $cartItems
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar el carrito',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tour_id' => 'required|exists:tours,id',
            'travel_date' => 'required|date|after:today',
            'number_of_people' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $userId = $request->user()->id;
            
            // Buscar si ya existe
            $existingItem = CartItem::where('user_id', $userId)
                ->where('tour_id', $request->tour_id)
                ->where('travel_date', $request->travel_date)
                ->first();

            if ($existingItem) {
                // Si existe, actualizar cantidad
                $existingItem->number_of_people += $request->number_of_people;
                $existingItem->save();
                
                $cartItem = $existingItem;
                $message = 'Cantidad actualizada en el carrito';
            } else {
                // Si no existe, crear nuevo
                $cartItem = CartItem::create([
                    'user_id' => $userId,
                    'tour_id' => $request->tour_id,
                    'travel_date' => $request->travel_date,
                    'number_of_people' => $request->number_of_people,
                ]);
                
                $message = 'Tour agregado al carrito';
            }

            $cartItem->load('tour');
            $tour = $cartItem->tour;
            $pricePerPerson = $tour->discount_price ?? $tour->price;
            $subtotal = $pricePerPerson * $cartItem->number_of_people;

            return response()->json([
                'success' => true,
                'message' => $message,
                'data' => [
                    'id' => $cartItem->id,
                    'tour_id' => $cartItem->tour_id,
                    'tour' => $tour,
                    'travel_date' => $cartItem->travel_date,
                    'number_of_people' => $cartItem->number_of_people,
                    'price_per_person' => $pricePerPerson,
                    'subtotal' => $subtotal,
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al agregar al carrito',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'number_of_people' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $cartItem = CartItem::where('user_id', $request->user()->id)
                ->findOrFail($id);

            $cartItem->update([
                'number_of_people' => $request->number_of_people
            ]);

            $cartItem->load('tour');
            $tour = $cartItem->tour;
            $pricePerPerson = $tour->discount_price ?? $tour->price;
            $subtotal = $pricePerPerson * $cartItem->number_of_people;

            return response()->json([
                'success' => true,
                'message' => 'Cantidad actualizada',
                'data' => [
                    'id' => $cartItem->id,
                    'tour_id' => $cartItem->tour_id,
                    'tour' => $tour,
                    'travel_date' => $cartItem->travel_date,
                    'number_of_people' => $cartItem->number_of_people,
                    'price_per_person' => $pricePerPerson,
                    'subtotal' => $subtotal,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        try {
            $cartItem = CartItem::where('user_id', $request->user()->id)
                ->findOrFail($id);

            $cartItem->delete();

            return response()->json([
                'success' => true,
                'message' => 'Item eliminado del carrito'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function clear(Request $request)
    {
        try {
            CartItem::where('user_id', $request->user()->id)->delete();

            return response()->json([
                'success' => true,
                'message' => 'Carrito vaciado'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al vaciar carrito',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}