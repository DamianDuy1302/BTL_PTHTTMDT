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
  const origin = searchParams.get("origin");
  const { toast } = useToast();
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

      toast({
        variant: "success",
        title: "Sign in successfully",
      });
      if (userData) {
        localStorage.setItem("access_token", JSON.stringify(access_token));
        addUserData(userData);
      }

      router.push("/");
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: "Something went wrong, please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0 mx-auto">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Icons.logo className="h-20 w-20" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Sign in to your {isSeller ? "seller" : ""} account
            </h1>

            <Link
              className={buttonVariants({
                variant: "link",
                className: "gap-1.5",
              })}
              href="/sign-up"
            >
              Don&apos;t have an account?
              <ArrowRight className="h-4 w-4" />
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
                      <p className="text-sm text-red-500">Email is required</p>
                    )}
                  </div>

                  <div className="grid gap-1 py-2">
                    <Label htmlFor="password">Password</Label>
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
                        Password is required
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
                    Sign in
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
                  Continue as customer
                </Button>
              ) : (
                <Button
                  onClick={continueAsSeller}
                  variant="secondary"
                  disabled={isLoading}
                  className="max-w-[350px] mx-auto w-full"
                >
                  Continue as seller
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
