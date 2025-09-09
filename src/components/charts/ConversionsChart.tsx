'use client';

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Sample data for conversions stacked bar chart
const conversionsData = [
  { month: 'Jan', rent: 8, forSale: 5, shortLet: 10 },
  { month: 'Feb', rent: 6, forSale: 4, shortLet: 6 },
  { month: 'Mar', rent: 12, forSale: 8, shortLet: 12 },
  { month: 'Apr', rent: 9, forSale: 6, shortLet: 8 },
  { month: 'May', rent: 10, forSale: 7, shortLet: 6 },
];

export function ConversionsChart() {
  return (
    <div className="flex items-start gap-12 self-stretch rounded-[8px] border border-[#E3E3E8] bg-white p-6">
      <div className="flex w-full grow flex-col items-start gap-6">
        <header className="flex w-full items-center justify-between gap-6">
          <h3 className="text-[12px] leading-[14px] tracking-[0.02em] text-[#7F7F7F] uppercase">Conversions</h3>

          <Select defaultValue="six_month">
            <SelectTrigger className="h-10 min-w-[138px] rounded-[45px] border-0 border-[oklch(0.8754_0.0109_286.17)] bg-[#F9F9F9] text-[#41415A] focus:ring-0">
              <div className="flex items-center gap-2">
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this_week">This week</SelectItem>
              <SelectItem value="six_month">Last 6 Months</SelectItem>
              <SelectItem value="this_month">This month</SelectItem>
            </SelectContent>
          </Select>
        </header>

        {/* Legend */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-[#60A5FA]"></div>
            <span className="text-sm text-gray-600">Rent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-[#3B82F6]"></div>
            <span className="text-sm text-gray-600">For Sale</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-[#1E40AF]"></div>
            <span className="text-sm text-gray-600">Short Let</span>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ChartContainer
            config={{
              rent: {
                label: 'Rent',
                color: '#60A5FA',
              },
              forSale: {
                label: 'For Sale',
                color: '#3B82F6',
              },
              shortLet: {
                label: 'Short Let',
                color: '#1E40AF',
              },
            }}
            className="h-full w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="rent" stackId="a" fill="var(--color-rent)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="forSale" stackId="a" fill="var(--color-forSale)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="shortLet" stackId="a" fill="var(--color-shortLet)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
