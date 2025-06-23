<?php

namespace App\Repositories;

use App\Exceptions\ModelNotFoundByIdException;
use App\Supports\Log;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Collection;

abstract class EloquentRepository implements EloquentRepositoryInterface
{
    use Log;
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

    public function getAll(): Collection
    {
        return $this->model->all();
    }

    public function getWithPagination($limit = 10, $page = 1)
    {
        return $this->model->paginate($limit,  '*', 'page', $page)->appends(['limit' => $limit]);
    }

    public function create(array $data): object|bool
    {
        return $this->model->create($data);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Model |false
     */
    public function update($id, array $data): bool
    {
        $model = $this->model->find($id);
        if ($model) {
            return $model->update($data);
        }
        return false;
    }

    public function delete($id): bool
    {
        $model = $this->model->find($id);
        if ($model) {
            return $model->delete();
        }
        return false;
    }

    /**
     *  @param id
     * @return object|false
     */
    public function find($id): object|bool
    {
        return $this->model->find($id) ?? false;
    }


    /**
     *  @param id
     * @return object|false
     */
    public function findWithRelation($id, array $relation): ?object
    {
        return $this->model->with($relation)->find($id);
    }

    /**
     *  @param id
     * @param array resource
     * @return object|false
     */
    public function updateOrCreateById($id, array $resource): object|bool
    {
        return $this->model->updateOrCreate(['id' => $id], $resource) ?? false;
    }

    /**
     * Tìm một instance theo id, nếu không có sẽ bắt lỗi exception
     */
    public function findOrFailById($id): object|bool
    {
        $record = $this->model->find($id);

        if (!$record) {
            throw new ModelNotFoundByIdException(class_basename($this->model), $id);
        }

        return $record;
    }

    public function updateOrCreate(array $conditions, array $resource): object|bool
    {
        return $this->model->updateOrCreate($conditions, $resource) ?? false;
    }

    public function findWithConditions(array $conditions): ?object
    {
        return $this->model->where($conditions)->first();
    }

    public function inserts(array $data): bool
    {
        DB::beginTransaction();
        try {
            $this->model->insert($data);
            DB::commit();
            return true;
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            DB::rollBack();
            return false;
        }
    }

    public function findMany($ids): Collection
    {
        return $this->model->findMany($ids);
    }


    /**
     * @param array $filter Mảng điều kiện. ví dụ ['status' => 'active', 'id' => ['!=', 1]];
     * @param  arry $order Sắp xếp. Ví dụ ['name' => 'asc];
     * @param arry $relations Load thêm quan hệ. Ví dụ: ['teachers'];
     * @param mixed $limit Giới hạn lấy record (phân trang). Ví dụ: 10
     * @param mixed $page lấy theo trang. Ví dụ: 1
     * @param arry orFilter Mảng điều kiện để lấy sau khi lọc filter ban đầu
     *
     */
    public function getList(array $filter = [], array $order = [], array $relations = [], $limit = null, $page = null, array $orFilter = [])
    {
        $query = $this->model->query();

        if (!empty($relations)) {
            $query->with($relations);
        }

        foreach ($filter as $column => $value) {
            if (is_array($value)) {
                [$operator, $val] = $value;
                if (strtolower($operator) === 'like') {
                    $query->where($column, 'LIKE', "%{$val}%");
                } else {
                    $query->where($column, $operator, $val);
                }
            } else
                $query->where($column, $value);
        }

        // Thêm điều kiện orWhere
        if (!empty($orFilter)) {
            $query->where(function ($subQuery) use ($orFilter) {
                foreach ($orFilter as $column => $value) {
                    if (is_array($value)) {
                        [$operator, $val] = $value;

                        if (strtolower($operator) === 'like') {
                            $subQuery->orWhere($column, 'LIKE', "%{$val}%");
                        } else {
                            $subQuery->orWhere($column, $operator, $val);
                        }
                    } else {
                        $subQuery->orWhere($column, $value);
                    }
                }
            });
        }

        foreach ($order as $column => $direction) {
            $query->orderBy($column, $direction);
        }
        return $limit ? $query->paginate($limit, ['*'], 'page', $page ?? 1)->appends(['limit' => $limit]) : $query->get();
    }

    /**
     * tìm theo điều kiện nếu không có record theo điều kiện thì tạo bản ghi mới
     */
    public function firstOrCreate(array $conditions): object
    {
        return $this->model->firstOrCreate($conditions);
    }

    public function where(array $conditions): Collection
    {
        $query = $this->model->query();

        foreach ($conditions as $key => $value) {
            $query->where($key, $value);
        }

        return $query->get();
    }

    public function deleteByConditions(array $conditions): bool
    {
        $query = $this->model->query();

        foreach ($conditions as $key => $value) {
            $query->where($key, $value);
        }

        return $query->delete();
    }

    
}
