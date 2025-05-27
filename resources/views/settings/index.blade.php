@extends('layouts.app')

@section('title', 'Settings')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="h3 mb-0">Settings</h1>
</div>

<div class="row">
    <div class="col-lg-4 mb-4">
        <div class="card shadow-sm border-0 h-100">
            <div class="card-header bg-transparent">
                <h5 class="card-title mb-0">Account Information</h5>
            </div>
            <div class="card-body">
                <form action="{{ route('settings.account') }}" method="POST">
                    @csrf
                    <div class="mb-3">
                        <label for="name" class="form-label">Name</label>
                        <input type="text" class="form-control" id="name" name="name" 
                               value="{{ old('name', $user->name) }}" required>
                    </div>
                    
                    <div class="mb-3">
                        <label for="email" class="form-label">Email Address</label>
                        <input type="email" class="form-control" id="email" name="email" 
                               value="{{ old('email', $user->email) }}" required>
                    </div>
                    
                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
    <div class="col-lg-8">
        <div class="card shadow-sm border-0">
            <div class="card-header bg-transparent">
                <h5 class="card-title mb-0">Social Media Platforms</h5>
                <p class="card-subtitle text-muted">Enable or disable platforms for your content</p>
            </div>
            <div class="card-body">
                <form action="{{ route('settings.platforms') }}" method="POST">
                    @csrf
                    @foreach($platforms as $platform)
                    <div class="card mb-3 border">
                        <div class="card-body">
                            <div class="d-flex align-items-center justify-content-between">
                                <div class="d-flex align-items-center">
                                    <div class="platform-icon {{ $platform->type }} me-3">
                                        <i class="bi bi-{{ $platform->type }}"></i>
                                    </div>
                                    <div>
                                        <h5 class="mb-0">{{ $platform->name }}</h5>
                                        <p class="text-muted mb-0 small">
                                            @if($platform->type === 'twitter')
                                                Max 280 characters
                                            @elseif($platform->type === 'instagram')
                                                Max 2,200 characters
                                            @elseif($platform->type === 'linkedin')
                                                Max 3,000 characters
                                            @else
                                                Max 5,000 characters
                                            @endif
                                        </p>
                                    </div>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" 
                                           name="platforms[]" value="{{ $platform->id }}"
                                           {{ in_array($platform->id, $userPlatforms) ? 'checked' : '' }}>
                                    <label class="form-check-label">Enabled</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    @endforeach
                    
                    <div class="d-grid mt-3">
                        <button type="submit" class="btn btn-primary">Save Preferences</button>
                    </div>
                </form>
            </div>
        </div>
        
        <div class="card shadow-sm border-0 mt-4">
            <div class="card-header bg-transparent">
                <h5 class="card-title mb-0">Danger Zone</h5>
            </div>
            <div class="card-body">
                <p class="text-muted">These actions are destructive and cannot be reversed.</p>
                
                <button type="button" class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#deleteAccountModal">
                    <i class="bi bi-trash me-2"></i>Delete Account
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Delete Account Modal -->
<div class="modal fade" id="deleteAccountModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Delete Account</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                <p class="text-danger">All your posts and data will be permanently deleted.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <form action="{{ route('settings.account.delete') }}" method="POST">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn btn-danger">Delete Account</button>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection