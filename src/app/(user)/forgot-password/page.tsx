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

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isSeller = searchParams.get("as") === "seller";

  const { toast } = useToast();
  //@ts-ignore
  const [errors, setErrors] = useState({
    email: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");

  const onChecking = () => {
    let flag = 0;
    //@ts-ignore
    setErrors((prev) => updateAllObject(prev, false));
    if (!email) {
      setErrors((prev) => ({ ...prev, email: true }));
      flag = 1;
    }

    return flag === 0;
  };

  const onSubmit = async () => {
    try {
      const isAllGood = onChecking();
      if (!isAllGood) return;
      setIsLoading(true);

      toast({
        variant: "success",
        title: "Đã gửi mật khẩu mới tới email của bạn",
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
              Quên mật khẩu {isSeller ? "seller" : ""}
            </h1>

            <Link
              className={buttonVariants({
                variant: "link",
                className: "gap-1.5",
              })}
              href="/sign-in"
            >
              Quay lại đăng nhập? <ArrowRight className="h-4 w-4" />
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
                    Gửi lại mật khẩu
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
