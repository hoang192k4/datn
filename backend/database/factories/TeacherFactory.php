<?php

namespace Database\Factories;

use App\Models\Teacher;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Factories\Factory;

class TeacherFactory extends Factory
{
    protected $model = Teacher::class;

    public function definition()
    {
        $password = '123456';
        return [
            'teacher_code' => $this->faker->unique()->regexify('[A-Z0-9]{8}'),
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'slug' => $this->faker->slug,
            'password' => $password,
            'date_of_birth' => $this->faker->date(),
            'address' => $this->faker->address(),
            'gender' => $this->faker->randomElement(['male', 'female']),
            'status' => $this->faker->randomElement(['active', 'inactive']),
            'role_id' => null,
        ];
    }
}
