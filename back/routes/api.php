<?php
// routes/api.php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UserController;
use Illuminate\Support\Facades\Route;

// Rutas públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rutas públicas de tours
Route::get('/tours', [\App\Http\Controllers\API\TourController::class, 'index']);
Route::get('/tours/{slug}', [\App\Http\Controllers\API\TourController::class, 'show']);
Route::get('/categories', [\App\Http\Controllers\API\CategoryController::class, 'index']);

// Rutas públicas de paquetes
Route::get('/packages', [\App\Http\Controllers\API\PackageController::class, 'index']);
Route::get('/packages/{slug}', [\App\Http\Controllers\API\PackageController::class, 'show']);


// Rutas protegidas (requieren autenticación)
Route::middleware('auth:sanctum')->group(function () {
    
    // Autenticación
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    // Favoritos
    Route::prefix('favorites')->group(function () {
        Route::get('/', [FavoriteController::class, 'index']);
        Route::get('/ids', [FavoriteController::class, 'ids']);
        Route::post('/', [FavoriteController::class, 'store']);
        Route::delete('/{tourId}', [FavoriteController::class, 'destroy']);
        Route::get('/check/{tourId}', [FavoriteController::class, 'check']);
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
    
    // Rutas de administrador
    Route::middleware(['role:admin'])->prefix('admin')->group(function () {
        
        // Gestión de usuarios
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/stats', [UserController::class, 'stats']);
        Route::post('/users', [UserController::class, 'store']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        
        // Gestión de tours
        Route::get('/tours/stats', [\App\Http\Controllers\API\TourController::class, 'stats']);
        Route::post('/tours', [\App\Http\Controllers\API\TourController::class, 'store']);
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
        Route::post('/packages', [\App\Http\Controllers\API\PackageController::class, 'store']);
        Route::put('/packages/{id}', [\App\Http\Controllers\API\PackageController::class, 'update']);
        Route::delete('/packages/{id}', [\App\Http\Controllers\API\PackageController::class, 'destroy']);
    
    });
});