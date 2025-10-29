import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const chartData = [
  {
    category: 'Developer News',
    value: 3848,
    color: '#eab308',
  },
  {
    category: 'Buying Guides',
    value: 2977,
    color: '#06b6d4',
  },
  {
    category: 'Market Trends',
    value: 5234,
    color: '#10b981',
  },
  {
    category: 'Avg. Property Price',
    value: 1233,
    color: '#ef4444',
  },
];

const TrafficCategoriesChart = () => {
  return (
    <div className="flex items-start gap-12 self-stretch rounded-xl border border-[#E3E3E8] bg-white p-6">
      <div className="flex w-full grow flex-col items-start gap-6">
        <header className="flex w-full items-center justify-between gap-6">
          <h3 className="text-[12px] leading-3.5 tracking-[0.02em] text-[#7F7F7F] uppercase">Traffic by Categories</h3>

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

        <div className="flex w-full flex-col gap-5">
          {chartData.map((item, index) => (
            <div key={index} className="flex flex-col gap-1">
              <span className="text-sm font-medium whitespace-nowrap text-gray-700">{item.category}</span>
              <div className="flex items-center justify-between">
                <div className="flex min-w-0 flex-1 items-center space-x-3">
                  <div className="flex-1">
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: item.color,
                          width: `${(item.value / 5234) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <span className="ml-3 text-sm font-semibold text-gray-900">{item.value.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrafficCategoriesChart;
