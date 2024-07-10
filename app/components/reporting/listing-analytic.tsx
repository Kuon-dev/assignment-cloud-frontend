import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
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

export default function ListingAnalyticsComponent({ data }: { data: [] }) {
  if (!data) {
    return <div>Loading...</div>;
  }

  const chartConfig = {
    views: {
      label: "Views",
      color: "#f59e0b", // Use a specific color here
    },
    applications: {
      label: "Applications",
      color: "#10b981", // Use a specific color here
    },
  } satisfies ChartConfig;

  return (
    <Card className="mx-auto aspect-square max-h-[400px] h-full w-full">
      <CardHeader>
        <CardTitle>Listing Analytics</CardTitle>
        <CardDescription>Overview of listing performance</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart data={data} width={800} height={500}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="listingId"
              tickFormatter={(value) => value.slice(0, 8) + "..."}
            />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
            <Line type="monotone" dataKey="views" stroke="#f59e0b" />
            <Line type="monotone" dataKey="applications" stroke="#10b981" />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
