<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GetPayIn - Social Feed</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css" rel="stylesheet">
    <style>
        .platform-icon {
            width: 32px;
            height: 32px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            color: white;
        }
        .facebook { background-color: #1877F2; }
        .twitter { background-color: #1DA1F2; }
        .instagram { background-color: #E4405F; }
        .linkedin { background-color: #0A66C2; }
        
        .post-card {
            transition: transform 0.2s ease;
        }
        .post-card:hover {
            transform: translateY(-5px);
        }
        
        .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
        }
        
        .engagement-btn {
            color: #6c757d;
            text-decoration: none;
            transition: color 0.2s ease;
        }
        .engagement-btn:hover {
            color: #0d6efd;
        }
        
        /* Center the main content */
        .main-content {
            margin: 0 auto;
            max-width: 800px;
        }
    </style>
</head>
<body class="bg-light">
    <!-- Navigation -->
    

    @include('layouts.nav')

    <div class="container py-4">
        <div class="row justify-content-center">
            <!-- Main Feed -->
            <div class="col-lg-10 main-content">
                <!-- Create Post Card -->
                

                <!-- Posts -->
                @foreach($posts as $post)
                <div class="post-card card shadow-sm mb-4">
                    <div class="card-body">
                        <div class="d-flex mb-3">
                            <div>
                                <h6 class="mb-0">{{ $post->user->name }}</h6>
                                <small class="text-muted">{{ $post->user->title }} • {{ $post->created_at->diffForHumans() }}</small>
                            </div>
                        </div>
                        
                        <h5>{{ $post->title }}</h5>
                        <p>{{ $post->content }}</p>
                        
                        @if($post->image_url)
                        <img src="{{ asset('storage/'.$post->image_url) }}" 
                             alt="{{ $post->title }}" class="img-fluid rounded mb-3">
                        @endif
                        
                       
                        <div class="d-flex gap-1">
                            <span class="fw-bold">Published at: </span>
                            @foreach($post->platforms as $platform)
                            <span class="platform-icon {{ $platform->type }}">
                                <i class="bi bi-{{ $platform->type }}"></i>
                            </span>
                            @endforeach
                        </div>
                       
                    </div>
                </div>
                @endforeach
                
                @if($posts->isEmpty())
                <div class="card shadow-sm">
                    <div class="card-body text-center py-5">
                        <i class="bi bi-newspaper display-4 text-muted mb-3"></i>
                        <h5>No published posts yet</h5>
                        <p class="text-muted">Be the first to create a post!</p>
                    </div>
                </div>
                @endif
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html> 