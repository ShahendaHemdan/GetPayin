<?php

namespace App\Http\Controllers\Blade;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Platform;
class FeedController extends Controller
{
    public function index()
    {
        $posts = Post::with(['user', 'platforms'])
            ->where('status', 'published')
            ->latest()
            ->paginate(10);

        $platforms = Platform::all();
        return view('feed', compact('posts', 'platforms'));
    }
}