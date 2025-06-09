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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->nullable()->constrained();
            $table->foreignId('course_section_id')->nullable()->constrained();
            $table->string('title');
            $table->string('content');
            $table->enum('status', ['public', 'private'])->default('public');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function ($table) {
            $table->dropForeign(['teacher_id']);
            $table->dropForeign(['course_section_id']);
        });
        Schema::dropIfExists('posts');
    }
};
