<?php

use App\Http\Controllers\Blade\AuthController;
use App\Http\Controllers\Blade\DashboardController;
use App\Http\Controllers\Blade\FeedController;
use App\Http\Controllers\Blade\PostController;
use App\Http\Controllers\Blade\SettingsController;
use Illuminate\Support\Facades\Route;


// Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
    
   
});
Route::middleware('auth')->group(function () {
    // Logout
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
 
    //feed
    Route::get('/',[FeedController::class, 'index'])->name('feed');


    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Posts
    Route::resource('posts', PostController::class)->except(['show']);
    
    // Settings
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings');
    Route::post('/settings/account', [SettingsController::class, 'updateAccount'])->name('settings.account');
    Route::post('/settings/platforms', [SettingsController::class, 'updatePlatforms'])->name('settings.platforms');
    Route::delete('/settings/platforms', [SettingsController::class, 'destroy'])->name('settings.account.delete');
});