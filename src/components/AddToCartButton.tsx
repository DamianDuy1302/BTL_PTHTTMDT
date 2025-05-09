"use client";

import { useCart } from "@/stores/cartStore";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import useAuthStore from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";

const AddToCartButton = ({ product, quantity }: any) => {
  const { addItem } = useCart();
  const { toast } = useToast();
  const { user, isAuthReady } = useAuthStore();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSuccess(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isSuccess]);

  return (
    <Button
      onClick={() => {
        if (isAuthReady && user !== null) {
          addItem(product, quantity);
          setIsSuccess(true);
        } else {
          toast({
            variant: "destructive",
            title: "Đăng nhập để thêm vào giỏ hàng",
          });
        }
      }}
      size="lg"
      className="w-full"
    >
      {isSuccess ? "Đã thêm!" : "Thêm vào giỏ hàng"}
    </Button>
  );
};

export default AddToCartButton;
