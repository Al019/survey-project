<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Option extends Model
{
    use HasFactory;

    protected $fillable = [
        'question_id',
        'text',
    ];

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class, 'question_id');
    }

    public function answer_option(): HasMany
    {
        return $this->hasMany(AnswerOption::class, 'option_id');
    }
}
