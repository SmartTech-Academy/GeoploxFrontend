import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useDebounce } from "use-debounce";
import { PropertyFilterSidebar } from "@/components/property-filter-sidebar";
import { MobilePropertyFilters } from "@/components/mobile-property-filters";
import { Property, PropertyListingCard } from "./property-listing-card";
import { useGetProperties, useGetLocations } from "@/lib/services";
import { PropertyListingCardSkeleton } from "./property-listing-card-skeleton";
import { cn } from "@/lib/utils";
import { propertyTypes, sortOptions } from "@/data/reuseable";
import { useGetProfileData } from "@/lib/services/profile";
import { PageMetaTags } from "@/components/page-meta-data";
import {
  buildListingUrl,
  parseListingUrl,
  CATEGORY_SLUG_MAP,
  CATEGORY_META,
  type ListingCategorySlug,
} from "@/lib/url-grammar";

// Indexation policy: a page under 5 live listings can't satisfy the search that reaches it -
// indexing it anyway reads as thin content and drags down the rest of the domain.
const MIN_LISTINGS_TO_INDEX = 5;

interface ListingPropertiesProps {
  /** Present only on the new grammar-driven routes (/property-for-sale, etc). When absent,
   *  this component falls back to its original pathname/query-string based behaviour, which
   *  dashboard routes (/listing, /admin-listing) still rely on. */
  grammarCategory?: ListingCategorySlug;
  grammarSplat?: string;
}

