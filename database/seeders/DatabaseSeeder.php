<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Hash;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'last_name' => 'Admin',
            'first_name' => 'User',
            'gender' => 'Male',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'status'=> 'active',
            'is_default' => 1,
        ]);

        User::factory()->create([
            'last_name' => 'Enumerator',
            'first_name' => 'User',
            'gender' => 'Male',
            'email' => 'enumerator@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'enumerator',
            'status'=> 'active',
            'is_default' => 1,
        ]);
    }
}
