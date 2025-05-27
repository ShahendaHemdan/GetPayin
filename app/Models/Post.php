<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
use HasFactory;

protected $fillable = [
'user_id', 'title', 'content', 'image_url',
'scheduled_time', 'status'
];

protected $casts = [
'scheduled_time' => 'datetime',
];

public function user()
{
return $this->belongsTo(User::class);
}

public function platforms()
{
return $this->belongsToMany(Platform::class, 'post_platform')
->withPivot('platform_status')
->withTimestamps();
}


public function scopeScheduled($query)
{
    return $query->where('status', 'scheduled');
}

public function scopeReadyToPublish($query)
    {
        return $query->where('scheduled_time', '<=', now());
    }

public function publish()
    {
        $this->update(['status' => 'published']);
        
        $this->platforms()->updateExistingPivot(
            $this->platforms->pluck('id')->toArray(),
            ['platform_status' => 'published']
        );
        
        return $this;
    }
}