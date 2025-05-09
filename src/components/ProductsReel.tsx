"use client";
import axiosInstance from "@/config/axios";
import { TQueryValidator } from "@/lib/validators/query-validator";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProductsListing from "./ProductsListing";

interface ProductsReelProps {
  title: string;
  subtitle?: string;
  href?: string;
  category_id?: number;
}

const ProductsReel = (props: ProductsReelProps) => {
  const { title, subtitle, category_id, href } = props;
  const [productList, setProductList] = useState<any>([]);

  const getProductData = async () => {
    try {
      const getProductDataResponse = await axiosInstance.get("/product/list", {
        params: {
          "category-id": category_id,
        },
      });
      setProductList(getProductDataResponse.data.data.product);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getProductData();
  }, []);
  return (
    <section className="py-12">
      <div className="md:flex md:items-center md:justify-between mb-4">
        <div className="max-w-2xl px-0 lg:max-w-4xl">
          {title ? (
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>

        {href ? (
          <div className="mt-1 md:mt-0">
            <Link
              href={href}
              className="text-sm font-medium text-primary hover:text-blue-500 "
            >
              Xem thêm sản phẩm <span aria-hidden={true}>&rarr;</span>
            </Link>
          </div>
        ) : null}
      </div>

      <div className="relative">
        <div className="mt-4 md:mt-6 flex items-center w-full">
          <div className="w-full flex gap-x-4 gap-y-10 sm:gap-x-6 md:gap-y-10 lg:gap-x-8 no-wrap overflow-x-auto pb-4 -mb-4">
            {productList &&
              //@ts-ignore
              productList.map((product, index) => (
                <ProductsListing
                  key={index}
                  product={product}
                  index={index}
                ></ProductsListing>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default ProductsReel;
