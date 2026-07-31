import { useMemo } from "react";
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "../ui/skeleton";
import { EmptyState } from "../empty-state";

const chartConfig = {
  rent: {
    label: "For Rent",
    color: "#EAB308", // Yellow
  },
  forSale: {
    label: "For Sale",
    color: "#DC2626", // Red
  },
  shortLet: {
    label: "Short Let",
    color: "#0891B2", // Teal
  },
} satisfies ChartConfig;

// Matches exactly what admin-insights.tsx (and every other caller) builds from the backend's
// {labels, series} payload - one flat row per period label, already keyed by display name. No
// separate per-category "series" array with its own slug/points shape - that contract never
// matched what any caller actually produced, which is why this chart always rendered empty.
interface ListingActivityPoint {
  name: string;
  "For Sale": number;
  "For Rent": number;
  "Short Let": number;
}

interface ListingActivitiesProps {
  data: ListingActivityPoint[];
  isLoading: boolean;
  period: string;
  onPeriodChange: (period: string) => void;
}

const ListingActivities = ({
  data,
  isLoading,
  period,
  onPeriodChange,
}: ListingActivitiesProps) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map((point) => ({
      month: point.name,
      rent: point["For Rent"] ?? 0,
      forSale: point["For Sale"] ?? 0,
      shortLet: point["Short Let"] ?? 0,
    }));
  }, [data]);

  const yMax = useMemo(
    () => Math.max(...chartData.flatMap((d) => [d.rent, d.forSale, d.shortLet]), 45),
    [chartData],
  );
  const yTicks = useMemo(
    () => Array.from({ length: 5 }, (_, i) => Math.round((yMax / 4) * i)),
    [yMax],
  );

  return (
    <div className="flex items-start gap-12 self-stretch rounded-xl border border-[#E3E3E8] bg-white p-6">
      <div className="flex w-full grow flex-col items-start gap-6">
        <header className="flex w-full items-center justify-between gap-6">
          <h3 className="text-[12px]/3.5 tracking-[0.02em] text-[#7F7F7F] uppercase">
            Listing Activities
          </h3>

          <Select value={period} onValueChange={onPeriodChange}>
            <SelectTrigger className="h-10 min-w-[138px] rounded-[45px] border-0 border-[oklch(0.8754_0.0109_286.17)] bg-[#F9F9F9] text-[#41415A] focus:ring-0">
              <div className="flex items-center gap-2">
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this_month">This month</SelectItem>
              <SelectItem value="last_6_months">Last 6 months</SelectItem>
              <SelectItem value="last_12_months">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </header>

        {/* Legend */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-sm bg-[#EAB308]"></div>
            <span className="text-sm text-gray-600">For Rent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-sm bg-[#DC2626]"></div>
            <span className="text-sm text-gray-600">For Sale</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-sm bg-[#0891B2]"></div>
            <span className="text-sm text-gray-600">Short Let</span>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[300px] w-full">
          {isLoading ? (
            <Skeleton className="size-full" />
          ) : chartData.length === 0 ? (
            <EmptyState type="chart" message="No listing activities to display." />
          ) : (
            <ChartContainer config={chartConfig} className="h-[300px]">
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                  top: 12,
                  bottom: 12,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5E7EB"
                  horizontal={true}
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 12, fill: "#9CA3AF" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 12, fill: "#9CA3AF" }}
                  domain={[0, yMax]}
                  ticks={yTicks}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Line
                  dataKey="rent"
                  type="monotone"
                  stroke="var(--color-rent)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 4,
                    stroke: "var(--color-for-rent)",
                    strokeWidth: 2,
                  }}
                />
                <Line
                  dataKey="forSale"
                  type="monotone"
                  stroke="var(--color-forSale)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 4,
                    stroke: "var(--color-forSale)",
                    strokeWidth: 2,
                  }}
                />
                <Line
                  dataKey="shortLet"
                  type="monotone"
                  stroke="var(--color-shortLet)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 4,
                    stroke: "var(--color-shortLet)",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ChartContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingActivities;
