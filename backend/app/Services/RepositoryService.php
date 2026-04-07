<?php

namespace App\Services;

use App\Jobs\SyncRepositoriesJob;
use App\Models\Repository;
use App\Models\User;
use App\Services\GitHub\GitHubApiService;
use App\Models\Integration;
use Illuminate\Pagination\LengthAwarePaginator;

class RepositoryService
{
    public function listForUser(User $user): LengthAwarePaginator
    {
        return Repository::where('user_id', $user->id)
            ->orderBy('name')
            ->paginate(50);
    }

    public function syncForUser(User $user): void
    {
        SyncRepositoriesJob::dispatch($user->id);
    }

    public function activateWebhook(User $user, Repository $repository): Repository
    {
        $integration = Integration::where('user_id', $user->id)
            ->where('provider', 'github')
            ->firstOrFail();

        $secret = $repository->generateWebhookSecret();
        $webhookUrl = config('app.url') . '/api/webhooks/github';

        [$owner, $repo] = explode('/', $repository->full_name);

        (new GitHubApiService($integration->access_token))
            ->createWebhook($owner, $repo, $webhookUrl, $secret);

        $repository->update(['webhook_active' => true]);

        return $repository->fresh();
    }
}
