<?php

namespace App\Services\Webhooks;

use App\Models\Repository;
use Illuminate\Http\Request;

class WebhookSignatureVerifier
{
    public function verify(Request $request, Repository $repository): bool
    {
        $signature = $request->header('X-Hub-Signature-256');

        if (! $signature || ! $repository->webhook_secret) {
            return false;
        }

        $expected = 'sha256=' . hash_hmac('sha256', $request->getContent(), $repository->webhook_secret);

        return hash_equals($expected, $signature);
    }
}
