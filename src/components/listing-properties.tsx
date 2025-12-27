import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

import { useLocation } from '@tanstack/react-router';
import { PropertyFilterSidebar } from '@/components/property-filter-sidebar';
import { MobilePropertyFilters } from '@/components/mobile-property-filters';
import { Property, PropertyListingCard } from './property-listing-card';
import { useGetProperties } from '@/lib/services';
import { PropertyListingCardSkeleton } from './property-listing-card-skeleton';
import { cn } from '@/lib/utils';
import statesAndLocalGov from '@/data/statesAndLocalGov.json';

const ListingProperties = () => {
  const location = useLocation();
  const isListingPage = location.pathname.includes('/listing');
  const isAdminListingPage = location.pathname.includes('/admin-listing');
  const [page, setPage] = useState(1);
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedLga, setSelectedLga] = useState<string | null>(null);
  const [filters, setFilters] = useState<any>({
    per_page: 5,
    page: 1,
    property_type: propertyType,
    sort: sortBy,
  });

  const { data: propertiesResponse, isPending: isLoadingProperties } = useGetProperties(
    filters,
    isListingPage || isAdminListingPage,
    isAdminListingPage
  );

  // The API response structure is different for dashboard/admin and public endpoints.
  const responseData = propertiesResponse?.data?.data;
  const rawProperties = responseData?.data ?? [];

  const properties: Property[] =
    isListingPage || isAdminListingPage
      ? rawProperties.map((p: any) => ({
          ...p,
          id: String(p.id), // Ensure id is a string
          // Admin/dashboard endpoints have flat location properties
          location: {
            city: p.city,
            state: p.state,
          },
          // Admin/dashboard endpoints might be missing some fields, so we add defaults
          category: p.category || 'N/A',
          cover_image: p.cover_image || p.images?.find((img: any) => img.is_cover)?.url || '/placeholder.png',
          excerpt: p.excerpt || p.desc,
        }))
      : rawProperties;
  const totalResults = responseData?.meta?.total ?? 0;

  const propertyTypes = ['flat', 'apartment', 'house', 'land', 'commercial', 'villa', 'duplex'];

  const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price (Lowest-Highest)', value: 'price_asc' },
    { label: 'Most viewed', value: 'most_viewed' },
  ];
  const verificationStatus = ['Verified', 'Unverified'];

  const handleNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setFilters((prev: any) => ({ ...prev, page: nextPage }));
  };

  const handlePreviousPage = () => {
    const prevPage = Math.max(1, page - 1);
    setPage(prevPage);
    setFilters((prev: any) => ({ ...prev, page: prevPage }));
  };

  const handlePropertyTypeChange = (newPropertyType: string | null) => {
    setPropertyType(newPropertyType);
    setFilters((prev: any) => ({ ...prev, property_type: newPropertyType, page: 1 }));
  };
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setFilters((prev: any) => ({ ...prev, sort: newSortBy, page: 1 }));
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters((prev: any) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleClearFilters = () => {
    setPropertyType(null);
    setSortBy('newest');
    setSelectedState(null);
    setSelectedLga(null);
    setFilters({ per_page: 5, page: 1, property_type: null, sort: 'newest' });
  };

  const handleStateClick = (state: string) => {
    setSelectedState(state);
    setSelectedLga(null);
    setFilters((prev: any) => ({ ...prev, state: state, city: undefined, area: undefined, page: 1 }));
  };

  const handleLgaClick = (lga: string) => {
    setSelectedLga(lga);
    setFilters((prev: any) => ({ ...prev, city: lga, area: undefined, page: 1 }));
  };

  const handleAreaClick = (area: string) => {
    setFilters((prev: any) => ({ ...prev, area: area, page: 1 }));
  };

  const handleBackToStates = () => {
    setSelectedState(null);
    setSelectedLga(null);
    setFilters((prev: any) => {
      const { state, city, area, ...rest } = prev;
      return { ...rest, page: 1 };
    });
  };

  const handleBackToLgas = () => {
    setSelectedLga(null);
    setFilters((prev: any) => {
      const { city, area, ...rest } = prev;
      return { ...rest, page: 1 };
    });
  };

  let displayedLocations: string[] = [];
  if (selectedState && selectedLga) {
    displayedLocations = (statesAndLocalGov.find((s) => s.state === selectedState) as any)?.[selectedLga] || [];
  } else if (selectedState) {
    displayedLocations = statesAndLocalGov.find((s) => s.state === selectedState)?.lgas || [];
  } else {
    displayedLocations = statesAndLocalGov.map((s) => s.state);
  }

  return (
    <div className="min-h-screen w-full bg-white py-(--landing-header-height)">
      <div className="landing-container w-full">
        <div className="hidden w-full gap-8 pt-11 lg:flex">
          {/* Left Sidebar - Filters */}
          <div className="flex h-dvh w-[334px] shrink-0 flex-col items-start gap-[17px]">
            <h2 className="text-[32px] leading-[38px] font-semibold tracking-[-0.02em] text-[#1F2130]">
              {isAdminListingPage
                ? 'Admin Listings'
                : isListingPage
                  ? 'My Listings'
                  : `${
                      location.pathname.includes('/buy') ? 'Buy' : location.pathname.includes('/rent') ? 'Rent' : 'Sell'
                    } Property`}
            </h2>

            <PropertyFilterSidebar onFiltersChange={handleFilterChange} onClear={handleClearFilters} />
          </div>

          {/* Right Content - Property Listings */}
          <div className="flex grow flex-col items-start gap-4 pt-11">
            {/* Header */}
            <div className="flex w-full justify-between gap-6 self-stretch">
              <h1 className="text-[16px] leading-6 text-[#535364]">{totalResults} Results</h1>
              <div className="flex items-center justify-center gap-6">
                {sortOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant="ghost"
                    onClick={() => handleSortChange(option.value)}
                    className={cn(
                      'h-8 rounded-none border-x-0 border-t-0 border-b-0 py-4 text-[16px] leading-6 font-normal text-[#71748C]',
                      sortBy === option.value && 'text-primary border-primary border-b font-semibold'
                    )}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex w-full flex-col items-start gap-10 self-stretch">
              <div className="flex w-full flex-col items-start gap-4 self-stretch">
                <div className="flex w-full flex-col justify-center gap-3 self-stretch bg-[#F8F8F8] p-3">
                  <h3 className="text-[12px] leading-[17px] font-semibold text-[#1F2130]">Average Price</h3>

                  <p className="text-[12px] leading-[17px] text-[#41415A]">
                    The average price of 2 bedroom flats for sale in Lekki, Lagos is ₦160,000,000. The prices vary by
                    location, size and features and range from ₦25,000,000 to ₦320,000,000. There are 3,376 available 2
                    bedroom flats for sale in Lekki, Lagos, Nigeria. The flats have been listed by estate agents who can
                    be contacted using the contact information provided for each flat / apartment listing. The list can
                    be filtered by price, furnishing and recency.
                  </p>
                </div>

                <div className="flex w-full flex-col gap-4 bg-[#F8F8F8] p-4 text-[#41415A]">
                  {/* Header */}
                  <h3 className="text-[12px] leading-[17px] font-semibold text-[#1F2130]">Quick Filter</h3>

                  {/* Property Types Row */}
                  <div className="flex flex-wrap items-center gap-1">
                    {propertyTypes.map((type, index) => (
                      <React.Fragment key={type}>
                        <span
                          onClick={() => handlePropertyTypeChange(type)}
                          className={cn(
                            'hover:text-primary cursor-pointer text-[12px] leading-[17px] capitalize transition-colors hover:underline',
                            propertyType === type && 'text-primary font-semibold'
                          )}
                        >
                          {type.replace('_', ' ')}
                        </span>
                        {index < propertyTypes.length - 1 && <span className="mx-2 text-gray-300">|</span>}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Locations Row */}
                  <div className="flex flex-col gap-2">
                    {selectedState && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="link"
                          onClick={handleBackToStates}
                          className="h-auto p-0 text-[12px] font-semibold text-[#1F2130]"
                        >
                          ← Back to States
                        </Button>
                        <span className="text-[12px] font-semibold text-[#1F2130]">{selectedState}</span>
                        {selectedLga && (
                          <>
                            <span className="text-[12px] text-[#1F2130]">{'>'}</span>
                            <Button
                              variant="link"
                              onClick={handleBackToLgas}
                              className="h-auto p-0 text-[12px] font-semibold text-[#1F2130]"
                            >
                              {selectedLga}
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
                              selectedState
                                ? selectedLga
                                  ? handleAreaClick(location)
                                  : handleLgaClick(location)
                                : handleStateClick(location)
                            }
                            className={cn(
                              'hover:text-primary cursor-pointer text-[12px] leading-[17px] transition-colors hover:underline',
                              !selectedState && 'font-medium'
                            )}
                          >
                            {location}
                          </span>
                          {index < displayedLocations.length - 1 && <span className="mx-2 text-gray-300">|</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Verification Status Row */}
                  <div className="flex items-center gap-1">
                    {verificationStatus.map((status, index) => (
                      <React.Fragment key={status}>
                        <span className="hover:text-primary cursor-pointer text-[12px] leading-[17px] transition-colors hover:underline">
                          {status}
                        </span>
                        {index < verificationStatus.length - 1 && <span className="mx-2 text-gray-300">|</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* Property Listings */}
              <div className="flex w-full flex-col gap-10">
                {isLoadingProperties
                  ? Array.from({ length: 5 }).map((_, index) => <PropertyListingCardSkeleton key={index} />)
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
                <Button onClick={handlePreviousPage} disabled={page <= 1 || isLoadingProperties}>
                  Previous
                </Button>
                <span className="text-sm">
                  Page {page} of {responseData?.meta?.last_page ?? 1}
                </span>
                <Button
                  onClick={handleNextPage}
                  disabled={page >= (responseData?.meta?.last_page ?? 1) || isLoadingProperties}
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
          <MobilePropertyFilters onFiltersChange={handleFilterChange} onClear={handleClearFilters} />

          {/* Mobile Results Header */}
          <div className="mb-4 px-4">
            <h1 className="mb-4 text-[16px] leading-6 font-medium text-[#535364]">{totalResults} Results</h1>
          </div>

          {/* Mobile Average Price */}
          <div className="mx-4 mb-6">
            <div className="flex w-full flex-col justify-center gap-3 rounded-xl bg-[#F8F8F8] p-4">
              <h3 className="text-[12px] leading-[17px] font-semibold text-[#1F2130]">Average Price</h3>
              <p className="text-[12px] leading-[17px] text-[#41415A]">
                The average price of 2 bedroom flats for sale in Lekki, Lagos is ₦160,000,000. The prices vary by
                location, size and features and range from ₦25,000,000 to ₦320,000,000. There are 3,376 available 2
                bedroom flats for sale in Lekki, Lagos, Nigeria.
              </p>
            </div>
          </div>

          {/* Mobile Quick Filter */}
          <div className="mx-4 mb-6">
            <div className="flex w-full flex-col gap-4 rounded-xl bg-[#F8F8F8] p-4 text-[#41415A]">
              <h3 className="text-[12px] leading-[17px] font-semibold text-[#1F2130]"> Quick Filter</h3>
              <div className="flex flex-wrap items-center gap-1">
                {propertyTypes.map((type, index) => (
                  <React.Fragment key={type}>
                    <span
                      onClick={() => handlePropertyTypeChange(type)}
                      className={cn(
                        'cursor-pointer text-[12px] leading-[17px] capitalize transition-colors hover:text-[#D4AF36] hover:underline',
                        propertyType === type && 'text-primary font-semibold'
                      )}
                    >
                      {type.replace('_', ' ')}
                    </span>
                    {index < propertyTypes.length - 1 && <span className="mx-2 text-gray-300">|</span>}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                {selectedState && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="link"
                      onClick={handleBackToStates}
                      className="h-auto p-0 text-[12px] font-semibold text-[#1F2130]"
                    >
                      ← Back to States
                    </Button>
                    <span className="text-[12px] font-semibold text-[#1F2130]">{selectedState}</span>
                    {selectedLga && (
                      <>
                        <span className="text-[12px] text-[#1F2130]">{'>'}</span>
                        <Button
                          variant="link"
                          onClick={handleBackToLgas}
                          className="h-auto p-0 text-[12px] font-semibold text-[#1F2130]"
                        >
                          {selectedLga}
                        </Button>
                      </>
                    )}
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-1">
                  {displayedLocations.slice(0, selectedState ? undefined : 6).map((location, index) => (
                    <React.Fragment key={location}>
                      <span
                        onClick={() =>
                          selectedState
                            ? selectedLga
                              ? handleAreaClick(location)
                              : handleLgaClick(location)
                            : handleStateClick(location)
                        }
                        className={cn(
                          'cursor-pointer text-[12px] leading-[17px] transition-colors hover:text-[#D4AF36] hover:underline',
                          !selectedState && 'font-medium'
                        )}
                      >
                        {location}
                      </span>
                      {index < (selectedState ? displayedLocations.length : 5) && (
                        <span className="mx-2 text-gray-300">|</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              {!selectedState && (
                <div className="flex">
                  <span className="cursor-pointer text-[12px] leading-[17px] text-[#D4AF36] transition-colors hover:underline">
                    Show more
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1">
                {verificationStatus.map((status, index) => (
                  <React.Fragment key={status}>
                    <span className="cursor-pointer text-[12px] leading-[17px] transition-colors hover:text-[#D4AF36] hover:underline">
                      {status}
                    </span>
                    {index < verificationStatus.length - 1 && <span className="mx-2 text-gray-300">|</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Property Listings */}
          <div className="flex flex-col gap-6 px-4">
            {isLoadingProperties
              ? Array.from({ length: 3 }).map((_, index) => <PropertyListingCardSkeleton key={index} />)
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
              <Button onClick={handlePreviousPage} disabled={page <= 1 || isLoadingProperties} size="sm">
                Previous
              </Button>
              <span className="text-sm">
                Page {page} of {responseData?.meta?.last_page ?? 1}
              </span>
              <Button
                onClick={handleNextPage}
                disabled={page >= (responseData?.meta?.last_page ?? 1) || isLoadingProperties}
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
