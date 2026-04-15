<?php

namespace App\Services;

use App\Models\Commit;
use App\Models\Repository;
use Illuminate\Pagination\LengthAwarePaginator;

class CommitService
{
    public function listForRepository(Repository $repository, ?string $branch = null, int $perPage = 30): LengthAwarePaginator
    {
        return Commit::with('summary')
            ->where('repository_id', $repository->id)
            ->when($branch, fn ($q) => $q->where('branch', $branch))
            ->orderByDesc('committed_at')
            ->paginate($perPage);
    }

    public function countForRepository(Repository $repository): int
    {
        return Commit::where('repository_id', $repository->id)->count();
    }

    public function getWithSummary(string $sha): Commit
    {
        return Commit::with('summary', 'repository')
            ->where('sha', $sha)
            ->firstOrFail();
    }
}
