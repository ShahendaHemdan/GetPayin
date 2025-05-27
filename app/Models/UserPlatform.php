<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class UserPlatform extends Pivot
{
protected $table = 'user_platforms';

protected $casts = [
'is_active' => 'boolean',
];
}