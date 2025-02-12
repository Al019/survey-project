<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Response extends Model
{
    use HasFactory;

    protected $fillable = [
        'survey_id',
        'enumerator_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'enumerator_id');
    }

    public function survey(): BelongsTo
    {
        return $this->belongsTo(Survey::class, 'survey_id');
    }

    public function answer(): HasMany
    {
        return $this->hasMany(Answer::class,'response_id');
    }
}
