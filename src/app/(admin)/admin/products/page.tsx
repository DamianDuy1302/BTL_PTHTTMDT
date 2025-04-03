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

const AdminProductsPage = () => {
  const [productList, setProductList] = useState([]);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [item, setItem] = useState({
    name: "",
    compare_price: 0,
    price: 0,
    category_id: 0,
    description: "",
  });

  const [inputProductNameFilter, setInputProductNameFilter] = useState("");
  const [productNameFilter, setProductNameFilter] = useState("");
  const [priceSort, setPriceSort] = useState("");
  const [comparePriceSort, setComparePriceSort] = useState("");
  const [soldSort, setSoldSort] = useState("");
  const [stockSort, setStockSort] = useState("");
  const getProductList = async () => {
    try {
      const { data } = await axiosInstance.get("/product/list", {
        params: {
          key: productNameFilter,
        },
      });
      console.log(data);
      setProductList(data.data.product);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCreateItem = async () => {
    console.log(item);
    console.log(files);
  };
  const handleEditItem = async () => {
    console.log(item);
    console.log(files);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setProductNameFilter(inputProductNameFilter); // Cập nhật sau 2s
    }, 500);

    return () => clearTimeout(timeout); // Xóa timeout nếu inputValue thay đổi trước khi 2s kết thúc
  }, [inputProductNameFilter]);

  useEffect(() => {
    getProductList();
  }, [productNameFilter]);
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
                      if (comparePriceSort === "asc") {
                        setComparePriceSort("desc");
                      } else if (comparePriceSort === "desc") {
                        setComparePriceSort("");
                      } else {
                        setComparePriceSort("asc");
                      }
                    }}
                    className="cursor-pointer"
                  >
                    {comparePriceSort === "asc" ? (
                      <ArrowUpNarrowWide size={16} color="blue" />
                    ) : comparePriceSort === "desc" ? (
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
                      if (priceSort === "asc") {
                        setPriceSort("desc");
                      } else if (priceSort === "desc") {
                        setPriceSort("");
                      } else {
                        setPriceSort("asc");
                      }
                    }}
                    className="cursor-pointer"
                  >
                    {priceSort === "asc" ? (
                      <ArrowUpNarrowWide size={16} color="blue" />
                    ) : priceSort === "desc" ? (
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
                      if (soldSort === "asc") {
                        setSoldSort("desc");
                      } else if (soldSort === "desc") {
                        setSoldSort("");
                      } else {
                        setSoldSort("asc");
                      }
                    }}
                    className="cursor-pointer"
                  >
                    {soldSort === "asc" ? (
                      <ArrowUpNarrowWide size={16} color="blue" />
                    ) : soldSort === "desc" ? (
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
                      if (stockSort === "asc") {
                        setStockSort("desc");
                      } else if (stockSort === "desc") {
                        setStockSort("");
                      } else {
                        setStockSort("asc");
                      }
                    }}
                    className="cursor-pointer"
                  >
                    {stockSort === "asc" ? (
                      <ArrowUpNarrowWide size={16} color="blue" />
                    ) : stockSort === "desc" ? (
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
                        setIsModalEditOpen(true);
                        setItem({
                          name: item.name,
                          compare_price: item.compare_price,
                          price: item.price,
                          category_id: item.category_id,
                          description: item.description,
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

      <Dialog
        open={isModalCreateOpen}
        onOpenChange={() => {
          setIsModalCreateOpen(false);
          setItem({
            name: "",
            compare_price: 0,
            price: 0,
            category_id: 0,
            description: "",
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
                Tên sản phẩm
              </Label>
              <Input
                id="name"
                onChange={(e) => {
                  setItem((prev) => ({ ...prev, name: e.target.value }));
                }}
                className="col-span-3"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="category" className="">
                Phân loại sản phẩm
              </Label>
              <Select
                onValueChange={(value) => {
                  setItem((prev) => ({ ...prev, category_id: Number(value) }));
                }}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Phân loại sản phẩm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Light</SelectItem>
                  <SelectItem value="2">Dark</SelectItem>
                  <SelectItem value="3">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-12 gap-x-4">
              <div className="flex flex-col gap-2 col-span-6">
                <Label htmlFor="compare_price" className="">
                  Giá gốc
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
              </div>
              <div className="flex flex-col gap-2 col-span-6">
                <Label htmlFor="price" className="">
                  Giá gốc
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
              <Label htmlFor="picture">Ảnh sản phẩm</Label>
              <ImageDropzone files={files} setFiles={setFiles}></ImageDropzone>
            </div>
          </div>

          <Button
            onClick={() => {
              handleCreateItem();
            }}
          >
            Thêm mới
          </Button>
        </DialogContent>
      </Dialog>

      {item.name && isModalEditOpen ? (
        <Dialog
          open={isModalEditOpen}
          onOpenChange={() => {
            setIsModalEditOpen(false);
            setItem({
              name: "",
              compare_price: 0,
              price: 0,
              category_id: 0,
              description: "",
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
                  Tên sản phẩm
                </Label>
                <Input
                  id="name"
                  onChange={(e) => {
                    setItem((prev) => ({ ...prev, name: e.target.value }));
                  }}
                  value={item.name}
                  className="col-span-3"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="category" className="">
                  Phân loại sản phẩm
                </Label>
                <Select
                  onValueChange={(value) => {
                    setItem((prev) => ({
                      ...prev,
                      category_id: Number(value),
                    }));
                  }}
                  value={item?.category_id?.toString()}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Phân loại sản phẩm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Light</SelectItem>
                    <SelectItem value="2">Dark</SelectItem>
                    <SelectItem value="3">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-12 gap-x-4">
                <div className="flex flex-col gap-2 col-span-6">
                  <Label htmlFor="compare_price" className="">
                    Giá gốc
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
                </div>
                <div className="flex flex-col gap-2 col-span-6">
                  <Label htmlFor="price" className="">
                    Giá gốc
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
                <Label htmlFor="picture">Ảnh sản phẩm</Label>
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
            >
              Chỉnh sửa
            </Button>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
};
export default AdminProductsPage;
