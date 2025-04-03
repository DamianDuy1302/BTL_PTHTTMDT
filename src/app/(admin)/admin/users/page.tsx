"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/config/axios";
import { formatDate } from "@/utils/functions";
import { ChevronLeft, ChevronRight, Eye, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const AdminUsersPage = () => {
  const [orderList, setOrderList] = useState([]);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [item, setItem] = useState({
    created_at: "",
    customer_name: "",
    total_price: 0,
    payment_method: "",
    payment_status: "",
    status: "",
    note: "",
  });
  const getOrderList = async () => {
    try {
      const token = localStorage.getItem("access_token").replace(/"/g, "");
      const { data } = await axiosInstance.get("/order/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(data);
      setOrderList(data.data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditItem = async () => {
    console.log(item);
  };

  useEffect(() => {
    getOrderList();
  }, []);
  return (
    <div>
      <div className="text-xl font-bold flex items-center justify-between">
        <div>Quản lí người dùng ứng dụng</div>
      </div>
      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Tên khách hàng</TableHead>
              <TableHead>Thời gian đặt</TableHead>
              <TableHead>Tổng thanh toán</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Phương thức thanh toán</TableHead>
              <TableHead>Trạng thái thanh toán</TableHead>

              <TableHead>Ghi chú</TableHead>

              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList &&
              orderList.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.customer_name}</TableCell>
                  <TableCell>{formatDate(item.created_at)}</TableCell>
                  <TableCell>{item.total_price}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.payment_method}</TableCell>
                  <TableCell>{item.payment_status}</TableCell>
                  <TableCell>{item.note}</TableCell>
                  <TableCell className="text-right gap-2 flex justify-end items-center">
                    <Button
                      className="w-10 h-10"
                      variant="outline"
                      onClick={() => {
                        setIsModalEditOpen(true);
                        setItem({
                          created_at: item.created_at,
                          customer_name: item.customer_name,
                          total_price: item.total_price,
                          payment_method: item.payment_method,
                          payment_status: item.payment_status,
                          status: item.status,
                          note: item.note,
                        });
                      }}
                    >
                      <Eye size={16} />
                    </Button>
                    <Button className="w-10 h-10" variant="outline">
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button className="w-10 h-10" variant="outline">
                  <ChevronLeft />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  className="border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <Button className="w-10 h-10" variant="outline">
                  <ChevronRight />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      {item.created_at && isModalEditOpen ? (
        <Dialog
          open={isModalEditOpen}
          onOpenChange={() => {
            setIsModalEditOpen(false);
            setItem({
              created_at: "",
              customer_name: "",
              total_price: 0,
              payment_method: "",
              payment_status: "",
              status: "",
              note: "",
            });
          }}
        >
          <DialogContent className="max-w-[90vw] md:max-w-[800px] max-h-[80vh] overflow-y-auto scrollbar-hide">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="customer_name" className="">
                  Tên khách hàng
                </Label>
                <Input
                  id="customer_name"
                  onChange={(e) => {
                    setItem((prev) => ({ ...prev, name: e.target.value }));
                  }}
                  value={item.customer_name}
                  className="col-span-3"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="created_at" className="">
                  Thời gian đặt hàng
                </Label>
                <Input
                  id="created_at"
                  value={formatDate(item.created_at)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-12 gap-x-4">
                <div className="flex flex-col gap-2 col-span-6">
                  <Label htmlFor="total_price" className="">
                    Tổng thanh toán
                  </Label>
                  <Input
                    id="total_price"
                    className="col-span-3"
                    value={item.total_price}
                  />
                </div>
                <div className="flex flex-col gap-2 col-span-6">
                  <Label htmlFor="status" className="">
                    Trạng thái
                  </Label>
                  <Input
                    id="status"
                    className="col-span-3"
                    value={item.payment_status}
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-x-4">
                <div className="flex flex-col gap-2 col-span-6">
                  <Label htmlFor="payment_method" className="">
                    Phương thức thanh toán
                  </Label>
                  <Input
                    id="payment_method"
                    className="col-span-3"
                    value={item.payment_method}
                  />
                </div>
                <div className="flex flex-col gap-2 col-span-6">
                  <Label htmlFor="payment_status" className="">
                    Trạng thái thanh toán
                  </Label>
                  <Input
                    id="payment_status"
                    className="col-span-3"
                    value={item.payment_status}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="note" className="">
                  Ghi chú
                </Label>
                <Textarea
                  id="note"
                  onChange={(e) => {
                    setItem((prev) => ({
                      ...prev,
                      note: e.target.value,
                    }));
                  }}
                  className="col-span-3"
                  value={item.note}
                />
              </div>
            </div>

            <Button
              onClick={() => {
                handleEditItem();
              }}
            >
              Chỉnh sửa
            </Button>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
};
export default AdminUsersPage;
