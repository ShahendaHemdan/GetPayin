@extends('layouts.app')

@section('title', 'Create New Post')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="h3 mb-0">Create New Post</h1>
    <a href="{{ route('dashboard') }}" class="btn btn-outline-secondary">
        <i class="bi bi-arrow-left me-2"></i>Back to Dashboard
    </a>
</div>

<div class="card shadow-sm border-0">
    <div class="card-body p-4">
        <form action="{{ route('posts.store') }}" method="POST" enctype="multipart/form-data">
            @csrf
            
            <div class="mb-4">
                <label for="post-title" class="form-label">Title <span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="post-title" name="title" placeholder="Enter post title" required value="{{ old('title') }}">
                <div class="form-text">A title to help you identify this post (not published to platforms)</div>
                @error('title')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>
            
            <div class="mb-4">
                <label for="post-content" class="form-label">Content <span class="text-danger">*</span></label>
                <textarea class="form-control" id="post-content" name="content" rows="5" placeholder="What would you like to share?" required>{{ old('content') }}</textarea>
                <div class="d-flex justify-content-between mt-2">
                    <div class="form-text">The content that will be published to selected platforms</div>
                    <div id="character-counter" class="character-counter">0/280 characters</div>
                </div>
                @error('content')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>
            
            <div class="mb-4">
                <label class="form-label d-block">Platforms <span class="text-danger">*</span></label>
                <div class="d-flex flex-wrap gap-3">
                    @foreach($platforms as $platform)
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" 
                               id="platform-{{ $platform->id }}" 
                               name="platforms[]" 
                               value="{{ $platform->id }}"
                               {{ in_array($platform->id, old('platforms', [])) ? 'checked' : '' }}>
                        <label class="form-check-label d-flex align-items-center" for="platform-{{ $platform->id }}">
                            <span class="platform-icon {{ $platform->type }} me-2">
                                <i class="bi bi-{{ $platform->type }}"></i>
                            </span>
                            {{ $platform->name }}
                        </label>
                    </div>
                    @endforeach
                </div>
                <div class="form-text">Select the platforms where you want to publish this post</div>
                @error('platforms')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>
            
            <div class="mb-4">
                <label for="post-image" class="form-label">Image</label>
                <input type="file" class="form-control" id="post-image" name="image_url" accept="image/*">
                <div class="form-text">Add an image to your post (optional)</div>
                
                <div class="mt-2 d-none" id="image-preview-container">
                    <img id="image-preview" class="img-thumbnail" style="max-height: 100px;">
                </div>
                @error('image')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>
            
            <div class="mb-4">
                <label class="form-label">Schedule <span class="text-danger">*</span></label>
                
                <div class="row g-3">
                    <div class="col-md-6">
                        <input type="date" class="form-control" name="scheduled_date" required value="{{ old('scheduled_date', date('Y-m-d')) }}">
                    </div>
                    <div class="col-md-6">
                        <input type="time" class="form-control" name="scheduled_time" value="{{ old('scheduled_time', '12:00') }}" required>
                    </div>
                </div>
                <div class="form-text">When should this post be published?</div>
                @error('scheduled_time')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>
            
            <div class="mb-4">
                <label for="post-status" class="form-label">Status</label>
                <select class="form-select" id="post-status" name="status">
                    <option value="draft" {{ old('status', 'scheduled') == 'draft' ? 'selected' : '' }}>Draft</option>
                    <option value="scheduled" {{ old('status', 'scheduled') == 'scheduled' ? 'selected' : '' }}>Scheduled</option>
                </select>
                <div class="form-text">Draft posts won't be published automatically</div>
                @error('status')
                    <div class="text-danger">{{ $message }}</div>
                @enderror
            </div>
            
            <div class="d-flex justify-content-between mt-4 pt-2">
                <a href="{{ route('dashboard') }}" class="btn btn-outline-secondary">Cancel</a>
                <button type="submit" class="btn btn-primary px-4">Create Post</button>
            </div>
        </form>
    </div>
</div>

@push('scripts')
<script>
    // Image preview
    document.getElementById('post-image').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.getElementById('image-preview');
                preview.src = e.target.result;
                document.getElementById('image-preview-container').classList.remove('d-none');
            }
            reader.readAsDataURL(file);
        }
    });

    // Character counter
    document.getElementById('post-content').addEventListener('input', function(e) {
        const counter = document.getElementById('character-counter');
        counter.textContent = `${e.target.value.length}/280 characters`;
    });
</script>
@endpush
@endsection