const ListingProperties = ({ grammarCategory, grammarSplat }: ListingPropertiesProps = {}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isListingPage = location.pathname.includes("/listing");
  const isAdminListingPage = location.pathname.includes("/admin-listing");
  const isProperties = location.pathname.includes("/properties");
  const pageType = grammarCategory
    ? CATEGORY_SLUG_MAP[grammarCategory]
    : location.pathname.includes("/short-let")
      ? `short-let`
      : location.pathname.includes("/for-rent")
        ? `for-rent`
        : location.pathname.includes("/for-sale")
          ? `for-sale`
          : location.pathname.includes("/joint-venture")
            ? `joint-venture`
            : "all";
  const { data: profileData } = useGetProfileData();
  const [filters, setFilters] = useState<Record<string, any>>({
    page: 1,
    sort: "newest",
  });

  const { data: locationsResponse } = useGetLocations();
  const states = locationsResponse?.data.data ?? [];

  // URL -> filters (grammar routes). Re-runs when the splat changes (real navigation) or once
  // the location tree finishes loading (so state/city/area resolve to their real display names
  // instead of the title-cased-slug fallback used before locations are available).
  React.useEffect(() => {
    if (!grammarCategory) return;

    const parsed = parseListingUrl(grammarCategory, grammarSplat, {
      resolveState: (slug) => states.find((s) => s.slug === slug)?.name,
      resolveCity: (stateSlug, citySlug) =>
        states
          .find((s) => s.slug === stateSlug)
          ?.children.find((c) => c.slug === citySlug)?.name,
      resolveArea: (stateSlug, citySlug, areaSlug) =>
        states
          .find((s) => s.slug === stateSlug)
          ?.children.find((c) => c.slug === citySlug)
          ?.children.find((a) => a.slug === areaSlug)?.name,
    });

    const nextFilters: Record<string, any> = { page: 1, sort: "newest" };
    if (parsed.propertyType) nextFilters.property_type = parsed.propertyType;
    if (parsed.propertySubType) nextFilters.filter_property_sub_type = parsed.propertySubType;
    if (parsed.state) nextFilters.state = parsed.state;
    if (parsed.city) nextFilters.city = parsed.city;
    if (parsed.area) nextFilters.area = parsed.area;
    if (parsed.bedrooms) nextFilters.bedrooms = String(parsed.bedrooms);

    setFilters((prev) => {
      // Preserve sort/page (not part of the grammar) across a grammar-driven URL change.
      const merged = { ...nextFilters, sort: prev.sort || "newest" };
      const prevSerialized = JSON.stringify(prev);
      const nextSerialized = JSON.stringify(merged);
      return prevSerialized === nextSerialized ? prev : merged;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grammarCategory, grammarSplat, states.length]);

  // filters -> URL (grammar routes only): keeps the address bar describing the same search the
  // sidebar/quick-filter just applied, without making navigation the sole source of truth for
  // the filters themselves (setFilters below still updates immediately for a responsive UI).
  React.useEffect(() => {
    if (!grammarCategory) return;

    const bedroomValues = String(filters.bedrooms || "")
      .split(",")
      .filter(Boolean);

    const nextUrl = buildListingUrl({
      category: grammarCategory,
      propertyType: filters.property_type,
      propertySubType: filters.filter_property_sub_type,
      state: filters.state,
      city: filters.city,
      area: filters.area,
      // The grammar's bedroom segment holds a single value - a multi-select combination stays
      // local-filter-only rather than forcing an arbitrary one into the path.
      bedrooms: bedroomValues.length === 1 ? Number(bedroomValues[0]) : undefined,
    });

    if (nextUrl !== location.pathname) {
      navigate({ to: nextUrl, replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    grammarCategory,
    filters.property_type,
    filters.filter_property_sub_type,
    filters.state,
    filters.city,
    filters.area,
    filters.bedrooms,
  ]);

  // Legacy query-string based location filters, for non-grammar usage only (dashboard
  // /listing, /admin-listing - never had path-based location filtering to begin with).
  React.useEffect(() => {
    if (grammarCategory) return;

    const params = new URLSearchParams(location.search);
    const nextFilters: Record<string, any> = {
      page: 1,
      sort: params.get("sort") || "newest",
    };

    const state = params.get("state");
    const city = params.get("city");
    const area = params.get("area");

    if (state) nextFilters.state = state;
    if (city) nextFilters.city = city;
    if (area) nextFilters.area = area;

    setFilters((prev) => {
      const prevSerialized = JSON.stringify(prev);
      const nextSerialized = JSON.stringify(nextFilters);
      return prevSerialized === nextSerialized ? prev : nextFilters;
    });
  }, [location.search, grammarCategory]);

  const [debouncedFilters] = useDebounce(filters, 300);
  const shouldIncludeOwnerName =
    (isListingPage || isProperties) &&
    (profileData?.user_role === "owner" || profileData?.user_role === "developer");

  const { data: propertiesResponse, isPending: isLoadingProperties } = useGetProperties(
    {
      ...debouncedFilters,
      pageType,
      developer_or_owners_name: shouldIncludeOwnerName ? profileData?.username : undefined,
    },
    isListingPage || isAdminListingPage,
    isAdminListingPage,
  );

  const responseData = propertiesResponse?.data?.data;
  const rawProperties = responseData?.data ?? [];

  const properties: Property[] =
    isListingPage || isAdminListingPage
      ? rawProperties.map((p: any) => ({
          ...p,
          id: String(p.id),
          location: {
            city: p.location?.city || p?.city || "N/A",
            state: p.location?.state || p?.state || "N/A",
          },
          category: p.category || "N/A",
          cover_image:
            p.cover_image || p.images?.find((img: any) => img.is_cover)?.url || "/placeholder.png",
          excerpt: p.excerpt || p.desc,
        }))
      : rawProperties;

  const totalResults = responseData?.meta?.total ?? 0;
  const lastPage = responseData?.meta?.last_page ?? 1;

  // Unique title/description/H1/structured-data per the location+filters actually in the URL,
  // and the indexation policy: noindex any page under 5 live listings (thin-content risk),
  // self-canonical always (never canonical page 2+ back to page 1).
  const seo = useMemo(() => {
    if (!grammarCategory) return null;

    const meta = CATEGORY_META[grammarCategory];
    const locationParts = [filters.area, filters.city, filters.state].filter(Boolean);
    const locationSuffix = locationParts.length ? ` in ${locationParts.join(", ")}` : "";
    const typeSuffix = filters.filter_property_sub_type
      ? `${filters.filter_property_sub_type} `
      : filters.property_type
        ? `${filters.property_type} `
        : "";

    // PageMetaTags appends " | Geoplox" itself whenever an explicit title is passed - not
    // included here, or it would show up twice.
    const title = locationParts.length
      ? `${typeSuffix}Properties ${meta.noun}${locationSuffix}`
      : undefined; // fall back to the category default title below
    const description = locationParts.length
      ? `Browse ${typeSuffix.toLowerCase()}properties ${meta.noun.toLowerCase()}${locationSuffix} on Geoplox - verified listings from real owners and developers.`
      : undefined;

    const isLoadedAndEmpty = !isLoadingProperties && totalResults === 0;
    const isThin = !isLoadingProperties && totalResults > 0 && totalResults < MIN_LISTINGS_TO_INDEX;
    const robots = isLoadedAndEmpty || isThin ? "noindex, follow" : "index, follow";

    const breadcrumbItems: { name: string; item: string }[] = [{ name: "Home", item: "/" }];
    let pathAcc = `/${grammarCategory}`;
    breadcrumbItems.push({ name: meta.title, item: pathAcc });
    if (filters.state) {
      pathAcc = buildListingUrl({ category: grammarCategory, state: filters.state });
      breadcrumbItems.push({ name: filters.state, item: pathAcc });
    }
    if (filters.city) {
      pathAcc = buildListingUrl({ category: grammarCategory, state: filters.state, city: filters.city });
      breadcrumbItems.push({ name: filters.city, item: pathAcc });
    }
    if (filters.area) {
      pathAcc = buildListingUrl({
        category: grammarCategory,
        state: filters.state,
        city: filters.city,
        area: filters.area,
      });
      breadcrumbItems.push({ name: filters.area, item: pathAcc });
    }

    const structuredData: Record<string, unknown>[] = [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.name,
          item: typeof window !== "undefined" ? `${window.location.origin}${b.item}` : b.item,
        })),
      },
    ];

    if (!isLoadingProperties && properties.length > 0) {
      structuredData.push({
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: properties.slice(0, 20).map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: typeof window !== "undefined" ? `${window.location.origin}${location.pathname}` : undefined,
          name: p.title,
        })),
      });
    }

    return {
      title: title ?? meta.title,
      description: description ?? meta.description,
      keywords: meta.keywords,
      robots,
      structuredData,
      isLoadedAndEmpty,
    };
  }, [
    grammarCategory,
    filters.state,
    filters.city,
    filters.area,
    filters.property_type,
    filters.filter_property_sub_type,
    isLoadingProperties,
    totalResults,
    properties,
    location.pathname,
  ]);

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleSortChange = (newSortBy: string) => {
    setFilters((prev) => ({ ...prev, sort: newSortBy, page: 1 }));
  };

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      sort: "newest",
    });
  };

  const handlePropertyTypeChange = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      property_type: type,
      filter_property_sub_type: undefined, // Reset sub-type when main type changes
      page: 1,
    }));
  };

  const handleSubTypeChange = (subType: string) => {
    setFilters((prev) => ({ ...prev, filter_property_sub_type: subType, page: 1 }));
  };

  const handleStateClick = (state: string) => {
    setFilters((prev) => ({ ...prev, state: state, city: undefined, area: undefined, page: 1 }));
  };

  const handleLgaClick = (lga: string) => {
    setFilters((prev) => ({ ...prev, city: lga, area: undefined, page: 1 }));
  };

  const handleAreaClick = (area: string) => {
    setFilters((prev) => ({ ...prev, area: area, page: 1 }));
  };

  const handleBackToStates = () => {
    setFilters((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { state, city, area, ...rest } = prev;
      return { ...rest, page: 1 };
    });
  };

  const handleBackToLgas = () => {
    setFilters((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { city, area, ...rest } = prev;
      return { ...rest, page: 1 };
    });
  };

  let displayedLocations: string[] = [];
  if (filters.state && filters.city) {
    const state = states.find((s) => s.name === filters.state);
    const city = state?.children.find((c) => c.name === filters.city);
    // Areas only here too - neighbourhoods stay a secondary ?n= filter, not part of this cascade.
    displayedLocations = (city?.children ?? [])
      .filter((c) => c.type === "area")
      .map((c) => c.name);
  } else if (filters.state) {
    const state = states.find((s) => s.name === filters.state);
    displayedLocations = (state?.children ?? []).map((c) => c.name);
  } else {
    displayedLocations = states.map((s) => s.name);
  }

  const selectedTypeObject = useMemo(() => {
    return propertyTypes.find((p) => p.types === filters.property_type);
  }, [filters.property_type]);

  return (
    <div className="min-h-screen w-full bg-white py-(--landing-header-height)">
      {seo && (
        <PageMetaTags
          title={seo.title}
          description={seo.description}
          keywords={seo.keywords}
          robots={seo.robots}
          structuredData={seo.structuredData}
          canonicalPath={location.pathname}
        />
      )}
      <div className="landing-container w-full">
        <div className="hidden w-full gap-8 pt-11 lg:flex">
          {/* Left Sidebar - Filters */}
          <div className="flex h-dvh w-[334px] shrink-0 flex-col items-start gap-[17px]">
            <h2 className="text-[32px] leading-[38px] font-semibold tracking-[-0.02em] text-[#1F2130]">
              {isAdminListingPage
                ? "Admin Listings"
                : isListingPage
                  ? "My Listings"
                  : (() => {
                      const base =
                        pageType === "short-let"
                          ? "Short Let Property"
                          : pageType === "for-rent"
                            ? "Rent Property"
                            : pageType === "joint-venture"
                              ? "Joint Venture Property"
                              : "Sell Property";
                      const locationParts = [filters.area, filters.city, filters.state].filter(
                        Boolean,
                      );
                      return locationParts.length
                        ? `${base} in ${locationParts.join(", ")}`
                        : base;
                    })()}
            </h2>

            <PropertyFilterSidebar
              filters={filters}
              onFiltersChange={handleFilterChange}
              onClear={handleClearFilters}
            />
          </div>

          {/* Right Content - Property Listings */}
          <div className="flex grow flex-col items-start gap-4 pt-11">
            {/* Header */}
            <div className="flex w-full justify-between gap-6 self-stretch">
              <h1 className="text-[16px]/6 text-[#535364]">{totalResults} Results</h1>
              <div className="flex items-center justify-center gap-6">
                {sortOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant="ghost"
                    onClick={() => handleSortChange(option.value)}
                    className={cn(
                      "h-8 rounded-none border-x-0 border-y-0 py-4 text-[16px]/6 font-normal text-[#71748C]",
                      filters.sort === option.value &&
                        "border-b border-primary font-semibold text-primary",
                    )}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex w-full flex-col items-start gap-10 self-stretch">
              <div className="flex w-full flex-col items-start gap-4 self-stretch">
                <div className="flex w-full flex-col gap-4 bg-[#F8F8F8] p-4 text-[#41415A]">
                  {/* Header */}
                  <h3 className="text-[12px] leading-[17px] font-semibold text-[#1F2130]">
                    Quick Filter
                  </h3>

                  {/* Property Types Row */}
                  <div className="flex flex-wrap items-center gap-1">
                    {propertyTypes.map((type, index) => (
                      <React.Fragment key={type.types}>
                        <span
                          onClick={() => handlePropertyTypeChange(type.types)}
                          className={cn(
                            "cursor-pointer text-[12px] leading-[17px] capitalize transition-colors hover:text-primary hover:underline",
                            filters.property_type === type.types && "font-semibold text-primary",
                          )}
                        >
                          {type.types.replace("_", " ")}
                        </span>
                        {index < propertyTypes.length - 1 && (
                          <span className="mx-2 text-gray-300">|</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {selectedTypeObject?.sub_types && selectedTypeObject?.sub_types?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedTypeObject?.sub_types.map((subType) => (
                        <span
                          key={subType}
                          onClick={() => handleSubTypeChange(subType)}
                          className={cn(
                            "cursor-pointer rounded-full border px-3 py-1 text-[12px] transition-colors",
                            filters.filter_property_sub_type === subType
                              ? "border-primary bg-primary text-white"
                              : "border-gray-300 text-gray-600 hover:border-primary hover:text-primary",
                          )}
                        >
                          {subType}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Clear Category Filter */}
                  {filters.category_id && (
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-semibold text-[#1F2130]">
                        Category: {filters.category_id}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleFilterChange({
                            ...filters,
                            category_id: undefined,
                          })
                        }
                        className="h-6 rounded-full border border-red-300 bg-white px-2 text-[10px] font-semibold text-red-600 hover:bg-red-50"
                      >
                        ✕ Clear
                      </Button>
                    </div>
                  )}

                  {/* Locations Row */}
                  <div className="flex flex-col gap-2">
                    {filters.state && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="link"
                          onClick={handleBackToStates}
                          className="h-auto p-0 text-[12px] font-semibold text-[#1F2130]"
                        >
                          ← Back to States
                        </Button>
                        <span className="text-[12px] font-semibold text-[#1F2130]">
                          {filters.state}
                        </span>
                        {filters.city && (
                          <>
                            <span className="text-[12px] text-[#1F2130]">{">"}</span>
                            <Button
                              variant="link"
                              onClick={handleBackToLgas}
                              className="h-auto p-0 text-[12px] font-semibold text-[#1F2130]"
                            >
                              {filters.city}
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                    {/* Capped + scrollable: some LGAs (e.g. Lekki) have 150+ areas, and with no
                        limit here that list used to balloon this box's height and shove every
                        section below it (sort tabs, property cards, pagination) far down the
                        page the moment that LGA was selected via the sidebar filter (both read
                        the same `filters.state`/`filters.city` state, so selecting Lekki there
                        drives this same list). Capping the height and scrolling within it keeps
                        the rest of the page layout stable regardless of list length. */}
                    <div className="flex max-h-32 flex-wrap items-center gap-1 overflow-y-auto pr-1">
                      {displayedLocations.map((location, index) => (
                        <React.Fragment key={location}>
                          <span
                            onClick={() =>
                              filters.state
                                ? filters.city
                                  ? handleAreaClick(location)
                                  : handleLgaClick(location)
                                : handleStateClick(location)
                            }
                            className={cn(
                              "cursor-pointer text-[12px] leading-[17px] transition-colors hover:text-primary hover:underline",
                              !filters.state && "font-medium",
                            )}
                          >
                            {location}
                          </span>
                          {index < displayedLocations.length - 1 && (
                            <span className="mx-2 text-gray-300">|</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Listings */}
              <div className="flex w-full flex-col gap-10">
                {isLoadingProperties
                  ? Array.from({ length: 5 }).map((_, index) => (
                      <PropertyListingCardSkeleton key={index} />
                    ))
                  : properties.map((property) => (
                      <PropertyListingCard
                        key={property.id}
                        property={property}
                        isDashboard={isListingPage || isAdminListingPage}
                        identifier={isListingPage ? property.id : property.slug}
                      />
                    ))}
                {properties.length === 0 && !isLoadingProperties && (
                  <div className="py-10 text-center">No properties found.</div>
                )}
              </div>

              {/* Pagination Controls */}
              <div className="flex w-full items-center justify-center gap-4 pt-6">
                <Button
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page <= 1 || isLoadingProperties}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {filters.page} of {lastPage}
                </span>
                <Button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page >= lastPage || isLoadingProperties}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex w-full flex-col pt-4 lg:hidden">
          {/* Mobile Filters */}
          <MobilePropertyFilters
            filters={filters}
            onFiltersChange={handleFilterChange}
            onClear={handleClearFilters}
          />

          {/* Mobile Results Header */}
          <div className="mb-4 px-4">
            <h1 className="mb-4 text-[16px]/6 font-medium text-[#535364]">
              {totalResults} Results
            </h1>
          </div>

          {/* Mobile Quick Filter */}
          <div className="mx-4 mb-6">
            <div className="flex w-full flex-col gap-4 rounded-xl bg-[#F8F8F8] p-4 text-[#41415A]">
              <h3 className="text-[12px] leading-[17px] font-semibold text-[#1F2130]">
                {" "}
                Quick Filter
              </h3>
              <div className="flex flex-wrap items-center gap-1">
                {propertyTypes.map((item, index) => (
                  <React.Fragment key={item.types}>
                    <span
                      onClick={() => handlePropertyTypeChange(item.types)}
                      className={cn(
                        "cursor-pointer text-[12px] leading-[17px] capitalize transition-colors hover:text-primary hover:underline",
                        filters.property_type === item.types && "font-semibold text-primary",
                      )}
                    >
                      {item.types}
                    </span>

                    {index < propertyTypes.length - 1 && (
                      <span className="mx-2 text-gray-300">|</span>
                    )}
                  </React.Fragment>
                ))}

                {selectedTypeObject?.sub_types && selectedTypeObject?.sub_types?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedTypeObject?.sub_types.map((subType) => (
                      <span
                        key={subType}
                        onClick={() => handleSubTypeChange(subType)}
                        className={cn(
                          "cursor-pointer rounded-full border px-3 py-1 text-[12px] transition-colors",
                          filters.filter_property_sub_type === subType
                            ? "border-primary bg-primary text-white"
                            : "border-gray-300 text-gray-600 hover:border-primary hover:text-primary",
                        )}
                      >
                        {subType}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {filters.state && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="link"
                      onClick={handleBackToStates}
                      className="h-auto p-0 text-[12px] font-semibold text-[#1F2130]"
                    >
                      ← Back to States
                    </Button>
                    <span className="text-[12px] font-semibold text-[#1F2130]">
                      {filters.state}
                    </span>
                    {filters.city && (
                      <>
                        <span className="text-[12px] text-[#1F2130]">{">"}</span>
                        <Button
                          variant="link"
                          onClick={handleBackToLgas}
                          className="h-auto p-0 text-[12px] font-semibold text-[#1F2130]"
                        >
                          {filters.city}
                        </Button>
                      </>
                    )}
                  </div>
                )}
                {/* Capped + scrollable - see the desktop copy of this list above for why
                    (unbounded height blowing out the page layout for LGAs with long area lists
                    like Lekki). Also fixes a trailing-separator bug: this copy compared
                    `index < displayedLocations.length` (always true, since index only ever
                    reaches length - 1) instead of `- 1`, so a stray "|" always rendered after
                    the very last item. */}
                <div className="flex max-h-32 flex-wrap items-center gap-1 overflow-y-auto pr-1">
                  {displayedLocations.map((location, index) => (
                    <React.Fragment key={location}>
                      <span
                        onClick={() =>
                          filters.state
                            ? filters.city
                              ? handleAreaClick(location)
                              : handleLgaClick(location)
                            : handleStateClick(location)
                        }
                        className={cn(
                          "cursor-pointer text-[12px] leading-[17px] transition-colors hover:text-[#D4AF36] hover:underline",
                          !filters.state && "font-medium",
                        )}
                      >
                        {location}
                      </span>
                      {index < displayedLocations.length - 1 && (
                        <span className="mx-2 text-gray-300">|</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Property Listings */}
          <div className="flex flex-col gap-6 px-4">
            {isLoadingProperties
              ? Array.from({ length: 3 }).map((_, index) => (
                  <PropertyListingCardSkeleton key={index} />
                ))
              : properties.map((property) => (
                  <PropertyListingCard
                    key={property.id}
                    property={property}
                    isDashboard={isListingPage || isAdminListingPage}
                    identifier={isListingPage ? property.id : property.slug}
                  />
                ))}

            {properties.length === 0 && !isLoadingProperties && (
              <div className="py-10 text-center">No properties found.</div>
            )}

            {/* Mobile Pagination Controls */}
            <div className="flex w-full items-center justify-center gap-4 pt-6">
              <Button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page <= 1 || isLoadingProperties}
                size="sm"
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {filters.page} of {lastPage}
              </span>
              <Button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page >= lastPage || isLoadingProperties}
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ListingProperties;
