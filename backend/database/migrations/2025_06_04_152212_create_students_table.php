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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('student_code')->unique();
            $table->string('email')->unique();
            $table->string('name');
            $table->string('password');
            $table->date('date_of_birth');
            $table->string('address');
            $table->enum('gender', ['male', 'female']);
            $table->date('enrollment_date')->useCurrent();
            $table->date('graduation_date')->nullable();
            $table->unsignedBigInteger('major_id')->nullable();
            $table->enum('status', ['active', 'graduated', 'suspended', 'dropped_out', 'pending'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
