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
        Schema::create('summary_grades', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_id')->nullable();
            $table->unsignedBigInteger('semester_id')->nullable();
            $table->unsignedBigInteger('subject_id')->nullable();
            $table->unsignedInteger('attempt')->nullable();
            $table->unsignedInteger('attendance_score')->nullable();
            $table->decimal('avg_score', 10, 2)->default(0);
            $table->decimal('exam1_score', 10, 2)->nullable();
            $table->decimal('exam2_score', 10, 2)->nullable();
            $table->decimal('final_score', 10, 2)->nullable();
            $table->enum('evaluation', ['excellent', 'good', 'fair', 'average', 'poor', 'very_poor']);
            $table->unsignedBigInteger('course_section_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('summary_grades');
    }
};
