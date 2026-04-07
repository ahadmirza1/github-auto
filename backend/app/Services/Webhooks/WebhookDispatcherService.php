<?php

namespace App\Services\Webhooks;

use App\Jobs\ProcessPushEventJob;
use App\Models\WebhookEvent;

class WebhookDispatcherService
{
    public function dispatch(WebhookEvent $event): void
    {
        match ($event->event_type) {
            'push' => ProcessPushEventJob::dispatch($event->id),
            default => null,
        };
    }
}
