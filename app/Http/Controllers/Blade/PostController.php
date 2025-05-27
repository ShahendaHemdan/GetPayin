<?php

namespace App\Http\Controllers\Blade;

use App\Http\Controllers\Controller;
use App\Http\Requests\Post\StorePostRequest;
use App\Http\Requests\Post\UpdatePostRequest;
use App\Models\Post;
use App\Models\Platform;
use App\Services\PostService;
use Illuminate\Http\Request;

class PostController extends Controller
{
    protected $postService;

    public function __construct(PostService $postService)
    {
        $this->postService = $postService;
    }

    public function create()
    {
        $platforms = Platform::all();
        return view('posts.create', compact('platforms'));
    }

    public function store(StorePostRequest $request)
    {
        try {
            $data = $request->validated();
            if ($request->hasFile('image_url')) {
                $data['image_url'] = $this->postService->uploadImage($request->file('image_url'));
            }

            $post = $this->postService->createPost(
                $request->user(),
                $data,
                $request->platforms
            );

            $this->postService->logActivity(
                $request->user(),
                'post_created',
                "Created post '{$post->title}'"
            );

            return redirect()->route('dashboard')->with('success', 'Post created successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage())->withInput();
        }
    }

    public function edit(Post $post)
    {
        $platforms = Platform::all();
        $selectedPlatforms = $post->platforms->pluck('id')->toArray();
        
        return view('posts.edit', compact('post', 'platforms', 'selectedPlatforms'));
    }

    public function update(UpdatePostRequest $request, Post $post)
    {
        try {
            $data = $request->validated();
            
            // Handle image removal checkbox
            if ($request->has('remove_image')) {
                $data['image_url'] = null;
            }
            // Handle new image upload
            elseif ($request->hasFile('image_url')) {
                $data['image_url'] = $this->postService->uploadImage($request->file('image_url'));
            }

            $this->postService->updatePost(
                $post,
                $data,
                $request->platforms ?? null
            );

            $this->postService->logActivity(
                $request->user(),
                'post_updated',
                "Updated post '{$post->title}'"
            );

            return redirect()->route('dashboard')->with('success', 'Post updated successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage())->withInput();
        }
    }

    public function destroy(Post $post)
    {
        try {
            $this->postService->deletePost($post);

            $this->postService->logActivity(
                request()->user(),
                'post_deleted',
                "Deleted post '{$post->title}'"
            );

            return redirect()->route('dashboard')->with('success', 'Post deleted successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}