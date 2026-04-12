<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('marking_sessions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->enum('type', ['single', 'batch']);
            $table->foreignUuid('script_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignUuid('batch_id')->nullable()->constrained('script_batches')->nullOnDelete();
            $table->foreignUuid('assessor_id')->constrained('users');
            $table->integer('assigned_scripts')->default(0);
            $table->integer('marked_scripts')->default(0);
            $table->enum('status', ['assigned', 'in_progress', 'completed'])->default('assigned');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('marking_sessions');
    }
};
