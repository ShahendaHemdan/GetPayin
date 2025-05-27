<?php

namespace App\Console\Commands;

use App\Jobs\ProcessScheduledPosts;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class PublishPostsCommand extends Command
{
    protected $signature = 'posts:publish';
    protected $description = 'Publish scheduled posts that have reached their scheduled time';
    
    public function handle()
    {
        Log::info('Running post publishing command at '.now('Africa/Cairo')->toDateTimeString());
        dispatch(new ProcessScheduledPosts());
        $this->info('Dispatched post publishing job! Check logs for details.');
        
        return 0;
    }
}