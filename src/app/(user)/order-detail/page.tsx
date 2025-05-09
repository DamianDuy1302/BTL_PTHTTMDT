"use client";

import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORIES } from "@/config";
import axiosInstance, { createAxiosInstance } from "@/config/axios";
import { useCart } from "@/stores/cartStore";
import { toast } from "@/hooks/use-toast";
import { cn, formatPrice } from "@/lib/utils";
import { Check, Loader2, Package, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { removeSpaces, updateAllObject } from "@/utils/functions";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const OrderDetailPage = ({ searchParams }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Banking");
  const [cartTotal, setCartTotal] = useState(0);
  const [status, setStatus] = useState("");
  const fee = 10000;

  const handleCancelOrder = async () => {
    try {
      setIsLoading(true);
      //@ts-ignore
      const token = localStorage.getItem("access_token").replace(/"/g, "");
      const { data } = await axiosInstance.put(
        `/order/cancel`,
        {
          cancel_reason: "Hủy đơn hàng",
          order_id: items[0].order_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        variant: "success",
        title: "Hủy đơn hàng thành công",
      });
      router.push("/order-list");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hủy đơn hàng thất bại",
        description:
          "Có lỗi xảy ra trong quá trình hủy đơn hàng, xin vui lòng thử lại sau.",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const getOrderDetail = async () => {
    try {
      //@ts-ignore
      const token = localStorage.getItem("access_token").replace(/"/g, "");
      const { data } = await axiosInstance.get(
        `/order/detail?order-id=${searchParams.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStatus(data.data.payment.status);
      setItems(data.data.order_items);
      setPhone(data.data.receive_info.phone);
      setAddress(data.data.receive_info.address);
      setNote(data.data.note);
      setPaymentMethod(data.data.payment.payment_method);

      setCartTotal(data.data.total_price);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getOrderDetail();
  }, []);
  return (
    <div>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Chi tiết đơn hàng
          </h1>

          <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            <div
              className={cn("lg:col-span-7", {
                "rounded-lg border-2 border-dashed border-zinc-200 p-12":
                  items.length === 0,
              })}
            >
              <h2 className="sr-only">Items in your shopping cart</h2>
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center space-y-1">
                  <div
                    aria-hidden="true"
                    className="relative mb-4 h-40 w-40 text-muted-foreground"
                  >
                    <Image
                      src="/hippo-empty-cart.png"
                      fill
                      loading="eager"
                      alt="empty shopping cart hippo"
                    />
                  </div>
                  <h3 className="font-semibold text-2xl">Your cart is empty</h3>
                  <p className="text-muted-foreground text-center">
                    Whoops! Nothing to show here yet.
                  </p>
                </div>
              ) : null}
              <ul
                className={cn({
                  "divide-y divide-gray-200 border-b border-t border-gray-200":
                    items.length > 0,
                })}
              >
                {true &&
                  items.map((product) => {
                    const image = product.image;

                    return (
                      <li key={product.id} className="flex py-6 sm:py-10">
                        <div className="flex-shrink-0">
                          <div className="relative h-24 w-24 ">
                            {image ? (
                              <Image
                                fill
                                src={image}
                                alt="product image"
                                className="h-full w-full rounded-md object-cover object-center sm:h-48 sm:w-48 border border-zinc-200"
                              />
                            ) : null}
                          </div>
                        </div>

                        <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                          <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                            <div>
                              <div className="flex justify-between">
                                <h3 className="text-sm">
                                  <Link
                                    href={`/product/${product.product_id}`}
                                    className="font-medium text-gray-900"
                                  >
                                    {product.name}
                                  </Link>
                                </h3>
                              </div>

                              <div className="mt-2 flex text-sm gap-2">
                                <span className="line-clamp-1 text-xs capitalize">
                                  Phân loại: {product?.category?.name}
                                </span>
                                {/* {product.options &&
                                  Object.values(product.options).join(", ") !==
                                    "" && (
                                    <span className="line-clamp-1 text-xs capitalize">
                                      Lựa chọn:{" "}
                                      {Object.values(product.options).join(
                                        ", "
                                      )}
                                      || {product.variant_title}
                                    </span>
                                  )} */}

                                <span className="line-clamp-1 text-xs ">
                                  Lựa chọn: {product.variant_title}
                                </span>
                              </div>
                              <div className="mt-2">
                                <div className="text-sm">
                                  Đơn giá:{" "}
                                  <span className="font-semibold text-gray-900">
                                    {formatPrice(product.price)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 sm:mt-0 sm:pr-9 w-20">
                              <div className="absolute right-0 top-0">
                                {/* <Button
                                  aria-label="remove product"
                                  onClick={() => removeItem(product)}
                                  variant="ghost"
                                  className="h-10 w-10"
                                >
                                  <X className="h-5 w-5" aria-hidden="true" />
                                </Button> */}
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center mt-2">
                            <div className="text-sm">
                              Số lượng:{" "}
                              <span className="font-semibold text-gray-900">
                                {product.quantity}
                              </span>
                            </div>
                            <div className="flex space-x-2 text-sm text-gray-700">
                              <Package className="h-5 w-5 flex-shrink-0 text-primary" />
                              <span>Hỗ trợ vận chuyển nhanh</span>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>

            <div className="grid lg:col-span-5 gap-4">
              <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
                <h2 className="text-lg font-medium text-gray-900">
                  Thông tin nhận hàng
                </h2>

                <div className="mt-4 space-y-4">
                  <div className="grid gap-2 py-2">
                    <Label htmlFor="phone">
                      Số điện thoại <span className="text-[red]">*</span>
                    </Label>
                    <Input
                      // className={cn({
                      //   "focus-visible:ring-red-500": errors.email,
                      // })}
                      placeholder="0123456789"
                      value={phone}
                      readOnly
                    />
                  </div>
                  <div className="grid gap-2 py-2">
                    <Label htmlFor="address">
                      Địa chỉ <span className="text-[red]">*</span>
                    </Label>
                    <Textarea
                      // className={cn({
                      //   "focus-visible:ring-red-500": errors.email,
                      // })}
                      placeholder="Số nhà 01, đường ABC, phường XYZ, quận 1, TP.HCM"
                      value={address}
                      readOnly
                    />
                  </div>
                  <div className="grid gap-2 py-2">
                    <Label htmlFor="note">Ghi chú</Label>
                    <Textarea
                      // className={cn({
                      //   "focus-visible:ring-red-500": errors.email,
                      // })}
                      placeholder="Ghi chú cho đơn hàng"
                      value={note}
                      readOnly
                    />
                    {/* {errors.email && (
                      <p className="text-sm text-red-500">Email is required</p>
                    )} */}
                  </div>
                  <div className="grid gap-2 py-2">
                    <Label htmlFor="payment_method">
                      Phương thức thanh toán
                    </Label>
                    <RadioGroup className="mt-2" value={paymentMethod}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={paymentMethod}
                          key={paymentMethod}
                        />
                        <Label>
                          {paymentMethod === "Banking" ? "Chuyển khoản" : "COD"}
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </section>
              <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
                <h2 className="text-lg font-medium text-gray-900">Hóa đơn</h2>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Tạm tính</p>
                    <p className="text-sm font-medium text-gray-900">
                      {true ? (
                        formatPrice(cartTotal - fee)
                      ) : (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>Phí vận chuyển</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {true ? (
                        formatPrice(fee)
                      ) : (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="text-base font-medium text-gray-900">
                      Tổng thanh toán
                    </div>
                    <div className="text-base font-medium text-gray-900">
                      {true ? (
                        formatPrice(cartTotal)
                      ) : (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
                {status === "Đang chờ" && (
                  <div className="mt-6">
                    <Button
                      disabled={items.length === -1 || isLoading}
                      onClick={() => {
                        handleCancelOrder();
                      }}
                      className="w-full"
                      size="lg"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                      ) : null}
                      Hủy đơn hàng
                    </Button>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrderDetailPage;
