<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ActivityLogController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        try {
            $logs = $request->user()->activityLogs()
                ->latest()
                ->paginate(10);
                
            return $this->success($logs, 'Activity logs retrieved successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve activity logs', 500);
        }
    }

    public function show(ActivityLog $log)
    {
        try {
            if ($log->user_id !== Auth::id()) {
                return $this->unauthorized();
            }

            return $this->success($log, 'Activity log retrieved successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve activity log', 500);
        }
    }
}