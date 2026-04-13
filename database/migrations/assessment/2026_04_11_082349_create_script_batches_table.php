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
        Schema::create('script_batches', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->enum('type', ['single', 'batch']);
            $table->foreignId('paper_id')->constrained()->cascadeOnDelete();
            $table->foreignId('center_id')->constrained('marking_centers')->cascadeOnDelete();
            $table->string('current_location')->nullable();
            $table->enum('status', ['received', 'allocated', 'marked', 'checked'])->default('received');
            $table->string('batch_code')->unique();
            $table->integer('total_scripts');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('script_batches');
    }
};
