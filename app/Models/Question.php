<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'survey_id',
        'text',
        'type',
        'required',
    ];

    public function survey(): BelongsTo
    {
        return $this->belongsTo(Survey::class, 'survey_id');
    }

    public function option(): HasMany
    {
        return $this->hasMany(Option::class, 'question_id');
    }

    public function answer(): HasMany
    {
        return $this->hasMany(Answer::class,'question_id');
    }
}
