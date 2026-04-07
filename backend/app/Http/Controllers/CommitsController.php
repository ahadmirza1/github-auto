<?php

namespace App\Http\Controllers;

use App\Models\Repository;
use App\Services\CommitService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommitsController extends Controller
{
    public function __construct(private readonly CommitService $commitService) {}

    public function index(Request $request, Repository $repository): JsonResponse
    {
        $this->authorize('view', $repository);

        $commits = $this->commitService->listForRepository(
            $repository,
            $request->query('branch')
        );

        return response()->json($commits);
    }

    public function show(string $sha): JsonResponse
    {
        $commit = $this->commitService->getWithSummary($sha);

        $this->authorize('view', $commit->repository);

        return response()->json($commit);
    }
}
