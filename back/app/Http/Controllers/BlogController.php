<?php
// app/Http/Controllers/API/BlogController.php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class BlogController extends Controller
{
    // Listar blogs (público)
    public function index(Request $request)
    {
        try {
            $query = Blog::with(['author', 'category'])
                ->where('is_published', true)
                ->orderBy('published_at', 'desc');

            if ($request->has('category')) {
                $query->where('category_id', $request->category);
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('excerpt', 'like', "%{$search}%")
                      ->orWhere('content', 'like', "%{$search}%");
                });
            }

            $blogs = $query->paginate($request->get('per_page', 12));

            return response()->json([
                'success' => true,
                'data' => $blogs
            ]);
        } catch (\Exception $e) {
            Log::error('Error en index de blogs:', ['message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar blogs'
            ], 500);
        }
    }

    // Ver un blog (público)
    public function show($slug)
    {
        try {
            $blog = Blog::with(['author', 'category'])
                ->where('slug', $slug)
                ->orWhere('id', $slug)
                ->firstOrFail();

            // Incrementar vistas
            $blog->increment('views');

            return response()->json([
                'success' => true,
                'data' => $blog
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Blog no encontrado'
            ], 404);
        }
    }

    // Admin: Listar todos los blogs
    public function adminIndex(Request $request)
    {
        try {
            $query = Blog::with(['author', 'category'])->latest();

            if ($request->has('status')) {
                $query->where('is_published', $request->status === 'published');
            }

            $blogs = $query->paginate(15);

            return response()->json([
                'success' => true,
                'data' => $blogs
            ]);
        } catch (\Exception $e) {
            Log::error('Error en adminIndex de blogs:', ['message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar blogs'
            ], 500);
        }
    }

    // Crear blog (admin)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'featured_image' => 'nullable|url',
            'category_id' => 'nullable|exists:categories,id',
            'tags' => 'nullable|array',
            'is_published' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $request->all();
            $data['author_id'] = auth()->id();

            // Generar slug
            $baseSlug = Str::slug($data['title']);
            $slug = $baseSlug;
            $counter = 1;

            while (Blog::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }

            $data['slug'] = $slug;

            // Si se publica, agregar fecha
            if ($data['is_published'] ?? false) {
                $data['published_at'] = now();
            }

            $blog = Blog::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Blog creado exitosamente',
                'data' => $blog->load(['author', 'category'])
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creando blog:', ['message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el blog'
            ], 500);
        }
    }

    // Actualizar blog (admin)
    public function update(Request $request, $id)
    {
        try {
            $blog = Blog::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|string|max:255',
                'excerpt' => 'nullable|string',
                'content' => 'sometimes|string',
                'featured_image' => 'nullable|url',
                'category_id' => 'nullable|exists:categories,id',
                'tags' => 'nullable|array',
                'is_published' => 'boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->all();

            // Actualizar slug si cambia el título
            if (isset($data['title']) && $data['title'] !== $blog->title) {
                $baseSlug = Str::slug($data['title']);
                $slug = $baseSlug;
                $counter = 1;

                while (Blog::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                    $slug = $baseSlug . '-' . $counter;
                    $counter++;
                }

                $data['slug'] = $slug;
            }

            // Si se publica por primera vez, agregar fecha
            if (isset($data['is_published']) && $data['is_published'] && !$blog->published_at) {
                $data['published_at'] = now();
            }

            $blog->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Blog actualizado exitosamente',
                'data' => $blog->load(['author', 'category'])
            ]);
        } catch (\Exception $e) {
            Log::error('Error actualizando blog:', ['message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el blog'
            ], 500);
        }
    }

    // Eliminar blog (admin)
    public function destroy($id)
    {
        try {
            $blog = Blog::findOrFail($id);
            $blog->delete();

            return response()->json([
                'success' => true,
                'message' => 'Blog eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            Log::error('Error eliminando blog:', ['message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el blog'
            ], 500);
        }
    }

    // Estadísticas (admin)
    public function stats()
    {
        try {
            $stats = [
                'total_blogs' => Blog::count(),
                'published' => Blog::where('is_published', true)->count(),
                'drafts' => Blog::where('is_published', false)->count(),
                'total_views' => Blog::sum('views'),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas'
            ], 500);
        }
    }


    public function showById($id)
    {
        try {
            $blog = Blog::with(['author', 'category'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $blog
            ]);
        } catch (\Exception $e) {
            Log::error('Error al obtener blog por ID: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el blog'
            ], 500);
        }
    }
}
