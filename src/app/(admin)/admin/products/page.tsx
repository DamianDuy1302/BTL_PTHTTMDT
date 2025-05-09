"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import ImageDropzone from "@/components/ImageDropZone";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/config/axios";
import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  ListFilter,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useEffect, useState } from "react";
import { PaginationDemo } from "@/components/Pagination";
import { updateAllObject } from "@/utils/functions";
import { useToast } from "@/hooks/use-toast";

const AdminProductsPage = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [productList, setProductList] = useState([]);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [productId, setProductId] = useState(-1);
  const [item, setItem] = useState({
    name: "",
    compare_price: 0,

    price: 0,
    category_id: 0,
    description: "",
    sold: 0,
    stock: 0,
  });

  const [categories, setCategories] = useState([]);

  const [inputProductNameFilter, setInputProductNameFilter] = useState("");
  const [productNameFilter, setProductNameFilter] = useState("");
  const [prevSortValue, setPrevSortValue] = useState("");
  const [sortValue, setSortValue] = useState("");
  const getProductList = async () => {
    try {
      const { data } = await axiosInstance.get("/product/list", {
        params: {
          page: currentPage,
          size: pageSize,
          key: productNameFilter,
          sort: sortValue,
        },
      });

      setProductList(data.data.product);
      setTotalPage(Math.ceil(data.data.count / pageSize));
    } catch (error) {
      console.log(error);
    }
  };
  const getCategories = async () => {
    try {
      const { data } = await axiosInstance.get("/category/list");

      setCategories(data.data.categories);
    } catch (error) {
      console.log(error);
    }
  };
  const getProductDetail = async () => {
    const getProductDataResponse = await axiosInstance.get(
      `/product/detail/${productId}`
    );
    const totalStock = getProductDataResponse.data.data.variants.reduce(
      (sum, v) => sum + v.stock,
      0
    );
    const totalSold = getProductDataResponse.data.data.variants.reduce(
      (sum, v) => sum + v.sold,
      0
    );
    setItem({
      name: getProductDataResponse.data.data.name,
      compare_price: getProductDataResponse.data.data.compare_price,
      price: getProductDataResponse.data.data.price,
      category_id: getProductDataResponse.data.data.category_id,
      description: getProductDataResponse.data.data.description,
      sold: totalSold,
      stock: totalStock,
    });
    setFiles(getProductDataResponse.data.data.images);
    setIsModalEditOpen(true);
  };

  const [errors, setErrors] = useState({
    name: false,
    compare_price: false,
    price: false,
    category_id: false,
    description: false,
    images: false,
    sold: false,
    stock: false,
  });

  const onChecking = () => {
    let flag = 0;
    //@ts-ignore
    setErrors((prev) => updateAllObject(prev, false));
    if (!item.name) {
      setErrors((prev) => ({ ...prev, name: true }));
      flag = 1;
    }
    if (!item.compare_price) {
      setErrors((prev) => ({ ...prev, compare_price: true }));
      flag = 1;
    }
    if (!item.price) {
      setErrors((prev) => ({ ...prev, price: true }));
      flag = 1;
    }
    if (isNaN(Number(item.sold)) && item.sold >= 0) {
      setErrors((prev) => ({ ...prev, sold: true }));
      flag = 1;
    }
    if (isNaN(Number(item.stock)) && item.stock >= 0) {
      setErrors((prev) => ({ ...prev, stock: true }));
      flag = 1;
    }
    if (!item.category_id) {
      setErrors((prev) => ({ ...prev, category_id: true }));
      flag = 1;
    }
    if (!item.description) {
      setErrors((prev) => ({ ...prev, description: true }));
      flag = 1;
    }
    // if (!files.length) {
    //   setErrors((prev) => ({ ...prev, images: true }));
    //   flag = 1;
    // }
    return flag === 0;
  };

  const handleCreateItem = async () => {
    const isAllGood = onChecking();
    if (!isAllGood) return;
    try {
      setIsLoading(true);
      const newProduct = {
        category_id: item.category_id,
        compare_price: item.compare_price,
        description: item.description,
        images: files,
        name: item.name,
        price: item.price,
        status: 2,
        summary: "",
        vendor: "",
        weight: null,
        weight_unit: "",
        unit: "",
        variants: [],
        options: [],
      };

      const token = localStorage.getItem("access_token")?.replace(/"/g, "");

      const { data } = await axiosInstance.post(
        "/admin/product/create",
        newProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        variant: "success",
        title: "Thêm mới thành công",
      });
      setIsModalCreateOpen(false);
      setProductId(-1);
      setItem({
        name: "",
        compare_price: 0,
        price: 0,
        category_id: 0,
        description: "",
        sold: 0,
        stock: 0,
      });
      setFiles([]);
      getProductList();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Tạo mới thất bại",
        description: "Có lỗi xảy ra, xin vui lòng thử lại sau",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleEditItem = async () => {
    const isAllGood = onChecking();
    if (!isAllGood) return;
    try {
      setIsLoading(true);
      const newProduct = {
        category_id: item.category_id,
        compare_price: item.compare_price,
        description: item.description,
        images: files,
        name: item.name,
        price: item.price,
        status: 2,
        stock: item.stock,
      };
      console.log(newProduct);
      const token = localStorage.getItem("access_token")?.replace(/"/g, "");

      const { data } = await axiosInstance.put(
        `/admin/product/update/${productId}`,
        newProduct,
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
      setProductId(-1);
      setItem({
        name: "",
        compare_price: 0,

        price: 0,
        category_id: 0,
        description: "",
        sold: 0,
        stock: 0,
      });
      setFiles([]);
      getProductList();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Cập nhật thất bại",
        description: "Có lỗi xảy ra, xin vui lòng thử lại sau",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setProductNameFilter(inputProductNameFilter); // Cập nhật sau 2s
    }, 500);

    return () => clearTimeout(timeout); // Xóa timeout nếu inputValue thay đổi trước khi 2s kết thúc
  }, [inputProductNameFilter]);

  useEffect(() => {
    getProductList();
  }, [sortValue, prevSortValue, productNameFilter, currentPage]);

  useEffect(() => {
    getCategories();
  }, []);
  useEffect(() => {
    if (productId !== -1) {
      getProductDetail();
    }
  }, [productId]);

  return (
    <div>
      <div className="text-xl font-bold flex items-center justify-between">
        <div>Quản lí sản phẩm</div>
        <div>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setIsModalCreateOpen(true)}
          >
            <CirclePlus size={16} />
            <div>Thêm sản phẩm</div>
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead className="flex items-center gap-2">
                <div>Tên sản phẩm</div>
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill={inputProductNameFilter ? "blue" : "none"} // Nếu có filter, fill màu xanh
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
                        value={inputProductNameFilter}
                        onChange={(e) => {
                          setCurrentPage(1);
                          setInputProductNameFilter(e.target.value);
                        }}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2 ">
                  <div>Giá gốc</div>
                  <div
                    onClick={() => {
                      if (prevSortValue === "compare-price") {
                        if (sortValue === "compare-price-asc") {
                          setSortValue("compare-price-desc");
                        } else if (sortValue === "compare-price-desc") {
                          setSortValue("");
                          setPrevSortValue("");
                        }
                      } else {
                        setSortValue("compare-price-asc");
                        setPrevSortValue("compare-price");
                      }
                      setCurrentPage(1);
                    }}
                    className="cursor-pointer"
                  >
                    {sortValue === "compare-price-asc" ? (
                      <ArrowUpNarrowWide size={16} color="blue" />
                    ) : sortValue === "compare-price-desc" ? (
                      <ArrowDownNarrowWide size={16} color="blue" />
                    ) : (
                      <ListFilter size={16} />
                    )}
                  </div>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2 ">
                  <div>Giá bán</div>
                  <div
                    onClick={() => {
                      if (prevSortValue === "price") {
                        if (sortValue === "price-asc") {
                          setSortValue("price-desc");
                        } else if (sortValue === "price-desc") {
                          setSortValue("");
                          setPrevSortValue("");
                        }
                      } else {
                        setSortValue("price-asc");
                        setPrevSortValue("price");
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
              <TableHead>
                <div className="flex items-center gap-2 ">
                  <div>Đã bán</div>
                  <div
                    onClick={() => {
                      if (prevSortValue === "sold") {
                        if (sortValue === "sold-asc") {
                          setSortValue("sold-desc");
                        } else if (sortValue === "sold-desc") {
                          setSortValue("");
                          setPrevSortValue("");
                        }
                      } else {
                        setSortValue("sold-asc");
                        setPrevSortValue("sold");
                      }
                      setCurrentPage(1);
                    }}
                    className="cursor-pointer"
                  >
                    {sortValue === "sold-asc" ? (
                      <ArrowUpNarrowWide size={16} color="blue" />
                    ) : sortValue === "sold-desc" ? (
                      <ArrowDownNarrowWide size={16} color="blue" />
                    ) : (
                      <ListFilter size={16} />
                    )}
                  </div>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2 ">
                  <div>Tồn kho</div>
                  <div
                    onClick={() => {
                      if (prevSortValue === "stock") {
                        if (sortValue === "stock-asc") {
                          setSortValue("stock-desc");
                        } else if (sortValue === "stock-desc") {
                          setSortValue("");
                          setPrevSortValue("");
                        }
                      } else {
                        setSortValue("stock-asc");
                        setPrevSortValue("stock");
                      }
                      setCurrentPage(1);
                    }}
                    className="cursor-pointer"
                  >
                    {sortValue === "stock-asc" ? (
                      <ArrowUpNarrowWide size={16} color="blue" />
                    ) : sortValue === "stock-desc" ? (
                      <ArrowDownNarrowWide size={16} color="blue" />
                    ) : (
                      <ListFilter size={16} />
                    )}
                  </div>
                </div>
              </TableHead>

              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productList &&
              productList.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.compare_price}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>{item.sold}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell className="text-right gap-2 flex justify-end items-center">
                    <Button
                      className="w-10 h-10"
                      variant="outline"
                      onClick={() => {
                        setProductId(item.id);
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

      {/* modal create product */}
      <Dialog
        open={isModalCreateOpen}
        onOpenChange={() => {
          setIsModalCreateOpen(false);
          setProductId(-1);
          setItem({
            name: "",
            compare_price: 0,

            price: 0,
            category_id: 0,
            description: "",
            sold: 0,
            stock: 0,
          });
          setFiles([]);
          setErrors({
            name: false,
            compare_price: false,
            price: false,
            category_id: false,
            description: false,
            images: false,
            sold: false,
            stock: false,
          });
        }}
      >
        <DialogContent className="max-w-[90vw] md:max-w-[800px] max-h-[80vh] overflow-y-auto scrollbar-hide">
          <DialogHeader>
            <DialogTitle>Thêm mới sản phẩm</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="">
                Tên sản phẩm <span className="text-[red]">*</span>
              </Label>
              <Input
                id="name"
                onChange={(e) => {
                  setItem((prev) => ({ ...prev, name: e.target.value }));
                }}
                className="col-span-3"
              />
              {errors.name && (
                <p className="text-sm text-red-500">
                  Vui lòng nhập tên sản phẩm
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="category" className="flex gap-2 items-center">
                <div>
                  Phân loại sản phẩm <span className="text-[red]">*</span>
                </div>

                {errors.category_id && (
                  <p className="text-sm text-red-500 font-normal">
                    Vui lòng chọn phân loại sản phẩm
                  </p>
                )}
              </Label>
              <Select
                onValueChange={(value) => {
                  setItem((prev) => ({ ...prev, category_id: Number(value) }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Phân loại sản phẩm" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-12 gap-x-4">
              <div className="flex flex-col gap-2 col-span-6">
                <Label htmlFor="compare_price" className="">
                  Giá gốc <span className="text-[red]">*</span>
                </Label>
                <Input
                  id="compare_price"
                  onChange={(e) => {
                    setItem((prev) => ({
                      ...prev,
                      compare_price: Number(e.target.value),
                    }));
                  }}
                  className="col-span-3"
                />
                {errors.compare_price && (
                  <p className="text-sm text-red-500">Vui lòng nhập giá gốc</p>
                )}
              </div>
              <div className="flex flex-col gap-2 col-span-6">
                <Label htmlFor="price" className="">
                  Giá bán <span className="text-[red]">*</span>
                </Label>
                <Input
                  id="price"
                  onChange={(e) => {
                    setItem((prev) => ({
                      ...prev,
                      price: Number(e.target.value),
                    }));
                  }}
                  className="col-span-3"
                />
                {errors.price && (
                  <p className="text-sm text-red-500">Vui lòng nhập giá bán</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-12 gap-x-4">
              {/* <div className="flex flex-col gap-2 col-span-6">
                <Label htmlFor="sold" className="">
                  Đã bán <span className="text-[red]">*</span>
                </Label>
                <Input
                  id="sold"
                  onChange={(e) => {
                    setItem((prev) => ({
                      ...prev,
                      sold: Number(e.target.value),
                    }));
                  }}
                  className="col-span-3"
                />
                {errors.sold && (
                  <p className="text-sm text-red-500">
                    Vui lòng nhập số lượng đã bán
                  </p>
                )}
              </div> */}
              <div className="flex flex-col gap-2 col-span-6">
                <Label htmlFor="stock" className="">
                  Tồn kho <span className="text-[red]">*</span>
                </Label>
                <Input
                  id="stock"
                  onChange={(e) => {
                    setItem((prev) => ({
                      ...prev,
                      stock: Number(e.target.value),
                    }));
                  }}
                  className="col-span-3"
                />
                {errors.stock && (
                  <p className="text-sm text-red-500">
                    Vui lòng nhập số lượng tồn kho
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description" className="">
                Mô tả sản phẩm
              </Label>
              <Textarea
                id="description"
                onChange={(e) => {
                  setItem((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }));
                }}
                className="col-span-3"
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="picture" className="flex gap-2 items-center">
                <div>
                  Ảnh sản phẩm <span className="text-[red]">*</span>
                </div>
                {errors.images && (
                  <p className="text-sm text-red-500 font-normal">
                    Vui lòng tải ảnh sản phẩm
                  </p>
                )}
              </Label>
              <ImageDropzone files={files} setFiles={setFiles}></ImageDropzone>
            </div>
          </div>

          <Button
            onClick={() => {
              handleCreateItem();
            }}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
            ) : null}
            Thêm mới
          </Button>
        </DialogContent>
      </Dialog>

      {item.name && isModalEditOpen ? (
        <Dialog
          open={isModalEditOpen}
          onOpenChange={() => {
            setIsModalEditOpen(false);
            setProductId(-1);
            setItem({
              name: "",
              compare_price: 0,

              price: 0,
              category_id: 0,
              description: "",
              sold: 0,
              stock: 0,
            });
            setFiles([]);
            setErrors({
              name: false,
              compare_price: false,
              price: false,
              category_id: false,
              description: false,
              images: false,
              sold: false,
              stock: false,
            });
          }}
        >
          <DialogContent className="max-w-[90vw] md:max-w-[800px] max-h-[80vh] overflow-y-auto scrollbar-hide">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="">
                  Tên sản phẩm <span className="text-[red]">*</span>
                </Label>
                <Input
                  id="name"
                  onChange={(e) => {
                    setItem((prev) => ({ ...prev, name: e.target.value }));
                  }}
                  value={item.name}
                  className="col-span-3"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">
                    Vui lòng nhập tên sản phẩm
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="category" className="flex gap-2 items-center">
                  <div>
                    Phân loại sản phẩm <span className="text-[red]">*</span>
                  </div>

                  {errors.category_id && (
                    <p className="text-sm text-red-500 font-normal">
                      Vui lòng chọn phân loại sản phẩm
                    </p>
                  )}
                </Label>
                <Select
                  onValueChange={(value) => {
                    setItem((prev) => ({
                      ...prev,
                      category_id: Number(value),
                    }));
                  }}
                  //@ts-ignore
                  defaultValue={item?.category_id}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Phân loại sản phẩm" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-12 gap-x-4">
                <div className="flex flex-col gap-2 col-span-6">
                  <Label htmlFor="compare_price" className="">
                    Giá gốc <span className="text-[red]">*</span>
                  </Label>
                  <Input
                    id="compare_price"
                    onChange={(e) => {
                      setItem((prev) => ({
                        ...prev,
                        compare_price: Number(e.target.value),
                      }));
                    }}
                    className="col-span-3"
                    value={item.compare_price}
                  />
                  {errors.compare_price && (
                    <p className="text-sm text-red-500">
                      Vui lòng nhập giá gốc
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 col-span-6">
                  <Label htmlFor="price" className="">
                    Giá bán <span className="text-[red]">*</span>
                  </Label>
                  <Input
                    id="price"
                    onChange={(e) => {
                      setItem((prev) => ({
                        ...prev,
                        price: Number(e.target.value),
                      }));
                    }}
                    className="col-span-3"
                    value={item.price}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500">
                      Vui lòng nhập giá bán
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-12 gap-x-4">
                <div className="flex flex-col gap-2 col-span-6">
                  <Label htmlFor="sold" className="">
                    Đã bán <span className="text-[red]">*</span>
                  </Label>
                  <Input
                    id="sold"
                    onChange={(e) => {
                      setItem((prev) => ({
                        ...prev,
                        sold: Number(e.target.value),
                      }));
                    }}
                    className="col-span-3"
                    value={item.sold}
                    readOnly
                  />
                  {errors.sold && (
                    <p className="text-sm text-red-500">
                      Vui lòng nhập số lượng đã bán
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 col-span-6">
                  <Label htmlFor="stock" className="">
                    Tồn kho <span className="text-[red]">*</span>
                  </Label>
                  <Input
                    id="stock"
                    onChange={(e) => {
                      setItem((prev) => ({
                        ...prev,
                        stock: Number(e.target.value),
                      }));
                    }}
                    className="col-span-3"
                    value={item.stock}
                  />
                  {errors.stock && (
                    <p className="text-sm text-red-500">
                      Vui lòng nhập số lượng tồn kho
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="description" className="">
                  Mô tả sản phẩm
                </Label>
                <Textarea
                  id="description"
                  onChange={(e) => {
                    setItem((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }));
                  }}
                  className="col-span-3"
                  value={item.description}
                />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="picture" className="flex gap-2 items-center">
                  <div>
                    Ảnh sản phẩm <span className="text-[red]">*</span>
                  </div>
                  {errors.images && (
                    <p className="text-sm text-red-500 font-normal">
                      Vui lòng tải ảnh sản phẩm
                    </p>
                  )}
                </Label>
                <ImageDropzone
                  files={files}
                  setFiles={setFiles}
                ></ImageDropzone>
              </div>
            </div>

            <Button
              onClick={() => {
                handleEditItem();
              }}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
              ) : null}
              Chỉnh sửa
            </Button>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
};
export default AdminProductsPage;
