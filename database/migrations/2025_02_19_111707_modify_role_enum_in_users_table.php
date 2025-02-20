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
        DB::statement("ALTER TABLE users CHANGE role role VARCHAR(255)");
        DB::statement("ALTER TABLE users CHANGE role role ENUM('admin', 'enumerator', 'viewer') NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE users CHANGE role role VARCHAR(255)");
        DB::statement("ALTER TABLE users CHANGE role role ENUM('admin', 'enumerator') NOT NULL");
    }
};
