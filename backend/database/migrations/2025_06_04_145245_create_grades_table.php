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
        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->decimal('score',10,2);
            $table->unsignedBigInteger('course_offer_id');
            $table->unsignedBigInteger('student_id');
            $table->unsignedBigInteger('grade_type_id');
            $table->enum('score_visibility',['public', 'private'])->default('private');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};
