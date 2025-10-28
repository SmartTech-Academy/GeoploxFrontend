import { Button } from '@/components/ui/button';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Check } from 'lucide-react';
import assets from '@/assets';
import { PageMetaTags } from '@/components/page-meta-data';
import LoadingFallback from '@/components/loading-fallback';
import { useGetPlans } from '@/lib/services';

export const Route = createFileRoute('/_landing/pricing/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [activeTab, setActiveTab] = useState('Monthly');
  const { data: plansResponse, isPending: isLoadingPlans } = useGetPlans();

  const plansData = plansResponse?.data.data;
  const plans = plansData ? [plansData.basic, plansData.premium, plansData.enterprise] : [];

  const tabs = [
    { name: 'Monthly', icon: '' },
    { name: 'Annually', icon: '' },
  ];

  // Show loading state
  if (isLoadingPlans) {
    return <LoadingFallback />;
  }

  // Helper function to get button text for each plan
  const getButtonText = (planName: string) => {
    if (planName === 'Basic') return 'Free for 14 days';
    if (planName === 'Premium') return 'Get Premium';
    return 'Get Enterprise';
  };

  // Helper function to get card styling
  const getCardStyle = (isRecommended: boolean) => {
    if (isRecommended) {
      return {
        className:
          'relative flex grow flex-col justify-between gap-6 rounded-xl border-[0.6px] border-[#EFE1B5] bg-[#F8F2DF] px-7 py-8',
        style: { backdropFilter: 'blur(3px)' },
      };
    }
    return {
      className: 'flex grow flex-col justify-between gap-6 rounded-xl border-[0.6px] border-[#D8D8D8] px-7 py-8',
      style: { backdropFilter: 'blur(3px)' },
    };
  };

  // Helper function to get button styling
  const getButtonStyle = (planName: string) => {
    if (planName === 'Premium') {
      return {
        style: {
          background: 'linear-gradient(180deg, #505050 0%, #1E1E1E 60%)',
          boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
        },
        className:
          'h-10 w-full rounded-[40px] border border-[oklch(0.235_0_0/50%)] p-4 text-[14px] leading-[17px] font-semibold text-white',
      };
    }
    return {
      style: {
        background: 'linear-gradient(180deg, #D4AF36 0%, #B69118 60%)',
        boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
      },
      className: `h-10 w-full rounded-[40px] border border-[oklch(0.7665_0.1393_91.15/50%)] p-4 text-[14px] leading-[17px] font-semibold text-white hover:bg-[#A0750A] ${
        planName === 'Enterprise' ? 'mt-16' : ''
      }`,
    };
  };

  return (
    <div className="min-h-screen w-full bg-white pt-(--landing-header-height)">
      <PageMetaTags
        title="Pricing Plans"
        description="Transparent pricing for property listings. Choose the plan that works best for your real estate needs."
        keywords="property listing fees, real estate pricing, geoplox plans"
      />
      <section className="landing-container flex w-full flex-col gap-8 py-[77px]">
        <div className="flex w-full flex-col items-center gap-14">
          <div className="mx-auto flex w-full max-w-[748px] flex-col items-center gap-10 lg:gap-14">
            <h1 className="text-[40px] font-semibold tracking-[-0.02em] text-[#1F2130] lg:text-[66px] lg:leading-[79px]">
              Ready to Get Started?
            </h1>

            <p className="text-[18px] leading-[25px] tracking-[0.01em] text-[#71748C]">
              Our pricing plans are designed to be affordable, flexible, and tailored to fit needs.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#F1F1F4] bg-white p-1.5">
            <div className="scrollbar-hide flex w-full items-center gap-3 overflow-x-auto">
              {tabs.map((tab) => (
                <Button
                  key={tab.name}
                  style={{
                    boxShadow:
                      activeTab === tab.name
                        ? '0px 0px 10px rgba(31, 33, 48, 0.06), 0px 1px 1px rgba(31, 33, 48, 0.25), inset 0px 2px 1px rgba(255, 255, 255, 0.7)'
                        : 'none',
                  }}
                  variant={activeTab === tab.name ? 'default' : 'outline'}
                  className={`h-[33px] rounded-[6px] px-3 py-[11px] text-[18px] leading-[21px] text-[#41415A] transition-all duration-300 ease-in-out ${
                    activeTab === tab.name
                      ? 'border border-[#D5D5DD] bg-white font-semibold hover:bg-gray-100'
                      : 'border-none bg-[#F9F9FB] font-normal hover:bg-white hover:text-black'
                  }`}
                  onClick={() => setActiveTab(tab.name)}
                >
                  {tab.name} {tab.icon}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid w-full gap-7 lg:grid-cols-3">
            {plans.map((plan) => {
              const cardStyle = getCardStyle(plan.is_recommended);
              const buttonStyle = getButtonStyle(plan.name);

              return (
                <div key={plan.id} style={cardStyle.style} className={cardStyle.className}>
                  {/* Recommended Badge */}
                  {plan.is_recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                      <div className="rounded-full bg-[#1F2130] px-4 py-1 text-[12px] font-medium text-white">
                        Recommended
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col items-start gap-5">
                    <h3 className="text-[20px] leading-7 font-semibold text-[#1F2130]">{plan.name} Plan</h3>

                    {plan.name === 'Basic' ? (
                      <span className="text-[32px] leading-[45px] font-semibold text-[#1F2130]">{plan.price}</span>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-[32px] leading-[45px] font-semibold text-[#1F2130]">
                          {plan.price.split('/')[0]}
                        </span>
                        <span className="text-[16px] leading-[22px] text-[#71748C]">/{plan.price.split('/')[1]}</span>
                      </div>
                    )}

                    <div className="flex flex-1 flex-col gap-4">
                      {plan.features.map((feature: string) => (
                        <div key={feature} className="flex items-center gap-4">
                          <Check className="size-4 flex-shrink-0 text-[#D4AF36]" />
                          <span className="text-[14px] leading-5 text-[#71748C]">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button style={buttonStyle.style} className={buttonStyle.className}>
                    {getButtonText(plan.name)}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative min-h-[527px] w-full rounded-[13px] bg-[oklch(0.7898_0.1514_90.07_/_20%)] py-5 lg:py-[106px]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${assets.yellowbackground})`,
          }}
        >
          <div className="absolute inset-0 bg-[oklch(0.7898_0.1514_90.07_/_20%)]/20" />
        </div>
        <div className="landing-container relative z-10 flex w-full flex-col items-center justify-center gap-10 lg:flex-row">
          <div className="flex grow flex-col items-start gap-10 lg:w-1/2">
            <div className="flex flex-col items-start gap-[13px]">
              <h4 className="text-[44px] leading-[62px] text-[#1F2130]">Ready to Find Real Property?</h4>

              <p className="text-[20px] leading-7 text-[#41415A]">
                Start your 7-day free trial and access Nigeria&apos;s most trusted real estate listings — full property
                details, high-quality photos, direct contact info, and more
              </p>
            </div>

            <div className="flex flex-col items-start gap-6 self-stretch">
              <Button
                style={{
                  background: 'linear-gradient(180deg, #787878 0%, #1E1E1E 60%)',
                  boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
                }}
                className="h-12 rounded-[40px] border border-[oklch(0.235_0_0/50%)] px-6 py-4 text-[16px] leading-[19px] font-semibold text-white"
              >
                Start Trial Now
              </Button>

              <span className="text-[14px] leading-5 text-[#41415A]">No card required. Cancel any time.</span>
            </div>
          </div>

          <img className="h-auto lg:w-1/2" src={assets.africanfamily} alt="family" width={573.58} height={294.28} />
        </div>
      </section>
    </div>
  );
}
