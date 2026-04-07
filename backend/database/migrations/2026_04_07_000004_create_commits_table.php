<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('repository_id')->constrained()->cascadeOnDelete();
            $table->string('sha', 40)->unique();
            $table->string('branch');
            $table->string('author_name');
            $table->string('author_email');
            $table->string('author_login')->nullable(); // GitHub username if available
            $table->text('message');
            $table->string('url');
            $table->timestamp('committed_at');
            $table->timestamps();

            $table->index(['repository_id', 'branch']);
            $table->index('committed_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commits');
    }
};
