<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commit_summaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('commit_id')->unique()->constrained()->cascadeOnDelete();
            $table->text('summary');
            $table->json('highlights')->nullable(); // key changes, risky files, breaking changes
            $table->string('model')->default('gpt-4o-mini');
            $table->unsignedInteger('tokens_used')->default(0);
            $table->string('status')->default('pending'); // pending, completed, failed
            $table->text('error')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commit_summaries');
    }
};
