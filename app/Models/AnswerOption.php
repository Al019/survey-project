<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnswerOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'answer_id',
        'option_id',
    ];

    public function answer(): BelongsTo
    {
        return $this->belongsTo(Answer::class, 'answer_id');
    }

    public function option(): BelongsTo
    {
        return $this->belongsTo(Option::class, 'option_id');
    }
}
