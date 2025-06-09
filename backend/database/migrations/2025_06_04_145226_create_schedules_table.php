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
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('period_start')->nullable();
            $table->unsignedInteger('period_end')->nullable();
            $table->unsignedInteger('period_number')->nullable();
            $table->unsignedBigInteger('course_section_id')->nullable();
            $table->enum('session',['morning','affternoon']);
            $table->enum('day_of_week',['0','1','2','3','4','5','6']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
