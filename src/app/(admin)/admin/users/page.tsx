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
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PaginationDemo } from "@/components/Pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const AdminUsersPage = () => {
  const pageSize = 1;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [userList, setUserList] = useState([]);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [item, setItem] = useState({
    id: "",
    full_name: "",
    phone: "",
    email: "",
    password: "",
    birth_day: "",
    address: "",
    role: "",
    gender: 0,
    last_login: "",
    created_at: "",
    updated_at: "",
  });

  const [errors, setErrors] = useState({
    full_name: false,
    phone: false,
    email: false,
    password: false,
    address: false,
  });

  const { toast } = useToast();

  const onChecking = () => {
    let flag = 0;
    //@ts-ignore
    setErrors((prev) => updateAllObject(prev, false));
    if (!item.full_name) {
      setErrors((prev) => ({ ...prev, full_name: true }));
      flag = 1;
    }
    // if (!item.phone) {
    //   setErrors((prev) => ({ ...prev, phone: true }));
    //   flag = 1;
    // }
    if (!item.email) {
      setErrors((prev) => ({ ...prev, email: true }));
      flag = 1;
    }
    return flag === 0;
  };

  const [inputEmailFilter, setInputEmailFilter] = useState("");
  const [userNameFilter, setUserNameFilter] = useState("");
  const getUserList = async () => {
    try {
      const token = localStorage.getItem("access_token").replace(/"/g, "");
      const { data } = await axiosInstance.get("/admin/user/list", {
        params: {
          page: currentPage,
          size: pageSize,
          key: userNameFilter,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserList(data.data.users);
      setTotalPage(Math.ceil(data.data.count / pageSize));
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditItem = async () => {
    const isAllGood = onChecking();
    if (!isAllGood) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem("access_token").replace(/"/g, "");
      if (item.password) {
        const { pdata } = await axiosInstance.put(
          `admin/auth/change-password/${item.id}`,
          {
            new_password: item.password,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      //@ts-ignore
      const { data } = await axiosInstance.put(
        `admin/user/update/${item.id}`,
        {
          phone: item.phone,
          address: item.address,
          //   password,
          full_name: item.full_name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        variant: "success",
        title: "Cập nhật thành công",
      });
      setIsModalEditOpen(false);
      getUserList();
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Cập nhật thất bại",
        description: "Có lỗi xảy ra, xin vui lòng thử lại sau",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setUserNameFilter(inputEmailFilter); // Cập nhật sau 2s
    }, 500);

    return () => clearTimeout(timeout); // Xóa timeout nếu inputValue thay đổi trước khi 2s kết thúc
  }, [inputEmailFilter]);

  useEffect(() => {
    getUserList();
  }, [currentPage, userNameFilter]);
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
              <TableHead>Tên người dùng</TableHead>
              <TableHead className="flex items-center gap-2">
                <div>Email</div>

                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill={inputEmailFilter ? "blue" : "none"} // Nếu có filter, fill màu xanh
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-funnel relative top-[1px]"
                      >
                        <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" />
                      </svg>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <Input
                        placeholder="Tìm kiếm..."
                        value={inputEmailFilter}
                        onChange={(e) => {
                          setCurrentPage(1);
                          setInputEmailFilter(e.target.value);
                        }}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>

              <TableHead>Vai trò</TableHead>
              <TableHead>Cập nhật gần nhất</TableHead>
              <TableHead>Đăng nhập gần nhất</TableHead>

              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userList &&
              userList.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.full_name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.role}</TableCell>
                  <TableCell>{formatDate(item.updated_at)}</TableCell>
                  <TableCell>{formatDate(item.last_login)}</TableCell>

                  <TableCell className="text-right gap-2 flex justify-end items-center">
                    <Button
                      className="w-10 h-10"
                      variant="outline"
                      onClick={() => {
                        setIsModalEditOpen(true);
                        setItem({
                          id: item.id,
                          full_name: item.full_name,
                          phone: item.phone,
                          email: item.email,
                          password: item.password,
                          birth_day: item.birth_day,
                          address: item.address,
                          role: item.role,
                          gender: item.gender,
                          last_login: item.last_login,
                          created_at: item.created_at,
                          updated_at: item.updated_at,
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
              id: "",
              full_name: "",
              phone: "",
              email: "",
              password: "",
              birth_day: "",
              address: "",
              role: "",
              gender: 0,
              last_login: "",
              created_at: "",
              updated_at: "",
            });
            setErrors({
              full_name: false,
              phone: false,
              email: false,
              password: false,
              address: false,
            });
          }}
        >
          <DialogContent className="max-w-[90vw] md:max-w-[800px] max-h-[80vh] overflow-y-auto scrollbar-hide">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa thông tin người dùng</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="grid grid-cols-12 gap-x-4">
                <div className="flex flex-col gap-2 col-span-6">
                  <Label htmlFor="full_name" className="">
                    Tên người dùng
                  </Label>
                  <Input
                    id="full_name"
                    onChange={(e) => {
                      setItem((prev) => ({
                        ...prev,
                        full_name: e.target.value,
                      }));
                    }}
                    value={item.full_name}
                    className="col-span-3"
                  />
                  {errors.full_name && (
                    <p className="text-sm text-red-500">
                      Vui lòng nhập tên nguời dùng
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 col-span-6">
                  <Label htmlFor="phone" className="">
                    Số điện thoại
                  </Label>
                  <Input
                    id="phone"
                    onChange={(e) => {
                      setItem((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }));
                    }}
                    value={item.phone}
                    className="col-span-3"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 font-normal">
                      Vui lòng nhập số điện thoại
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-12 gap-x-4">
                <div className="flex flex-col gap-2 col-span-6">
                  <Label htmlFor="email" className="">
                    Email <span className="text-[red]">*</span>
                  </Label>
                  <Input
                    id="email"
                    onChange={(e) => {
                      setItem((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }));
                    }}
                    value={item.email}
                    className="col-span-3"
                    readOnly
                  />
                </div>
                <div className="flex flex-col gap-2 col-span-6">
                  <Label htmlFor="password" className="">
                    Mật khẩu
                  </Label>
                  <Input
                    id="password"
                    onChange={(e) => {
                      setItem((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }));
                    }}
                    value={item.password}
                    className="col-span-3"
                  />
                  {/* {errors.password && (
                    <p className="text-sm text-red-500">
                      Vui lòng nhập mật khẩu
                    </p>
                  )} */}
                </div>
              </div>

              <div className="grid grid-cols-12 gap-x-4">
                <div className="flex flex-col gap-2 col-span-6">
                  <Label htmlFor="updated_at" className="">
                    Cập nhật gần nhất
                  </Label>
                  <Input
                    id="updated_at"
                    onChange={(e) => {
                      setItem((prev) => ({
                        ...prev,
                        updated_at: e.target.value,
                      }));
                    }}
                    value={formatDate(item.updated_at)}
                    className="col-span-3"
                    readOnly
                  />
                </div>
                <div className="flex flex-col gap-2 col-span-6">
                  <Label htmlFor="last_login" className="">
                    Đăng nhập gần nhất
                  </Label>
                  <Input
                    id="last_login"
                    onChange={(e) => {
                      setItem((prev) => ({
                        ...prev,
                        last_login: e.target.value,
                      }));
                    }}
                    value={formatDate(item.last_login)}
                    className="col-span-3"
                    readOnly
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-x-4">
                <div className="flex flex-col gap-2 col-span-12">
                  <Label htmlFor="address" className="">
                    Địa chỉ
                  </Label>
                  <Textarea
                    id="address"
                    onChange={(e) => {
                      setItem((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }));
                    }}
                    className="col-span-3"
                    value={item.address}
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={() => {
                handleEditItem();
              }}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Chỉnh sửa
            </Button>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
};
export default AdminUsersPage;
