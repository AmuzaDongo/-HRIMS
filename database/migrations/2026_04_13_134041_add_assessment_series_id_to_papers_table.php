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
        Schema::table('papers', function (Blueprint $table) {
            Schema::table('papers', function (Blueprint $table) {
            $table->foreignId('assessment_series_id')
                ->nullable()
                ->after('id')
                ->constrained('assessment_series')
                ->nullOnDelete();
        });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('papers', function (Blueprint $table) {
            //
        });
    }
};
