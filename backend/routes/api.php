<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommitsController;
use App\Http\Controllers\Integrations\GitHubController;
use App\Http\Controllers\Integrations\IntegrationsController;
use App\Http\Controllers\RepositoriesController;
use App\Http\Controllers\WebhookController;
use Illuminate\Support\Facades\Route;

// Public
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Webhook — no auth, signature verified per-request
Route::post('/webhooks/github', [WebhookController::class, 'github'])
    ->withoutMiddleware('throttle');

// Authenticated
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Integrations
    Route::get('/integrations', [IntegrationsController::class, 'index']);

    // GitHub integration
    Route::get('/integrations/github/redirect', [GitHubController::class, 'redirect']);
    Route::get('/integrations/github/callback', [GitHubController::class, 'callback']);
    Route::delete('/integrations/github', [GitHubController::class, 'disconnect']);

    // Repositories
    Route::get('/repositories', [RepositoriesController::class, 'index']);
    Route::post('/repositories/sync', [RepositoriesController::class, 'sync']);
    Route::post('/repositories/{repository}/webhook', [RepositoriesController::class, 'activateWebhook']);

    // Commits
    Route::get('/repositories/{repository}/commits', [CommitsController::class, 'index']);
    Route::get('/commits/{sha}', [CommitsController::class, 'show']);
});
