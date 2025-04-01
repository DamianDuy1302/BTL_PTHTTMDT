"use client";
import PaymentStatus from "@/components/PaymentStatus";
import { PRODUCT_CATEGORIES } from "@/config";
import axiosInstance from "@/config/axios";
import { formatPrice } from "@/lib/utils";
import { Product, ProductFile, User } from "@/payload-types";
import useAuthStore from "@/stores/authStore";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
const VNPAYReturnURLPage = ({ searchParams }: any) => {
  const paymentRef = searchParams.vnp_TxnRef;
  const order: any = {};

  //@ts-ignore
  const { user } = useAuthStore();

  // const getOrderDetail = async () => {
  //   const {data} =  await axiosInstance
  // }

  const changePaymentStatus = async () => {
    const { data } = await axiosInstance.put("/order/payment/change-status", {
      payment_ref: paymentRef,
      payment_status: "Đã thanh toán",
    });
    console.log(data);
  };

  useEffect(() => {
    // nhớ kiểm tra tình trạng đơn hàng trước khi thanh toán
    changePaymentStatus();
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
        <div>
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
            <div className="lg:col-start-2">
              <p className="text-sm font-medium text-blue-600">
                Đặt hàng thành công
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Cảm ơn bạn đã đặt hàng!
              </h1>
              {!order._isPaid ? (
                <p className="mt-2 text-base text-muted-foreground">
                  Đơn hàng của bạn đã được xử lý thành công. Chúng tôi đã gửi
                  thông tin đơn hàng và hóa đơn đến{" "}
                  {typeof order.user !== "string" ? (
                    <span className="font-medium text-gray-900">
                      {order?.user?.email || user.email}
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
                  {order?.products &&
                    (order.products as Product[]).map((product) => {
                      const label = PRODUCT_CATEGORIES.find(
                        ({ value }) => value === product.category
                      )?.label;

                      const downloadUrl = (product.product_files as ProductFile)
                        .url as string;

                      const { image } = product.images[0];

                      return (
                        <li key={product.id} className="flex space-x-6 py-6">
                          <div className="relative h-24 w-24">
                            {typeof image !== "string" && image.url ? (
                              <Image
                                fill
                                src={image.url}
                                alt={`${product.name} image`}
                                className="flex-none rounded-md bg-gray-100 object-cover object-center border border-zinc-200"
                              />
                            ) : null}
                          </div>

                          <div className="flex-auto flex flex-col justify-between">
                            <div className="space-y-1">
                              <h3 className="text-gray-900">{product.name}</h3>

                              <p className="my-1">Category: {label}</p>
                            </div>

                            {!order._isPaid ? (
                              <a
                                href={downloadUrl}
                                download={product.name}
                                className="text-blue-600 hover:underline underline-offset-2"
                              >
                                Download asset
                              </a>
                            ) : null}
                          </div>

                          <p className="flex-none font-medium text-gray-900">
                            {formatPrice(product.price)}
                          </p>
                        </li>
                      );
                    })}
                </ul>
                <div className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-muted-foreground">
                  <div className="flex justify-between">
                    <p>Tạm tính</p>
                    <p className="text-gray-900">{formatPrice(100)}</p>
                  </div>

                  <div className="flex justify-between">
                    <p>Phí giao dịch</p>
                    <p className="text-gray-900">{formatPrice(1)}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                    <p className="text-base">Tổng thanh toán</p>
                    <p className="text-base">{formatPrice(100 + 1)}</p>
                  </div>
                </div>

                <PaymentStatus
                  isPaid={order._isPaid}
                  orderEmail={(order.user as User)?.email || user.email}
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
      </main>
    </>
  );
};
export default VNPAYReturnURLPage;
