"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { PaginationDemo } from "@/components/Pagination";
import ProductsListing from "@/components/ProductsListing";
import axiosInstance from "@/config/axios";
import { useEffect, useState } from "react";

const ProductsPage = ({ searchParams }: any) => {
  const { category_id, key } = searchParams;

  const pageSize = 4; // Số lượng sản phẩm trên mỗi trang

  const [productList, setProductList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const getProductList = async () => {
    try {
      const { data } = await axiosInstance.get("/product/list", {
        params: category_id
          ? { "category-id": category_id }
          : key
          ? { key: key }
          : {},
      });

      setProductList(data.data.product);
      setTotalPage(Math.ceil(data.data.product.length / pageSize)); // Tính tổng số trang
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProductList();
  }, [category_id, key]);

  return (
    <MaxWidthWrapper>
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Danh sách sản phẩm
        </h1>
        <div className="mt-4 text-gray-900 font-medium">
          Tìm kiếm theo{" "}
          {productList && productList.length > 0 ? (
            <>
              {category_id ? (
                <span>danh mục: {productList[0].category_name}</span>
              ) : (
                <>
                  {key ? (
                    <span>từ khóa: {key}</span>
                  ) : (
                    <span>tất cả sản phẩm</span>
                  )}
                </>
              )}
            </>
          ) : null}
        </div>

        <div className="mt-12 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:gap-y-10 lg:gap-x-10">
          {productList &&
            productList.length > 0 &&
            productList.map((product: any, index: any) => {
              // Tính toán chỉ số bắt đầu và kết thúc của sản phẩm trên trang hiện tại
              const startIndex = (currentPage - 1) * pageSize;
              const endIndex = startIndex + pageSize;

              if (index < startIndex || index >= endIndex) {
                return null;
              } // Không hiển thị sản phẩm này trên trang hiện tại
              return (
                <ProductsListing
                  key={product.id}
                  product={productList[index]}
                  index={index}
                />
              );
            })}
        </div>
        <div className="mt-4">
          <PaginationDemo
            totalPage={totalPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default ProductsPage;
