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
        Schema::create('scripts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('paper_id')->constrained()->cascadeOnDelete();
            $table->string('barcode')->nullable();
            $table->string('center_origin')->nullable();
            $table->enum('status', ['received', 'allocated', 'marked', 'checked'])->default('received');
            $table->string('current_location')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreignUuid('created_by')->nullable()->constrained('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scripts');
    }
};
