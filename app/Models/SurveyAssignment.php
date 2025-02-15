<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SurveyAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'survey_id',
        'enumerator_id',
        'target',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'enumerator_id');
    }

    public function survey(): BelongsTo
    {
        return $this->belongsTo(Survey::class, 'survey_id');
    }
}
