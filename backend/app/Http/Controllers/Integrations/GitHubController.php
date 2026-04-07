<?php

namespace App\Http\Controllers\Integrations;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\GitHub\GitHubOAuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class GitHubController extends Controller
{
    public function __construct(private readonly GitHubOAuthService $oauthService) {}

    public function redirect(Request $request): JsonResponse
    {
        $state = Str::random(40);

        // Store user_id against state so the public callback can identify the user
        Cache::put("github_oauth_state:{$state}", $request->user()->id, now()->addMinutes(10));

        return response()->json([
            'url' => $this->oauthService->getAuthorizationUrl($state),
        ]);
    }

    // Public route — GitHub redirects the browser here with ?code=&state=
    public function callback(Request $request): RedirectResponse
    {
        $state = $request->get('state');
        $userId = Cache::pull("github_oauth_state:{$state}");

        if (! $userId) {
            return redirect(config('app.frontend_url') . '/dashboard/integrations?error=invalid_state');
        }

        $user = User::findOrFail($userId);
        $this->oauthService->connect($user, $request->get('code'));

        return redirect(config('app.frontend_url') . '/dashboard/integrations?connected=github');
    }

    public function disconnect(Request $request): JsonResponse
    {
        $this->oauthService->disconnect($request->user());

        return response()->json(['message' => 'GitHub disconnected']);
    }
}
