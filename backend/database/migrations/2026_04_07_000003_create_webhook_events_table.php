<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('webhook_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('repository_id')->nullable()->constrained()->nullOnDelete();
            $table->string('delivery_id')->unique(); // X-GitHub-Delivery header
            $table->string('event_type'); // push, create, pull_request
            $table->json('payload');
            $table->string('status')->default('received'); // received, processed, failed
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();

            $table->index(['event_type', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('webhook_events');
    }
};
