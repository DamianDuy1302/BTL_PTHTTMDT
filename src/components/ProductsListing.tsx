"use client";

import { cn, formatPrice } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import ImagesSlider from "./ImagesSlider";
import { Skeleton } from "./ui/skeleton";

interface ProductListingProps {
  product: any;
  index: number;
}

const ProductsListing = ({ product, index }: any) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 75);

    return () => clearTimeout(timer);
  }, [index]);

  if (!product || !isVisible) return <ProductPlaceholder />;

  if (isVisible && product) {
    return (
      <Link
        className={cn(
          "invisible h-full w-full max-w-[160px] lg:max-w-[240px] cursor-pointer group/main",
          {
            "visible animate-in fade-in-5": isVisible,
          }
        )}
        href={`/product/${product.id}`}
      >
        <div className="flex flex-col w-full">
          <ImagesSlider urls={product.images} />

          <h3 className="mt-4 font-medium text-sm text-gray-700 truncate">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.category_name}</p>
          <p className="mt-1 font-medium text-sm text-gray-900">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    );
  }
};

const ProductPlaceholder = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="relative bg-zinc-100 aspect-square w-full overflow-hidden rounded-xl">
        <Skeleton className="h-full w-full" />
      </div>
      <Skeleton className="mt-4 w-2/3 h-4 rounded-lg" />
      <Skeleton className="mt-2 w-16 h-4 rounded-lg" />
      <Skeleton className="mt-2 w-12 h-4 rounded-lg" />
    </div>
  );
};

export default ProductsListing;
