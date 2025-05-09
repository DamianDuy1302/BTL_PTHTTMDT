"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import axiosInstance from "@/config/axios";
import { LocalRadialChart } from "@/components/LocalRadialChart";
import { LocalLineChart } from "@/components/LocalLineChart";
import { LocalBarChart } from "@/components/LocalBarChart";

const AdminDashBoardPage = () => {
  const [metaData, setMetaData] = React.useState({});

  const getMetaData = async () => {
    try {
      const token = localStorage.getItem("access_token").replace(/"/g, "");
      const { data } = await axiosInstance.get("/admin/analytic/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMetaData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getMetaData();
  }, []);

  return (
    <div>
      <div className="text-xl font-bold">Dashboard</div>
      {metaData.revenues &&
      metaData.products &&
      metaData.orders &&
      metaData.users ? (
        <div className="mt-4">
          {/* <Component total={metaData.revenues.total}></Component> */}
          <LocalLineChart total={metaData.revenues.total}></LocalLineChart>
          <div className="w-full mt-4 grid grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sản phẩm</CardTitle>
              </CardHeader>
              <CardContent>
                <LocalRadialChart
                  title={"Số lượng sản phẩm"}
                  subTitle={"sản phẩm"}
                  totalUser={metaData.products.total}
                ></LocalRadialChart>
              </CardContent>
              <CardContent>
                <LocalBarChart
                  title={"Thống kê bán chạy"}
                  chartData={[
                    {
                      key: `Most - ${metaData.products.product_best_seller?.variant_id}`,
                      value: metaData.products.product_best_seller.sold,
                    },
                    {
                      key: `Least - ${metaData.products.product_least_seller?.variant_id}`,
                      value: metaData.products.product_least_seller.sold,
                    },
                  ]}
                ></LocalBarChart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Đơn hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <LocalRadialChart
                  title={"Số lượng đơn hàng"}
                  subTitle={"đơn hàng"}
                  totalUser={metaData.orders.total}
                ></LocalRadialChart>
              </CardContent>
              <CardContent>
                <LocalBarChart
                  title={"Thống kê trên 1 đơn hàng"}
                  chartData={[
                    {
                      key: `Most paid`,
                      value: metaData.orders.most_total_value.total_price,
                    },
                    {
                      key: `Most items`,
                      value: metaData.orders.most_product.total_quantity,
                    },
                  ]}
                ></LocalBarChart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Người dùng
                  {/* {metaData.users.total}{" "} */}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LocalRadialChart
                  title={"Số lượng người dùng"}
                  subTitle={"người dùng"}
                  totalUser={metaData.users.total}
                ></LocalRadialChart>
              </CardContent>
              <CardContent>
                <LocalBarChart
                  title={"Thống kê trên 1 người dùng"}
                  chartData={[
                    {
                      key: "Most pay",
                      value: metaData.users.top_spender_today.total_spent,
                    },
                    {
                      key: "Most orders",
                      value: metaData.users.top_spender_today.user_id,
                    },
                  ]}
                ></LocalBarChart>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default AdminDashBoardPage;
