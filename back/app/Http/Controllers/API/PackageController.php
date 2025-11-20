<?php
// =============================================================
// app/Http/Controllers/API/PackageController.php (CORREGIDO)
// =============================================================

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PackageController extends Controller
{
    /**
     * Listar paquetes (público)
     */
    public function index(Request $request)
    {
        try {
            $query = Package::with(['category', 'tours'])->where('is_active', true);

            if ($request->has('category')) {
                $query->where('category_id', $request->category);
            }

            if ($request->has('min_price')) {
                $query->where('price', '>=', $request->min_price);
            }

            if ($request->has('max_price')) {
                $query->where('price', '<=', $request->max_price);
            }

            if ($request->has('difficulty')) {
                $query->where('difficulty_level', $request->difficulty);
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }

            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            $perPage = $request->get('per_page', 12);
            $packages = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $packages
            ]);
        } catch (\Exception $e) {
            Log::error('Error en index de packages:', [
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al cargar paquetes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Ver un paquete con su itinerario (público)
     */
    public function show($identifier)
    {
        try {
            $package = Package::with(['category', 'tours'])
                ->where(function($query) use ($identifier) {
                    if (is_numeric($identifier)) {
                        $query->where('id', $identifier);
                    }
                    $query->orWhere('slug', $identifier);
                })
                ->first();

            if (!$package) {
                return response()->json([
                    'success' => false,
                    'message' => 'Paquete no encontrado'
                ], 404);
            }

            // Agregar itinerario formateado
            $package->itinerary = $package->itinerary;

            return response()->json([
                'success' => true,
                'data' => $package
            ]);
        } catch (\Exception $e) {
            Log::error('Error en show de package:', [
                'identifier' => $identifier,
                'message' => $e->getMessage(),
                'line' => $e->getLine()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al cargar el paquete',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Crear paquete (admin) - CON MEJOR MANEJO DE ERRORES
     */
    public function store(Request $request)
    {
        Log::info('Iniciando creación de paquete', ['data' => $request->all()]);

        // Validación
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'short_description' => 'nullable|string|max:500',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'total_days' => 'required|integer|min:1',
            'total_nights' => 'required|integer|min:0',
            'difficulty_level' => 'required|in:easy,moderate,challenging,difficult',
            'max_group_size' => 'required|integer|min:1',
            'category_id' => 'nullable|exists:categories,id',
            'tours' => 'required|array|min:1',
            'tours.*.tour_id' => 'required|exists:tours,id',
            'tours.*.day_number' => 'required|integer|min:1',
            'tours.*.order' => 'nullable|integer|min:0',
            'tours.*.notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            Log::warning('Validación fallida al crear paquete', [
                'errors' => $validator->errors()->toArray()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Errores de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();

        try {
            $data = $request->except('tours');
            
            // Generar slug único
            if (!isset($data['slug']) || empty($data['slug'])) {
                $baseSlug = Str::slug($data['name']);
                $slug = $baseSlug;
                $counter = 1;
                
                while (Package::where('slug', $slug)->exists()) {
                    $slug = $baseSlug . '-' . $counter;
                    $counter++;
                }
                
                $data['slug'] = $slug;
            }

            // Asegurar que category_id sea null si está vacío
            if (!isset($data['category_id']) || $data['category_id'] === '' || $data['category_id'] === 'null') {
                $data['category_id'] = null;
            }

            // Asegurar valores por defecto
            $data['is_featured'] = $data['is_featured'] ?? false;
            $data['is_active'] = $data['is_active'] ?? true;
            $data['included'] = $data['included'] ?? [];
            $data['not_included'] = $data['not_included'] ?? [];
            $data['images'] = $data['images'] ?? [];

            Log::info('Datos a crear:', $data);

            // Crear el paquete
            $package = Package::create($data);

            Log::info('Paquete creado con ID: ' . $package->id);

            // Adjuntar tours
            $toursData = [];
            foreach ($request->tours as $tourData) {
                $toursData[$tourData['tour_id']] = [
                    'day_number' => $tourData['day_number'],
                    'order' => $tourData['order'] ?? 0,
                    'notes' => $tourData['notes'] ?? null,
                ];
            }
            
            Log::info('Tours a adjuntar:', $toursData);

            $package->tours()->attach($toursData);

            DB::commit();

            Log::info('Paquete creado exitosamente', ['id' => $package->id]);

            return response()->json([
                'success' => true,
                'message' => 'Paquete creado exitosamente',
                'data' => $package->load(['category', 'tours'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error al crear paquete:', [
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al crear el paquete',
                'error' => $e->getMessage(),
                'details' => config('app.debug') ? [
                    'line' => $e->getLine(),
                    'file' => basename($e->getFile())
                ] : null
            ], 500);
        }
    }

    /**
     * Actualizar paquete (admin)
     */
    public function update(Request $request, $id)
    {
        Log::info('Actualizando paquete', ['id' => $id, 'data' => $request->all()]);

        try {
            $package = Package::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'price' => 'sometimes|numeric|min:0',
                'category_id' => 'nullable|exists:categories,id',
                'tours' => 'sometimes|array',
                'tours.*.tour_id' => 'required_with:tours|exists:tours,id',
                'tours.*.day_number' => 'required_with:tours|integer|min:1',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            $data = $request->except('tours');
            
            // Actualizar slug si cambia el nombre
            if (isset($data['name']) && $data['name'] !== $package->name) {
                $baseSlug = Str::slug($data['name']);
                $slug = $baseSlug;
                $counter = 1;
                
                while (Package::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                    $slug = $baseSlug . '-' . $counter;
                    $counter++;
                }
                
                $data['slug'] = $slug;
            }

            // Limpiar category_id
            if (isset($data['category_id']) && ($data['category_id'] === '' || $data['category_id'] === 'null')) {
                $data['category_id'] = null;
            }

            $package->update($data);

            // Actualizar tours si se proporcionan
            if ($request->has('tours')) {
                $package->tours()->detach();
                
                $toursData = [];
                foreach ($request->tours as $tourData) {
                    $toursData[$tourData['tour_id']] = [
                        'day_number' => $tourData['day_number'],
                        'order' => $tourData['order'] ?? 0,
                        'notes' => $tourData['notes'] ?? null,
                    ];
                }
                
                $package->tours()->attach($toursData);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Paquete actualizado exitosamente',
                'data' => $package->load(['category', 'tours'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error al actualizar paquete:', [
                'id' => $id,
                'message' => $e->getMessage(),
                'line' => $e->getLine()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el paquete',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar paquete (admin)
     */
    public function destroy($id)
    {
        try {
            $package = Package::findOrFail($id);
            $package->delete();

            return response()->json([
                'success' => true,
                'message' => 'Paquete eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            Log::error('Error al eliminar paquete:', [
                'id' => $id,
                'message' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el paquete',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Estadísticas de paquetes (admin)
     */
    public function stats()
    {
        try {
            $stats = [
                'total_packages' => Package::count(),
                'active_packages' => Package::where('is_active', true)->count(),
                'featured_packages' => Package::where('is_featured', true)->count(),
                'packages_by_difficulty' => Package::groupBy('difficulty_level')
                    ->selectRaw('difficulty_level, count(*) as count')
                    ->pluck('count', 'difficulty_level'),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            Log::error('Error en stats de packages:', [
                'message' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}