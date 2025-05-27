<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Platform extends Model
{
use HasFactory;

protected $fillable = ['name', 'type'];

public function posts()
{
return $this->belongsToMany(Post::class, 'post_platform')
->withPivot('platform_status')
->withTimestamps();
}

public function users()
{
return $this->belongsToMany(User::class, 'user_platforms')
->withPivot('is_active')
->withTimestamps();
}
}