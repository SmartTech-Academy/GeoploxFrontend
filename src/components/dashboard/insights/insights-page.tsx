import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, MoveUpRight } from 'lucide-react';
import { PageMetaTags } from '@/components/page-meta-data';
import BlogViewsChart from '@/components/charts/BlogViewsChart';
import TrafficCategoriesChart from '@/components/charts/TrafficCategoriesChart';

const OVERVIEW = [
  {
    title: 'Total Published',
    value: '145',
  },
  {
    title: 'Active Posts',
    value: '110',
  },
  {
    title: 'Drafted Post',
    value: '30',
  },
];

const TOTALS = [
  { title: 'Blog Subscribers', value: '2.04K' },
  { title: 'Total Views', value: '1.40K' },
  { title: 'Unique Visitors', value: '515' },
  { title: 'Bounce Rate', value: '12.3%' },
];

const InsightsPage = () => {
  return (
    <div className="flex w-full flex-col items-start gap-5 py-8">
      <PageMetaTags
        title="Market Insights"
        description="Get data-driven insights into market trends, pricing analytics, and investment opportunities."
        keywords="market insights, real estate trends, property analytics"
      />
      <header className="flex w-full items-center justify-between gap-2 self-stretch">
        <Select defaultValue="all">
          <SelectTrigger className="h-10 min-w-[138px] rounded-[45px] border-0 border-[oklch(0.8754_0.0109_286.17)] bg-[#F9F9F9] text-[#41415A] focus:ring-0">
            <div className="flex items-center gap-2">
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Blog Post</SelectItem>
            <SelectItem value="rent">Rent</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="secondary"
          className="h-8 rounded-[40px] bg-[#F9F9FB] p-4 text-[14px] leading-[20px] font-normal text-[#1F2130]"
        >
          Export
          <Download className="size-4" />
        </Button>
      </header>

      <section className="grid grid-cols-1 gap-5 self-stretch lg:grid-cols-3">
        {OVERVIEW.map((item, index) => (
          <div
            key={index}
            className="isolate box-border flex grow flex-col items-start gap-5 rounded-[10px] border border-[#E2E2E2] bg-white"
          >
            <div className="box-border w-full rounded-t-[10px] border-b border-[#ECECEC] bg-[#F9F9F9] px-6 pt-6 pb-3">
              <h6 className="text-[12px] leading-[14px] tracking-[-0.02em] text-[#7F7F7F] uppercase">{item.title}</h6>
            </div>

            <div className="flex items-baseline gap-2 px-6 pb-6">
              <p className="text-[48px] leading-[48px] font-semibold tracking-[-1px] text-[#1F2130]">{item.value}</p>
              <span className="text-[16px] leading-[22px] text-[#1F2130]">Posts</span>
            </div>
          </div>
        ))}
      </section>

      <section className="grid w-full grid-cols-1 gap-6 rounded-[8px] lg:grid-cols-2">
        <BlogViewsChart />
        <TrafficCategoriesChart />
      </section>

      <section className="grid w-full grid-cols-1 gap-5 self-stretch lg:grid-cols-4">
        {TOTALS.map((item, index) => (
          <div
            key={index}
            className="isolate box-border flex grow flex-col items-start gap-5 rounded-[10px] border border-[#E2E2E2] bg-white"
          >
            <div className="box-border w-full rounded-t-[10px] border-b border-[#ECECEC] bg-[#F9F9F9] px-6 pt-6 pb-3">
              <h6 className="text-[12px] leading-[14px] tracking-[-0.02em] text-[#7F7F7F] uppercase">{item.title}</h6>
            </div>

            <div className="flex items-baseline gap-2 px-6 pb-6">
              <p className="text-[48px] leading-[48px] font-semibold tracking-[-1px] text-[#1F2130]">{item.value}</p>

              <div className="flex items-center gap-1">
                <MoveUpRight className="size-3 text-[#008A00]" />
                <span className="text-[14px] leading-[16px] tracking-[-0.02em] text-[#008A00D2]">3.36</span>
                <span className="text-[14px] leading-[16px] tracking-[-0.02em] text-[#71748C]">Last mth.</span>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default InsightsPage;
