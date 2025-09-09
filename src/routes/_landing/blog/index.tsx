import assets from '@/assets';
import { PageMetaTags } from '@/components/page-meta-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/_landing/blog/')({
  component: RouteComponent,
});

const tabs = [
  { name: 'All Posts', icon: '' },
  { name: 'Market Trends', icon: '' },
  { name: 'Developer News', icon: '' },
  { name: 'Buying Guides', icon: '' },
  { name: 'Avg. Property Price', icon: '' },
];

const BLOGS = [
  {
    date: 'Sunday, February 12, 2023',
    title: 'How to position your team for success',
    text: 'In this article, we provide three tips on how we position our team for success consolidated in the 3 C’s framework',
    image: assets.blog1,
  },
  {
    date: 'Sunday, February 12, 2023',
    title: 'How to position your team for success',
    text: 'In this article, we provide three tips on how we position our team for success consolidated in the 3 C’s framework',
    image: assets.blog2,
  },
  {
    date: 'Sunday, February 12, 2023',
    title: 'How to position your team for success',
    text: 'In this article, we provide three tips on how we position our team for success consolidated in the 3 C’s framework',
    image: assets.blog3,
  },
  {
    date: 'Sunday, February 12, 2023',
    title: 'How to position your team for success',
    text: 'In this article, we provide three tips on how we position our team for success consolidated in the 3 C’s framework',
    image: assets.blog4,
  },
  {
    date: 'Sunday, February 12, 2023',
    title: 'How to position your team for success',
    text: 'In this article, we provide three tips on how we position our team for success consolidated in the 3 C’s framework',
    image: assets.blog5,
  },
];

function RouteComponent() {
  const [activeTab, setActiveTab] = useState('All Posts');
  return (
    <div className="w-full">
      <PageMetaTags
        title="Real Estate Blog"
        description="Get expert insights on Nigerian real estate market, investment tips, and property trends."
        keywords="real estate blog Nigeria, property investment tips, real estate news"
      />
      <section className="relative flex min-h-[700px] items-center justify-start">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${assets.bloghero})`,
          }}
        >
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Content */}
        <div className="landing-container relative z-10 w-full py-(--landing-header-height)">
          <div className="flex w-full flex-col items-start gap-[42px]">
            <div className="flex max-w-[639px] flex-col items-start gap-[17px]">
              <div className="flex flex-col items-start gap-[9px]">
                {/* Main Heading */}
                <h1 className="text-[66px] leading-[79px] font-semibold tracking-[-0.02em] text-balance text-[#D4AF36]">
                  Geoplox Blog
                </h1>
              </div>

              {/* Subheading */}
              <p className="text-primary-foreground text-[20px] leading-[28px]">
                Updates about current market trends and news
              </p>
            </div>

            <div className="flex w-full max-w-[817px] grow flex-col gap-3">
              {/* Search Interface */}
              <div className="flex w-full max-w-[817px] items-center gap-3 rounded-[32px] bg-[oklch(1_0_0_/_50%)] p-4 backdrop-blur-[12px]">
                <div className="relative flex flex-1 items-center gap-2">
                  <Input
                    type="email"
                    placeholder="Enter email"
                    className="h-10 rounded-[85px] border border-[#D5D5DD] bg-white py-[14px] text-base text-gray-900 placeholder:text-gray-500 focus-visible:ring-0"
                  />
                </div>

                <Button
                  style={{
                    background: 'linear-gradient(180deg, #505050 0%, #1E1E1E 60%)',
                    border: '1px solid rgba(30, 30, 30, 0.5)',
                    boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
                  }}
                  className="flex h-10 items-center justify-center rounded-[40px] p-4 text-[14px] leading-[17px] font-semibold text-white"
                >
                  Subscribe
                </Button>
              </div>

              <p className="text-[14px] leading-[20px] text-white">
                Subscribe to our monthly newsletter. You can unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex w-full flex-col gap-[64px] bg-white py-16">
        <div className="mx-auto flex w-full max-w-[719px] flex-col items-center text-center">
          <div className="w-full overflow-hidden rounded-[8px] border border-[#F1F1F4] bg-white p-1.5">
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
        </div>
        <div className="landing-container flex w-full flex-col gap-[64px]">
          {BLOGS.map((blog, index) => (
            <Link
              to="/blog/$id"
              params={{ id: String(index) }}
              key={index}
              className="flex flex-col-reverse items-center justify-center gap-10 lg:flex-row"
            >
              <div className="flex flex-col items-start lg:w-1/2">
                <div className="flex flex-col gap-6 self-stretch">
                  <div className="flex items-center gap-3">
                    <span className="text-[15px] leading-[20px] tracking-[-0.12px] text-[#060809]">Market Trends</span>
                    <span className="text-[15px] leading-[20px] tracking-[-0.12px] text-[#7B828E]">{blog.date}</span>
                  </div>

                  <div className="flex flex-col gap-8 self-stretch pb-8">
                    <h4 className="text-[28px] leading-[34px] font-semibold tracking-[-0.39px] text-black">
                      {blog.title}
                    </h4>

                    <p className="line-clamp-2 text-[15px] leading-[20px] tracking-[-0.12px] text-[#060809]">
                      {blog.text}
                    </p>
                  </div>
                </div>
              </div>

              <img src={blog.image} width={573} height={294} alt="art" className="h-auto lg:w-1/2" />
            </Link>
          ))}

          <div className="flex items-center justify-center">
            <Button
              className="h-12 rounded-[40px] bg-[#F9F9F9] px-6 py-[15px] text-[16px] leading-[19px] font-semibold text-[#1F2130]"
              variant="secondary"
            >
              Load More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
