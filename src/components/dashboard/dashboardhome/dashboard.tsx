import { Button } from '@/components/ui/button';
import { ChevronRight, HousePlus } from 'lucide-react';
import { format, formatDistanceToNow, parseISO } from 'date-fns';

import { Link } from '@tanstack/react-router';

import { PageMetaTags } from '@/components/page-meta-data';
import { ActiveListingsChart } from '@/components/charts/ActiveListingsChart';
import { useGetProfileData } from '@/lib/services/profile';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useMemo, useState } from 'react';
import { useGetDashboardOverview } from '@/lib/services/dashboard';
import { toast } from 'sonner';

interface RecentMessage {
  conversation_id: number;
  last_message: {
    id: number;
    body: string;
    sender: {
      id: number;
      name: string;
      avatar: string;
    };
    created_at: string;
  };
  is_unread: boolean;
}

const Dashboard = () => {
  const { data: profileData, isLoading: isProfileLoading } = useGetProfileData();
  const [period, setPeriod] = useState('last_6_months');
  const { data: dashboardData, isLoading: isDashboardLoading } = useGetDashboardOverview(period);

  const userName = useMemo(() => {
    if (profileData) {
      return `${profileData?.firstname || ''} ${profileData?.lastname || ''}`.trim();
    }
    return 'User';
  }, [profileData]);

  const overviewCards = [
    { title: 'Total Listings', value: dashboardData?.data.data?.cards?.totalListings ?? 0 },
    { title: 'Active Listing', value: dashboardData?.data.data?.cards?.activeListings ?? 0 },
    { title: 'Archived Listing', value: dashboardData?.data.data?.cards?.archivedListings ?? 0 },
  ];

  const totalsCards = [
    { title: 'Total Clicks', value: dashboardData?.data.data?.cards?.totalClicks ?? 0 },
    { title: 'Total Leads', value: dashboardData?.data.data?.cards?.totalLeads ?? 0 },
    { title: 'Total Views', value: dashboardData?.data.data?.cards?.totalViews ?? 0 },
    { title: 'Total Saves & shares', value: dashboardData?.data.data?.cards?.totalSavesShares ?? 0 },
  ];

  const recentMessages = dashboardData?.data?.data?.recentMessages ?? [];
  const listingActivities = dashboardData?.data.data?.data?.listingActivities ?? [];
  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  const isLoading = isProfileLoading || isDashboardLoading;

  useEffect(() => {
    if (dashboardData?.data?.data?.Dashboard_Warning_Message) {
      const toastId = toast.info(dashboardData?.data?.data?.Dashboard_Warning_Message, {
        action: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(toastId), // dismisses the toast
        },
        duration:Infinity,
      });

    }
  }, [dashboardData]);

  return (
    <div className="flex w-full flex-col items-start gap-5 py-8">
      <PageMetaTags
        title="Dashboard Overview"
        description="Your Geoplox dashboard - manage properties, view analytics, and track your real estate portfolio."
        keywords="property dashboard, real estate management"
      />

      <header className="flex w-full flex-wrap items-center justify-between gap-2 self-stretch">
        <div className="flex flex-col items-baseline gap-2">
          <h1 className="flex items-center gap-2 text-[18px] leading-[18px] font-semibold text-[#1F2130]">
            <span>Good Afternoon,</span>
            {isLoading ? <Skeleton className="h-5 w-32" /> : <span>{userName}</span>}
          </h1>

          <p className="text-[12px] leading-[17px] tracking-[-0.01em] text-[#71748C]">
            {format(new Date(), 'EEEE, MMMM d')}
          </p>
        </div>

        <Button
          asChild
          style={{
            background: 'linear-gradient(180deg, #505050 0%, #1E1E1E 60%)',
            boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
          }}
          className="h-10 rounded-[40px] border border-[oklch(0.235_0_0/50%)] p-4 text-[12px]/3  font-normal text-white lg:w-fit"
        >
          <Link to="/properties/create">
            <HousePlus className="size-4" /> New Listing
          </Link>
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
                <div className="box-border w-full rounded-t-[10px] border-b border-[#ECECEC] bg-[#F9F9F9] px-6 pt-6 pb-3">
                  <h6 className="text-[12px]/3.5  tracking-[-0.02em] text-[#7F7F7F] uppercase">{item.title}</h6>
                </div>

                <div className="flex items-baseline gap-2 px-6 pb-6">
                  <p className="text-[48px]/12  font-semibold tracking-[-1px] text-[#1F2130]">{item.value}</p>
                  <span className="text-[16px] leading-[22px] text-[#1F2130]">Properties</span>
                </div>
              </div>
            ))}
      </section>

      <section className="grid w-full gap-6 rounded-xl lg:grid-cols-2">
        <ActiveListingsChart data={listingActivities} period={period} onPeriodChange={setPeriod} />

        <div className="flex w-full items-start gap-12 self-stretch rounded-xl border border-[#E3E3E8] bg-white p-6">
          <div className="flex w-full grow flex-col items-start gap-6">
            <header className="flex w-full items-center justify-between gap-6">
              <h3 className="text-[12px]/3.5  tracking-[0.02em] text-[#7F7F7F] uppercase">Recent Messages</h3>

              <Button asChild variant="link" className="text-[12px] leading-3.5 font-semibold text-primary">
              <Link to="/messages" >
              View All
                <ChevronRight className="size-4 fill-[#D4AF36]" />
              </Link>

              </Button>
            </header>

            <div className="flex w-full flex-col items-start gap-4 self-stretch">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex w-full items-center gap-4">
                    <Skeleton className="size-11 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))
              ) : recentMessages.length > 0 ? (
                recentMessages.map((item: RecentMessage) => (
                  <div
                    key={item.conversation_id}
                    className="flex w-full items-center justify-between gap-3.5 self-stretch border-b border-[#E3E3E8] pb-4 last:border-b-0"
                  >
                    <div className="flex w-full items-center gap-3.5">
                      <img src={item.last_message.sender.avatar} alt="" className="size-11" width={44} height={44} />
                      <div className="flex w-full flex-col items-start justify-center gap-2.5">
                        <div className="flex w-full items-center justify-between">
                          <h5 className="text-[14px] leading-[17px] font-semibold text-[#41415A]">
                            {item.last_message.sender.name}
                          </h5>
                          <div className="flex items-center justify-center gap-2.5">
                            <p className="text-right text-[12px]/3.5  tracking-[0.01em] whitespace-nowrap text-[#71748C]">
                              {formatTime(item.last_message.created_at)}
                            </p>
                            {item.is_unread && <div className="size-2 rounded-full bg-[#D20832]" />}
                          </div>
                        </div>

                        <p className="max-w-72 truncate text-[12px]/3.5  tracking-[0.01em] text-[#71748C]">
                          {item.last_message.body}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-10 text-center text-sm text-gray-500">No recent messages.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="grid w-full grid-cols-1 gap-5 self-stretch lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-[150px] w-full" />)
          : totalsCards.map((item, index) => (
              <div
                key={index}
                className="isolate box-border flex grow flex-col items-start gap-5 rounded-[10px] border border-[#E2E2E2] bg-white"
              >
                <div className="box-border w-full rounded-t-[10px] border-b border-[#ECECEC] bg-[#F9F9F9] px-6 pt-6 pb-3">
                  <h6 className="text-[12px]/3.5  tracking-[-0.02em] text-[#7F7F7F] uppercase">{item.title}</h6>
                </div>
                <div className="flex items-baseline gap-2 px-6 pb-6">
                  <p className="text-[48px]/12  font-semibold tracking-[-1px] text-[#1F2130]">{item.value}</p>
                </div>
              </div>
            ))}
      </section>
    </div>
  );
};

export default Dashboard;
