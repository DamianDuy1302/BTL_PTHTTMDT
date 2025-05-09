"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductsReel from "@/components/ProductsReel";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  ArrowDownToLine,
  CheckCircle,
  Leaf,
  Package,
  Search,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/config/axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Chatbot from "@/components/Chatbot";

const perks = [
  {
    name: "Vận chuyển nhanh",
    Icon: Package,
    description:
      "Hỗ trợ vận chuyển nhanh trong vòng 24h cho tất cả các đơn hàng. Chúng tôi cam kết giao hàng đúng hẹn.",
  },
  {
    name: "Chất lượng đảm bảo",
    Icon: ShieldCheck,
    description:
      "Chúng tôi cam kết cung cấp sản phẩm chất lượng cao nhất với giá cả hợp lý nhất.",
  },
  {
    name: "An toàn với môi trường",
    Icon: Leaf,
    description:
      "Chúng tôi trích dẫn một phần doanh thu để bảo vệ môi trường. Chúng tôi cam kết sử dụng các vật liệu thân thiện với môi trường trong sản phẩm của mình.",
  },
];

export default function Home() {
  const router = useRouter();
  const [categoryList, setCategoryList] = useState<any>([]);
  const [searchKey, setSearchKey] = useState<string>("");
  const getCategoryList = async () => {
    try {
      const { data } = await axiosInstance.get("/category/list");

      setCategoryList(data.data.categories);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getCategoryList();
  }, []);
  return (
    <>
      <div className="relative flex flex-col min-h-screen">
        <NavBar></NavBar>
        <div className="flex-grow flex-1 ">
          <div>
            <MaxWidthWrapper>
              <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Mua sắm thông minh tại{" "}
                  <span className="text-primary">Hippo</span>, giá tốt, giao
                  nhanh, ưu đãi mỗi ngày!
                </h1>
              </div>

              <div className="flex w-full items-center space-x-2">
                <div className="relative w-full">
                  <Input
                    type="email"
                    placeholder="Tìm kiếm: bộ dụng cụ nhà bếp..."
                    className="pr-10"
                    onChange={(e) => {
                      setSearchKey(e.target.value);
                    }}
                  />
                  <Search
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </div>
                <Button
                  type="submit"
                  onClick={() => {
                    router.push(`/products?key=${searchKey}`);
                  }}
                >
                  Tìm kiếm
                </Button>
              </div>

              <div className="mt-4 flex flex-nowrap gap-2 w-full overflow-x-auto pb-2 -mb-2">
                {categoryList &&
                  categoryList.map((item: any) => {
                    return (
                      <Button
                        variant={"secondary"}
                        key={item.id}
                        className={"text-sm font-medium"}
                        onClick={() => {
                          router.push(`/products?category_id=${item.id}`);
                        }}
                      >
                        {item.name}
                      </Button>
                    );
                  })}
              </div>

              {/* TODO: List products */}
              {categoryList.length > 0 && (
                <>
                  {categoryList.map((item: any, index) => {
                    if (index > 3) {
                      return;
                    }
                    return (
                      <ProductsReel
                        title={item.name}
                        href={`/products?category_id=${item.id}`}
                        category_id={item.id}
                        key={item.id}
                      ></ProductsReel>
                    );
                  })}
                </>
              )}
            </MaxWidthWrapper>

            <section className="border-t border-gray-200 bg-gray-50">
              <MaxWidthWrapper className="py-20">
                <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
                  {perks.map((item, index) => (
                    <div
                      key={item.name}
                      className="text-center md:flex md:items-start md:text-left lg:block lg:text-center"
                    >
                      <div className="md:flex-shrink-0 flex justify-center">
                        <div className="h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-900">
                          {<item.Icon className="w-1/3 h-1/3" />}
                        </div>
                      </div>
                      <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                        <h3 className="text-base font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <p className="mt-3 text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </MaxWidthWrapper>
            </section>
          </div>
        </div>
        <Footer></Footer>
        <Chatbot />
      </div>
    </>
  );
}
