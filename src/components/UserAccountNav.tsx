"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import useAuthStore from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useCart } from "@/stores/cartStore";

const UserAccountNav = ({ user }: any) => {
  //@ts-ignore
  const { clearUserData } = useAuthStore();
  const { items, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const handleLogOut = () => {
    const saveCart = (userEmail, items) => {
      // Lấy data cũ từ localStorage
      const existingData = JSON.parse(localStorage.getItem("csa")) || [];

      // Tìm xem có user với email này chưa
      const index = existingData.findIndex(
        (entry) => entry.email === userEmail
      );

      if (index !== -1) {
        // Nếu đã tồn tại -> update items
        existingData[index].items = items;
      } else {
        // Nếu chưa tồn tại -> thêm mới
        existingData.push({ email: userEmail, items });
      }

      // Ghi lại vào localStorage
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="overflow-visible">
        <Button variant="ghost" size="sm" className="relative">
          Tài khoản của tôi
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-white w-60" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-0.5 leading-none">
            <p className="font-medium text-sm text-black">{user.email}</p>
          </div>
        </div>

        <DropdownMenuSeparator />

        {user.role === "admin" && (
          <DropdownMenuItem className="cursor-pointer" asChild>
            <Link href="/admin/dashboard">Trang Admin</Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            router.push("/profile");
          }}
        >
          Hồ sơ
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            router.push("/order-list");
          }}
        >
          Danh sách đơn hàng
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            handleLogOut();
          }}
        >
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
