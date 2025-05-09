"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import axiosInstance from "@/config/axios";

const chartConfig = {
  views: {
    label: "Page Views",
  },
  last_week: {
    label: "last_week",
  },
  last_month: {
    label: "last_month",
  },
} satisfies ChartConfig;

export function LocalLineChart({ total }) {
  const [activeChart, setActiveChart] = React.useState("last_week");
  const [revenuesData, setRevenuesData] = React.useState({});
  const [period, setPeriod] = React.useState(1);
  const [value, setValue] = React.useState(7);
  const getRevenuesData = async () => {
    try {
      const token = localStorage.getItem("access_token").replace(/"/g, "");
      const { data } = await axiosInstance.get("/admin/analytic/revenue", {
        params: {
          period: period,
          value: value,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(data);
      setRevenuesData(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    getRevenuesData();
  }, [period, value]);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Doanh thu: {total.toLocaleString()} ₫</CardTitle>
        </div>
        <div className="flex">
          {["last_week", "last_month"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="min-w-[max-content] relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => {
                  setActiveChart(chart);
                  if (chart == "last_week") {
                    setPeriod(1);
                    setValue(7);
                  }
                  if (chart == "last_month") {
                    setPeriod(2);
                    setValue(6);
                  }
                }}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label == "last_week"
                    ? "7 ngày"
                    : "6 tháng"}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      {revenuesData ? (
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={{ id: "chart-total", type: "line" }}
            className="aspect-auto h-[250px] w-full"
          >
            <LineChart
              accessibilityLayer
              data={revenuesData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="period"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  // Nếu là chuỗi có 10 ký tự -> YYYY-MM-DD
                  if (value.length === 10) {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }

                  // Nếu là chuỗi có 7 ký tự -> YYYY-MM
                  if (value.length === 7) {
                    const date = new Date(`${value}-01`);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    });
                  }

                  return value; // fallback nếu format không đúng
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="total"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                  />
                }
              />
              <Line
                dataKey="total"
                type="monotone"
                stroke={`hsl(221, 82%, 53%)`}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      ) : null}
    </Card>
  );
}
