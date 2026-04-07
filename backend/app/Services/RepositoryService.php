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

    public function deactivateWebhook(User $user, Repository $repository): Repository
    {
        $integration = Integration::where('user_id', $user->id)
            ->where('provider', 'github')
            ->firstOrFail();

        [$owner, $repo] = explode('/', $repository->full_name);
        $api = new GitHubApiService($integration->access_token);

        $webhookUrl = (config('app.webhook_base_url') ?: config('app.url')) . '/api/webhooks/github';

        $hooks = $api->listWebhooks($owner, $repo);
        foreach ($hooks as $hook) {
            if (($hook['config']['url'] ?? '') === $webhookUrl) {
                $api->deleteWebhook($owner, $repo, $hook['id']);
            }
        }

        $repository->update(['webhook_active' => false, 'webhook_secret' => null]);

        return $repository->fresh();
    }

    public function activateWebhook(User $user, Repository $repository): Repository
    {
        $integration = Integration::where('user_id', $user->id)
            ->where('provider', 'github')
            ->firstOrFail();

        $secret = $repository->generateWebhookSecret();
        $webhookUrl = (config('app.webhook_base_url') ?: config('app.url')) . '/api/webhooks/github';

        [$owner, $repo] = explode('/', $repository->full_name);

        (new GitHubApiService($integration->access_token))
            ->createWebhook($owner, $repo, $webhookUrl, $secret);

        $repository->update(['webhook_active' => true]);

        return $repository->fresh();
    }
}
