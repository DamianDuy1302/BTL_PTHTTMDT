"use client";

import { ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import Image from "next/image";
import { useCart } from "@/stores/cartStore";
import { ScrollArea } from "./ui/scroll-area";
import CartItem from "./CartItem";
import { useEffect } from "react";

const Cart = () => {
  const { items, reRenderCart } = useCart();
  const itemCount = items.length;

  const cartTotal = items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const fee = 10000;

  useEffect(() => {}, [reRenderCart]);
  return (
    <>
      <Sheet>
        <SheetTrigger className="group -m-2 flex items-center p-2 mr-2">
          <ShoppingCart
            aria-hidden="true"
            className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
          ></ShoppingCart>
          <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
            {itemCount}
          </span>
        </SheetTrigger>
        <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg z-[1000]">
          <SheetHeader className="space-y-2.5 pr-6">
            <SheetTitle>Giỏ hàng ({itemCount})</SheetTitle>
          </SheetHeader>
          {itemCount > 0 ? (
            <>
              <div className="flex w-full flex-col pr-6">
                {/* TODO: cart logic */}
                <ScrollArea>
                  {items.map((item, index) => (
                    <CartItem
                      key={`${item.id}-${index}`}
                      product={item}
                    ></CartItem>
                  ))}
                </ScrollArea>
              </div>
              <div className="space-y-4 pr-6">
                <Separator></Separator>
                <div className="space-y-1.5 text-sm">
                  <div className="flex">
                    <span className="flex-1">Phí giao dịch</span>
                    <span>Miễn phí</span>
                  </div>
                  <div className="flex">
                    <span className="flex-1">Phí vận chuyển</span>
                    <span>{formatPrice(fee)}</span>
                  </div>
                  <div className="flex">
                    <span className="flex-1">Tổng thanh toán</span>
                    <span>{formatPrice(cartTotal + fee)}</span>
                  </div>
                </div>
                <SheetFooter>
                  <SheetTrigger asChild>
                    <Link
                      href="/cart"
                      className={buttonVariants({
                        className: "w-full",
                      })}
                    >
                      Tiếp tục thanh toán
                    </Link>
                  </SheetTrigger>
                </SheetFooter>
              </div>
            </>
          ) : (
            <>
              <div className="flex h-full flex-col items-center justify-center space-y-1">
                <div className="relative mb-4 h-60 w-60 text-muted-foreground">
                  <Image src="/hippo-empty-cart.png" fill alt="" />
                </div>
                <div className="text-xl font-semibold">Your cart is empty</div>
                <SheetTrigger asChild>
                  <Link
                    href="/products"
                    className={buttonVariants({
                      variant: "link",
                      size: "sm",
                      className: "text-sm text-muted-foreground",
                    })}
                  >
                    Add items to your cart to checkout
                  </Link>
                </SheetTrigger>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
export default Cart;
