import { PageMetaTags } from "@/components/page-meta-data";
import ListingActivities from "@/components/charts/ListingActivities";
import { ConversionsChart } from "@/components/charts/ConversionsChart";
import { useMemo, useState } from "react";
import { useGetPlatformPerformance } from "@/lib/services/admin";
import { Skeleton } from "@/components/ui/skeleton";

const OverviewCard = ({
  title,
  value,
  isLoading,
}: {
  title: string;
  value: string | number;
  isLoading: boolean;
}) => (
  <div className="isolate box-border flex grow flex-col items-start gap-5 rounded-[10px] border border-[#E2E2E2] bg-white">
    <div className="box-border w-full border-b border-[#ECECEC] bg-[#F9F9F9] px-6 pt-6 pb-3">
      <h6 className="text-[12px]/3.5 tracking-[-0.02em] text-[#7F7F7F] uppercase">{title}</h6>
    </div>
    <div className="flex items-baseline gap-2 px-6 pb-6">
      {isLoading ? (
        <Skeleton className="h-12 w-24" />
      ) : (
        <p className="text-[48px]/12 font-semibold tracking-[-1px] text-[#1F2130]">{value}</p>
      )}
      <span className="text-[16px] leading-[22px] text-[#1F2130]">Properties</span>
    </div>
  </div>
);

const KpiCard = ({
  title,
  value,
  isLoading,
}: {
  title: string;
  value: string | number;
  isLoading: boolean;
}) => (
  <div className="isolate box-border flex grow flex-col items-start gap-5 rounded-[10px] border border-[#E2E2E2] bg-white">
    <div className="box-border w-full border-b border-[#ECECEC] bg-[#F9F9F9] px-6 pt-6 pb-3">
      <h6 className="text-[12px]/3.5 tracking-[-0.02em] text-[#7F7F7F] uppercase">{title}</h6>
    </div>
    <div className="flex items-baseline gap-2 px-6 pb-6">
      {isLoading ? (
        <Skeleton className="h-12 w-20" />
      ) : (
        <p className="text-[48px]/12 font-semibold tracking-[-1px] text-[#1F2130]">{value}</p>
      )}
      {/* Change indicator can be added later if API supports it */}
    </div>
  </div>
);

const AdminInsights = () => {
  const [period, setPeriod] = useState("last_6_months");
  const [filter] = useState("all");

  const { data: performanceData, isLoading } = useGetPlatformPerformance({ period, filter });

  const totals = performanceData?.data?.data?.totals;
  const kpis = performanceData?.data?.data?.kpis;
  const listingActivities = performanceData?.data?.data?.listing_activities;
  const conversions = performanceData?.data?.data?.conversions;

  const listingActivitiesData = useMemo(() => {
    if (!listingActivities) return [];
    return listingActivities.labels.map((label: any, index: number) => ({
      name: label,
      "For Sale": listingActivities.series.for_sale[index] || 0,
      "For Rent": listingActivities.series.for_rent[index] || 0,
      "Short Let": listingActivities.series.short_let[index] || 0,
    }));
  }, [listingActivities]);

  const conversionChartData = useMemo(() => {
    if (!conversions) return [];
    return conversions.labels.map((label: any, index: number) => ({
      month: label,
      forSale: conversions.series.for_sale[index] || 0,
      rent: conversions.series.for_rent[index] || 0,
      shortLet: conversions.series.short_let[index] || 0,
    }));
  }, [conversions]);

  return (
    <div className="flex w-full flex-col items-start gap-5 py-8">
      <PageMetaTags
        title="Admin Insights"
        description="Get a comprehensive overview of platform performance, user metrics, and listing activities."
        keywords="admin dashboard, platform analytics, user insights, property trends"
      />
      <header className="flex w-full items-center justify-between gap-2 self-stretch">
        {/* <Select defaultValue={filter} onValueChange={setFilter}>
          <SelectTrigger className="h-10 min-w-[138px] rounded-[45px] border-0 border-[oklch(0.8754_0.0109_286.17)] bg-[#F9F9F9] text-[#41415A] focus:ring-0">
            <div className="flex items-center gap-2">
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Properties</SelectItem>
            <SelectItem value="for-sale">For Sale</SelectItem>
            <SelectItem value="for-rent">For Rent</SelectItem>
          </SelectContent>
        </Select> */}

        {/* <Button
          variant="secondary"
          className="h-8 rounded-[40px] bg-[#F9F9FB] p-4 text-[14px]/5 font-normal text-[#1F2130]"
        >
          Export
          <Download className="size-4" />
        </Button> */}
      </header>

      <section className="grid grid-cols-1 gap-5 self-stretch lg:grid-cols-3">
        <OverviewCard
          title="Total Listings"
          value={totals?.total_listings ?? 0}
          isLoading={isLoading}
        />
        <OverviewCard
          title="Active Listing"
          value={totals?.active_listings ?? 0}
          isLoading={isLoading}
        />
        <OverviewCard
          title="Archived Listing"
          value={totals?.archived_listings ?? 0}
          isLoading={isLoading}
        />
      </section>

      <section className="grid w-full grid-cols-1 gap-6 rounded-lg lg:grid-cols-2">
        <ListingActivities data={listingActivitiesData} isLoading={isLoading} />
        <ConversionsChart data={conversionChartData} period={period} onPeriodChange={setPeriod} />
      </section>

      <section className="grid w-full grid-cols-1 gap-5 self-stretch md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Clicks" value={kpis?.total_clicks ?? 0} isLoading={isLoading} />
        <KpiCard title="Total Leads" value={kpis?.total_leads ?? 0} isLoading={isLoading} />
        <KpiCard title="Total Views" value={kpis?.total_views ?? 0} isLoading={isLoading} />
        <KpiCard
          title="Total Saves & Shares"
          value={kpis?.total_saves_shares ?? 0}
          isLoading={isLoading}
        />
      </section>
    </div>
  );
};

export default AdminInsights;
