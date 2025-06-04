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
        Schema::table('notifications', function (Blueprint $table) {
            //
            $table->foreign('teacher_id')
                ->references('id')
                ->on('teachers')
                ->onDelete('set null');
            $table->foreign('teacher_receive_id')
                ->references('id')
                ->on('teachers')
                ->onDelete('set null');
            $table->foreign('student_id')
                ->references('id')
                ->on('students')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            //
            $table->dropForeign(['teacher_id']);
            $table->dropForeign(['teacher_receive_id']);
            $table->dropForeign(['student_id']);
        });
    }
};
