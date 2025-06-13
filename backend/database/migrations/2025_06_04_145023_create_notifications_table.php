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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('teacher_id')->nullable();
            $table->unsignedBigInteger('teacher_receive_id')->nullable();
            $table->unsignedBigInteger('student_id')->nullable();
            $table->string('title');
            $table->string('content');
            $table->enum('type', ['student_send', 'teacher_send', 'admin_send'])->default('teacher_send');
            $table->enum('status', ['read', 'unread'])->default('unread');
            $table->timestamps()->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
