<?php

namespace App\Models\Assessment;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ScriptMovement extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'type', 'script_id', 'batch_id','from_location', 'to_location', 'action', 'status', 'handled_by', 'metadata',
    ];

    protected $casts = [
        'metadata' => 'array'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = Uuid::uuid4()->toString();
            }
        });
    }

    public function handledBy()
    {
        return $this->belongsTo(User::class, 'handled_by');
    }
}

