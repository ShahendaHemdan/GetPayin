<?php

namespace App\Http\Controllers\Blade;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $stats = $this->getPostStats($user);
        $posts = $this->getUserPosts($user);

        return view('dashboard.index', compact('stats', 'posts'));
    }

    protected function getPostStats($user)
    {
        return [
            'scheduled' => $user->posts()->where('status', 'scheduled')->count(),
            'published' => $user->posts()->where('status', 'published')->count(),
            'draft' => $user->posts()->where('status', 'draft')->count(),
        ];
    }

    protected function getUserPosts($user)
    {
        return $user->posts()
            ->with('platforms')
            ->latest()
            ->paginate(10);
    }
}