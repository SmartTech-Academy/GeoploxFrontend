import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, BedDouble, ShowerHead, Square, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import assets from '@/assets';
import { Link } from '@tanstack/react-router';
import { useGetHomepageProperties } from '@/lib/services';
import { Skeleton } from '@/components/ui/skeleton';

interface Property {
  id: string;
  slug: string;
  title: string;
  category: string;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  cover_image: string;
  location: {
    city: string;
    state: string;
  };
}

const formatPrice = (price: number, currency: string) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(price);
};

const getStatusDotColor = (status: string) => {
  switch (status) {
    case 'For Sale':
      return 'bg-[#D20832]';
    case 'For Rent':
      return 'bg-[#0CBA65]';
    case 'Short Let':
      return 'bg-[#1893DD]';
    default:
      return 'bg-gray-400';
  }
};

const PropertyCardSkeleton = () => (
  <div className="flex flex-col items-start gap-6">
    <Skeleton className="h-[284px] w-full" />
    <div className="flex flex-col items-start gap-3 self-stretch">
      <Skeleton className="h-8 w-48" />
      <div className="flex flex-col items-start gap-[11px] self-stretch">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
      </div>
    </div>
  </div>
);

const nextGen = [assets.direct, assets.deluxe, assets.adozollion, assets.cruxstone, assets.etoniru];

const blogs = [
  {
    image: assets.herohouse,
    title: '5 Reasons Serious Buyers Are Switching to Subscription-Based Property Platforms',
    tags: ['Articles', 'Investment'],
    content:
      'In a digital world full of free listings and endless browsing, serious property buyers are beginning to favor quality over quantity. Subscription-based platforms are cutting through the noise by curating only verified listings and offering exclusive access to decision-ready users.',
    dateTime: 'Dec 19, 2024 —  2 min',
  },
  {
    image: assets.trendinghome3,
    title: 'Why Verified Listings Are the Future of Real Estate in Nigeria',
    tags: ['News & Update'],
    content:
      'Nigeria’s real estate market has long been plagued by misinformation, duplicate listings, and unverified agents posing as owners. This has eroded trust and wasted valuable time for buyers and agents alike. As the market matures, platforms that guarantee verified listi',
    dateTime: 'Dec 19, 2024 —  2 min',
  },
  {
    image: assets.trendinghome6,
    title: 'Agents vs Owners: Who Should You Really Be Dealing With When Buying Property?',
    tags: ['Articles'],
    content:
      'While agents have traditionally played a major role in property transactions, many buyers today are questioning whether they add value or just increase complexity. With the rise of direct-to-owner platforms, buyers are gaining faster access, clearer communication, and ',
    dateTime: 'Dec 19, 2024 —  2 min',
  },
];

