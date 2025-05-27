<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Post\StorePostRequest;
use App\Http\Requests\Post\UpdatePostRequest;
use App\Models\Post;
use App\Services\PostService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    use ApiResponse;

    protected $postService;

    public function __construct(PostService $postService)
    {
        $this->postService = $postService;
    }

    public function index(Request $request)
    {
        try {
            $posts = $this->postService->getUserPosts(
                $request->user(),
                $request->only(['status', 'date'])
            );
            
            return $this->success($posts, 'Posts retrieved successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve posts', 500);
        }
    }

    public function store(StorePostRequest $request)
    {
        try {
            $post = $this->postService->createPost(
                $request->user(),
                $request->validated(),
                $request->platforms
            );

            // Log activity
            $request->user()->activityLogs()->create([
                'action' => 'post_created',
                'description' => "Created post '{$post->title}'",
            ]);

            return $this->success($post->load('platforms'), 'Post created successfully', 201);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    public function show(Request $request, Post $post)
    {
        try {
            if ($post->user_id !== $request->user()->id) {
                return $this->unauthorized();
            }

            return $this->success($post->load('platforms'), 'Post retrieved successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve post', 500);
        }
    }

    public function update(UpdatePostRequest $request, Post $post)
    {
        try {
            if ($post->user_id !== $request->user()->id) {
                return $this->unauthorized();
            }

            $post = $this->postService->updatePost(
                $post,
                $request->validated(),
                $request->platforms ?? null
            );

            // Log activity
            $request->user()->activityLogs()->create([
                'action' => 'post_updated',
                'description' => "Updated post '{$post->title}'",
            ]);

            return $this->success($post->load('platforms'), 'Post updated successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    public function destroy(Request $request, Post $post)
    {
        try {
            if ($post->user_id !== $request->user()->id) {
                return $this->unauthorized();
            }

            $this->postService->deletePost($post);

            // Log activity
            $request->user()->activityLogs()->create([
                'action' => 'post_deleted',
                'description' => "Deleted post '{$post->title}'",
            ]);

            return $this->success(null, 'Post deleted successfully', 204);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 422);
        }
    }
}