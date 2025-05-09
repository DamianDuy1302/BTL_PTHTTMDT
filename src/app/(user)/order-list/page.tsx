"use client";
import { PaginationDemo } from "@/components/Pagination";
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

  const pageSize = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [orderList, setOrderList] = useState([]);
  //@ts-ignore
  const token = localStorage.getItem("access_token").replace(/"/g, "");
  const getOrderList = async () => {
    const { data } = await axiosInstance.get("/order/list", {
      params: {
        "my-order": true,
        page: currentPage,
        size: pageSize,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setOrderList(data.data.orders);
    setTotalPage(Math.ceil(data.data.count / pageSize));
  };

  useEffect(() => {
    getOrderList();
  }, [currentPage]);

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
                      {formatPrice(invoice.total_price)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4">
            <PaginationDemo
              totalPage={totalPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrderListPage;
