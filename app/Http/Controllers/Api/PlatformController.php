<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Platform;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class PlatformController extends Controller
{
    use ApiResponse;

    public function index()
    {
        try {
            $platforms = Platform::all();
            return $this->success($platforms, 'Platforms retrieved successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve platforms', 500);
        }
    }

    public function userPlatforms(Request $request)
    {
        try {
            $platforms = $request->user()->platforms()
                ->wherePivot('is_active', true)
                ->get();
                
            return $this->success($platforms, 'User platforms retrieved successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve user platforms', 500);
        }
    }

    public function togglePlatform(Request $request, Platform $platform)
    {
        try {
            $user = $request->user();
            
            if ($user->platforms()->where('platform_id', $platform->id)->exists()) {
                // Get current status before toggling
                $currentStatus = $user->platforms()->find($platform->id)->pivot->is_active;
                
                // Toggle the platform status
                $user->platforms()->updateExistingPivot($platform->id, [
                    'is_active' => !$currentStatus
                ]);
                
                $message = $currentStatus ? 'Platform disabled successfully' : 'Platform enabled successfully';
            } else {
                // Attach the platform if not already attached with default active status
                $user->platforms()->attach($platform->id, ['is_active' => true]);
                $message = 'Platform added and enabled successfully';
            }

            // Return the updated platform with its new status
            $updatedPlatform = $user->platforms()
                ->where('platform_id', $platform->id)
                ->first();

            return $this->success([
                'platform' => $updatedPlatform,
                'is_active' => $updatedPlatform->pivot->is_active
            ], $message);
        } catch (\Exception $e) {
            return $this->error('Failed to update', 500);
        }
    }
}