"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/config/axios";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { updateAllObject } from "@/utils/functions";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ProfilePage = ({ searchParams }) => {
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModalChangePassword, setIsOpenModalChangePassword] =
    useState(false);

  const [old_password, setOldPassword] = useState("");
  const [new_password, setNewPassword] = useState("");

  const [errors, setErrors] = useState({
    email: false,
    password: false,
    full_name: false,
    phone: false,
    address: false,
  });

  const [changePasswordErrors, setChangePasswordErrors] = useState({
    old_password: false,
    new_password: false,
  });

  const { toast } = useToast();

  const onCheckingChangePassword = () => {
    let flag = 0;
    //@ts-ignore
    setChangePasswordErrors((prev) => updateAllObject(prev, false));
    if (!old_password) {
      setChangePasswordErrors((prev) => ({ ...prev, old_password: true }));
      flag = 1;
    }
    if (!new_password) {
      setChangePasswordErrors((prev) => ({ ...prev, new_password: true }));
      flag = 1;
    }
    return flag === 0;
  };

  const handleChangePassword = async () => {
    const isAllGood = onCheckingChangePassword();
    if (!isAllGood) return;
    try {
      setIsLoading(true);
      //@ts-ignore
      const token = localStorage.getItem("access_token").replace(/"/g, "");
      const { data } = await axiosInstance.put(
        `/auth/change-password`,
        {
          old_password,
          new_password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        variant: "success",
        title: "Đổi mật khẩu thành công",
      });
      setIsOpenModalChangePassword(false);
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Đổi mật khẩu thất bại",
        description: "Có lỗi xảy ra, xin vui lòng thử lại sau",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onChecking = () => {
    let flag = 0;
    //@ts-ignore
    setErrors((prev) => updateAllObject(prev, false));
    if (!email) {
      setErrors((prev) => ({ ...prev, email: true }));
      flag = 1;
    }
    // if (!password) {
    //   setErrors((prev) => ({ ...prev, password: true }));
    //   flag = 1;
    // }
    if (!fullName) {
      setErrors((prev) => ({ ...prev, full_name: true }));
      flag = 1;
    }
    return flag === 0;
  };

  const getUserDetail = async () => {
    try {
      //@ts-ignore
      const token = localStorage.getItem("access_token").replace(/"/g, "");
      const { data } = await axiosInstance.get(`/user/detail`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPhone(data.data.phone);
      setAddress(data.data.address);
      setPassword(data.data.password || "");
      setFullName(data.data.full_name);
      setEmail(data.data.email);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdateProfile = async () => {
    const isAllGood = onChecking();
    if (!isAllGood) return;
    try {
      setIsLoading(true);
      //@ts-ignore
      const token = localStorage.getItem("access_token").replace(/"/g, "");
      const { data } = await axiosInstance.put(
        `/user/update`,
        {
          phone,
          address,
          //   password,
          full_name: fullName,
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
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Đăng ký thất bại",
        description: "Có lỗi xảy ra, xin vui lòng thử lại sau",
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getUserDetail();
  }, []);
  return (
    <div>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Hồ sơ
          </h1>

          <section className="mt-12 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900">
              Thông tin người dùng
            </h2>

            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-12 gap-2">
                <div className="flex flex-col gap-2 col-span-6">
                  <Label htmlFor="email">
                    Email <span className="text-[red]">*</span>
                  </Label>
                  <Input
                    // className={cn({
                    //   "focus-visible:ring-red-500": errors.email,
                    // })}
                    placeholder="abc123@gmail.com"
                    value={email}
                    readOnly
                  />
                </div>
                <div className="flex flex-col gap-2 col-span-6">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <div className="flex gap-2">
                    {/* <Input
                      className={cn({
                        "focus-visible:ring-red-500": errors.email,
                      })}
                      placeholder="abc123!@#"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    /> */}
                    <Button
                      onClick={() => {
                        setIsOpenModalChangePassword(true);
                      }}
                    >
                      Đổi mật khẩu
                    </Button>
                  </div>

                  {/* {errors.password && (
                    <p className="text-sm text-red-500">
                      Vui lòng nhập mật khẩu
                    </p>
                  )} */}
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <div className="flex flex-col gap-2 col-span-6">
                  <Label htmlFor="full_name">
                    Tên người dùng <span className="text-[red]">*</span>
                  </Label>
                  <Input
                    // className={cn({
                    //   "focus-visible:ring-red-500": errors.email,
                    // })}
                    placeholder="Trần Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  {errors.full_name && (
                    <p className="text-sm text-red-500">
                      Vui lòng nhập tên người dùng
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 col-span-6">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    // className={cn({
                    //   "focus-visible:ring-red-500": errors.email,
                    // })}
                    placeholder="0123456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-2 py-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Textarea
                  // className={cn({
                  //   "focus-visible:ring-red-500": errors.email,
                  // })}
                  placeholder="Số nhà 01, đường ABC, phường XYZ, quận 1, TP.HCM"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <Button
                disabled={isLoading}
                className="w-full"
                onClick={() => {
                  handleUpdateProfile();
                }}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Cập nhật
              </Button>
            </div>
          </section>
        </div>
      </div>

      {isOpenModalChangePassword ? (
        <Dialog
          open={isOpenModalChangePassword}
          onOpenChange={() => {
            setIsOpenModalChangePassword(false);
            setOldPassword("");
            setNewPassword("");
          }}
        >
          <DialogContent className="max-w-[90vw] md:max-w-[600px] max-h-[80vh] overflow-y-auto scrollbar-hide">
            <DialogHeader>
              <DialogTitle>Đổi mật khẩu</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="customer_name" className="">
                  Mật khẩu cũ <span className="text-[red]">*</span>
                </Label>
                <Input
                  id="customer_name"
                  onChange={(e) => {
                    setOldPassword(e.target.value);
                  }}
                  className="col-span-3"
                />
                {changePasswordErrors.old_password && (
                  <p className="text-sm text-red-500">
                    Vui lòng nhập mật khẩu cũ
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="customer_name" className="">
                  Mật khẩu mới <span className="text-[red]">*</span>
                </Label>
                <Input
                  id="customer_name"
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                  }}
                  className="col-span-3"
                />
                {changePasswordErrors.new_password && (
                  <p className="text-sm text-red-500">
                    Vui lòng nhập mật khẩu mới
                  </p>
                )}
              </div>
            </div>

            <Button
              onClick={() => {
                handleChangePassword();
              }}
            >
              Xác nhận
            </Button>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
};
export default ProfilePage;
