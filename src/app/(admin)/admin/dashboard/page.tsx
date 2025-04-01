"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import NumberTicker from "@/fancy/components/text/basic-number-ticker";

const NumberTickerDemo = () => {
  return (
    <p className="text-[#1f464d]">
      <NumberTicker
        from={0}
        target={100}
        autoStart={true}
        transition={{ duration: 3.5, type: "tween", ease: "easeInOut" }}
        onComplete={() => console.log("complete")}
        onStart={() => console.log("start")}
      />
      %
    </p>
  );
};

const AdminDashBoardPage = () => {
  return (
    <div>
      <div className="text-xl font-bold">Dashboard</div>
      <div className="w-full mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Doanh thu</CardTitle>
            <CardDescription>Card Description</CardDescription>
            <NumberTickerDemo></NumberTickerDemo>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Số lượng sản phẩm bán được
            </CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Số lượng đơn hàng bán được
            </CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Số lương khách hàng</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Hiện tại</p>
          </CardContent>
          <CardFooter>
            <p>Mới trong tháng</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
export default AdminDashBoardPage;
