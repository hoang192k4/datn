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
        Schema::create('course_offer_student', function (Blueprint $table) {
            $table->unsignedBigInteger('course_offer_id');
            $table->unsignedBigInteger('student_id');
            $table->timestamps();

            $table->primary(['course_offer_id', 'student_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_offer_student');
    }
};
