<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('repositories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('github_id');
            $table->string('name');
            $table->string('full_name'); // owner/repo
            $table->string('default_branch')->default('main');
            $table->string('html_url');
            $table->boolean('private')->default(false);
            $table->string('webhook_secret', 64)->nullable();
            $table->boolean('webhook_active')->default(false);
            $table->timestamp('synced_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'github_id']);
            $table->index('full_name');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('repositories');
    }
};
