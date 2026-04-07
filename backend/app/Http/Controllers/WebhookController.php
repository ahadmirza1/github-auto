<?php

namespace App\Http\Controllers;

use App\Models\Repository;
use App\Models\WebhookEvent;
use App\Services\Webhooks\WebhookDispatcherService;
use App\Services\Webhooks\WebhookSignatureVerifier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class WebhookController extends Controller
{
    public function __construct(
        private readonly WebhookSignatureVerifier $verifier,
        private readonly WebhookDispatcherService $dispatcher
    ) {}

    public function github(Request $request): JsonResponse
    {
        $deliveryId = $request->header('X-GitHub-Delivery');
        $eventType = $request->header('X-GitHub-Event');
        $payload = $request->json()->all();

        $repository = $this->resolveRepository($payload);

        if ($repository && ! $this->verifier->verify($request, $repository)) {
            return response()->json(['error' => 'Invalid signature'], Response::HTTP_UNAUTHORIZED);
        }

        // Idempotent — skip already-processed deliveries
        if (WebhookEvent::where('delivery_id', $deliveryId)->exists()) {
            return response()->json(['message' => 'Already processed']);
        }

        $event = WebhookEvent::create([
            'repository_id' => $repository?->id,
            'delivery_id' => $deliveryId,
            'event_type' => $eventType,
            'payload' => $payload,
            'status' => 'received',
        ]);

        $this->dispatcher->dispatch($event);

        return response()->json(['message' => 'Accepted'], Response::HTTP_ACCEPTED);
    }

    private function resolveRepository(array $payload): ?Repository
    {
        $repoData = $payload['repository'] ?? null;

        if (! $repoData) {
            return null;
        }

        return Repository::where('github_id', $repoData['id'])->first();
    }
}
