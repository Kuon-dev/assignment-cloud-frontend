import { TrendingUp } from "lucide-react";
import { LabelList, RadialBar, RadialBarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  totalListings: {
    label: "Total Listings",
    color: "#2563eb",
  },
  totalApplications: {
    label: "Total Applications",
    color: "#f97316",
  },
} satisfies ChartConfig;

export default function PerformanceAnalyticsComponent({ data }) {
  const chartData = [
    { name: "Total Listings", value: data.totalListings, fill: "#1f77b4" },
    {
      name: "Total Applications",
      value: data.totalApplications,
      fill: "#ff7f0e",
    },
  ];

  return (
    <Card className="mx-auto aspect-square max-h-[400px] h-full w-full">
      <CardHeader>
        <CardTitle>Performance Analytics</CardTitle>
        <CardDescription>Metrics overview</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="text-2xl font-bold text-center mb-4">
          Average Price: ${data.averagePrice.toFixed(2)}
        </div>
        <ChartContainer config={chartConfig}>
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={-270}
            innerRadius={30}
            outerRadius={110}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="name" />}
            />
            <RadialBar dataKey="value" background>
              <LabelList
                position="insideStart"
                dataKey="name"
                className="fill-white capitalize mix-blend-luminosity"
                fontSize={11}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
