<?php

namespace App\Services\Post;

use Illuminate\Http\Request;


interface PostServiceInterface
{
    public function destroyPost($postId);
    public function update(Request $request, $id): bool;
}
