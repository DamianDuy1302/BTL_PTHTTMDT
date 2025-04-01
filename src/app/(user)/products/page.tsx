"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductsListing from "@/components/ProductsListing";
import axiosInstance from "@/config/axios";
import { useEffect, useState } from "react";

const ProductsPage = ({ searchParams }: any) => {
  const { category_id, key } = searchParams;
  console.log(category_id, key);

  const [productList, setProductList] = useState([]);

  const getProductList = async () => {
    try {
      const { data } = await axiosInstance.get("/product/list", {
        params: category_id
          ? { "category-id": category_id }
          : key
            ? { key: key }
            : {},
      });
      console.log(data);
      setProductList(data.data.product);
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
                <>{key && <span>từ khóa: {key}</span>}</>
              )}
            </>
          ) : null}
        </div>

        <div className="mt-12 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:gap-y-10 lg:gap-x-10">
          {productList &&
            productList.length > 0 &&
            productList.map((product: any, index: any) => {
              return (
                <div key={index}>
                  <ProductsListing
                    product={product}
                    index={index}
                  ></ProductsListing>
                </div>
              );
            })}
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default ProductsPage;
