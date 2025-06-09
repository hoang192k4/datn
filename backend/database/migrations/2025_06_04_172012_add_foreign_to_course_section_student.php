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
        Schema::table('course_section_student', function (Blueprint $table) {
            //
            $table->foreign('course_section_id')
                ->references('id')
                ->on('course_sections')
                ->onDelete('cascade');
            $table->foreign('student_id')
                ->references('id')
                ->on('students')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('course_section_student', function (Blueprint $table) {
            //
            $table->dropForeign(['student_id']);
            $table->dropForeign(['course_section_id']);
        });
    }
};
