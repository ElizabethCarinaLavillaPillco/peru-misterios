<?php
// app/Http/Controllers/API/BookingController.php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Tour;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

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
        try {
            $bookings = Booking::with('tour')
                ->where('user_id', $request->user()->id)
                ->latest()
                ->get();

            return response()->json([
                'success' => true,
                'data' => $bookings
            ]);
        } catch (\Exception $e) {
            Log::error('Error en myBookings: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error al cargar reservas',
                'error' => config('app.debug') ? $e->getMessage() : 'Error interno'
            ], 500);
        }
    }

    public function show($id)
    {
        try {
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
        } catch (\Exception $e) {
            Log::error('Error en show booking: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error al cargar la reserva',
                'error' => config('app.debug') ? $e->getMessage() : 'Error interno'
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
            $tour = Tour::findOrFail($request->tour_id);
            $pricePerPerson = $tour->discount_price ?? $tour->price;
            $subtotal = $pricePerPerson * $request->number_of_people;
            $tax = $subtotal * 0.18;
            $total = $subtotal + $tax;

            // Generar códigos únicos
            $bookingCode = 'BK-' . strtoupper(Str::random(8));
            $bookingNumber = 'BN-' . time() . '-' . rand(1000, 9999);

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
                'booking_code' => $bookingCode,
                'booking_number' => $bookingNumber,
            ]);

            Log::info('Booking creado exitosamente', ['booking_id' => $booking->id]);

            return response()->json([
                'success' => true,
                'data' => $booking->load('tour'),
                'message' => 'Reserva creada exitosamente'
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creando booking: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al crear la reserva',
                'error' => config('app.debug') ? $e->getMessage() : 'Error interno del servidor'
            ], 500);
        }
    }

    public function cancel(Request $request, $id)
    {
        try {
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
        } catch (\Exception $e) {
            Log::error('Error cancelando booking: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error al cancelar la reserva'
            ], 500);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,confirmed,completed,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $booking = Booking::findOrFail($id);
            $booking->update(['status' => $request->status]);

            return response()->json([
                'success' => true,
                'data' => $booking,
                'message' => 'Estado actualizado exitosamente'
            ]);
        } catch (\Exception $e) {
            Log::error('Error actualizando status: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el estado'
            ], 500);
        }
    }

    public function updatePaymentStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'payment_status' => 'required|in:pending,paid,refunded',
            'payment_method' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $booking = Booking::findOrFail($id);

            $updateData = ['payment_status' => $request->payment_status];

            if ($request->has('payment_method')) {
                $updateData['payment_method'] = $request->payment_method;
            }

            $booking->update($updateData);

            Log::info('Payment status actualizado', [
                'booking_id' => $id,
                'payment_status' => $request->payment_status
            ]);

            return response()->json([
                'success' => true,
                'data' => $booking,
                'message' => 'Estado de pago actualizado exitosamente'
            ]);
        } catch (\Exception $e) {
            Log::error('Error actualizando payment status: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el estado de pago'
            ], 500);
        }
    }

    public function stats()
    {
        try {
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
        } catch (\Exception $e) {
            Log::error('Error en stats: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas'
            ], 500);
        }
    }
    public function generateReceipt($id)
{
    try {
        $booking = Booking::with(['tour', 'user'])->findOrFail($id);

        // Verificar que el usuario puede ver esta reserva
        if (auth()->user()->role !== 'admin' && $booking->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permiso para ver esta reserva'
            ], 403);
        }

        // Generar el PDF
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('receipts.booking', ['booking' => $booking]);

        return $pdf->download('comprobante-' . $booking->booking_code . '.pdf');
    } catch (\Exception $e) {
        Log::error('Error generando PDF: ' . $e->getMessage(), [
            'booking_id' => $id,
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Error al generar el comprobante'
        ], 500);
    }
}
}
