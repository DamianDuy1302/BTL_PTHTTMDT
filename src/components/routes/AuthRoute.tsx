"use client";

import useAuthStore from "@/stores/authStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function AuthRoute({ children }: any) {
  const { user, isAuthReady } = useAuthStore();

  console.log("user", user);
  console.log("isAuthReady", isAuthReady);

  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isAuthReady) return; // Chờ trạng thái auth sẵn sàng
    if (isAuthReady && user !== null) {
      if (pathname === "/sign-in" || pathname === "/sign-up") {
        router.push("/");
      } else {
        setIsChecking(false);
      }
    } else if (isAuthReady && user === null) {
      if (pathname === "/cart" || pathname === "/vnpay/return-url") {
        router.push("/sign-in");
      } else {
        setIsChecking(false);
      }
    }
  }, [user, isAuthReady, pathname]);

  // Chặn render nếu vẫn đang kiểm tra quyền
  if (isChecking) {
    return <></>;
  }

  return <>{children}</>;
}

export default AuthRoute;
