<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Answer extends Model
{
    use HasFactory;

    protected $fillable = [
        'response_id',
        'question_id',
        'text',
    ];

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class, 'question_id');
    }

    public function response(): BelongsTo
    {
        return $this->belongsTo(Response::class, 'response_id');
    }

    public function answer_option(): HasMany
    {
        return $this->hasMany(AnswerOption::class, 'answer_id');
    }
}
