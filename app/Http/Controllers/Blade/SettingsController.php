<?php

namespace App\Http\Controllers\Blade;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Platform;
use Illuminate\Support\Facades\Auth;

class SettingsController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $platforms = Platform::all();
        $userPlatforms = $user->platforms->pluck('id')->toArray();
        
        return view('settings.index', compact('user', 'platforms', 'userPlatforms'));
    }

    public function updateAccount(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . Auth::id(),
        ]);

        Auth::user()->update($validated);

        return redirect()->route('settings')->with('success', 'Account information updated successfully');
    }

    public function updatePlatforms(Request $request)
    {
        $validated = $request->validate([
            'platforms' => 'array',
            'platforms.*' => 'exists:platforms,id',
        ]);

        Auth::user()->platforms()->sync($validated['platforms'] ?? []);

        return redirect()->route('settings')->with('success', 'Platform preferences updated successfully');
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();
        $this->deleteUserData($user);
        $this->logoutUser($request);

        return redirect()->route('login')->with('success', 'Your account has been permanently deleted.');
    }

    protected function deleteUserData($user)
    {
        $user->posts()->delete();
        $user->delete();
    }

    protected function logoutUser(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
    }
}