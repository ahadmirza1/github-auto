<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Commit extends Model
{
    protected $fillable = [
        'repository_id',
        'sha',
        'branch',
        'author_name',
        'author_email',
        'author_login',
        'message',
        'url',
        'committed_at',
    ];

    protected $casts = [
        'committed_at' => 'datetime',
    ];

    public function repository(): BelongsTo
    {
        return $this->belongsTo(Repository::class);
    }

    public function summary(): HasOne
    {
        return $this->hasOne(CommitSummary::class);
    }
}
