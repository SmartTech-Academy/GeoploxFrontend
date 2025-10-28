import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, MoveUpRight } from 'lucide-react';
import { PageMetaTags } from '@/components/page-meta-data';
import { ConversionsChart } from '@/components/charts/ConversionsChart';
import { useGetPerformance } from '@/lib/services/dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { ActiveListingsChart } from '@/components/charts/ActiveListingsChart';

const PerformancePage = () => {
  const [period, setPeriod] = useState('last_6_months');
  const [filter, setFilter] = useState('all');
  const { data: performanceData, isLoading } = useGetPerformance({ period, filter });

  const cards = performanceData?.data?.data?.cards;
  const deltas = performanceData?.data?.data?.deltas;
  const listingActivities =
    performanceData?.data?.data?.listingActivities?.map((d: any) => ({ ...d, rent: d.forRent })) ?? [];
  const conversions = performanceData?.data?.data?.conversions?.map((d: any) => ({ ...d, rent: d.forRent })) ?? [];

  const overviewCards = [
    { title: 'Total Listings', value: cards?.totalListings ?? 0 },
    { title: 'Active Listing', value: cards?.activeListings ?? 0 },
    { title: 'Archived Listing', value: cards?.archivedListings ?? 0 },
  ];

  const totalsCards = [
    { title: 'Total Clicks', value: cards?.totalClicks ?? 0, delta: deltas?.clicks },
    { title: 'Total Leads', value: cards?.totalLeads ?? 0, delta: deltas?.leads },
    { title: 'Total Views', value: cards?.totalViews ?? 0, delta: deltas?.views },
    { title: 'Total Saves & shares', value: cards?.totalSavesShares ?? 0, delta: deltas?.saves },
  ];

  return (
    <div className="flex w-full flex-col items-start gap-5 py-8">
      <PageMetaTags
        title="Performance Analytics"
        description="Track your property portfolio performance with detailed analytics and insights."
        keywords="property analytics, real estate performance, listing metrics"
      />
      <header className="flex w-full items-center justify-between gap-2 self-stretch">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="h-10 min-w-[138px] rounded-[45px] border-0 border-[oklch(0.8754_0.0109_286.17)] bg-[#F9F9F9] text-[#41415A] focus:ring-0">
            <div className="flex items-center gap-2">
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Properties</SelectItem>
            <SelectItem value="for-rent">For Rent</SelectItem>
            <SelectItem value="for-sale">For Sale</SelectItem>
            <SelectItem value="short-let">Short Let</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="secondary"
          className="h-8 rounded-[40px] bg-[#F9F9FB] p-4 text-[14px] leading-5 font-normal text-[#1F2130]"
        >
          Export
          <Download className="size-4" />
        </Button>
      </header>

      <section className="grid grid-cols-1 gap-5 self-stretch lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-[150px] w-full" />)
          : overviewCards.map((item, index) => (
              <div
                key={index}
                className="isolate box-border flex grow flex-col items-start gap-5 rounded-[10px] border border-[#E2E2E2] bg-white"
              >
                <div className="box-border w-full border-b border-[#ECECEC] bg-[#F9F9F9] px-6 pt-6 pb-3">
                  <h6 className="text-[12px] leading-3.5 tracking-[-0.02em] text-[#7F7F7F] uppercase">{item.title}</h6>
                </div>
                <div className="flex items-baseline gap-2 px-6 pb-6">
                  <p className="text-[48px] leading-12 font-semibold tracking-[-1px] text-[#1F2130]">{item.value}</p>
                  <span className="text-[16px] leading-[22px] text-[#1F2130]">Properties</span>
                </div>
              </div>
            ))}
      </section>

      <section className="grid w-full grid-cols-1 gap-6 rounded-xl lg:grid-cols-2">
        <ActiveListingsChart data={listingActivities} period={period} onPeriodChange={setPeriod} />
        <ConversionsChart data={conversions} period={period} onPeriodChange={setPeriod} />
      </section>

      <section className="grid w-full grid-cols-1 gap-5 self-stretch lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-[150px] w-full" />)
          : totalsCards.map((item, index) => (
              <div
                key={index}
                className="isolate box-border flex grow flex-col items-start gap-5 rounded-[10px] border border-[#E2E2E2] bg-white"
              >
                <div className="box-border w-full border-b border-[#ECECEC] bg-[#F9F9F9] px-6 pt-6 pb-3">
                  <h6 className="text-[12px] leading-3.5 tracking-[-0.02em] text-[#7F7F7F] uppercase">{item.title}</h6>
                </div>
                <div className="flex items-baseline gap-2 px-6 pb-6">
                  <p className="text-[48px] leading-12 font-semibold tracking-[-1px] text-[#1F2130]">{item.value}</p>
                  {item.delta !== undefined && (
                    <div className="flex items-center gap-1.5">
                      <MoveUpRight className="size-3 text-[#008A00]" />
                      <span className="text-[14px] leading-4 tracking-[-0.02em] text-[#008A00D2]">{item.delta}%</span>
                      <span className="text-[14px] leading-4 tracking-[-0.02em] text-[#71748C]">Last mth.</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
      </section>
    </div>
  );
};

export default PerformancePage;
