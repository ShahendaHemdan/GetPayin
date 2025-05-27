@extends('layouts.app')

@section('title', 'Post Dashboard')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="h3 mb-0">Post Dashboard</h1>
    <a href="{{ route('posts.create') }}" class="btn btn-primary">
        <i class="bi bi-plus-lg me-2"></i>New Post
    </a>
</div>

<div class="row mb-4">
    <div class="col-md-4">
        <div class="card border-0 shadow-sm">
            <div class="card-body">
                <div class="d-flex align-items-center">
                    <div class="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                        <i class="bi bi-calendar-check text-primary fs-4"></i>
                    </div>
                    <div>
                        <h6 class="text-muted mb-1">Scheduled Posts</h6>
                        <h4 class="mb-0">{{ $stats['scheduled'] }}</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="col-md-4">
        <div class="card border-0 shadow-sm">
            <div class="card-body">
                <div class="d-flex align-items-center">
                    <div class="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                        <i class="bi bi-check-circle text-success fs-4"></i>
                    </div>
                    <div>
                        <h6 class="text-muted mb-1">Published Posts</h6>
                        <h4 class="mb-0">{{ $stats['published'] }}</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="col-md-4">
        <div class="card border-0 shadow-sm">
            <div class="card-body">
                <div class="d-flex align-items-center">
                    <div class="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                        <i class="bi bi-pencil-square text-warning fs-4"></i>
                    </div>
                    <div>
                        <h6 class="text-muted mb-1">Draft Posts</h6>
                        <h4 class="mb-0">{{ $stats['draft'] }}</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="card shadow-sm border-0">
    <div class="card-header bg-white border-bottom-0 py-3">
        <ul class="nav nav-tabs card-header-tabs">
            <li class="nav-item">
                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#list-view">List View</button>
            </li>
        </ul>
    </div>
    
    <div class="card-body">
        <div class="tab-content">
            <div class="tab-pane fade show active" id="list-view">
                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead class="table-light">
                            <tr>
                                <th>Title</th>
                                <th>Platforms</th>
                                <th>Scheduled For</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($posts as $post)
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center">
                                        @if($post->image_url)
                                        <div class="me-3" style="width: 48px; height: 48px;">
                                            <img src="{{ asset('storage/'.$post->image_url) }}" 
                                                alt="Post" class="img-fluid rounded" style="width: 48px; height: 48px; object-fit: cover;">
                                        </div>
                                        @endif
                                        <div>
                                            <h6 class="mb-0">{{ $post->title }}</h6>
                                            <small class="text-muted">{{ Str::limit($post->content, 50) }}</small>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="d-flex gap-1">
                                        @foreach($post->platforms as $platform)
                                        <span class="platform-icon {{ $platform->type }}">
                                            <i class="bi bi-{{ $platform->type }}"></i>
                                        </span>
                                        @endforeach
                                    </div>
                                </td>
                                <td>{{ $post->scheduled_time->format('M d, Y h:i A') }}</td>
                                <td>
                                    @if($post->status === 'scheduled')
                                        <span class="badge bg-primary">Scheduled</span>
                                    @elseif($post->status === 'published')
                                        <span class="badge bg-success">Published</span>
                                    @else
                                        <span class="badge bg-warning">Draft</span>
                                    @endif
                                </td>
                                <td class="text-end">
                                    <div class="d-flex gap-1">
                                        <a href="{{ route('posts.edit', $post->id) }}" class="btn btn-sm btn-outline-primary">
                                            <i class="bi bi-pencil"></i>
                                            <span class="d-none d-md-inline ms-1">Edit</span>
                                        </a>
                                        <form action="{{ route('posts.destroy', $post->id) }}" method="POST">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-sm btn-outline-danger">
                                                <i class="bi bi-trash"></i>
                                                <span class="d-none d-md-inline ms-1">Delete</span>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
                
                {{ $posts->links() }}
            </div>
        </div>
    </div>
</div>
@endsection