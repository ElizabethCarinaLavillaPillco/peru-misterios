<?php
// app/Http/Controllers/API/BlogController.php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    // ========================================
    // MÉTODOS PÚBLICOS
    // ========================================

    /**
     * Lista blogs publicados (público)
     */
    public function index(Request $request)
    {
        try {
            $query = Blog::with(['author', 'category'])
                ->where('is_published', true)
                ->orderBy('published_at', 'desc');

            // Filtro por categoría
            if ($request->has('category_id') && $request->category_id) {
                $query->where('category_id', $request->category_id);
            }

            // Búsqueda
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('excerpt', 'like', "%{$search}%")
                      ->orWhere('content', 'like', "%{$search}%");
                });
            }

            $blogs = $query->paginate(12);

            return response()->json([
                'success' => true,
                'data' => $blogs
            ]);
        } catch (\Exception $e) {
            Log::error('Error al listar blogs públicos: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar los blogs'
            ], 500);
        }
    }

    /**
     * Muestra un blog por slug (público)
     */
    public function show($slug)
    {
        try {
            $blog = Blog::with(['author', 'category'])
                ->where('slug', $slug)
                ->where('is_published', true)
                ->firstOrFail();

            // Incrementar vistas
            $blog->increment('views');

            return response()->json([
                'success' => true,
                'data' => $blog
            ]);
        } catch (\Exception $e) {
            Log::error('Error al mostrar blog: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Blog no encontrado'
            ], 404);
        }
    }

    // ========================================
    // MÉTODOS ADMIN
    // ========================================

    /**
     * Lista todos los blogs (admin)
     */
    public function adminIndex(Request $request)
    {
        try {
            $query = Blog::with(['author', 'category'])
                ->orderBy('created_at', 'desc');

            // Filtro por estado de publicación
            if ($request->has('is_published') && $request->is_published !== '') {
                $query->where('is_published', $request->is_published);
            }

            // Búsqueda
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('excerpt', 'like', "%{$search}%");
                });
            }

            $blogs = $query->get();

            return response()->json([
                'success' => true,
                'data' => $blogs
            ]);
        } catch (\Exception $e) {
            Log::error('Error al listar blogs (admin): ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar los blogs'
            ], 500);
        }
    }

    /**
     * Muestra un blog por ID (admin)
     */
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
                'message' => 'Blog no encontrado'
            ], 404);
        }
    }

    /**
     * Estadísticas de blogs (admin)
     */
    public function stats()
    {
        try {
            $totalBlogs = Blog::count();
            $published = Blog::where('is_published', true)->count();
            $drafts = Blog::where('is_published', false)->count();
            $totalViews = Blog::sum('views');

            return response()->json([
                'success' => true,
                'total_blogs' => $totalBlogs,
                'published' => $published,
                'drafts' => $drafts,
                'total_views' => $totalViews ?? 0
            ]);
        } catch (\Exception $e) {
            Log::error('Error al obtener estadísticas de blogs: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());

            return response()->json([
                'success' => false,
                'message' => 'Error al cargar estadísticas',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Crea un nuevo blog
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'category_id' => 'nullable|exists:categories,id',
                'excerpt' => 'nullable|string|max:500',
                'content' => 'required|string',
                'featured_image' => 'nullable|url',
                'is_published' => 'boolean',
                'tags' => 'nullable|array',
            ]);

            // Generar slug único
            $baseSlug = Str::slug($validated['title']);
            $slug = $baseSlug;
            $counter = 1;

            while (Blog::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }

            // Crear blog
            $blog = new Blog();
            $blog->title = $validated['title'];
            $blog->slug = $slug;
            $blog->category_id = $validated['category_id'] ?? null;
            $blog->excerpt = $validated['excerpt'] ?? null;
            $blog->content = $validated['content'];
            $blog->featured_image = $validated['featured_image'] ?? null;
            $blog->author_id = auth()->id();
            $blog->is_published = $validated['is_published'] ?? false;
            $blog->tags = $validated['tags'] ?? null;

            if ($blog->is_published) {
                $blog->published_at = now();
            }

            $blog->save();

            return response()->json([
                'success' => true,
                'message' => 'Blog creado exitosamente',
                'data' => $blog->load(['author', 'category'])
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errores de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error al crear blog: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el blog'
            ], 500);
        }
    }

    /**
     * Actualiza un blog existente
     */
    public function update(Request $request, $id)
    {
        try {
            $blog = Blog::findOrFail($id);

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'category_id' => 'nullable|exists:categories,id',
                'excerpt' => 'nullable|string|max:500',
                'content' => 'required|string',
                'featured_image' => 'nullable|url',
                'is_published' => 'boolean',
                'tags' => 'nullable|array',
            ]);

            // Si cambió el título, regenerar slug
            if ($blog->title !== $validated['title']) {
                $baseSlug = Str::slug($validated['title']);
                $slug = $baseSlug;
                $counter = 1;

                while (Blog::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                    $slug = $baseSlug . '-' . $counter;
                    $counter++;
                }
                $blog->slug = $slug;
            }

            $blog->title = $validated['title'];
            $blog->category_id = $validated['category_id'] ?? null;
            $blog->excerpt = $validated['excerpt'] ?? null;
            $blog->content = $validated['content'];
            $blog->featured_image = $validated['featured_image'] ?? null;
            $blog->tags = $validated['tags'] ?? null;

            // Si se publica por primera vez
            if ($validated['is_published'] && !$blog->is_published) {
                $blog->published_at = now();
            }

            $blog->is_published = $validated['is_published'] ?? false;
            $blog->save();

            return response()->json([
                'success' => true,
                'message' => 'Blog actualizado exitosamente',
                'data' => $blog->load(['author', 'category'])
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Errores de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error al actualizar blog: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el blog'
            ], 500);
        }
    }

    /**
     * Elimina un blog
     */
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
            Log::error('Error al eliminar blog: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el blog'
            ], 500);
        }
    }
}
