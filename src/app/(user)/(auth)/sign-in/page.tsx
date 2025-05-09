"use client";

import { Icons } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

import axiosInstance from "@/config/axios";
import { updateAllObject } from "@/utils/functions";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import useAuthStore from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/stores/cartStore";

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isSeller = searchParams.get("as") === "seller";
  const origin = searchParams.get("origin");
  const { toast } = useToast();
  const { addItem } = useCart();
  //@ts-ignore
  const { user, addUserData } = useAuthStore();
  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const continueAsSeller = () => {
    router.push("?as=seller");
  };

  const continueAsBuyer = () => {
    router.replace("/sign-in", undefined);
  };

  const onChecking = () => {
    let flag = 0;
    //@ts-ignore
    setErrors((prev) => updateAllObject(prev, false));
    if (!email) {
      setErrors((prev) => ({ ...prev, email: true }));
      flag = 1;
    }
    if (!password) {
      setErrors((prev) => ({ ...prev, password: true }));
      flag = 1;
    }
    return flag === 0;
  };

  const onSubmit = async () => {
    try {
      const isAllGood = onChecking();
      if (!isAllGood) return;
      setIsLoading(true);
      const { data } = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      const { access_token, ...userData } = data.data;

      if (userData) {
        localStorage.setItem("access_token", JSON.stringify(access_token));
        addUserData(userData);

        const cartStorageAuth = localStorage.getItem("csa");
        if (cartStorageAuth) {
          const cart = JSON.parse(cartStorageAuth);
          cart.forEach((item: any) => {
            if (item.email === userData.email && item.items.length > 0) {
              item.items.forEach((cartItem: any) => {
                const { quantity, ...productWithoutQuantity } = cartItem;
                addItem(productWithoutQuantity, quantity);
              });
            }
          });
        }
      }
      toast({
        variant: "success",
        title: "Đăng nhập thành công",
      });
      router.push("/");
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Đăng nhập thất bại",
        description: "Có lỗi xảy ra, xin vui lòng thử lại sau",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="container relative flex py-20 flex-col items-center justify-center lg:px-0 mx-auto">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Icons.logo className="h-20 w-20" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Đăng nhập {isSeller ? "seller" : ""}
            </h1>

            <Link
              className={buttonVariants({
                variant: "link",
                className: "gap-1.5",
              })}
              href="/sign-up"
            >
              Chưa có tài khoản? <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div>
            <div className="grid gap-6 max-w-[350px] mx-auto">
              <form>
                <div className="grid gap-2 ">
                  <div className="grid gap-1 py-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      // {...register("email")}
                      className={cn({
                        "focus-visible:ring-red-500": errors.email,
                      })}
                      placeholder="you@example.com"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">
                        Vui lòng nhập email
                      </p>
                    )}
                  </div>

                  <div className="grid gap-1 py-2">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Input
                      // {...register("password")}
                      type="password"
                      className={cn({
                        "focus-visible:ring-red-500": errors.password,
                      })}
                      placeholder="password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-500">
                        Vui lòng nhập mật khẩu
                      </p>
                    )}
                  </div>

                  <div className="text-primary font-semibold text-sm pb-4">
                    <span
                      className="cursor-pointer underline-offset-4 hover:underline"
                      onClick={() => {
                        router.push("/forgot-password");
                      }}
                    >
                      {" "}
                      Quên mật khẩu?
                    </span>
                  </div>

                  <Button
                    disabled={isLoading}
                    onClick={(e) => {
                      e.preventDefault();
                      onSubmit();
                    }}
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Đăng nhập
                  </Button>
                </div>
              </form>

              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center"
                >
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    or
                  </span>
                </div>
              </div>

              {isSeller ? (
                <Button
                  onClick={continueAsBuyer}
                  variant="secondary"
                  disabled={isLoading}
                  className="max-w-[350px] mx-auto w-full"
                >
                  Tiếp tuc với tư cách người mua
                </Button>
              ) : (
                <Button
                  onClick={continueAsSeller}
                  variant="secondary"
                  disabled={isLoading}
                  className="max-w-[350px] mx-auto w-full"
                >
                  Tiếp tục với tư cách người bán
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
