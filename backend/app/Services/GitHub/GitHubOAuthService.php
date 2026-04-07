<?php

namespace App\Services\GitHub;

use App\Models\Integration;
use App\Models\User;
use App\Jobs\SyncRepositoriesJob;
use GuzzleHttp\Client;
use Illuminate\Support\Str;

class GitHubOAuthService
{
    private Client $http;

    public function __construct()
    {
        $this->http = new Client(['base_uri' => 'https://github.com']);
    }

    public function getAuthorizationUrl(string $state): string
    {
        $params = http_build_query([
            'client_id' => config('services.github.client_id'),
            'redirect_uri' => config('services.github.redirect'),
            'scope' => 'repo read:user user:email',
            'state' => $state,
        ]);

        return "https://github.com/login/oauth/authorize?{$params}";
    }

    public function exchangeCode(string $code): array
    {
        $response = $this->http->post('/login/oauth/access_token', [
            'json' => [
                'client_id' => config('services.github.client_id'),
                'client_secret' => config('services.github.client_secret'),
                'code' => $code,
            ],
            'headers' => ['Accept' => 'application/json'],
        ]);

        return json_decode($response->getBody()->getContents(), true);
    }

    public function connect(User $user, string $code): Integration
    {
        $tokenData = $this->exchangeCode($code);

        $githubUser = (new GitHubApiService($tokenData['access_token']))->getAuthenticatedUser();

        $integration = Integration::updateOrCreate(
            ['user_id' => $user->id, 'provider' => 'github'],
            [
                'access_token' => $tokenData['access_token'],
                'token_type' => $tokenData['token_type'] ?? 'Bearer',
                'meta' => [
                    'login' => $githubUser['login'],
                    'avatar_url' => $githubUser['avatar_url'],
                    'name' => $githubUser['name'],
                ],
            ]
        );

        SyncRepositoriesJob::dispatch($user->id);

        return $integration;
    }

    public function disconnect(User $user): void
    {
        Integration::where('user_id', $user->id)
            ->where('provider', 'github')
            ->delete();
    }
}
