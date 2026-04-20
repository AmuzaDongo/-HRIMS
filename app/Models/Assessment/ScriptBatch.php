<?php

namespace App\Models\Assessment;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;
use App\Models\User;
use App\Models\HR\MarkingCenter;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ScriptBatch extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'type', 'paper_id', 'center_id', 'batch_code', 'total_scripts','current_location', 'status', 'assessment_series_id', 'metadata',
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

    public function paper()
    {
        return $this->belongsTo(Paper::class);
    }

    public function marking_center()
    {
        return $this->belongsTo(MarkingCenter::class, 'center_id');
    }

    public function assessmentSeries()
    {
        return $this->belongsTo(AssessmentSeries::class, 'assessment_series_id');
    }

    public function movements()
    {
        return $this->hasMany(ScriptMovement::class, 'script_batch_id');
    }
}


