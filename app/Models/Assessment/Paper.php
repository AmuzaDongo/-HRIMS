<?php

namespace App\Models\Assessment;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Ramsey\Uuid\Uuid;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class Paper extends Model
{
    use SoftDeletes;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'name', 'code', 'file_path', 'assessment_series_id', 'metadata',
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

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function setFilePathAttribute($value)
    {
        if ($value instanceof UploadedFile) {

            // ✅ Delete old file safely
            if ($this->file_path && Storage::disk('public')->exists($this->file_path)) {
                Storage::disk('public')->delete($this->file_path);
            }

            // ✅ FIXED method name
            $filename = time() . '_' . Str::slug($this->name) . '.' . $value->getClientOriginalExtension();

            $value->storeAs('papers', $filename, 'public');

            $this->attributes['file_path'] = 'papers/' . $filename;
        } 
        elseif (is_string($value)) {
            $this->attributes['file_path'] = $value;
        }
    }

    public function getFileUrlAttribute(): ?string
    {
        if (!$this->file_path) {
            return null;
        }

        return asset('storage/' . $this->file_path);
    }

    public function scripts()
    {
        return $this->hasMany(Script::class);
    }

    public function script_batches()
    {
        return $this->hasMany(ScriptBatch::class);
    }

    public function assessment_series()
    {
        return $this->belongsTo(AssessmentSeries::class);
    }
}