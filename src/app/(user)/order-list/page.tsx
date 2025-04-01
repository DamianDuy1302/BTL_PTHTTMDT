"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axiosInstance from "@/config/axios";
import { formatPrice } from "@/lib/utils";
import { formatDate } from "@/utils/functions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const OrderListPage = () => {
  const router = useRouter();

  const [orderList, setOrderList] = useState([]);
  //@ts-ignore
  const token = localStorage.getItem("access_token").replace(/"/g, "");
  const getOrderList = async () => {
    const { data } = await axiosInstance.get("/order/list", {
      params: {
        "my-order": true,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(data);
    setOrderList(data.data.orders);
  };

  useEffect(() => {
    getOrderList();
  }, []);

  return (
    <div>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Danh sách đơn hàng
          </h1>

          <div className="mt-12">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Mã đơn hàng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Phương thức thanh toán</TableHead>
                  <TableHead>Thời gian đặt</TableHead>
                  <TableHead className="text-right">Tổng thanh toán</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderList.map((invoice) => (
                  <TableRow
                    key={invoice.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      router.push(`/order-detail?id=${invoice.id}`);
                    }}
                  >
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.payment_status}</TableCell>
                    <TableCell>{invoice.payment_method}</TableCell>
                    <TableCell>{formatDate(invoice.created_at)}</TableCell>
                    <TableCell className="text-right">
                      {formatPrice(invoice.total_price + 1)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrderListPage;
