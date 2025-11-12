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
        $cartItems = CartItem::with('tour')
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json($cartItems);
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

        $cartItem = CartItem::create([
            'user_id' => $request->user()->id,
            'tour_id' => $request->tour_id,
            'travel_date' => $request->travel_date,
            'number_of_people' => $request->number_of_people,
        ]);

        return response()->json([
            'success' => true,
            'data' => $cartItem->load('tour')
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $cartItem = CartItem::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'number_of_people' => 'sometimes|integer|min:1',
            'travel_date' => 'sometimes|date|after:today',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $cartItem->update($request->only(['number_of_people', 'travel_date']));

        return response()->json([
            'success' => true,
            'data' => $cartItem->load('tour')
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $cartItem = CartItem::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $cartItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'Item eliminado del carrito'
        ]);
    }

    public function clear(Request $request)
    {
        CartItem::where('user_id', $request->user()->id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Carrito vaciado'
        ]);
    }

    public function checkout(Request $request)
    {
        // Implementar lógica de checkout
        return response()->json([
            'success' => true,
            'message' => 'Checkout en desarrollo'
        ]);
    }
}