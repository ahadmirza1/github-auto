<?php

namespace App\Services\Ai;

use App\Services\Ai\Contracts\AiProviderInterface;
use App\Services\Ai\Providers\ClaudeProvider;
use App\Services\Ai\Providers\GeminiProvider;
use App\Services\Ai\Providers\GroqProvider;

class AiSummarizerService
{
    private AiProviderInterface $provider;

    public function __construct()
    {
        $this->provider = match (config('ai.provider')) {
            'groq'   => new GroqProvider(),
            'gemini' => new GeminiProvider(),
            default  => new ClaudeProvider(),
        };
    }

    public function summarizeCommit(string $commitMessage, string $diff): array
    {
        return $this->provider->summarizeCommit($commitMessage, $diff);
    }

    public function getProviderName(): string
    {
        return config('ai.provider');
    }
}
