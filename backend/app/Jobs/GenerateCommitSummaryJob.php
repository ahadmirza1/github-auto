<?php

namespace App\Jobs;

use App\Models\Commit;
use App\Models\CommitSummary;
use App\Models\Integration;
use App\Services\Ai\AiSummarizerService;
use App\Services\GitHub\GitHubApiService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Throwable;

class GenerateCommitSummaryJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public array $backoff = [30, 60, 120];

    public function __construct(private readonly int $commitId) {}

    public function handle(AiSummarizerService $summarizer): void
    {
        $commit = Commit::with('repository.user')->findOrFail($this->commitId);
        $summary = CommitSummary::where('commit_id', $commit->id)->firstOrFail();

        $summary->update(['status' => 'processing']);

        $diff = $this->fetchDiff($commit);
        $result = $summarizer->summarizeCommit($commit->message, $diff);

        $summary->update([
            'summary' => $result['summary'],
            'highlights' => $result['highlights'],
            'model' => $result['model'],
            'tokens_used' => $result['tokens_used'],
            'status' => 'completed',
        ]);
    }

    public function failed(Throwable $exception): void
    {
        CommitSummary::where('commit_id', $this->commitId)->update([
            'status' => 'failed',
            'error' => $exception->getMessage(),
        ]);
    }

    private function fetchDiff(Commit $commit): string
    {
        $integration = Integration::where('user_id', $commit->repository->user_id)
            ->where('provider', 'github')
            ->first();

        if (! $integration) {
            return '';
        }

        [$owner, $repo] = explode('/', $commit->repository->full_name);

        return (new GitHubApiService($integration->access_token))
            ->getCommitDiff($owner, $repo, $commit->sha);
    }
}
