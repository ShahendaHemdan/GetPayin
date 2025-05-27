<?php

namespace App\Jobs;

use App\Models\Post;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProcessScheduledPosts implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle()
    {
        Log::info('Starting post publishing job at '.Carbon::now('Africa/Cairo')->toDateTimeString());
        
        $now = Carbon::now('Africa/Cairo')->toDateTimeString();
        
        try {
            DB::transaction(function () use ($now) {
                $posts = Post::with('platforms')
                    ->where('status', 'scheduled')
                    ->where('scheduled_time', '<=', $now)
                    ->get();
                
                Log::info('Found '.$posts->count().' posts to publish');
                
                foreach ($posts as $post) {
                    $post->update(['status' => 'published']);
                    
                    $post->platforms()->updateExistingPivot(
                        $post->platforms->pluck('id')->toArray(),
                        ['platform_status' => 'published']
                    );
                    
                    Log::info("Published post ID: {$post->id} scheduled for {$post->scheduled_time}");
                }
            });
        } catch (\Exception $e) {
            Log::error('Post publishing failed: '.$e->getMessage());
            throw $e;
        }
    }
}