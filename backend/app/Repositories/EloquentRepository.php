<?php

namespace App\Repositories;

abstract class EloquentRepository implements EloquentRepositoryInterface
{
    protected $model;
    public function __construct()
    {
        $this->setModel();
    }
    public function setModel()
    {
        $this->model = app()->make($this->getModel());
    }

    abstract function getModel();

    public function getAll()
    {
        return $this->model->all();
    }

    public function getWithPagination($limit = 10, $page = 1)
    {
        return $this->model->paginate($limit,  '*', 'page', $page)->appends(['limit' => $limit]);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $model = $this->model->find($id);
        if ($model) {
            return $model->update($data);
        }
        return false;
    }

    public function delete($id)
    {
        $model = $this->model->find($id);
        if ($model) {
            return $model->delete();
        }
        return false;
    }
}
