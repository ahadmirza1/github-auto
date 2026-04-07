<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommitSummary extends Model
{
    protected $fillable = [
        'commit_id',
        'summary',
        'highlights',
        'model',
        'tokens_used',
        'status',
        'error',
    ];

    protected $casts = [
        'highlights' => 'array',
        'tokens_used' => 'integer',
    ];

    public function commit(): BelongsTo
    {
        return $this->belongsTo(Commit::class);
    }
}
