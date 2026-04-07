<?php

namespace App\Http\Controllers;

use App\Models\Repository;
use App\Services\RepositoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RepositoriesController extends Controller
{
    public function __construct(private readonly RepositoryService $repositoryService) {}

    public function index(Request $request): JsonResponse
    {
        $repos = $this->repositoryService->listForUser($request->user());

        return response()->json($repos);
    }

    public function sync(Request $request): JsonResponse
    {
        $this->repositoryService->syncForUser($request->user());

        return response()->json(['message' => 'Sync queued']);
    }

    public function activateWebhook(Request $request, Repository $repository): JsonResponse
    {
        $this->authorize('update', $repository);

        $repository = $this->repositoryService->activateWebhook($request->user(), $repository);

        return response()->json($repository);
    }

    public function deactivateWebhook(Request $request, Repository $repository): JsonResponse
    {
        $this->authorize('update', $repository);

        $repository = $this->repositoryService->deactivateWebhook($request->user(), $repository);

        return response()->json($repository);
    }
}
