<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\PlatformController;
use App\Http\Controllers\Api\ActivityLogController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    
    // Posts routes
    Route::apiResource('posts', PostController::class);
    
    // Platforms routes
    Route::get('/platforms', [PlatformController::class, 'index']);
    Route::get('/user/platforms', [PlatformController::class, 'userPlatforms']);
    Route::post('/platforms/{platform}/toggle', [PlatformController::class, 'togglePlatform']);
    
    // Activity logs
    Route::get('/activity-logs', [ActivityLogController::class, 'index']);
});