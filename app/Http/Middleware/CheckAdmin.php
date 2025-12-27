<?php
// ============================================
// app/Http/Middleware/CheckAdmin.php
// ============================================

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user()) {
            return response()->json([
                'success' => false,
                'message' => 'No autenticado'
            ], 401);
        }

        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Acceso denegado. Solo administradores.'
            ], 403);
        }

        return $next($request);
    }
}