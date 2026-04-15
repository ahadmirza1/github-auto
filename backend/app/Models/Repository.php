<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Repository extends Model
{
    protected $fillable = [
        'user_id',
        'github_id',
        'name',
        'full_name',
        'default_branch',
        'html_url',
        'private',
        'webhook_secret',
        'webhook_active',
        'webhook_id',
        'synced_at',
    ];

    protected $casts = [
        'private' => 'boolean',
        'webhook_active' => 'boolean',
        'synced_at' => 'datetime',
    ];

    protected $hidden = ['webhook_secret'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function commits(): HasMany
    {
        return $this->hasMany(Commit::class);
    }

    public function webhookEvents(): HasMany
    {
        return $this->hasMany(WebhookEvent::class);
    }

    public function generateWebhookSecret(): string
    {
        $secret = Str::random(32);
        $this->update(['webhook_secret' => $secret]);
        return $secret;
    }

    public function isPrivate(): bool
    {
        return (bool) $this->private;
    }

    public function hasActiveWebhook(): bool
    {
        return (bool) $this->webhook_active && $this->webhook_id !== null;
    }

    public function getDisplayName(): string
    {
        return $this->full_name ?? $this->name;
    }
}
