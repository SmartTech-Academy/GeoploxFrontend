import { PageMetaTags } from "@/components/page-meta-data";
import ListingActivities from "@/components/charts/ListingActivities";
import { ConversionsChart } from "@/components/charts/ConversionsChart";
import { useMemo, useState } from "react";
import { useGetPlatformPerformance } from "@/lib/services/admin";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [filter, setFilter] = useState("all");

  const {
    data: performanceData,
    isLoading,
    isError,
  } = useGetPlatformPerformance({ period, filter });

  const normalizedData = useMemo(() => {
    const payload = performanceData?.data?.data;
    if (!payload) return null;

    const nestedPayload = payload.data && typeof payload.data === "object" ? payload.data : payload;

    return {
      totals: payload.totals || nestedPayload.totals || nestedPayload.cards,
      kpis: payload.kpis || nestedPayload.kpis || nestedPayload.cards,
      listingActivities:
        payload.listing_activities ||
        nestedPayload.listing_activities ||
        nestedPayload.listingActivities,
      conversions: payload.conversions || nestedPayload.conversions,
    };
  }, [performanceData]);

  const totals = normalizedData?.totals;
  const kpis = normalizedData?.kpis;
  const listingActivities = normalizedData?.listingActivities;
  const conversions = normalizedData?.conversions;

  const listingActivitiesData = useMemo(() => {
    if (!listingActivities) return [];
    if (Array.isArray(listingActivities)) {
      return listingActivities.map((item: any) => ({
        name: item.month,
        "For Sale": item.forSale || item.for_sale || 0,
        "For Rent": item.forRent || item.rent || item.for_rent || 0,
        "Short Let": item.shortLet || item.short_let || 0,
      }));
    }

    return listingActivities.labels.map((label: any, index: number) => ({
      name: label,
      "For Sale": listingActivities.series.for_sale?.[index] || 0,
      "For Rent": listingActivities.series.for_rent?.[index] || 0,
      "Short Let": listingActivities.series.short_let?.[index] || 0,
    }));
  }, [listingActivities]);

  const conversionChartData = useMemo(() => {
    if (!conversions) return [];
    if (Array.isArray(conversions)) {
      return conversions.map((item: any) => ({
        month: item.month,
        forSale: item.forSale || item.for_sale || 0,
        rent: item.forRent || item.rent || item.for_rent || 0,
        shortLet: item.shortLet || item.short_let || 0,
      }));
    }

    return conversions.labels.map((label: any, index: number) => ({
      month: label,
      forSale: conversions.series.for_sale?.[index] || 0,
      rent: conversions.series.for_rent?.[index] || 0,
      shortLet: conversions.series.short_let?.[index] || 0,
    }));
  }, [conversions]);

  return (
    <div className="flex w-full flex-col items-start gap-5 py-8">
      <PageMetaTags
        title="Admin Insights"
        description="Get a comprehensive overview of platform performance, user metrics, and listing activities."
        keywords="admin dashboard, platform analytics, user insights, property trends"
      />
      {isError && (
        <div className="w-full rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-600">
          Failed to load platform performance data. Please refresh the page.
        </div>
      )}
      <header className="flex w-full items-center justify-between gap-2 self-stretch">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="h-10 min-w-[138px] rounded-[45px] border-0 border-[oklch(0.8754_0.0109_286.17)] bg-[#F9F9F9] text-[#41415A] focus:ring-0">
            <div className="flex items-center gap-2">
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Properties</SelectItem>
            <SelectItem value="for-sale">For Sale</SelectItem>
            <SelectItem value="for-rent">For Rent</SelectItem>
            <SelectItem value="shortlet">Short Let</SelectItem>
          </SelectContent>
        </Select>
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
        <ListingActivities
          data={listingActivitiesData}
          isLoading={isLoading}
          period={period}
          onPeriodChange={setPeriod}
        />
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
