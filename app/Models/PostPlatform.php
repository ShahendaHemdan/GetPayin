<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class PostPlatform extends Pivot
{
protected $table = 'post_platform';

protected $casts = [
'platform_status' => 'string',
];
}