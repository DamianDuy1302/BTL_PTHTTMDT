"use client";
import PaymentStatus from "@/components/PaymentStatus";
import { PRODUCT_CATEGORIES } from "@/config";
import axiosInstance from "@/config/axios";
import { cn, formatPrice } from "@/lib/utils";
import useAuthStore from "@/stores/authStore";
import { useCart } from "@/stores/cartStore";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
const VNPAYReturnURLPage = ({ searchParams }: any) => {
  const paymentRef = searchParams.vnp_TxnRef;
  const [order, setOrder] = useState({});
  const { clearCart } = useCart();

  //@ts-ignore
  const { user } = useAuthStore();
  const fee = 10000;

  const getOrderDetail = async () => {
    try {
      const token = localStorage.getItem("access_token").replace(/"/g, "");
      const { data } = await axiosInstance.get("/order/detail", {
        params: {
          "payment-ref": paymentRef,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrder(data.data);
      if (data.data.payment_status === "Đã thanh toán") {
        changePaymentStatus();
      }
      if (data.data.payment.payment_method === "Banking") {
        clearCart();
        if (data.data.payment.status !== "Đã thanh toán") {
          changePaymentStatus();
          setOrder({
            ...data.data,
            payment: {
              ...data.data.payment,
              status: "Đã thanh toán",
            },
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changePaymentStatus = async () => {
    const { data } = await axiosInstance.put("/order/payment/change-status", {
      payment_ref: paymentRef,
      payment_status: "Đã thanh toán",
    });
  };

  useEffect(() => {
    // nhớ kiểm tra tình trạng đơn hàng trước khi thanh toán
    getOrderDetail();
  }, []);

  return (
    <>
      <main className="relative lg:min-h-full">
        <div className="hidden lg:block h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
          <Image
            fill
            src="/checkout-thank-you.jpg"
            className="h-full w-full object-cover object-center"
            alt="thank you for your order"
          />
        </div>
        {order.id ? (
          <div>
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
              <div className="lg:col-start-2">
                <p className="text-sm font-medium text-blue-600">
                  Đặt hàng thành công
                </p>
                <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                  Cảm ơn bạn đã đặt hàng!
                </h1>
                {order.id ? (
                  <p className="mt-2 text-base text-muted-foreground">
                    Đơn hàng của bạn đã được xử lý thành công. Chúng tôi đã gửi
                    thông tin đơn hàng và hóa đơn đến{" "}
                    {typeof order.user !== "string" ? (
                      <span className="font-medium text-gray-900">
                        {order?.customer?.email || user.email}
                      </span>
                    ) : null}
                    . Bạn vui lòng kiểm tra email để biết thêm chi tiết.
                  </p>
                ) : (
                  <p className="mt-2 text-base text-muted-foreground">
                    Cảm ơn bạn đã đặt hàng! Chúng tôi đang xử lý đơn hàng và sẽ
                    sớm gửi xác nhận đến bạn.
                  </p>
                )}

                <div className="mt-16 text-sm font-medium">
                  <div className="text-muted-foreground">Hóa đơn</div>
                  <div className="mt-2 text-gray-900">{order.id}</div>
                  <ul className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground">
                    {order.order_items.map((product) => {
                      return (
                        <li key={product.id} className="flex py-6 sm:py-10">
                          <div className="flex-shrink-0">
                            <div className="relative h-24 w-24 ">
                              {product.image ? (
                                <Image
                                  fill
                                  src={product.image}
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
                                  {product.options &&
                                    Object.values(product.options).join(
                                      ", "
                                    ) !== "" && (
                                      <span className="line-clamp-1 text-xs capitalize">
                                        Lựa chọn:{" "}
                                        {Object.values(product.options).join(
                                          ", "
                                        )}
                                      </span>
                                    )}
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
                            </div>

                            <div className="flex justify-between items-center mt-2">
                              <div className="text-sm">
                                Số lượng:{" "}
                                <span className="font-semibold text-gray-900">
                                  {product.quantity}
                                </span>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-muted-foreground">
                    <div className="flex justify-between">
                      <p>Tạm tính</p>
                      <p className="text-gray-900">
                        {formatPrice(order.payment.amount - fee)}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <p>Phí vận chuyển</p>
                      <p className="text-gray-900">{formatPrice(fee)}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                      <p className="text-base">Tổng thanh toán</p>
                      <p className="text-base">
                        {formatPrice(order.payment.amount)}
                      </p>
                    </div>
                  </div>

                  <PaymentStatus
                    isPaid={order.payment.status}
                    orderEmail={order.customer?.email || user.email}
                    orderId={order.id}
                  />

                  <div className="mt-16 border-t border-gray-200 py-6 text-right">
                    <Link
                      href="/products"
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      Tiếp tục mua hàng &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </>
  );
};
export default VNPAYReturnURLPage;
