"use client";

import useAuthStore from "@/stores/authStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function AuthRoute({ children }: any) {
  //@ts-ignore
  const { user, isAuthReady } = useAuthStore();

  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isAuthReady) return; // Chờ trạng thái auth sẵn sàng
    if (isAuthReady && user !== null) {
      if (
        pathname === "/sign-in" ||
        pathname === "/sign-up" ||
        pathname === "/forgot-password"
      ) {
        router.push("/");
      } else {
        setIsChecking(false);
      }
    } else if (isAuthReady && user === null) {
      if (
        pathname === "/cart" ||
        pathname === "/vnpay/return-url" ||
        pathname === "/profile"
      ) {
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
