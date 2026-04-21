import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface ConversionsChartProps {
  data: any[];
  period: string;

  onPeriodChange: (period: string) => void;
}

export function ConversionsChart({ data, period, onPeriodChange }: ConversionsChartProps) {
  return (
    <div className="flex items-start gap-12 self-stretch rounded-xl border border-[#E3E3E8] bg-white p-6">
      <div className="flex w-full grow flex-col items-start gap-6">
        <header className="flex w-full items-center justify-between gap-6">
          <h3 className="text-[12px]/3.5 tracking-[0.02em] text-[#7F7F7F] uppercase">
            Conversions
          </h3>
          <Select value={period} onValueChange={onPeriodChange}>
            <SelectTrigger className="h-10 min-w-[138px] rounded-[45px] border-0 border-[oklch(0.8754_0.0109_286.17)] bg-[#F9F9F9] text-[#41415A] focus:ring-0">
              <div className="flex items-center gap-2">
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this_month">This month</SelectItem>
              <SelectItem value="last_3_months">Last 3 months</SelectItem>
              <SelectItem value="last_6_months">Last 6 months</SelectItem>
            </SelectContent>
          </Select>
        </header>

        {/* Legend */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-sm bg-[#60A5FA]"></div>
            <span className="text-sm text-gray-600">Rent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-sm bg-[#3B82F6]"></div>
            <span className="text-sm text-gray-600">For Sale</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-sm bg-[#1E40AF]"></div>
            <span className="text-sm text-gray-600">Short Let</span>
          </div>
        </div>

        <div className="h-[300px] w-full">
          {data && data.length > 0 ? (
            <ChartContainer
              config={{
                rent: {
                  label: "Rent",
                  color: "#60A5FA",
                },
                forSale: {
                  label: "For Sale",
                  color: "#3B82F6",
                },
                shortLet: {
                  label: "Short Let",
                  color: "#1E40AF",
                },
              }}
              className="size-full"
            >
              <div className="w-full">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#666" }}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="rent" stackId="a" fill="var(--color-rent)" radius={[0, 0, 0, 0]} />
                  <Bar
                    dataKey="forSale"
                    stackId="a"
                    fill="var(--color-forSale)"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="shortLet"
                    stackId="a"
                    fill="var(--color-shortLet)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </div>
            </ChartContainer>
          ) : (
            <div className="flex size-full items-center justify-center">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-800">No Conversion Data</h4>
                <p className="text-sm text-gray-500">
                  There are no conversions to display for this period.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
