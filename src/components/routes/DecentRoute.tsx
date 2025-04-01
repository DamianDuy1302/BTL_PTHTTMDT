"use client";

import useAuthStore from "@/stores/authStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function DecentRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthReady } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isAuthReady) return; // Chờ trạng thái auth sẵn sàng

    if (pathname.includes("/admin") && user?.role !== "admin") {
      router.replace("/"); // Dùng replace để không thể quay lại trang cũ
    } else {
      setIsChecking(false); // Kiểm tra xong, cho phép render giao diện
    }
  }, [user, isAuthReady, pathname]);

  // Chặn render nếu vẫn đang kiểm tra quyền
  if (isChecking) {
    return <></>;
  }

  return <>{children}</>;
}

export default DecentRoute;
