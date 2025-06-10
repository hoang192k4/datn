<?php

namespace App\Http\Controllers;

use App\Supports\Log;
use App\Supports\ResponseWithJson;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class BaseController extends Controller
{
    //
    use ResponseWithJson, Log;

    protected $service;
    protected $repository;
}
