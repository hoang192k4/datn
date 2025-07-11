<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Collection;

interface EloquentRepositoryInterface
{
    public function countWithConditions(array $conditions); //đếm bản ghi với mảng điều kiện
    public function create(array $data): object|bool; //tạo instance mới
    public function delete($id): bool; //xóa vĩnh viễn instance theo id
    public function deleteByConditions(array $conditions): bool; //xóa vĩnh viễn nhiều instance theo điều kiện

    public function firstOrCreate(array $conditions): object; //tìm kiếm một instance nếu không có thì tạo bản ghi mới
    public function findOrFailById($id): object|bool; //tìm một instance theo id, nếu không có trả về lỗi 404
    public function find($id): object|bool; //tìm một instance theo id
    public function findMany($ids): Collection; //danh sách các instance theo danh sách id
    public function findWithRelation($id, array $relation): ?object; //tìm một instance và eager loading relation
    public function findWithConditions(array $conditions): ?object; //tìm một instance với mảng điều kiện

    public function inserts(array $data): bool; //thêm nhiều dòng dữ liệu cùng lúc

    public function getAll();
    public function getWithPagination($limit, $page);
    /** tìm kiếm danh sách có điều kiện, lọc, eager load $relations, (limit và page) để phân trang*/
    public function getList(array $filter = [], array $order = [], array $relations = [], $limit = null, $page = null, array $orFilter = []);

    public function update($id, array $data): bool; //cập nhật giá trị trong mảng data theo id
    public function updateOrCreateById($id, array $resource): object|bool; //cập nhật giá trị trong mảng theo id, nếu không có instance theo id thì tạo mới
    public function updateOrCreate(array $conditions, array $resource): object|bool; // cập nhật giá trị của instance tìm theo mảng, nếu không có thì tạo mới

    public function where(array $conditions): Collection; //lấy danh sách instance theo điều kiện
}
