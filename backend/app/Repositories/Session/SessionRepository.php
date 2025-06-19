<?php 
namespace App\Repositories\Session;

use App\Models\Session;
use App\Repositories\EloquentRepository;

class SessionRepository extends EloquentRepository implements SessionRepositoryInterface
{
    public function getModel()
    {
        return Session::class;
    }
}