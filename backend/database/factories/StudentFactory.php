<?php

namespace Database\Factories;

use App\Models\Student;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Factories\Factory;

class StudentFactory extends Factory
{
    protected $model = Student::class;

    public function definition()
    {
        $password = '123456';
        return [
            'student_code' => $this->faker->unique()->regexify('[A-Z0-9]{8}'),
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'password' => $password,
            'date_of_birth' => $this->faker->date(),
            'address' => $this->faker->address(),
            'gender' => $this->faker->randomElement(['male', 'female']),
            'enrollment_date' => $this->faker->date(),
            'status' => $this->faker->randomElement(['active', 'graduated', 'suspended', 'dropped_out', 'pending']),
            'major_id' => null,
        ];
    }
}
