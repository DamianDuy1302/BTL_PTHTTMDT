"use client";
import { useToast } from "@/hooks/use-toast";
import useAuthStore from "@/stores/authStore";
import { useCart } from "@/stores/cartStore";
import { AlignJustify, ChevronDown, ChevronUp, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cart from "./Cart";
import { Icons } from "./Icons";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import UserAccountNav from "./UserAccountNav";
const NavBar = () => {
  // @ts-ignore
  const { user, clearUserData } = useAuthStore();
  const { items, clearCart } = useCart();
  const [isOpenMyAccount, setIsOpenMyAccount] = useState(false);
  const [isOpenMobileNav, setIsOpenMobileNav] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  const handleLogOut = () => {
    const saveCart = (userEmail, items) => {
      const existingData = JSON.parse(localStorage.getItem("csa")) || [];

      const index = existingData.findIndex(
        (entry) => entry.email === userEmail
      );

      if (index !== -1) {
        existingData[index].items = items;
      } else {
        existingData.push({ email: userEmail, items });
      }

      localStorage.setItem("csa", JSON.stringify(existingData));
    };

    saveCart(user.email, items);
    clearCart();
    clearUserData();
    toast({
      variant: "success",
      title: "Đăng xuất thành công",
    });
  };

  useEffect(() => {
    setIsOpenMyAccount(false);
  }, [isOpenMobileNav]);

  useEffect(() => {
    setIsOpenMobileNav(false);
    setIsOpenMyAccount(false);
    //@ts-ignore
  }, [router.pathname]);
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        // Chỉ đóng khi màn hình > lg (1024px)
        setIsOpenMobileNav(false);
        setIsOpenMyAccount(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <div className="bg-white sticky z-[10] top-0 inset-x-0 h-16">
        <header className="relative bg-white">
          <MaxWidthWrapper>
            <div className="border-b border-gray-200">
              <div className="flex h-16 items-center">
                {/* TODO: Mobile nav */}
                {/* <MobileNav /> */}

                <div className="ml-4 flex lg:ml-0">
                  <Link href="/">
                    <Icons.logo className="h-10 w-10"></Icons.logo>
                  </Link>
                </div>

                <div className="ml-auto flex items-center">
                  <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                    {user ? null : (
                      <>
                        <Link
                          href={"/sign-in"}
                          className={buttonVariants({ variant: "ghost" })}
                        >
                          Sign in
                        </Link>
                      </>
                    )}
                    {user ? (
                      <UserAccountNav user={user}></UserAccountNav>
                    ) : (
                      <span className="h-6 w-px bg-gray-200" />
                    )}
                    {user ? null : (
                      <>
                        <Link
                          href={"/sign-up"}
                          className={buttonVariants({ variant: "ghost" })}
                        >
                          Sign up
                        </Link>
                      </>
                    )}
                    {user ? <span className="h-6 w-px bg-gray-200" /> : null}

                    {user ? null : (
                      <div className="flex lg:ml-6">
                        <span className="h-6 w-px bg-gray-200" />
                      </div>
                    )}

                    <div className="ml-4 flow-root lg:ml-6">
                      <Cart></Cart>
                    </div>
                  </div>

                  <div
                    className="cursor-pointer lg:hidden"
                    onClick={() => setIsOpenMobileNav(true)}
                  >
                    <AlignJustify />
                  </div>
                  {isOpenMobileNav && (
                    <div className="absolute bg-white inset-0 lg:hidden z-[10] ">
                      <div className="mx-auto w-full max-w-screen-xl px-2.5 md:px-20 ">
                        <div className="border-b border-gray-200 bg-white">
                          <div className="h-16 w-full flex items-center justify-between cursor-pointer">
                            <Link href="/">
                              <Icons.logo className="h-10 w-10 ml-4"></Icons.logo>
                            </Link>
                            <X onClick={() => setIsOpenMobileNav(false)} />
                          </div>
                          {user ? (
                            <div className="relative -top-4 w-full h-full pt-4 pb-2 font-medium text-gray-900">
                              <div className="flex flex-col justify-center items-center gap-4">
                                <div
                                  className="cursor-pointer flex items-center justify-center gap-2 relative -right-[12px]"
                                  onClick={() => {
                                    setIsOpenMyAccount(!isOpenMyAccount);
                                  }}
                                >
                                  Tài khoản của tôi
                                  <div>
                                    {!isOpenMyAccount ? (
                                      <ChevronDown size={16} />
                                    ) : (
                                      <ChevronUp size={16} />
                                    )}
                                  </div>
                                </div>
                                {isOpenMyAccount && (
                                  <div className="-mt-2 flex flex-col gap-2 items-center justify-center text-gray-600 text-sm font-medium">
                                    <div className="text-gray-900">
                                      {user.email}
                                    </div>
                                    {user.role === "admin" && (
                                      <Link
                                        href="/admin/dashboard"
                                        className="hover:text-gray-900"
                                        onClick={() => {
                                          setIsOpenMobileNav(false);
                                        }}
                                      >
                                        Trang Admin
                                      </Link>
                                    )}
                                    <Link
                                      href="/profile"
                                      className="hover:text-gray-900"
                                      onClick={() => {
                                        setIsOpenMobileNav(false);
                                      }}
                                    >
                                      Hồ sơ
                                    </Link>
                                    <Link
                                      href="/order-list"
                                      className="hover:text-gray-900"
                                      onClick={() => {
                                        setIsOpenMobileNav(false);
                                      }}
                                    >
                                      Danh sách đơn hàng
                                    </Link>
                                    <div
                                      className="cursor-pointer hover:text-gray-900"
                                      onClick={() => {
                                        handleLogOut();
                                        setIsOpenMobileNav(false);
                                      }}
                                    >
                                      Đăng xuất
                                    </div>
                                  </div>
                                )}

                                <Link
                                  href={"/cart"}
                                  onClick={() => {
                                    setIsOpenMobileNav(false);
                                  }}
                                >
                                  Giỏ hàng ({items.length})
                                </Link>
                              </div>
                            </div>
                          ) : (
                            <div className="relative -top-4 w-full h-full pt-4 pb-2 font-medium text-gray-900">
                              <div className="flex flex-col justify-center items-center gap-4">
                                <div
                                  className="cursor-pointer flex items-center justify-center gap-"
                                  onClick={() => {
                                    router.push("/sign-in");
                                    setIsOpenMobileNav(false);
                                  }}
                                >
                                  Đăng nhập
                                </div>

                                <div
                                  className="cursor-pointer flex items-center justify-center gap-"
                                  onClick={() => {
                                    router.push("/sign-up");
                                    setIsOpenMobileNav(false);
                                  }}
                                >
                                  Đăng ký
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </MaxWidthWrapper>
        </header>
      </div>
    </>
  );
};
export default NavBar;
