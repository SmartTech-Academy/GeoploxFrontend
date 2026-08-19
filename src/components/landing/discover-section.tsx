import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BedDouble, ShowerHead, Square, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import assets from "@/assets";
import { Link } from "@tanstack/react-router";
import { useGetHomepageProperties } from "@/lib/services";
import { useInfiniteWpPosts } from "@/lib/services/wpBlog";
import { Skeleton } from "@/components/ui/skeleton";
import { LazyImage } from "@/components/ui/lazy-image";
import { excerptFromHtml } from "@/lib/utils";
import { toAbsoluteBlogUrl } from "@/lib/wpGraphql";
import { format } from "date-fns";
import { FavoriteButton } from "@/components/favorite-button";
import type { ListingCategorySlug } from "@/lib/url-grammar";

// "Explore Listing" CTA below points at the search/listing page for this category, which now
// lives at the new grammar URL - unlike getPropertyBasePath() further down, which still points
// individual property cards at their (unchanged) detail-page URLs.
const getListingPagePath = (category?: string): ListingCategorySlug => {
  switch (category?.toLowerCase()) {
    case "for rent":
      return "property-for-rent";
    case "short let":
      return "property-for-short-let";
    case "joint venture":
      return "joint-venture";
    case "for sale":
    default:
      return "property-for-sale";
  }
};

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
  is_favourited?: boolean;
  location: {
    city: string;
    state: string;
  };
}

const getPropertyBasePath = (category?: string) => {
  switch (category?.toLowerCase()) {
    case "for rent":
      return "/for-rent";
    case "short let":
      return "/short-let";
    case "joint venture":
      return "/joint-venture";
    case "for sale":
    default:
      return "/for-sale";
  }
};

const formatPrice = (price: number, currency: string) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).format(price);
};

