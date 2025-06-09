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
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->string('teacher_code')->unique();
            $table->string('email')->unique();
            $table->string('name');
            $table->string('slug');
            $table->string('password');
            $table->date('date_of_birth');
            $table->string('address');
            $table->enum('gender', ['male', 'female']);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->unsignedBigInteger('role_id')->nullable();
            $table->string('device_token');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teachers');
    }
};
