<?php

use Illuminate\Support\Facades\Route;

// Cualquier URL que no sea api o admin la resuelve React
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
