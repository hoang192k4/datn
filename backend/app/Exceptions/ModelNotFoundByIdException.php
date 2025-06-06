<?php

namespace App\Exceptions;

use Exception;

class ModelNotFoundByIdException extends Exception
{
    //
    public function __construct(string $modelName = 'Model', $id = null)
    {
        $message = "$modelName với ID [$id] không tồn tại.";
        parent::__construct($message, 404);
    }
}
