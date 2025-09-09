'use client';

import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
  { month: 'Jan', rent: 1, forSale: 1, shortLet: 26 },
  { month: 'Feb', rent: 5, forSale: 8, shortLet: 24 },
  { month: 'Mar', rent: 12, forSale: 15, shortLet: 22 },
  { month: 'Apr', rent: 18, forSale: 17, shortLet: 20 },
  { month: 'May', rent: 22, forSale: 18, shortLet: 17 },
  { month: 'Jun', rent: 24, forSale: 19, shortLet: 15 },
  { month: 'Jul', rent: 25, forSale: 19, shortLet: 13 },
  { month: 'Aug', rent: 26, forSale: 18, shortLet: 20 },
  { month: 'Sep', rent: 24, forSale: 12, shortLet: 18 },
  { month: 'Oct', rent: 26, forSale: 13, shortLet: 12 },
  { month: 'Nov', rent: 27, forSale: 14, shortLet: 8 },
  { month: 'Dec', rent: 28, forSale: 17, shortLet: 6 },
];

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

const ListingActivities = () => {
  return (
    <div className="flex items-start gap-12 self-stretch rounded-[8px] border border-[#E3E3E8] bg-white p-6">
      <div className="flex w-full grow flex-col items-start gap-6">
        <header className="flex w-full items-center justify-between gap-6">
          <h3 className="text-[12px] leading-[14px] tracking-[0.02em] text-[#7F7F7F] uppercase">Listing Activities</h3>

          <Select defaultValue="this_month">
            <SelectTrigger className="h-10 min-w-[138px] rounded-[45px] border-0 border-[oklch(0.8754_0.0109_286.17)] bg-[#F9F9F9] text-[#41415A] focus:ring-0">
              <div className="flex items-center gap-2">
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this_week">This week</SelectItem>
              <SelectItem value="this_month">This month</SelectItem>
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
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={true} vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                domain={[0, 45]}
                ticks={[0, 10, 20, 30, 40, 45]}
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
                  stroke: 'var(--color-rent)',
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
                  stroke: 'var(--color-forSale)',
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
                  stroke: 'var(--color-shortLet)',
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default ListingActivities;
