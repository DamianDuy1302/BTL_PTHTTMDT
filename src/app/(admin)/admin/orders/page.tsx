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
import { formatDate, updateAllObject } from "@/utils/functions";
import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  ChevronLeft,
  ChevronRight,
  Eye,
  ListFilter,
  Pencil,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PaginationDemo } from "@/components/Pagination";
import { useToast } from "@/hooks/use-toast";

const AdminOrdersPage = () => {
  const pageSize = 1;
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const [orderList, setOrderList] = useState([]);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [item, setItem] = useState({
    created_at: "",
    customer_name: "",
    total_price: 0,
    payment_ref: "",
    payment_method: "",
    payment_status: "",
    status: "",
    note: "",
  });

  const [errors, setErrors] = useState({
    customer_name: false,
    total_price: false,
    payment_method: false,
    payment_status: false,
    status: false,
    note: false,
  });

  const onChecking = () => {
    let flag = 0;
    //@ts-ignore
    setErrors((prev) => updateAllObject(prev, false));
    if (!item.customer_name) {
      setErrors((prev) => ({ ...prev, customer_name: true }));
      flag = 1;
    }
    if (!item.payment_status) {
      setErrors((prev) => ({ ...prev, payment_status: true }));
      flag = 1;
    }
    if (!item.status) {
      setErrors((prev) => ({ ...prev, status: true }));
      flag = 1;
    }
    return flag === 0;
  };
  const getOrderList = async () => {
    try {
      const token = localStorage.getItem("access_token").replace(/"/g, "");
      const { data } = await axiosInstance.get("/order/list", {
        params: {
          "payment-method": paymentMethodFilter,
          "payment-status": paymentStatusFilter,
          sort: sortValue,
          page: currentPage,
          size: pageSize,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrderList(data.data.orders);
      setTotalPage(Math.ceil(data.data.count / pageSize));
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditItem = async () => {
    const isAllGood = onChecking();
    if (!isAllGood) return;
    try {
      const token = localStorage.getItem("access_token").replace(/"/g, "");
      const { data } = await axiosInstance.put(
        `/order/payment/change-status`,
        {
          payment_ref: item.payment_ref,
          payment_status: item.payment_status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsModalEditOpen(false);
      getOrderList();
      setItem({
        created_at: "",
        customer_name: "",
        total_price: 0,
        payment_ref: "",
        payment_method: "",
        payment_status: "",
        status: "",
        note: "",
      });
      toast({
        variant: "success",
        title: "Cập nhật thành công",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Cập nhật thất bại",
        description: "Có lỗi xảy ra, xin vui lòng thử lại sau",
      });
      console.log(error);
    }
  };

  useEffect(() => {
    getOrderList();
  }, [paymentMethodFilter, paymentStatusFilter, sortValue, currentPage]);
  return (
    <div>
      <div className="text-xl font-bold flex items-center justify-between">
        <div>Quản lí đơn hàng</div>
      </div>
      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Tên khách hàng</TableHead>
              <TableHead>Thời gian đặt</TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <div>Tổng thanh toán</div>
                  <div
                    onClick={() => {
                      if (sortValue === "price-asc") {
                        setSortValue("price-desc");
                      } else if (sortValue === "price-desc") {
                        setSortValue("");
                      } else {
                        setSortValue("price-asc");
                      }
                      setCurrentPage(1);
                    }}
                    className="cursor-pointer"
                  >
                    {sortValue === "price-asc" ? (
                      <ArrowUpNarrowWide size={16} color="blue" />
                    ) : sortValue === "price-desc" ? (
                      <ArrowDownNarrowWide size={16} color="blue" />
                    ) : (
                      <ListFilter size={16} />
                    )}
                  </div>
                </div>
              </TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <div>Phương thức thanh toán</div>
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill={paymentMethodFilter ? "blue" : "none"} // Nếu có filter, fill màu xanh
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`lucide lucide-funnel-icon lucide-funnel relative top-[1px]`}
                        >
                          <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" />
                        </svg>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="flex flex-col gap-1">
                        <Button
                          variant="outline"
                          className={
                            paymentMethodFilter === "Banking"
                              ? "bg-gray-200"
                              : ""
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            if (paymentMethodFilter !== "Banking") {
                              setPaymentMethodFilter("Banking");
                            } else {
                              setPaymentMethodFilter("");
                            }
                            setCurrentPage(1);
                          }}
                        >
                          Banking
                        </Button>
                        <Button
                          variant="outline"
                          className={
                            paymentMethodFilter === "COD" ? "bg-gray-200" : ""
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            if (paymentMethodFilter !== "COD") {
                              setPaymentMethodFilter("COD");
                            } else {
                              setPaymentMethodFilter("");
                            }
                            setCurrentPage(1);
                          }}
                        >
                          COD
                        </Button>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <div>Trạng thái thanh toán</div>
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill={paymentStatusFilter ? "blue" : "none"} // Nếu có filter, fill màu xanh
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`lucide lucide-funnel-icon lucide-funnel relative top-[1px]`}
                        >
                          <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" />
                        </svg>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="flex flex-col gap-1">
                        <Button
                          variant="outline"
                          className={
                            paymentStatusFilter === "Đã thanh toán"
                              ? "bg-gray-200"
                              : ""
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            if (paymentStatusFilter !== "Đã thanh toán") {
                              setPaymentStatusFilter("Đã thanh toán");
                            } else {
                              setPaymentStatusFilter("");
                            }
                            setCurrentPage(1);
                          }}
                        >
                          Đã thanh toán
                        </Button>
                        <Button
                          variant="outline"
                          className={
                            paymentStatusFilter === "Đang chờ"
                              ? "bg-gray-200"
                              : ""
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            if (paymentStatusFilter !== "Đang chờ") {
                              setPaymentStatusFilter("Đang chờ");
                            } else {
                              setPaymentStatusFilter("");
                            }
                            setCurrentPage(1);
                          }}
                        >
                          Đang chờ
                        </Button>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </TableHead>

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
                  <TableCell>{item.total_price.toLocaleString()}</TableCell>
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
                          payment_ref: item.payment_ref,
                          payment_method: item.payment_method,
                          payment_status: item.payment_status,
                          status: item.status,
                          note: item.note,
                        });
                      }}
                    >
                      <Pencil size={16} />
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
          <PaginationDemo
            totalPage={totalPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
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
              payment_ref: "",
              payment_status: "",
              status: "",
              note: "",
            });
            setErrors({
              customer_name: false,
              total_price: false,
              payment_method: false,
              payment_status: false,
              status: false,
              note: false,
            });
          }}
        >
          <DialogContent className="max-w-[90vw] md:max-w-[800px] max-h-[80vh] overflow-y-auto scrollbar-hide">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa đơn hàng</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="customer_name" className="">
                  Tên khách hàng <span className="text-[red]">*</span>
                </Label>
                <Input
                  id="customer_name"
                  onChange={(e) => {
                    setItem((prev) => ({
                      ...prev,
                      customer_name: e.target.value,
                    }));
                  }}
                  defaultValue={item.customer_name}
                  className="col-span-3"
                  readOnly
                />
                {errors.customer_name && (
                  <p className="text-sm text-red-500">
                    Vui lòng nhập tên khách hàng
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="created_at" className="">
                  Thời gian đặt hàng
                </Label>
                <Input
                  id="created_at"
                  value={formatDate(item.created_at)}
                  className="col-span-3"
                  readOnly
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
                    value={item.status}
                    readOnly
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
                    Trạng thái thanh toán <span className="text-[red]">*</span>
                  </Label>
                  <Input
                    id="payment_status"
                    className="col-span-3"
                    defaultValue={item.payment_status}
                    onChange={(e) => {
                      setItem((prev) => ({
                        ...prev,
                        payment_status: e.target.value,
                      }));
                    }}
                  />
                  {errors.payment_status && (
                    <p className="text-sm text-red-500">
                      Vui lòng nhập trạng thái thanh toán
                    </p>
                  )}
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
                  readOnly
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
export default AdminOrdersPage;
