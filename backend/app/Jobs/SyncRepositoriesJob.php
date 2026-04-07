<?php

namespace App\Jobs;

use App\Models\User;
use App\Services\GitHub\RepositorySyncService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SyncRepositoriesJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 30;

    public function __construct(private readonly int $userId) {}

    public function handle(RepositorySyncService $service): void
    {
        $user = User::findOrFail($this->userId);
        $service->syncForUser($user);
    }
}
