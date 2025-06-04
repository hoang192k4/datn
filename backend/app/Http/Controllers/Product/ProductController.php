<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\BaseController;
use App\Supports\Log;
use App\Http\Requests\Product\ProductRequest;
use App\Http\Resources\Product\ProductResource;
use App\Http\Resources\Product\ProductResourceCollection;
use App\Models\Product;
use App\Repositories\Product\ProductRepositoryInterface;
use App\Services\Product\ProductServiceInterface;
use App\Supports\JsonResponse;
use Illuminate\Foundation\Exceptions\Renderer\Exception;
use Illuminate\Http\Request;

class ProductController extends BaseController
{
    use JsonResponse, Log;

    public function __construct(
        ProductRepositoryInterface $repository,
        ProductServiceInterface $service
    ) {
        $this->repository = $repository;
        $this->service = $service;
    }

    /**
     * @group Sản phẩm
     *
     * API lấy danh sách sản phẩm
     * @header X-API-KEY string required Khóa API để xác thực. Example: x8Yz0ABRLa9cP7KYJ1TFojZUDqk4MPsxhNQvVGAs
     * @queryParam limit int Số lượng sản phẩm mỗi trang. Mặc định 10.
     * @queryParam page int Trang hiện tại. Mặc định 1.
     *
     * @response 200 {
     *   "status": 200,
     *   "message": "Thực hiện thành công",
     *   "data": {
     *     "products": [
     *       {
     *         // Thông tin chi tiết của từng sản phẩm (theo ProductResource)
     *       }
     *     ],
     *     "links": {
     *       "first": "http://localhost/api/products?page=1",
     *       "last": "http://localhost/api/products?page=10",
     *       "prev": null,
     *       "next": "http://localhost/api/products?page=2"
     *     },
     *     "meta": {
     *       "current_page": 1,
     *       "from": 1,
     *       "to": 10,
     *       "limit": 10,
     *       "total": 100,
     *       "count": 10,
     *       "total_pages": 10
     *     }
     *   }
     * }
     */

    public function index(ProductRequest $request)
    {
        $data = $request->validated();

        $limit = $data['limit'] ?? 10;
        $page = $data['page'] ?? 1;

        $products = $this->repository->getWithPagination($limit, $page);
        return $this->jsonResponseSuccess(new ProductResourceCollection($products));
    }

    /**
     * @group Sản phẩm
     *
     * API thêm mới sản phẩm
     *
     * @bodyParam name string required Tên sản phẩm. Bắt buộc.
     * @response 201 {
     *   "status": 201,
     *   "message": "Thực hiện thành công",
     *   "data": null
     * }
     * @response 400 {
     *   "status": 400,
     *   "message": "Thực hiện không thành công",
     *   "data": null
     * }
     * @response 500 {
     *   "status": 500,
     *   "message": "Lỗi hệ thống!",
     *   "data": null
     * }
     */

    public function store(ProductRequest $request)
    {
        try {
            $product = $this->service->store($request);
            if ($product)
                return $this->jsonResponseSuccessNoData('', 201);
            return $this->jsonResponseError();
        } catch (\Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống!', 500);
        }
    }

    /**
     * @group Sản phẩm
     *
     * API lấy thông tin chi tiết sản phẩm
     *
     * @urlParam id int required ID sản phẩm. Example: 1
     * @response 200 {
     *   "status": 200,
     *   "message": "Thực hiện thành công",
     *   "data": {
     *     // Thông tin chi tiết của sản phẩm (theo ProductResource)
     *   }
     * }
     */
    public function detail(Product $product)
    {
        return $this->jsonResponseSuccess(new ProductResource($product));
    }

    /**
     * @group Sản phẩm
     *
     * API cập nhật thông tin sản phẩm
     *
     * @urlParam id int required ID sản phẩm. Example: 1
     * @bodyParam name string Tên sản phẩm. Không bắt buộc.
     * @response 200 {
     *   "status": 200,
     *   "message": "Thực hiện thành công",
     *   "data": null
     * }
     * @response 400 {
     *   "status": 400,
     *   "message": "Thực hiện không thành công",
     *   "data": null
     * }
     * @response 500 {
     *   "status": 500,
     *   "message": "Lỗi hệ thống!",
     *   "data": null
     * }
     */
    public function update(ProductRequest $request, Product $product)
    {
        try {
            $product = $this->service->update($request, $product);
            if ($product)
                return $this->jsonResponseSuccessNoData('', 200);
            return $this->jsonResponseError();
        } catch (\Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống!', 500);
        }
    }
}
