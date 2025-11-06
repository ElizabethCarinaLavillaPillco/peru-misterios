<?php
// app/Http/Controllers/API/BookingController.php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Tour;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $bookings = Booking::with(['user', 'tour'])
            ->latest()
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $bookings
        ]);
    }

    public function myBookings(Request $request)
    {
        $bookings = Booking::with('tour')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($bookings);
    }

    public function show($id)
    {
        $booking = Booking::with(['tour', 'user'])->findOrFail($id);

        // Verificar que el usuario puede ver esta reserva
        if (auth()->user()->role !== 'admin' && $booking->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permiso para ver esta reserva'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $booking
        ]);
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

        $tour = Tour::findOrFail($request->tour_id);
        $pricePerPerson = $tour->final_price;
        $subtotal = $pricePerPerson * $request->number_of_people;
        $tax = $subtotal * 0.18;
        $total = $subtotal + $tax;

        $booking = Booking::create([
            'user_id' => $request->user()->id,
            'tour_id' => $request->tour_id,
            'travel_date' => $request->travel_date,
            'number_of_people' => $request->number_of_people,
            'price_per_person' => $pricePerPerson,
            'subtotal' => $subtotal,
            'tax' => $tax,
            'total' => $total,
            'status' => 'pending',
            'payment_status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'data' => $booking->load('tour')
        ], 201);
    }

    public function cancel(Request $request, $id)
    {
        $booking = Booking::where('user_id', $request->user()->id)
            ->findOrFail($id);

        if ($booking->status === 'cancelled') {
            return response()->json([
                'success' => false,
                'message' => 'Esta reserva ya está cancelada'
            ], 400);
        }

        $booking->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => $request->reason,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Reserva cancelada exitosamente',
            'data' => $booking
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,confirmed,completed,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $booking->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'data' => $booking
        ]);
    }

    public function updatePaymentStatus(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'payment_status' => 'required|in:pending,paid,refunded',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $booking->update(['payment_status' => $request->payment_status]);

        return response()->json([
            'success' => true,
            'data' => $booking
        ]);
    }

    public function stats()
    {
        $stats = [
            'total_bookings' => Booking::count(),
            'pending' => Booking::where('status', 'pending')->count(),
            'confirmed' => Booking::where('status', 'confirmed')->count(),
            'completed' => Booking::where('status', 'completed')->count(),
            'cancelled' => Booking::where('status', 'cancelled')->count(),
            'total_revenue' => Booking::where('payment_status', 'paid')->sum('total'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}