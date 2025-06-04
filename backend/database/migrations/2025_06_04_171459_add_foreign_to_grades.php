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
        Schema::table('grades', function (Blueprint $table) {
            //
            $table->foreign('student_id')
                ->references('id')
                ->on('students')
                ->onDelete('set null');
            $table->foreign('course_offer_id')
                ->references('id')
                ->on('course_offers')
                ->onDelete('set null');
            $table->foreign('grade_type_id')
                ->references('id')
                ->on('grade_types')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('grades', function (Blueprint $table) {
            //
            $table->dropForeign(['student_id']);
            $table->dropForeign(['course_offer_id']);
            $table->dropForeign(['grade_type_id']);
        });
    }
};
