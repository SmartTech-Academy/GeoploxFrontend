import { Button } from '@/components/ui/button';
import { ChevronRight, HousePlus } from 'lucide-react';
import { format } from 'date-fns';
import assets from '@/assets';
import { Link } from '@tanstack/react-router';

import { PageMetaTags } from '@/components/page-meta-data';
import { ActiveListingsChart } from '@/components/charts/ActiveListingsChart';

const OVERVIEW = [
  {
    title: 'Total Listings',
    value: '45',
  },
  {
    title: 'Active Listing',
    value: '15',
  },
  {
    title: 'Archived Listing',
    value: '45',
  },
];

const TOTALS = [
  { title: 'Total Clicks', value: '2.04K' },
  { title: 'Total Leads', value: '140' },
  { title: 'Total Views', value: '5.15K' },
  { title: 'Total Saves & shares', value: '565' },
];

const MESSAGES = [
  {
    image: assets.messaging1,
    title: 'Daniel Hamilton',
    message: 'Maybe next week',
    time: '18:34',
  },
  {
    image: assets.messaging2,
    title: 'Stephanie Sharkey',
    message: 'It’s okay. Thanks',
    time: '18:34',
    count: '7',
  },
  {
    image: assets.messaging3,
    title: 'John Dukes',
    message: 'I’ll be there.',
    time: '18:34',
  },
  {
    image: assets.messaging4,
    title: 'Joshua Jones',
    message: 'Okay thanks for the feedback',
    time: '18:34',
    count: '7',
  },
];
const Dashboard = () => {
  return (
    <div className="flex w-full flex-col items-start gap-5 py-8">
      <PageMetaTags
        title="Dashboard Overview"
        description="Your Geoplox dashboard - manage properties, view analytics, and track your real estate portfolio."
        keywords="property dashboard, real estate management"
      />

      <header className="flex w-full items-center justify-between gap-2 self-stretch">
        <div className="flex flex-col items-baseline gap-2">
          <h1 className="text-[18px] leading-[18px] font-semibold text-[#1F2130]">Good Afternoon, Rene</h1>

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
          className="h-10 rounded-[40px] border border-[oklch(0.235_0_0_/_50%)] p-4 text-[12px] leading-[12px] font-normal text-white lg:w-fit"
        >
          <Link to="/properties/create">
            <HousePlus className="size-4" /> New Listing
          </Link>
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
              <span className="text-[16px] leading-[22px] text-[#1F2130]">Properties</span>
            </div>
          </div>
        ))}
      </section>

      <section className="grid w-full gap-6 rounded-[8px] lg:grid-cols-2">
        <ActiveListingsChart />

        <div className="flex w-full items-start gap-12 self-stretch rounded-[8px] border border-[#E3E3E8] bg-white p-6">
          <div className="flex w-full grow flex-col items-start gap-6">
            <header className="flex w-full items-center justify-between gap-6">
              <h3 className="text-[12px] leading-[14px] tracking-[0.02em] text-[#7F7F7F] uppercase">Active Listings</h3>

              <Button variant="link" className="text-primary text-[12px] leading-[14px] font-semibold">
                View All
                <ChevronRight className="size-4 fill-[#D4AF36]" />
              </Button>
            </header>

            <div className="flex w-full flex-col items-start gap-4 self-stretch">
              {MESSAGES.map((item, index) => (
                <div
                  key={index}
                  className="flex w-full items-center justify-between gap-[14px] self-stretch border-b border-[#E3E3E8] pb-4 last:border-b-0"
                >
                  <div className="flex items-center gap-[14px]">
                    <img src={item.image} alt="" className="size-11" width={44} height={44} />
                    <div className="flex flex-col items-start justify-center gap-2.5">
                      <h5 className="text-[14px] leading-[17px] font-semibold text-[#41415A]">{item.title}</h5>

                      <p className="text-[12px] leading-[14px] tracking-[0.01em] text-[#71748C]">{item.message}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-2.5">
                    <p className="text-right text-[12px] leading-[14px] tracking-[0.01em] text-[#71748C]">
                      {item.time}
                    </p>

                    {item.count && (
                      <div className="flex flex-col items-center rounded-full bg-[#D20832] px-2 py-1 text-[10px] leading-[14px] font-semibold text-white">
                        <span className="flex items-center justify-center">{item.count}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Dashboard;
