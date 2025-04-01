"use client";

import { Icons } from "@/components/Icons";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/config/axios";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { updateAllObject } from "@/utils/functions";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignUpPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      const { data } = await axiosInstance.post(`/auth/sign-up`, {
        email,
        password,
      });
      toast({
        variant: "success",
        title: "Sign up successfully",
      });
      router.push("/sign-in");
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: "Something went wrong, please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <MaxWidthWrapper>
        <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0 mx-auto">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] ">
            <div className="flex flex-col items-center space-y-2 text-center">
              <Icons.logo className="h-20 w-20" />
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h1>

              <Link
                className={buttonVariants({
                  variant: "link",
                  className: "gap-1.5",
                })}
                href="/sign-in"
              >
                Already have an account? Sign-in
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6">
              <form>
                <div className="grid gap-2 max-w-[350px] mx-auto">
                  <div className="grid gap-2 py-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
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

                  <div className="grid gap-2 py-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      type="password"
                      className={cn({
                        "focus-visible:ring-red-500": errors.password,
                      })}
                      placeholder="e.g: abc123"
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
                    Sign up
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </>
  );
};

export default SignUpPage;
