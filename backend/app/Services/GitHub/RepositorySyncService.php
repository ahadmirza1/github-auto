<?php

namespace App\Services\GitHub;

use App\Models\Integration;
use App\Models\Repository;
use App\Models\User;

class RepositorySyncService
{
    public function syncForUser(User $user): int
    {
        $integration = Integration::where('user_id', $user->id)
            ->where('provider', 'github')
            ->firstOrFail();

        $api = new GitHubApiService($integration->access_token);

        $repos = $this->fetchAllRepos($api);
        $synced = 0;

        foreach ($repos as $repo) {
            Repository::updateOrCreate(
                ['user_id' => $user->id, 'github_id' => $repo['id']],
                [
                    'name' => $repo['name'],
                    'full_name' => $repo['full_name'],
                    'default_branch' => $repo['default_branch'] ?? 'main',
                    'html_url' => $repo['html_url'],
                    'private' => $repo['private'],
                    'synced_at' => now(),
                ]
            );
            $synced++;
        }

        return $synced;
    }

    private function fetchAllRepos(GitHubApiService $api): array
    {
        $all = [];
        $page = 1;

        do {
            $page_repos = $api->getUserRepos($page);
            $all = array_merge($all, $page_repos);
            $page++;
        } while (count($page_repos) === 100);

        return $all;
    }
}