const getStatusDotColor = (status: string) => {
  switch (status) {
    case "For Sale":
      return "bg-[#D20832]";
    case "For Rent":
      return "bg-[#0CBA65]";
    case "Short Let":
      return "bg-[#1893DD]";
    default:
      return "bg-gray-400";
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

const slugFromUri = (uri: string) => uri.replace(/^\/+|\/+$/g, "");

export function DiscoverSection() {
  const [activeTab, setActiveTab] = useState("Trending Homes");
  const { data: propertyResponse, isPending: isLoadingProperties } = useGetHomepageProperties();
  const postsQuery = useInfiniteWpPosts(3);
  const tabs = [
    { name: "Trending Homes", icon: "🔥" },
    { name: "All Homes", icon: "" },
    { name: "Duplexes", icon: "" },
    { name: "Luxury Villas", icon: "" },
  ];

  const propertyData = propertyResponse?.data.data;

  const tabKeyMap: { [key: string]: keyof typeof propertyData } = {
    "Trending Homes": "trending_homes",
    "All Homes": "all_homes",
    Duplexes: "duplexes",
    "Luxury Villas": "luxury_villas",
  };

  const currentProperties = propertyData ? propertyData[tabKeyMap[activeTab]] : [];
  const exploreListingPath = `/${
    currentProperties?.[0] ? getListingPagePath(currentProperties[0].category) : "property-for-sale"
  }`;
  const blogPosts = (postsQuery.data?.pages.flatMap((page) => page.nodes) ?? []).slice(0, 3);

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
              <div className="flex w-full items-center gap-3 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {tabs.map((tab) => (
                  <Button
                    key={tab.name}
                    style={{
                      boxShadow:
                        activeTab === tab.name
                          ? "0px 0px 10px rgba(31, 33, 48, 0.06), 0px 1px 1px rgba(31, 33, 48, 0.25), inset 0px 2px 1px rgba(255, 255, 255, 0.7)"
                          : "none",
                    }}
                    variant={activeTab === tab.name ? "default" : "outline"}
                    className={`h-[33px] shrink-0 rounded-[6px] px-3 py-[11px] text-[18px] leading-[21px] whitespace-nowrap text-[#41415A] transition-all duration-300 ease-in-out ${
                      activeTab === tab.name
                        ? "border border-[#D5D5DD] bg-white font-semibold hover:bg-gray-100"
                        : "border-none bg-[#F9F9FB] font-normal hover:bg-white hover:text-black"
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
          <div className="landing-container flex flex-col items-center gap-20 self-stretch">
            <div className="flex w-full flex-col items-center gap-12 self-stretch">
              <div className="flex flex-col items-center gap-3 text-center">
                <h3 className="text-[36px] leading-[41px] text-[#D4AF36]">
                  {activeTab} around you
                </h3>
                <p className="text-[20px]/6 text-primary-foreground">
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
                      to={`${getPropertyBasePath(property.category)}/$id`}
                      params={{ id: property.slug }}
                      key={property.id}
                      className="flex w-full flex-col items-start gap-6 overflow-hidden transition-shadow hover:shadow-lg"
                    >
                      <div className="relative w-full">
                        <LazyImage
                          src={property.cover_image || "/placeholder.png"}
                          alt={property.title}
                          width={397}
                          height={284}
                          containerClassName="h-[284.42px] w-full"
                          className="size-full rounded-xl object-cover"
                        />

                        <Badge
                          className={cn(
                            "absolute top-4 left-4 h-[25px] rounded-sm border border-[oklch(0.5931_0_0/30%)] bg-white px-2 py-0.5 text-[14px] leading-[21px] font-normal text-[#0B0B0D]",
                          )}
                        >
                          <div
                            className={cn(
                              "size-1.5 rounded-full",
                              getStatusDotColor(property.category),
                            )}
                          />
                          {property.category}
                        </Badge>
                        <FavoriteButton
                          propertyId={property.id}
                          isFavorited={property.is_favourited}
                          className="absolute top-4 right-4"
                        />
                      </div>
                      <div className="flex flex-col items-start gap-3">
                        <h4 className="font-dm_sans text-[24px] leading-[31px] font-semibold text-white">
                          {formatPrice(property.price, property.currency)}
                        </h4>
                        <div className="flex flex-col items-start gap-[11px] self-stretch">
                          <p className="text-[16px] leading-[18px] text-primary-foreground">
                            {property.location.city}, {property.location.state}
                          </p>

                          <div className="flex items-end gap-3 self-stretch">
                            <div className="flex items-center gap-5 text-[14px]/4 text-primary-foreground">
                              <div className="flex items-center gap-2">
                                <BedDouble className="size-[18px] text-white" />
                                <span>{property.bedrooms} Beds</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <ShowerHead className="size-[18px] text-white" />
                                <span>{property.bathrooms} Baths</span>
                              </div>
                              {!!property.area_sqft && (
                                <div className="flex items-center gap-2">
                                  <Square className="size-[18px] text-white" />
                                  <span>{property.area_sqft.toLocaleString()} sqft</span>
                                </div>
                              )}
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
                  className="h-12 min-w-[181px] rounded-[40px] bg-secondary-foreground px-6 py-[15px] text-[16px] leading-[19px] font-semibold text-white hover:bg-gray-800"
                >
                  <Link to={exploreListingPath}>
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
        <div className="flex flex-col items-center lg:landing-container lg:gap-[104px]">
          <div className="mx-auto flex w-full max-w-[849px] flex-col gap-[23px] px-5 text-center lg:px-0">
            <h2 className="text-[42px] leading-[59px] text-[#1F2130]">
              Next-Gen Data for Next Level Deals
            </h2>

            <p className="text-[20px]/7 text-[#41415A]">
              Whether you’re looking for your next home, scouting investment properties, or sourcing
              deals for clients — this platform gives you the edge.
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

          <div className="relative w-full bg-[oklch(0.7898_0.1514_90.07/20%)] pt-24 lg:min-h-[595px] lg:rounded-r-[13px] lg:pt-0">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${assets.yellowbackground})`,
              }}
            >
              <div className="absolute inset-0 bg-[oklch(0.7898_0.1514_90.07/20%)]/20" />
            </div>

            <div className="relative z-10 flex w-full flex-col items-center justify-between gap-[95px] rounded-[13px] px-5 lg:flex-row lg:pr-0 lg:pl-10">
              <div className="flex h-auto flex-col items-start gap-10 lg:w-[521px] lg:shrink-0">
                <div className="flex flex-col items-start gap-[13px]">
                  <h3 className="text-[44px] leading-[62px] text-[#1F2130]">
                    Ready to Find Real Property?
                  </h3>

                  <p className="self-stretch text-[20px]/7 text-[#41415A]">
                    Start your 7-day free trial and access Nigeria’s most trusted real estate
                    listings — full property details, high-quality photos, direct contact info, and
                    more
                  </p>
                </div>

                <div className="flex flex-col items-start gap-6 self-stretch">
                  <Button
                    style={{
                      background: " linear-gradient(180deg, #787878 0%, #1E1E1E 60%)",
                      boxShadow:
                        " 0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)",
                    }}
                    className="h-12 rounded-[40px] border border-[oklch(0.235_0_0/50%)] px-6 py-4 text-[16px] leading-[19px] font-semibold text-white"
                  >
                    Start Trial Now
                  </Button>

                  <span className="self-stretch text-[14px]/5 text-[#41415A]">
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
              {postsQuery.isLoading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex grow flex-col items-start gap-[19px]">
                      <Skeleton className="h-[229px] w-full rounded-t-xl" />
                      <div className="flex w-full flex-col items-start gap-4 self-stretch">
                        <div className="flex items-start gap-2">
                          <Skeleton className="h-[25px] w-24 rounded-sm" />
                        </div>
                        <div className="flex w-full flex-col items-start gap-3 self-stretch">
                          <Skeleton className="h-6 w-full" />
                          <Skeleton className="h-6 w-5/6" />
                          <Skeleton className="h-5 w-full" />
                          <Skeleton className="h-5 w-4/5" />
                        </div>
                        <Skeleton className="h-3 w-28" />
                      </div>
                    </div>
                  ))
                : blogPosts.map((post) => {
                    const slug = slugFromUri(post.uri);
                    const tags =
                      post.categories?.nodes
                        ?.map((category) => category?.name)
                        .filter((name): name is string => Boolean(name))
                        .slice(0, 2) ?? [];
                    const imageUrl =
                      toAbsoluteBlogUrl(post.featuredImage?.node?.sourceUrl) ??
                      toAbsoluteBlogUrl(post.featuredImage?.node?.filePath) ??
                      assets.blog1;
                    const dateLabel = post.date
                      ? format(new Date(post.date), "MMM d, yyyy")
                      : "Latest Post";

                    return (
                      <Link
                        to="/blog/$id"
                        params={{ id: slug }}
                        key={post.uri}
                        className="flex grow flex-col items-start gap-[19px]"
                      >
                        <img
                          className="h-[229px] w-full rounded-t-xl object-cover"
                          src={imageUrl}
                          alt={post.featuredImage?.node?.altText || post.title || "blog"}
                          width={394}
                          height={229}
                        />

                        <div className="flex flex-col items-start gap-4 self-stretch">
                          <div className="flex flex-wrap items-start gap-2">
                            {(tags.length > 0 ? tags : ["Blog"]).map((tag) => (
                              <div
                                key={tag}
                                className="flex h-[25px] items-center justify-center rounded-sm bg-[oklch(0.7665_0.1393_91.15/5%)] px-2 py-0.5 text-[14px] leading-[21px] text-[#D4AF36]"
                              >
                                {tag}
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-col items-start gap-3 self-stretch">
                            <h5 className="self-stretch text-[16px]/6 font-semibold tracking-[-0.15px] text-[#0B0B0D]">
                              {post.title}
                            </h5>

                            <p className="line-clamp-2 text-[14px]/6 tracking-[-0.14px] text-[#6C7574]">
                              {excerptFromHtml(post.content ?? "")}
                            </p>
                          </div>

                          <span className="text-[10px] leading-[11px] tracking-[0.88px] text-[#0B0B0D] uppercase">
                            {dateLabel}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
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
