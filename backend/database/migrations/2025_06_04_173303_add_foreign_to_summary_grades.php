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
        Schema::table('summary_grades', function (Blueprint $table) {
            //
            $table->foreign('course_offer_id')
                ->references('id')
                ->on('course_offers')
                ->onDelete('set null');
            $table->foreign('student_id')
                ->references('id')
                ->on('students')
                ->onDelete('set null');
            $table->foreign('semester_id')
                ->references('id')
                ->on('semesters')
                ->onDelete('set null');
            $table->foreign('subject_id')
                ->references('id')
                ->on('subjects')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('summary_grades', function (Blueprint $table) {
            //
            $table->dropForeign(['course_offer_id']);
            $table->dropForeign(['semester_id']);
            $table->dropForeign(['student_id']); 
            $table->dropForeign(['subject_id']);
        });
    }
};
