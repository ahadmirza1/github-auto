<?php

namespace App\Jobs;

use App\Models\Commit;
use App\Models\CommitSummary;
use App\Models\WebhookEvent;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessPushEventJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public function __construct(private readonly int $webhookEventId) {}

    public function handle(): void
    {
        $event = WebhookEvent::findOrFail($this->webhookEventId);
        $payload = $event->payload;

        if (empty($payload['commits']) || ! $event->repository_id) {
            $event->update(['status' => 'processed', 'processed_at' => now()]);
            return;
        }

        $branch = $this->extractBranch($payload['ref'] ?? '');

        foreach ($payload['commits'] as $commitData) {
            $commit = Commit::firstOrCreate(
                ['sha' => $commitData['id']],
                [
                    'repository_id' => $event->repository_id,
                    'branch' => $branch,
                    'author_name' => $commitData['author']['name'],
                    'author_email' => $commitData['author']['email'],
                    'author_login' => $commitData['author']['username'] ?? null,
                    'message' => $commitData['message'],
                    'url' => $commitData['url'],
                    'committed_at' => $commitData['timestamp'],
                ]
            );

            if ($commit->wasRecentlyCreated) {
                CommitSummary::create(['commit_id' => $commit->id, 'status' => 'pending', 'summary' => '']);
                GenerateCommitSummaryJob::dispatch($commit->id);
            }
        }

        $event->update(['status' => 'processed', 'processed_at' => now()]);
    }

    private function extractBranch(string $ref): string
    {
        return str_replace('refs/heads/', '', $ref);
    }
}
