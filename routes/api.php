<?php
// routes/api.php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\BlogController;
use App\Http\Controllers\API\ActivityController;
use Illuminate\Support\Facades\Route;

// ========================================
// RUTAS PÚBLICAS
// ========================================

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Destinos públicos
Route::get('/destinos', [\App\Http\Controllers\API\DestinationController::class, 'index']);
Route::get('/destinos/{slug}', [\App\Http\Controllers\API\DestinationController::class, 'show']);

// Tours públicos
Route::get('/tours/featured', [\App\Http\Controllers\API\TourController::class, 'featured']); // DEBE IR PRIMERO
Route::get('/tours', [\App\Http\Controllers\API\TourController::class, 'index']);
Route::get('/tours/{slug}', [\App\Http\Controllers\API\TourController::class, 'show']);


// Paquetes públicos
Route::get('/packages', [\App\Http\Controllers\API\PackageController::class, 'index']);
Route::get('/packages/{slug}', [\App\Http\Controllers\API\PackageController::class, 'show']);

// Actividades públicas
Route::get('/activities', [ActivityController::class, 'index']);
Route::get('/activities/{slug}', [ActivityController::class, 'show']);

// Blogs públicos
Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/{slug}', [BlogController::class, 'show']);

// Categorías
Route::get('/categories', [\App\Http\Controllers\API\CategoryController::class, 'index']);

// ========================================
// RUTAS PROTEGIDAS (AUTH)
// ========================================

Route::middleware('auth:sanctum')->group(function () {

    // Autenticación
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    // Favoritos
    Route::prefix('favorites')->group(function () {
        Route::get('/', [\App\Http\Controllers\API\FavoriteController::class, 'index']);
        Route::get('/ids', [\App\Http\Controllers\API\FavoriteController::class, 'ids']);
        Route::post('/', [\App\Http\Controllers\API\FavoriteController::class, 'store']);
        Route::delete('/{tourId}', [\App\Http\Controllers\API\FavoriteController::class, 'destroy']);
        Route::get('/check/{tourId}', [\App\Http\Controllers\API\FavoriteController::class, 'check']);
    });

    // Carrito de compras
    Route::prefix('cart')->group(function () {
        Route::get('/', [\App\Http\Controllers\API\CartController::class, 'index']);
        Route::post('/', [\App\Http\Controllers\API\CartController::class, 'store']);
        Route::put('/{id}', [\App\Http\Controllers\API\CartController::class, 'update']);
        Route::delete('/{id}', [\App\Http\Controllers\API\CartController::class, 'destroy']);
        Route::delete('/', [\App\Http\Controllers\API\CartController::class, 'clear']);
        Route::post('/checkout', [\App\Http\Controllers\API\CartController::class, 'checkout']);
    });

    // Reservas del usuario
    Route::get('/my-bookings', [\App\Http\Controllers\API\BookingController::class, 'myBookings']);
    Route::get('/bookings/{id}', [\App\Http\Controllers\API\BookingController::class, 'show']);
    Route::post('/bookings', [\App\Http\Controllers\API\BookingController::class, 'store']);
    Route::post('/bookings/{id}/cancel', [\App\Http\Controllers\API\BookingController::class, 'cancel']);
    Route::get('/bookings/{id}/receipt', [\App\Http\Controllers\API\BookingController::class, 'generateReceipt']);

    // Permitir al usuario actualizar sus propias reservas durante el pago
    Route::put('/bookings/{id}/payment', [\App\Http\Controllers\API\BookingController::class, 'updatePaymentStatus']);
    Route::put('/bookings/{id}/status', [\App\Http\Controllers\API\BookingController::class, 'updateStatus']);

    // ========================================
    // RUTAS DE ADMINISTRADOR
    // ========================================

    Route::middleware(['role:admin'])->prefix('admin')->group(function () {

        // Gestión de usuarios
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/stats', [UserController::class, 'stats']);
        Route::post('/users', [UserController::class, 'store']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);

        // Gestión de destinos
        Route::get('/destinos/stats', [\App\Http\Controllers\API\DestinationController::class, 'stats']);
        Route::get('/destinos', [\App\Http\Controllers\API\DestinationController::class, 'adminIndex']);
        Route::get('/destinos/{id}', [\App\Http\Controllers\API\DestinationController::class, 'showById']);
        Route::post('/destinos', [\App\Http\Controllers\API\DestinationController::class, 'store']);
        Route::put('/destinos/{id}', [\App\Http\Controllers\API\DestinationController::class, 'update']);
        Route::delete('/destinos/{id}', [\App\Http\Controllers\API\DestinationController::class, 'destroy']);


        // Gestión de tours - ORDEN IMPORTANTE: stats primero, luego {id}
        Route::get('/tours/stats', [\App\Http\Controllers\API\TourController::class, 'stats']);
        Route::post('/tours', [\App\Http\Controllers\API\TourController::class, 'store']);
        Route::get('/tours/{id}', [\App\Http\Controllers\API\TourController::class, 'showById']);
        Route::put('/tours/{id}', [\App\Http\Controllers\API\TourController::class, 'update']);
        Route::delete('/tours/{id}', [\App\Http\Controllers\API\TourController::class, 'destroy']);

        // Gestión de categorías
        Route::post('/categories', [\App\Http\Controllers\API\CategoryController::class, 'store']);

        // Gestión de reservas
        Route::get('/bookings', [\App\Http\Controllers\API\BookingController::class, 'index']);
        Route::get('/bookings/stats', [\App\Http\Controllers\API\BookingController::class, 'stats']);
        Route::put('/bookings/{id}/status', [\App\Http\Controllers\API\BookingController::class, 'updateStatus']);
        Route::put('/bookings/{id}/payment', [\App\Http\Controllers\API\BookingController::class, 'updatePaymentStatus']);

        // Gestión de paquetes
        Route::get('/packages/stats', [\App\Http\Controllers\API\PackageController::class, 'stats']);
        Route::get('/packages', [\App\Http\Controllers\API\PackageController::class, 'index']);
        Route::get('/packages/{id}', [\App\Http\Controllers\API\PackageController::class, 'showById']);
        Route::post('/packages', [\App\Http\Controllers\API\PackageController::class, 'store']);
        Route::put('/packages/{id}', [\App\Http\Controllers\API\PackageController::class, 'update']);
        Route::delete('/packages/{id}', [\App\Http\Controllers\API\PackageController::class, 'destroy']);

        // Gestión de actividades
        Route::get('/activities/stats', [ActivityController::class, 'stats']);
        Route::get('/activities', [ActivityController::class, 'adminIndex']);
        Route::get('/activities/{id}', [ActivityController::class, 'showById']);
        Route::post('/activities', [ActivityController::class, 'store']);
        Route::put('/activities/{id}', [ActivityController::class, 'update']);
        Route::delete('/activities/{id}', [ActivityController::class, 'destroy']);

        // Gestión de blogs
        Route::get('/blogs/stats', [BlogController::class, 'stats']);
        Route::get('/blogs', [BlogController::class, 'adminIndex']);
        Route::get('/blogs/{id}', [BlogController::class, 'showById']);
        Route::post('/blogs', [BlogController::class, 'store']);
        Route::put('/blogs/{id}', [BlogController::class, 'update']);
        Route::delete('/blogs/{id}', [BlogController::class, 'destroy']);
    });
});
