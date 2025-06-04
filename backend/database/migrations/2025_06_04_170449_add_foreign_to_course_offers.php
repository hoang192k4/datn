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
        Schema::table('course_offers', function (Blueprint $table) {
            //
            $table->foreign('teacher_id')
                ->references('id')
                ->on('teachers')
                ->onDelete('set null');
            $table->foreign('subject_id')
                ->references('id')
                ->on('subjects')
                ->onDelete('set null');
            $table->foreign('class_id')
                ->references('id')
                ->on('classes')
                ->onDelete('set null');
            $table->foreign('classroom_id')
                ->references('id')
                ->on('classrooms')
                ->onDelete('set null');
            $table->foreign('semester_id')
                ->references('id')
                ->on('semesters')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('course_offers', function (Blueprint $table) {
            //
            $table->dropForeign(['teacher_id']);
            $table->dropForeign(['subject_id']);
            $table->dropForeign(['class_id']);
            $table->dropForeign(['classroom_id']);
            $table->dropForeign(['semester_id']);
        });
    }
};
