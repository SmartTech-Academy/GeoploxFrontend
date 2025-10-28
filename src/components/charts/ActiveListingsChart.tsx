import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartConfig = {
  rent: {
    label: 'Rent',
    color: '#EAB308', // Yellow
  },
  forSale: {
    label: 'For Sale',
    color: '#DC2626', // Red
  },
  shortLet: {
    label: 'Short Let',
    color: '#0891B2', // Teal
  },
} satisfies ChartConfig;

interface ActiveListingsChartProps {
  data: any[];
  period: string;

  onPeriodChange: (period: string) => void;
}

export function ActiveListingsChart({ data, period, onPeriodChange }: ActiveListingsChartProps) {
  return (
    <div className="flex items-start gap-12 self-stretch rounded-xl border border-[#E3E3E8] bg-white p-6">
      <div className="flex w-full grow flex-col items-start gap-6">
        <header className="flex w-full items-center justify-between gap-6">
          <h3 className="text-[12px] leading-3.5 tracking-[0.02em] text-[#7F7F7F] uppercase">Active Listings</h3>

          <Select value={period} onValueChange={onPeriodChange}>
            <SelectTrigger className="h-10 min-w-[138px] rounded-[45px] border-0 border-[oklch(0.8754_0.0109_286.17)] bg-[#F9F9F9] text-[#41415A] focus:ring-0">
              <div className="flex items-center gap-2">
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this_month">This month</SelectItem>
              <SelectItem value="last_3_months">Last 3 months</SelectItem>
              <SelectItem value="last_6_months">Last 6 months</SelectItem>
              <SelectItem value="this_year">This year</SelectItem>
            </SelectContent>
          </Select>
        </header>

        {/* Legend */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-[#EAB308]"></div>
            <span className="text-sm text-gray-600">Rent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-[#DC2626]"></div>
            <span className="text-sm text-gray-600">For Sale</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-[#0891B2]"></div>
            <span className="text-sm text-gray-600">Short Let</span>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[300px] w-full">
          <div className="w-full">
            {data && data.length > 0 ? (
              <ChartContainer config={chartConfig}>
                <LineChart
                  accessibilityLayer
                  data={data}
                  margin={{
                    left: 12,
                    right: 12,
                    top: 12,
                    bottom: 12,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={true} vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Line
                    dataKey="rent"
                    type="monotone"
                    stroke="var(--color-rent)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, stroke: 'var(--color-rent)', strokeWidth: 2 }}
                  />
                  <Line
                    dataKey="forSale"
                    type="monotone"
                    stroke="var(--color-forSale)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, stroke: 'var(--color-forSale)', strokeWidth: 2 }}
                  />
                  <Line
                    dataKey="shortLet"
                    type="monotone"
                    stroke="var(--color-shortLet)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, stroke: 'var(--color-shortLet)', strokeWidth: 2 }}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-center text-sm text-gray-500">
                No listing activity for this period.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
