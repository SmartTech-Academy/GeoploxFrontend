import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "@tanstack/react-router";
import { useDebounce } from "use-debounce";
import { PropertyFilterSidebar } from "@/components/property-filter-sidebar";
import { MobilePropertyFilters } from "@/components/mobile-property-filters";
import { Property, PropertyListingCard } from "./property-listing-card";
import { useGetProperties } from "@/lib/services";
import { PropertyListingCardSkeleton } from "./property-listing-card-skeleton";
import { cn } from "@/lib/utils";
import statesAndLocalGov from "@/data/statesAndLocalGov.json";
import { propertyTypes, sortOptions } from "@/data/reuseable";
import { useGetProfileData } from "@/lib/services/profile";

const ListingProperties = () => {
  const location = useLocation();
  const isListingPage = location.pathname.includes("/listing");
  const isAdminListingPage = location.pathname.includes("/admin-listing");
  const isProperties = location.pathname.includes("/properties");
  const pageType = location.pathname.includes("/short-let")
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

  React.useEffect(() => {
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
  }, [location.search]);

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
    displayedLocations =
      (statesAndLocalGov.find((s) => s.state === filters.state) as any)?.[filters.city] || [];
  } else if (filters.state) {
    displayedLocations = statesAndLocalGov.find((s) => s.state === filters.state)?.lgas || [];
  } else {
    displayedLocations = statesAndLocalGov.map((s) => s.state);
  }

  const selectedTypeObject = useMemo(() => {
    return propertyTypes.find((p) => p.types === filters.property_type);
  }, [filters.property_type]);

  return (
    <div className="min-h-screen w-full bg-white py-(--landing-header-height)">
      <div className="landing-container w-full">
        <div className="hidden w-full gap-8 pt-11 lg:flex">
          {/* Left Sidebar - Filters */}
          <div className="flex h-dvh w-[334px] shrink-0 flex-col items-start gap-[17px]">
            <h2 className="text-[32px] leading-[38px] font-semibold tracking-[-0.02em] text-[#1F2130]">
              {isAdminListingPage
                ? "Admin Listings"
                : isListingPage
                  ? "My Listings"
                  : `${
                      location.pathname.includes("/short-let")
                        ? "Short Let"
                        : location.pathname.includes("/for-rent")
                          ? "Rent"
                          : "Sell"
                    } Property`}
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
                    <div className="flex flex-wrap items-center gap-1">
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
                <div className="flex flex-wrap items-center gap-1">
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
                      {index < displayedLocations.length && (
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
