<?php

namespace App\Services\GitHub;

use GuzzleHttp\Client;

class GitHubApiService
{
    private Client $http;

    public function __construct(private readonly string $token)
    {
        $this->http = new Client([
            'base_uri' => 'https://api.github.com',
            'headers' => [
                'Authorization' => "Bearer {$token}",
                'Accept' => 'application/vnd.github+json',
                'X-GitHub-Api-Version' => '2022-11-28',
            ],
        ]);
    }

    public function getAuthenticatedUser(): array
    {
        return $this->get('/user');
    }

    public function getUserRepos(int $page = 1, int $perPage = 100): array
    {
        return $this->get('/user/repos', [
            'sort' => 'updated',
            'per_page' => $perPage,
            'page' => $page,
        ]);
    }

    public function getCommitDiff(string $owner, string $repo, string $sha): string
    {
        $response = $this->http->get("/repos/{$owner}/{$repo}/commits/{$sha}", [
            'headers' => ['Accept' => 'application/vnd.github.diff'],
        ]);

        return $response->getBody()->getContents();
    }

    public function createWebhook(string $owner, string $repo, string $webhookUrl, string $secret): array
    {
        return $this->post("/repos/{$owner}/{$repo}/hooks", [
            'name' => 'web',
            'active' => true,
            'events' => ['push', 'create', 'pull_request'],
            'config' => [
                'url' => $webhookUrl,
                'content_type' => 'json',
                'secret' => $secret,
                'insecure_ssl' => '0',
            ],
        ]);
    }

    public function listWebhooks(string $owner, string $repo): array
    {
        return $this->get("/repos/{$owner}/{$repo}/hooks");
    }

    public function deleteWebhook(string $owner, string $repo, int $hookId): void
    {
        $this->http->delete("/repos/{$owner}/{$repo}/hooks/{$hookId}");
    }

    private function get(string $path, array $query = []): array
    {
        $response = $this->http->get($path, ['query' => $query]);
        return json_decode($response->getBody()->getContents(), true);
    }

    private function post(string $path, array $body): array
    {
        $response = $this->http->post($path, ['json' => $body]);
        return json_decode($response->getBody()->getContents(), true);
    }
}