export function DiscoverSection() {
  const [activeTab, setActiveTab] = useState('Trending Homes');
  const { data: propertyResponse, isPending: isLoadingProperties } = useGetHomepageProperties();
  const tabs = [
    { name: 'Trending Homes', icon: '🔥' },
    { name: 'All Homes', icon: '' },
    { name: 'Duplexes', icon: '' },
    { name: 'Luxury Villas', icon: '' },
  ];

  const propertyData = propertyResponse?.data.data;

  const tabKeyMap: { [key: string]: keyof typeof propertyData } = {
    'Trending Homes': 'trending_homes',
    'All Homes': 'all_homes',
    Duplexes: 'duplexes',
    'Luxury Villas': 'luxury_villas',
  };

  const currentProperties = propertyData ? propertyData[tabKeyMap[activeTab]] : [];

  return (
    <div className="w-full">
      <section className="w-full">
        {/* Discover Section - Dark Background */}
        <div className="w-full bg-white px-5 py-16">
          <div className="mx-auto flex w-full max-w-full flex-col items-center gap-12 text-center lg:max-w-[542px]">
            <h2 className="inline-block gap-1 text-[42px] leading-[59px] text-[#1F2130]">
              Discover Verified Homes
              <br />
              that <span className="text-[#D4AF36] italic">Defines Elegance</span>
            </h2>

            {/* Tabs */}
            <div className="w-full overflow-hidden rounded-xl border border-[#F1F1F4] bg-white p-1.5">
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
                    className={`h-[33px] flex-shrink-0 rounded-[6px] px-3 py-[11px] text-[18px] leading-[21px] whitespace-nowrap text-[#41415A] transition-all duration-300 ease-in-out ${
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
        </div>

        {/* Trending Homes Section - White Background */}
        <div className="w-full bg-[#21242E] py-16">
          <div className="landing-container flex flex-col items-center gap-[80px] self-stretch">
            <div className="flex w-full flex-col items-center gap-12 self-stretch">
              <div className="flex flex-col items-center gap-3 text-center">
                <h3 className="text-[36px] leading-[41px] text-[#D4AF36]">{activeTab} around you</h3>
                <p className="text-primary-foreground text-[20px] leading-6">
                  Viewed and saved the most in the area over the past 24 hours
                </p>
              </div>

              {/* Property Grid */}
              {isLoadingProperties ? (
                <div className="grid w-full grid-cols-1 gap-x-5 gap-y-10 self-stretch md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <PropertyCardSkeleton key={index} />
                  ))}
                </div>
              ) : (
                <div className="grid w-full grid-cols-1 gap-x-5 gap-y-10 self-stretch md:grid-cols-2 lg:grid-cols-3">
                  {currentProperties?.map((property: Property) => (
                    <Link
                      to={`/buy/$id`}
                      params={{ id: property.slug }}
                      key={property.id}
                      className="flex flex-col items-start gap-6 overflow-hidden transition-shadow hover:shadow-lg"
                    >
                      <div className="relative">
                        <img
                          src={property.cover_image || '/placeholder.png'}
                          alt={property.title}
                          width={397}
                          height={284}
                          className="h-[284.42px] w-full object-cover"
                        />

                        <Badge
                          className={cn(
                            'absolute top-4 left-4 h-[25px] rounded border border-[oklch(0.5931_0_0_/_30%)] bg-white px-2 py-0.5 text-[14px] leading-[21px] font-normal text-[#0B0B0D]'
                          )}
                        >
                          <div className={cn('size-1.5 rounded-full', getStatusDotColor(property.category))} />
                          {property.category}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-4 right-4 bg-transparent hover:bg-transparent"
                        >
                          <Heart className="size-6 text-white" />
                        </Button>
                      </div>
                      <div className="flex flex-col items-start gap-3">
                        <h4 className="font-dm_sans text-[24px] leading-[31px] font-semibold text-white">
                          {formatPrice(property.price, property.currency)}
                        </h4>
                        <div className="flex flex-col items-start gap-[11px] self-stretch">
                          <p className="text-primary-foreground text-[16px] leading-[18px]">
                            {property.location.city}, {property.location.state}
                          </p>

                          <div className="flex items-end gap-3 self-stretch">
                            <div className="text-primary-foreground flex items-center gap-5 text-[14px] leading-4">
                              <div className="flex items-center gap-2">
                                <BedDouble className="size-[18px] text-white" />
                                <span>{property.bedrooms} Beds</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <ShowerHead className="size-[18px] text-white" />
                                <span>{property.bathrooms} Baths</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Square className="size-[18px] text-white" />
                                <span>{property.area_sqft.toLocaleString()} sqft</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Explore Listing Button */}
              <div className="flex flex-col items-start gap-2 py-6 text-center">
                <Button
                  asChild
                  className="min-w-[181px]] bg-secondary-foreground h-12 rounded-[40px] px-6 py-[15px] text-[16px] leading-[19px] font-semibold text-white hover:bg-gray-800"
                >
                  <Link to="/buy">
                    Explore Listing <ChevronRight className="size-4 fill-white" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* next gen */}
      <section className="w-full bg-white py-16">
        <div className="lg:landing-container flex flex-col items-center lg:gap-[104px]">
          <div className="mx-auto flex w-full max-w-[849px] flex-col gap-[23px] px-5 text-center lg:px-0">
            <h2 className="text-[42px] leading-[59px] text-[#1F2130]">Next-Gen Data for Next Level Deals</h2>

            <p className="text-[20px] leading-7 text-[#41415A]">
              Whether you’re looking for your next home, scouting investment properties, or sourcing deals for clients —
              this platform gives you the edge.
            </p>
          </div>

          <div className="flex w-full flex-col items-center gap-16">
            <div className="flex flex-col items-center gap-14 lg:flex-row">
              {nextGen.map((item, index) => (
                <img
                  key={index}
                  src={item}
                  alt={`gen${index}`}
                  width={180}
                  height={100}
                  className="h-[100px] w-[180px] object-cover transition-all duration-300 ease-in-out hover:scale-105"
                />
              ))}
            </div>
          </div>

          <div className="relative w-full bg-[oklch(0.7898_0.1514_90.07_/_20%)] pt-24 lg:min-h-[595px] lg:rounded-r-[13px] lg:pt-0">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${assets.yellowbackground})`,
              }}
            >
              <div className="absolute inset-0 bg-[oklch(0.7898_0.1514_90.07_/_20%)]/20" />
            </div>

            <div className=";lg:pl-10 relative z-10 flex w-full flex-col items-center justify-between gap-[95px] rounded-[13px] pr-5 pl-5 lg:flex-row lg:pr-0">
              <div className="flex h-auto flex-col items-start gap-10 lg:w-[521px] lg:shrink-0">
                <div className="flex flex-col items-start gap-[13px]">
                  <h3 className="text-[44px] leading-[62px] text-[#1F2130]">Ready to Find Real Property?</h3>

                  <p className="self-stretch text-[20px] leading-7 text-[#41415A]">
                    Start your 7-day free trial and access Nigeria’s most trusted real estate listings — full property
                    details, high-quality photos, direct contact info, and more
                  </p>
                </div>

                <div className="flex flex-col items-start gap-6 self-stretch">
                  <Button
                    style={{
                      background: ' linear-gradient(180deg, #787878 0%, #1E1E1E 60%)',
                      boxShadow: ' 0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
                    }}
                    className="h-12 rounded-[40px] border border-[oklch(0.235_0_0/50%)] px-6 py-4 text-[16px] leading-[19px] font-semibold text-white"
                  >
                    Start Trial Now
                  </Button>

                  <span className="self-stretch text-[14px] leading-5 text-[#41415A]">
                    No card required. Cancel any time.
                  </span>
                </div>
              </div>
              <img
                alt="group"
                src={assets.realproperties}
                width={554.26}
                height={668.98}
                className="h-full object-contain lg:rounded-r-[13px]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="flex w-full bg-white py-16">
        <div className="landing-container flex w-full flex-col gap-6 lg:gap-0">
          <div className="flex w-full grow items-center justify-between gap-6">
            <h3 className="self-stretch text-[54px] leading-[65px] text-black">Stay Informed</h3>

            <Button
              asChild
              variant="ghost"
              className="hidden h-12 rounded-[40px] bg-[#F9F9F9] px-6 py-[15px] text-[16px] leading-[19px] font-semibold text-[#1F2130] lg:inline-flex"
            >
              <Link to="/blog">
                View all Articles
                <ChevronRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="flex w-full flex-col self-stretch border-b border-[#ECECEC] bg-white py-6">
            <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
              {blogs.map((blog, index) => (
                <Link
                  to="/blog/$id"
                  params={{ id: String(index) }}
                  key={index}
                  className="flex grow flex-col items-start gap-[19px]"
                >
                  <img
                    className="h-[229px] w-full rounded-t-[8px]"
                    src={blog.image}
                    alt="blog"
                    width={394}
                    height={229}
                  />

                  <div className="flex flex-col items-start gap-4 self-stretch">
                    <div className="flex items-start gap-2">
                      {blog.tags.map((tag, index) => (
                        <div
                          key={index}
                          className="bg-[ flex h-[25px] items-center justify-center rounded bg-[oklch(0.7665_0.1393_91.15_/_5%)] px-2 py-0.5 text-[14px] leading-[21px] text-[#D4AF36]"
                        >
                          {tag}
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col items-start gap-3 self-stretch">
                      <h5 className="self-stretch text-[16px] leading-6 font-semibold tracking-[-0.15px] text-[#0B0B0D]">
                        {blog.title}
                      </h5>

                      <p className="line-clamp-2 text-[14px] leading-6 tracking-[-0.14px] text-[#6C7574]">
                        {blog.content}
                      </p>
                    </div>

                    <span className="text-[10px] leading-[11px] tracking-[0.88px] text-[#0B0B0D] uppercase">
                      {blog.dateTime}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <Button
            variant="ghost"
            className="h-12 rounded-[40px] bg-[#F9F9F9] px-6 py-[15px] text-[16px] leading-[19px] font-semibold text-[#1F2130] lg:hidden"
          >
            View all Articles
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
