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
        Schema::create('chapters', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->unsignedSmallInteger('position')->nullable();
            $table->foreignId('teacher_id')->nullable()->constrained();
            $table->foreignId('subject_id')->nullable()->constrained();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('chapters', function ($table) {
            $table->dropForeign(['teacher_id']);
            $table->dropForeign(['subject_id']);
        });
        Schema::dropIfExists('chapters');
    }
};
