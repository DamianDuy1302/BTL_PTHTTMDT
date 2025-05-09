"use client";

import AddToCartButton from "@/components/AddToCartButton";
import ImagesSlider from "@/components/ImagesSlider";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductsReel from "@/components/ProductsReel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PRODUCT_CATEGORIES } from "@/config";
import axiosInstance from "@/config/axios";
// import { getPayloadClient } from "@/get-payload";
import { formatPrice } from "@/lib/utils";
import { removeSpaces } from "@/utils/functions";
import { Check, Package, Shield } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

const BREADCRUMBS = [
  { id: 1, name: "Trang chủ", href: "/" },
  { id: 2, name: "Sản phẩm", href: "/products" },
];

const ProductPage = ({ params }: any) => {
  const { productId } = params;

  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [options, setOptions] = useState<any>({});
  const [price, setPrice] = useState(0);
  const getProductDetail = async () => {
    const getProductDataResponse = await axiosInstance.get(
      `/product/detail/${productId}`
    );
    setProduct(getProductDataResponse.data.data);
    setPrice(getProductDataResponse.data.data.price);
    for (const option of getProductDataResponse.data.data.options) {
      if (option.hidden === false) {
        setOptions((prev: any) => ({
          ...prev,
          [option.name]: option.values[0], // Thêm key-value vào object
        }));
      }
    }
  };

  const handleSetQuantity = (value: number) => {
    if (quantity + value > 0) {
      setQuantity(quantity + value);
    }
  };

  useEffect(() => {
    getProductDetail();
  }, [productId]);

  return (
    <>
      <MaxWidthWrapper className="bg-white">
        <div className="bg-white">
          {/* Product Details */}
          {product && (
            <>
              <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                <div className="lg:max-w-lg lg:self-end">
                  <ol className="flex items-center space-x-2">
                    {BREADCRUMBS.map((breadcrumb, i) => (
                      <li key={breadcrumb.href}>
                        <div className="flex items-center text-sm">
                          <Link
                            href={breadcrumb.href}
                            className="font-medium text-sm text-muted-foreground hover:text-gray-900"
                          >
                            {breadcrumb.name}
                          </Link>
                          {i !== BREADCRUMBS.length - 1 ? (
                            <svg
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                              className="ml-2 h-5 w-5 flex-shrink-0 text-gray-300"
                            >
                              <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                            </svg>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-4">
                    <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                      {product.name}
                    </h1>
                  </div>
                  <section className="mt-4">
                    <div className="flex items-center">
                      <p className="font-medium text-gray-900">
                        {formatPrice(price)}
                      </p>

                      <div className="ml-4 border-l text-muted-foreground border-gray-300 pl-4">
                        {product.category.name}
                      </div>
                    </div>

                    <div className="mt-4 space-y-6">
                      <p className="text-base text-muted-foreground">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center">
                      <Package
                        aria-hidden="true"
                        className="h-5 w-5 flex-shrink-0 text-primary"
                      />
                      <p className="ml-2 text-muted-foreground">
                        Hỗ trợ vận chuyển nhanh
                      </p>
                    </div>
                  </section>
                </div>
                {/* Product images */}
                <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
                  <div className="aspect-square rounded-lg">
                    <ImagesSlider urls={product.images} />
                  </div>
                </div>
                {/* add to cart part */}
                <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
                  <div>
                    <div className="grid grid-cols-2 gap-x-4">
                      {product.options.map((option: any, index: any) => {
                        if (!option.hidden) {
                          return (
                            <div
                              key={index}
                              className="flex flex-col items-start"
                            >
                              <div className="font-medium text-gray-900">
                                {option.name}
                              </div>
                              {option.values.length >= 1 ? (
                                <RadioGroup
                                  defaultValue={option.values[0]}
                                  className="mt-2"
                                  onValueChange={(e) => {
                                    const newOptions = {
                                      ...options,
                                      [option.name]: e,
                                    };
                                    setOptions(newOptions);

                                    const selectedOption =
                                      product.variants.find(
                                        (item: any) =>
                                          removeSpaces(
                                            item.options.join(", ")
                                          ) ===
                                          removeSpaces(
                                            Object.values(newOptions).join(", ")
                                          )
                                      );

                                    setPrice(selectedOption.price);
                                  }}
                                >
                                  {option.values.map(
                                    (value: any, index: any) => (
                                      <div
                                        key={index}
                                        className="flex items-center space-x-2"
                                      >
                                        <RadioGroupItem
                                          value={value}
                                          id={value}
                                        />
                                        <Label htmlFor={value}>{value}</Label>
                                      </div>
                                    )
                                  )}
                                </RadioGroup>
                              ) : null}
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                    <div className="flex justify-center items-center mt-10">
                      <div className=" flex w-[260px] lg:w-full items-center gap-2">
                        <Button
                          disabled={quantity === 1}
                          variant={"outline"}
                          className="!p-4 w-10"
                          onClick={() => {
                            handleSetQuantity(-1);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-minus !text-black"
                          >
                            <path d="M5 12h14" />
                          </svg>
                        </Button>
                        <Input
                          value={quantity}
                          type="text"
                          readOnly
                          className="text-center"
                        />
                        <Button
                          variant={"outline"}
                          className="!p-4 w-10"
                          onClick={() => {
                            handleSetQuantity(+1);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-plus !text-black"
                          >
                            <path d="M5 12h14" />
                            <path d="M12 5v14" />
                          </svg>
                        </Button>
                      </div>
                    </div>

                    <div className="mt-6">
                      <AddToCartButton
                        product={{ ...product, price, options }} // Tạo object mới có đầy đủ dữ liệu
                        quantity={quantity}
                      />
                    </div>
                    <div className="mt-6 text-center">
                      <div className="group inline-flex text-sm text-medium text-muted-foreground font-medium">
                        <Shield
                          aria-hidden="true"
                          className="mr-2 h-5 w-5 flex-shrink-0"
                        />
                        <span className="">
                          Miễn phí hoàn hàng trong 30 ngày
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <ProductsReel
                title="Có thể bạn sẽ thích"
                href={`/products?category_id=${product.category_id}`}
                category_id={product.category_id}
              ></ProductsReel>
            </>
          )}
        </div>
      </MaxWidthWrapper>
    </>
  );
};

export default ProductPage;
