<?php

namespace App\Repositories;

interface EloquentRepositoryInterface
{
    public function getAll();
    public function getWithPagination($limit, $page);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
    public function find($id): object|bool;
    public function findWithRelation($id, array $relation): object|bool;
    public function updateOrCreateById($id, array $resource): object|bool;
    public function findOrFailById($id);
    public function updateOrCreate(array $conditions, array $resource);

      public function findWithConditions(array $conditions);
}

