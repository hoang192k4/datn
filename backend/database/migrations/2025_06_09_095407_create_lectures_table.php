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
        Schema::create('lectures', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->string('file_path')->nullable();
            $table->foreignId('chapter_id')->nullable()->constrained();
            $table->unsignedSmallInteger('position')->nullable();
            $table->enum('status', ['public', 'private'])->default('public');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
         Schema::table('lectures', function ($table) {
            $table->dropForeign(['chapter_id']);
        });
        Schema::dropIfExists('lectures');
    }
};
