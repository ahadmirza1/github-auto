<?php

namespace App\Services\Ai;

use Anthropic\Laravel\Facades\Anthropic;

class AiSummarizerService
{
    private const MAX_DIFF_CHARS = 12000;
    private const MODEL = 'claude-sonnet-4-6';

    public function summarizeCommit(string $commitMessage, string $diff): array
    {
        $truncatedDiff = mb_substr($diff, 0, self::MAX_DIFF_CHARS);
        $wasTruncated = mb_strlen($diff) > self::MAX_DIFF_CHARS;

        $response = Anthropic::messages()->create([
            'model' => self::MODEL,
            'max_tokens' => 1024,
            'system' => $this->systemPrompt(),
            'messages' => [
                [
                    'role' => 'user',
                    'content' => $this->buildPrompt($commitMessage, $truncatedDiff, $wasTruncated),
                ],
            ],
        ]);

        $content = json_decode($response->content[0]->text, true);

        return [
            'summary' => $content['summary'] ?? '',
            'highlights' => [
                'key_changes' => $content['key_changes'] ?? [],
                'risky_files' => $content['risky_files'] ?? [],
                'breaking_changes' => $content['breaking_changes'] ?? [],
                'diff_truncated' => $wasTruncated,
            ],
            'model' => self::MODEL,
            'tokens_used' => $response->usage->inputTokens + $response->usage->outputTokens,
        ];
    }

    private function systemPrompt(): string
    {
        return <<<PROMPT
        You are a senior software engineer reviewing git commits. Analyze the commit message and diff, then return ONLY a valid JSON object (no markdown, no code fences) with these exact keys:
        - "summary": 2-3 sentence plain English description of what changed and why
        - "key_changes": array of strings, each describing a meaningful change (max 5 items)
        - "risky_files": array of file paths that have high-risk changes (migrations, auth, config, security)
        - "breaking_changes": array of strings describing breaking changes (empty array if none)
        PROMPT;
    }

    private function buildPrompt(string $message, string $diff, bool $truncated): string
    {
        $truncatedNote = $truncated ? "\n[Note: diff was truncated due to size]" : '';

        return "Commit message: {$message}\n\nDiff:{$truncatedNote}\n{$diff}";
    }
}
