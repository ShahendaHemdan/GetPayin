<?php

use App\Console\Commands\PublishPostsCommand;
use App\Jobs\ProcessScheduledPosts;
use App\Jobs\PublishScheduledPosts;
use App\Models\Post;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

// Existing inspire command
Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Register your custom command
Artisan::command('posts:publish', function () {
    dispatch(new ProcessScheduledPosts());
    $this->info('Scheduled posts published successfully!');
})->purpose('Publish scheduled posts');

Schedule::command('posts:publish')->timezone('Africa/Cairo')->everySecond();