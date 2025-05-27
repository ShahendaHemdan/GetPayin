<?php

namespace App\Services;

use App\Models\Post;
use App\Models\Platform;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class PostService
{
    protected $disk;

    public function __construct()
    {
        $this->disk = Storage::disk('public');
    }

    public function getUserPosts(User $user, array $filters = [])
    {
        $query = $user->posts()->with('platforms');
        
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        
        if (isset($filters['date'])) {
            $query->whereDate('scheduled_time', $filters['date']);
        }
        
        return $query->latest()->paginate(10);
    }

    public function createPost(User $user, array $data, array $platformIds): Post
    {
        if ($this->exceedsDailyPostLimit($user)) {
            throw new \Exception('You have reached the daily limit of 10 scheduled posts');
        }

        $post = $user->posts()->create([
            'title' => $data['title'],
            'content' => $data['content'],
            'image_url' => $data['image_url'] ?? null,
            'scheduled_time' => $data['scheduled_time'],
            'status' => $data['status'] ?? 'scheduled',
        ]);

        $post->platforms()->attach($platformIds);

        return $post;
    }

    public function updatePost(Post $post, array $data, ?array $platformIds = null): Post
    {
        if ($post->status === 'published') {
            throw new \Exception('Published posts cannot be modified');
        }

        // Handle image removal
        if (array_key_exists('image_url', $data) && empty($data['image_url'])) {
            $this->deleteImageIfExists($post->image_url);
            $data['image_url'] = null;
        }
        // Handle new image upload
        elseif (isset($data['image_url']) && $data['image_url'] !== $post->image_url) {
            $this->deleteImageIfExists($post->image_url);
        }

        $post->update([
            'title' => $data['title'] ?? $post->title,
            'content' => $data['content'] ?? $post->content,
            'image_url' => $data['image_url'] ?? $post->image_url,
            'scheduled_time' => $data['scheduled_time'] ?? $post->scheduled_time,
            'status' => $data['status'] ?? $post->status,
        ]);

        if ($platformIds !== null) {
            $post->platforms()->sync($platformIds);
        }

        return $post;
    }

    public function deletePost(Post $post): void
    {
        if ($post->status === 'published') {
            throw new \Exception('Published posts cannot be deleted');
        }

        $this->deleteImageIfExists($post->image_url);
        $post->delete();
    }

    public function exceedsDailyPostLimit(User $user): bool
    {
        return $user->posts()
            ->whereDate('created_at', today())
            ->count() >= 10;
    }

    public function uploadImage(UploadedFile $image): string
    {
        return $image->store('posts/images', 'public');
    }

    protected function deleteImageIfExists(?string $imagePath): void
    {
        if ($imagePath && $this->disk->exists($imagePath)) {
            $this->disk->delete($imagePath);
        }
    }

    public function logActivity(User $user, string $action, string $description): void
    {
        $user->activityLogs()->create([
            'action' => $action,
            'description' => $description,
        ]);
    }
}