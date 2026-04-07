<?php

namespace App\Services\Ai;

use OpenAI\Laravel\Facades\OpenAI;

class AiSummarizerService
{
    private const MAX_DIFF_CHARS = 12000;
    private const MODEL = 'gpt-4o-mini';

    public function summarizeCommit(string $commitMessage, string $diff): array
    {
        $truncatedDiff = mb_substr($diff, 0, self::MAX_DIFF_CHARS);
        $wasTruncated = mb_strlen($diff) > self::MAX_DIFF_CHARS;

        $prompt = $this->buildPrompt($commitMessage, $truncatedDiff, $wasTruncated);

        $response = OpenAI::chat()->create([
            'model' => self::MODEL,
            'messages' => [
                ['role' => 'system', 'content' => $this->systemPrompt()],
                ['role' => 'user', 'content' => $prompt],
            ],
            'response_format' => ['type' => 'json_object'],
            'temperature' => 0.3,
        ]);

        $content = json_decode($response->choices[0]->message->content, true);

        return [
            'summary' => $content['summary'] ?? '',
            'highlights' => [
                'key_changes' => $content['key_changes'] ?? [],
                'risky_files' => $content['risky_files'] ?? [],
                'breaking_changes' => $content['breaking_changes'] ?? [],
                'diff_truncated' => $wasTruncated,
            ],
            'model' => self::MODEL,
            'tokens_used' => $response->usage->totalTokens,
        ];
    }

    private function systemPrompt(): string
    {
        return <<<PROMPT
        You are a senior software engineer reviewing git commits. Analyze the commit message and diff,
        then return a JSON object with these keys:
        - summary: 2-3 sentence plain English description of what changed and why
        - key_changes: array of strings, each describing a meaningful change (max 5)
        - risky_files: array of file paths that have high-risk changes (migrations, auth, config)
        - breaking_changes: array of strings describing any breaking changes (empty if none)
        PROMPT;
    }

    private function buildPrompt(string $message, string $diff, bool $truncated): string
    {
        $truncatedNote = $truncated ? "\n[Note: diff was truncated due to size]" : '';

        return <<<PROMPT
        Commit message: {$message}

        Diff:{$truncatedNote}
        {$diff}
        PROMPT;
    }
}
