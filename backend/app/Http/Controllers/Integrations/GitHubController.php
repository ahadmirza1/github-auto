<?php

namespace App\Http\Controllers\Integrations;

use App\Http\Controllers\Controller;
use App\Services\GitHub\GitHubOAuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GitHubController extends Controller
{
    public function __construct(private readonly GitHubOAuthService $oauthService) {}

    public function redirect(Request $request): JsonResponse
    {
        $state = Str::random(40);
        $request->session()->put('github_oauth_state', $state);

        return response()->json([
            'url' => $this->oauthService->getAuthorizationUrl($state),
        ]);
    }

    public function callback(Request $request): RedirectResponse
    {
        $state = $request->session()->pull('github_oauth_state');

        if (! hash_equals((string) $state, (string) $request->get('state'))) {
            return redirect(config('app.frontend_url') . '/integrations?error=invalid_state');
        }

        $this->oauthService->connect($request->user(), $request->get('code'));

        return redirect(config('app.frontend_url') . '/integrations?connected=github');
    }

    public function disconnect(Request $request): JsonResponse
    {
        $this->oauthService->disconnect($request->user());

        return response()->json(['message' => 'GitHub disconnected']);
    }
}
