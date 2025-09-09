import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { BedDouble, ChevronDown, ChevronUp, ShowerHead, Square } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import assets from '@/assets';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Link } from '@tanstack/react-router';
import { PageMetaTags } from '@/components/page-meta-data';

const ListingPage = () => {
  const [priceRange, setPriceRange] = useState([10000000, 99000000]);
  const [landAreaMin, setLandAreaMin] = useState(3000);
  const [landAreaMax, setLandAreaMax] = useState(5000);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Collapsible states
  const [isLocationOpen, setIsLocationOpen] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isPropertyTypeOpen, setIsPropertyTypeOpen] = useState(true);
  const [isLandTypeOpen, setIsLandTypeOpen] = useState(true);
  const [isKeywordOpen, setIsKeywordOpen] = useState(false);
  const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(false);
  const [isLandAreaOpen, setIsLandAreaOpen] = useState(false);
  const [isBedroomBathroomOpen, setIsBedroomBathroomOpen] = useState(false);
  const [isDeveloperOwnerOpen, setIsDeveloperOwnerOpen] = useState(false);
  const [isVerifiedListingOpen, setIsVerifiedListingOpen] = useState(true);

  // Selection states
  const [selectedBedrooms, setSelectedBedrooms] = useState<any>([2]);
  const [selectedBathrooms, setSelectedBathrooms] = useState<any>([3]);

  // Mock property data
  const properties = [
    {
      id: 1,
      title: '2 Bedroom Flats for Sale in Lekki, Lagos',
      price: '₦800,000,000',
      location: 'Lekki, GRA Ajah Badore Oyo',
      bedrooms: 2,
      bathrooms: 2,
      area: '5 Bed room fully detached house with 2 maid rooms, an elevator, rooftop terrace (front and back), a swimming pool, a cinema/theater, and Lekki VGC',
      images: assets.property1,
    },
    {
      id: 2,
      title: '3 Bedroom Flats for Sale in Lekki, Lagos',
      price: '₦600,000,000',
      location: 'Ikoyi, GRA Ajah Badore Oyo',
      bedrooms: 3,
      bathrooms: 2,
      area: '3 Bed room fully detached house with 2 maid rooms, an elevator, rooftop terrace (front and back), a swimming pool',
      images: assets.property2,
    },
    {
      id: 3,
      title: '4 Bedroom Flats for Sale in Lekki, Lagos',
      price: '₦500,000,000',
      location: 'Ikoyi, GRA Ajah Badore Oyo',
      bedrooms: 4,
      bathrooms: 3,
      area: '4 Bed room fully detached house with 2 maid rooms, an elevator, rooftop terrace (front and back), a swimming pool',
      images: assets.property3,
    },
    {
      id: 4,
      title: '4 Bedroom Flats for Sale in Lekki, Lagos',
      price: '₦500,000,000',
      location: 'Ikoyi, GRA Ajah Badore Oyo',
      bedrooms: 4,
      bathrooms: 3,
      area: '4 Bed room fully detached house with 2 maid rooms, an elevator, rooftop terrace (front and back), a swimming pool',
      images: assets.property4,
    },
    {
      id: 5,
      title: '4 Bedroom Flats for Sale in Lekki, Lagos',
      price: '₦500,000,000',
      location: 'Ikoyi, GRA Ajah Badore Oyo',
      bedrooms: 4,
      bathrooms: 3,
      area: '4 Bed room fully detached house with 2 maid rooms, an elevator, rooftop terrace (front and back), a swimming pool',
      images: assets.property4,
    },
  ];
  const propertyTypes = ['Self contain', 'Mini Flat'];

  const locations = [
    'Abijo',
    'Agungi',
    'Ajiran Road',
    'Idado',
    'Igbi Efon',
    'Ikate',
    'Ikate Elegushi',
    'Ikota',
    'Ikota Estates',
  ];

  const estates = [
    'Admiralty Home Estate',
    'Alpha Beach Estate',
    'Alperton Estate',
    'Atlantic View Estate',
    'Bakare Estate',
  ];

  const verificationStatus = ['Verified', 'Unverified'];

  type CollapsibleSectionProps = {
    title: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  };

  const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, isOpen, onToggle, children }) => {
    return (
      <Collapsible
        open={isOpen}
        onOpenChange={onToggle}
        className={cn('border-b border-[#F1F1F4]', isOpen ? 'pb-6' : 'pb-0')}
      >
        <CollapsibleTrigger asChild>
          <button className="group mb-4 flex w-full items-center justify-between text-left">
            <h3 className="text-sm leading-[17px] font-semibold tracking-[0.01em] text-[#41415A] transition-colors duration-200 group-hover:text-gray-900">
              {title}
            </h3>
            <div className="transition-transform duration-200 ease-in-out">
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
              )}
            </div>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden transition-all duration-300 ease-linear">
          {children}
        </CollapsibleContent>
      </Collapsible>
    );
  };
  return (
    <div className="flex h-screen w-full items-start gap-0 self-stretch py-8">
      <PageMetaTags
        title="Active Listings"
        description="Manage your active property listings, view inquiries, and track listing performance."
        keywords="active listings, property listings management"
      />
      <div className="w-full">
        <div className="hidden w-full gap-8 pt-11 lg:flex">
          {/* Left Sidebar - Filters */}
          <div className="flex h-dvh w-[334px] shrink-0 flex-col items-start gap-[17px] overflow-y-auto border-r border-[#F1F1F4] pr-8">
            <div className="flex w-full flex-col gap-8">
              {/* Location */}
              <CollapsibleSection
                title="Location"
                isOpen={isLocationOpen}
                onToggle={() => setIsLocationOpen(!isLocationOpen)}
              >
                <Input
                  placeholder="e.g Lekki, Lagos"
                  className="h-8 w-full rounded-[8px] border border-[#D5D5DD] px-3"
                />
              </CollapsibleSection>

              {/* Category */}
              <CollapsibleSection
                title="Category"
                isOpen={isCategoryOpen}
                onToggle={() => setIsCategoryOpen(!isCategoryOpen)}
              >
                <div className="flex w-full flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Checkbox id="for-rent" />
                    <label htmlFor="for-rent" className="text-[14px] leading-[16px] text-[#41415A]">
                      For Rent
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="for-sale" defaultChecked />
                    <label htmlFor="for-sale" className="text-[14px] leading-[16px] text-[#41415A]">
                      For Sale
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="joint-venture" defaultChecked />
                    <label htmlFor="joint-venture" className="text-[14px] leading-[16px] text-[#41415A]">
                      Joint Venture
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="short-let" />
                    <label htmlFor="short-let" className="text-[14px] leading-[16px] text-[#41415A]">
                      Short Let
                    </label>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Property Type */}
              <CollapsibleSection
                title="Property Type"
                isOpen={isPropertyTypeOpen}
                onToggle={() => setIsPropertyTypeOpen(!isPropertyTypeOpen)}
              >
                <div className="flex w-full flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Checkbox id="flat" />
                    <label htmlFor="flat" className="text-[14px] leading-[16px] text-[#41415A]">
                      Flat
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="apartment" defaultChecked />
                    <label htmlFor="apartment" className="text-[14px] leading-[16px] text-[#41415A]">
                      Apartment
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="house" defaultChecked />
                    <label htmlFor="house" className="text-[14px] leading-[16px] text-[#41415A]">
                      House
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="land" />
                    <label htmlFor="land" className="text-[14px] leading-[16px] text-[#41415A]">
                      Land
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="commercial" defaultChecked />
                    <label htmlFor="commercial" className="text-[14px] leading-[16px] text-[#41415A]">
                      Commercial Property
                    </label>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Land Type */}
              <CollapsibleSection
                title="Land Type"
                isOpen={isLandTypeOpen}
                onToggle={() => setIsLandTypeOpen(!isLandTypeOpen)}
              >
                <div className="flex w-full flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Checkbox id="residential" />
                    <label htmlFor="residential" className="text-[14px] leading-[16px] text-[#41415A]">
                      Residential
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="commercial-land" defaultChecked />
                    <label htmlFor="commercial-land" className="text-[14px] leading-[16px] text-[#41415A]">
                      Commercial
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="industrial" defaultChecked />
                    <label htmlFor="industrial" className="text-[14px] leading-[16px] text-[#41415A]">
                      Industrial
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="mixed-use" />
                    <label htmlFor="mixed-use" className="text-[14px] leading-[16px] text-[#41415A]">
                      Mixed-use
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="others" defaultChecked />
                    <label htmlFor="others" className="text-[14px] leading-[16px] text-[#41415A]">
                      Others
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="all-lands" defaultChecked />
                    <label htmlFor="all-lands" className="text-[14px] leading-[16px] text-[#41415A]">
                      All Lands
                    </label>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Keyword */}
              <CollapsibleSection
                title="Keyword"
                isOpen={isKeywordOpen}
                onToggle={() => setIsKeywordOpen(!isKeywordOpen)}
              >
                <Input placeholder="Enter keyword" className="h-8 w-full rounded-[8px] border border-[#D5D5DD] px-3" />
              </CollapsibleSection>

              {/* Price Range */}
              <CollapsibleSection
                title="Price Range"
                isOpen={isPriceRangeOpen}
                onToggle={() => setIsPriceRangeOpen(!isPriceRangeOpen)}
              >
                <div className="flex flex-col gap-6 pt-12">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={200000000}
                    min={1000000}
                    step={1000000}
                    className="w-full"
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      value={`₦${priceRange[0].toLocaleString()}`}
                      className="border-primary h-8 bg-white px-3 text-sm shadow-[0px_0px_3px_rgba(212,_175,_54,_0.5)]"
                      readOnly
                    />

                    <svg width="20" height="2" viewBox="0 0 20 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect y="0.5" width="20" height="1" fill="#D9D9D9" />
                    </svg>

                    <Input
                      value={`₦${priceRange[1].toLocaleString()}`}
                      className="h-8 border-[#D5D5DD] bg-white px-3 text-sm"
                      readOnly
                    />
                  </div>
                </div>
              </CollapsibleSection>

              {/* Land Area */}
              <CollapsibleSection
                title="Land Area"
                isOpen={isLandAreaOpen}
                onToggle={() => setIsLandAreaOpen(!isLandAreaOpen)}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] leading-[16px] text-[#41415A]">Min.</label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={landAreaMin}
                        onChange={(e) => setLandAreaMin(Number(e.target.value))}
                        className="h-8 border-[#D5D5DD] bg-white px-3 pr-8 text-sm"
                      />
                      <span className="absolute top-2 right-2 text-xs text-gray-400">sq ft</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] leading-[16px] text-[#41415A]">Max.</label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={landAreaMax}
                        onChange={(e) => setLandAreaMax(Number(e.target.value))}
                        className="h-8 border-[#D5D5DD] bg-white px-3 pr-8 text-sm"
                      />
                      <span className="absolute top-2 right-2 text-xs text-gray-400">sq ft</span>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Bedroom/Bathroom */}
              <CollapsibleSection
                title="Bedroom/Bathroom"
                isOpen={isBedroomBathroomOpen}
                onToggle={() => setIsBedroomBathroomOpen(!isBedroomBathroomOpen)}
              >
                <div className="flex w-full flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] leading-[16px] text-[#41415A]">Bedroom</label>
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4, '5+'].map((num) => (
                        <Button
                          key={num}
                          variant={'outline'}
                          size="sm"
                          className={`h-8 rounded-[8px] px-3 text-[14px] leading-[16px] text-[#41415A] ${
                            selectedBedrooms.includes(num) ? 'border-primary hover:border-primary' : 'border-[#D5D5DD]'
                          }`}
                          onClick={() => {
                            if (selectedBedrooms.includes(num)) {
                              setSelectedBedrooms(selectedBedrooms.filter((b: any) => b !== num));
                            } else {
                              setSelectedBedrooms([...selectedBedrooms, num]);
                            }
                          }}
                        >
                          {num}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] leading-[16px] text-[#41415A]">Bathroom</label>
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4, '5+'].map((num) => (
                        <Button
                          key={num}
                          variant={'outline'}
                          size="sm"
                          className={`h-8 rounded-[8px] px-3 text-[14px] leading-[16px] text-[#41415A] ${
                            selectedBathrooms.includes(num) ? 'border-primary hover:border-primary' : 'border-[#D5D5DD]'
                          }`}
                          onClick={() => {
                            if (selectedBathrooms.includes(num)) {
                              setSelectedBathrooms(selectedBathrooms.filter((b: any) => b !== num));
                            } else {
                              setSelectedBathrooms([...selectedBathrooms, num]);
                            }
                          }}
                        >
                          {num}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Developer/Owner */}
              <CollapsibleSection
                title="Developer / Owner"
                isOpen={isDeveloperOwnerOpen}
                onToggle={() => setIsDeveloperOwnerOpen(!isDeveloperOwnerOpen)}
              >
                <div className="flex w-full flex-col gap-2">
                  <label className="text-[14px] leading-[16px] text-[#41415A]">Name</label>
                  <Input
                    placeholder="e.g Royalty Properties"
                    className="h-8 w-full border-[#D5D5DD] bg-white px-3 text-sm"
                  />
                </div>
              </CollapsibleSection>

              {/* Verified Listing */}
              <CollapsibleSection
                title="Verified Listing"
                isOpen={isVerifiedListingOpen}
                onToggle={() => setIsVerifiedListingOpen(!isVerifiedListingOpen)}
              >
                <div className="flex w-full flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Checkbox id="all-listings" />
                    <label htmlFor="all-listings" className="text-[14px] leading-[16px] text-[#41415A]">
                      All Listings
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="verified-only" defaultChecked />
                    <label htmlFor="verified-only" className="text-[14px] leading-[16px] text-[#41415A]">
                      Verified Listings Only
                    </label>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 self-stretch">
                <Button
                  variant="secondary"
                  className="h-10 grow rounded-[32px] bg-[#F1F1F4] px-4 py-[15px] text-[14px] leading-[17px] text-[#1F2130] hover:bg-gray-50"
                >
                  Clear
                </Button>
                <Button
                  style={{
                    background: 'linear-gradient(180deg, #505050 0%, #1E1E1E 60%)',

                    boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
                  }}
                  className="h-10 grow rounded-[40px] border border-[oklch(0.235_0_0_/_50%)] p-4 text-[14px] leading-[17px] font-semibold text-white"
                >
                  Apply Filter
                </Button>
              </div>
            </div>
          </div>

          {/* Right Content - Property Listings */}
          <div className="flex grow flex-col items-start gap-4 pt-11">
            {/* Header */}
            <div className="flex w-full justify-between gap-6 self-stretch">
              <h1 className="text-[16px] leading-[24px] text-[#535364]">124 Results</h1>
              <div className="flex items-center justify-center gap-6">
                <Button
                  variant="ghost"
                  className="text-primary border-primary h-8 rounded-none border-x-0 border-t-0 border-b py-4 text-[16px] leading-[24px] font-semibold"
                >
                  Newest
                </Button>
                <Button
                  variant="ghost"
                  className="h-8 rounded-none border-x-0 border-t-0 border-b-0 py-4 text-[16px] leading-[24px] font-normal text-[#71748C]"
                >
                  Price (Lowest-Highest)
                </Button>
                <Button
                  variant="ghost"
                  className="h-8 rounded-none border-x-0 border-t-0 border-b-0 py-4 text-[16px] leading-[24px] font-normal text-[#71748C]"
                >
                  Most viewed
                </Button>

                <Button
                  variant="ghost"
                  className="h-8 rounded-none border-x-0 border-t-0 border-b-0 py-4 text-[16px] leading-[24px] font-normal text-[#71748C]"
                >
                  Favorites
                </Button>
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
                        <span className="hover:text-primary cursor-pointer text-[12px] leading-[17px] transition-colors hover:underline">
                          {type}
                        </span>
                        {index < propertyTypes.length - 1 && <span className="mx-2 text-gray-300">|</span>}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Locations Row */}
                  <div className="flex flex-wrap items-center gap-1">
                    {locations.map((location, index) => (
                      <React.Fragment key={location}>
                        <span className="hover:text-primary cursor-pointer text-[12px] leading-[17px] transition-colors hover:underline">
                          {location}
                        </span>
                        {index < locations.length - 1 && <span className="mx-2 text-gray-300">|</span>}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Estates Row */}
                  <div className="flex flex-wrap items-center gap-1">
                    {estates.map((estate, index) => (
                      <React.Fragment key={estate}>
                        <span className="hover:text-primary cursor-pointer text-[12px] leading-[17px] transition-colors hover:underline">
                          {estate}
                        </span>
                        {index < estates.length - 1 && <span className="mx-2 text-gray-300">|</span>}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Show more link */}
                  <div className="flex">
                    <span className="text-primary cursor-pointer text-[12px] leading-[17px] transition-colors hover:underline">
                      Show more
                    </span>
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
              <div className="flex w-full flex-col gap-8">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="flex w-full items-center justify-between gap-8 self-stretch border-b border-[#F1F1F4] pb-10"
                  >
                    <img src={property.images} alt="images" className="h-[264px] w-[351px]" width={351} height={264} />

                    <div className="flex flex-col items-start gap-9">
                      <div className="flex flex-col gap-4 self-stretch">
                        <div className="flex flex-col items-start gap-2.5">
                          <Badge className="h-[25px] rounded border border-[oklch(0.5931_0_0_/_30%)] bg-white px-2 py-0.5 text-[14px] leading-[21px] font-normal text-[#0B0B0D]">
                            For Sale
                          </Badge>

                          <p className="text-[16px] leading-[18px] text-[#7F7F7F]">{property.title}</p>

                          <p className="font-dm_sans text-[20px] leading-[26px] font-bold text-[#1F2130]">
                            {property.price}
                          </p>
                        </div>

                        <div className="flex flex-col items-start gap-[11px] self-stretch">
                          <span className="text-[14px] leading-[16px] text-[#545767]">{property.location}</span>

                          <div className="flex w-full items-center gap-5 self-stretch text-[14px] leading-[16px] text-[oklch(0_0_0_/_80%)]">
                            <div className="flex items-center gap-2">
                              <BedDouble className="text-primary size-[18px]" />
                              <span>{property.bedrooms}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <ShowerHead className="text-primary size-[18px]" />
                              <span>{property.bathrooms}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Square className="text-primary size-[18px]" />
                              <span>3,000 sq ft</span>
                            </div>
                          </div>

                          <p className="mb-4 line-clamp-2 text-sm text-gray-600">{property.area}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-stretch">
                        <Button
                          asChild
                          variant={'secondary'}
                          className="h-8 w-1/2 rounded-[40px] bg-[#F1F1F4] p-4 text-[14px] leading-[17px] font-semibold text-[#41415A]"
                        >
                          <Link params={{ id: String(property.id) }} to="/listing/$id">
                            View Details
                          </Link>
                        </Button>

                        <Button
                          asChild
                          style={{
                            background: 'linear-gradient(180deg, #D4AF36 0%, #B69118 60%)',
                            boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
                          }}
                          className="h-8 w-1/2 rounded-[40px] border border-[oklch(0.7665_0.1393_91.15_/_50%)] p-4 text-[14px] leading-[17px] font-semibold text-white"
                        >
                          <Link to="/messages">Contact</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex w-full flex-col pt-4 lg:hidden">
          {/* Mobile Filters */}
          <div className="mb-6 flex flex-col gap-4 px-4">
            {/* Basic Filters Row 1 */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] leading-[16px] font-medium text-[#41415A]">Location</label>
                <Input
                  placeholder="e.g Lekki, Lagos"
                  className="h-8 w-full rounded-[8px] border border-[#D5D5DD] px-3"
                />
              </div>
            </div>

            {/* Basic Filters Row 2 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] leading-[16px] font-medium text-[#41415A]">Category</label>
                <Select defaultValue="For Sale">
                  <SelectTrigger className="h-8 w-full text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="For Sale">For Sale</SelectItem>
                    <SelectItem value="For Rent">For Rent</SelectItem>
                    <SelectItem value="Joint Venture">Joint Venture</SelectItem>
                    <SelectItem value="Short Let">Short Let</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[14px] leading-[16px] font-medium text-[#41415A]">Property Type</label>
                <Select defaultValue="House">
                  <SelectTrigger className="h-8 w-full text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="House">House</SelectItem>
                    <SelectItem value="Flat">Flat</SelectItem>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Land">Land</SelectItem>
                    <SelectItem value="Commercial Property">Commercial Property</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Basic Filters Row 3 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] leading-[16px] font-medium text-[#41415A]">Land Type</label>
                <Select defaultValue="Commercial">
                  <SelectTrigger className="h-8 w-full text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="Residential">Residential</SelectItem>
                    <SelectItem value="Industrial">Industrial</SelectItem>
                    <SelectItem value="Mixed-us">Mixed-us</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[14px] leading-[16px] font-medium text-[#41415A]">Keyword</label>
                <Input
                  placeholder="Enter keyword"
                  className="h-10 w-full rounded-[8px] border border-[#D5D5DD] bg-white px-3"
                />
              </div>
            </div>

            {/* Advance Filter Button */}
            <Button
              variant="link"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="text-primary text-[14px] leading-[17px] font-semibold tracking-[0.01em]"
            >
              {showAdvancedFilters ? 'Hide Filter' : 'Advance Filter'}
            </Button>

            {/* Advanced Filters (Collapsible) */}
            {showAdvancedFilters && (
              <div className="animate-in slide-in-from-top flex flex-col gap-6 duration-300">
                {/* Price Range */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-[14px] leading-[16px] font-semibold text-[#41415A]">Price Range</h3>
                  <div className="flex flex-col gap-6 pt-4">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={200000000}
                      min={1000000}
                      step={1000000}
                      className="w-full"
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        value={`₦${priceRange[0].toLocaleString()}`}
                        className="border-primary h-10 bg-white px-3 text-sm shadow-[0px_0px_3px_rgba(212,_175,_54,_0.5)]"
                        readOnly
                      />
                      <svg width="20" height="2" viewBox="0 0 20 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect y="0.5" width="20" height="1" fill="#D9D9D9" />
                      </svg>
                      <Input
                        value={`₦${priceRange[1].toLocaleString()}`}
                        className="h-10 border-[#D5D5DD] bg-white px-3 text-sm"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                {/* Land Area */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-[14px] leading-[16px] font-semibold text-[#41415A]">Land Area</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] leading-[14px] text-[#41415A]">Min.</label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={landAreaMin}
                          onChange={(e) => setLandAreaMin(Number(e.target.value))}
                          className="h-10 border-[#D5D5DD] bg-white px-3 pr-8 text-sm"
                        />
                        <span className="absolute top-3 right-2 text-xs text-gray-400">sq ft</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] leading-[14px] text-[#41415A]">Max.</label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={landAreaMax}
                          onChange={(e) => setLandAreaMax(Number(e.target.value))}
                          className="h-10 border-[#D5D5DD] bg-white px-3 pr-8 text-sm"
                        />
                        <span className="absolute top-3 right-2 text-xs text-gray-400">sq ft</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bedroom/Bathroom */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-[14px] leading-[16px] font-semibold text-[#41415A]">Bedroom/Bathroom</h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] leading-[14px] text-[#41415A]">Bedroom</label>
                      <div className="grid grid-cols-5 gap-2">
                        {[1, 2, 3, 4, '5+'].map((num) => (
                          <Button
                            key={num}
                            variant={'outline'}
                            size="sm"
                            className={`h-10 rounded-[8px] px-3 text-[14px] leading-[16px] text-[#41415A] ${
                              selectedBedrooms.includes(num)
                                ? 'border-[#D4AF36] bg-[#D4AF36] text-white'
                                : 'border-[#D5D5DD]'
                            }`}
                            onClick={() => {
                              if (selectedBedrooms.includes(num)) {
                                setSelectedBedrooms(selectedBedrooms.filter((b: any) => b !== num));
                              } else {
                                setSelectedBedrooms([...selectedBedrooms, num]);
                              }
                            }}
                          >
                            {num}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] leading-[14px] text-[#41415A]">Bathroom</label>
                      <div className="grid grid-cols-5 gap-2">
                        {[1, 2, 3, 4, '5+'].map((num) => (
                          <Button
                            key={num}
                            variant={'outline'}
                            size="sm"
                            className={`h-10 rounded-[8px] px-3 text-[14px] leading-[16px] text-[#41415A] ${
                              selectedBathrooms.includes(num)
                                ? 'border-[#D4AF36] bg-[#D4AF36] text-white'
                                : 'border-[#D5D5DD]'
                            }`}
                            onClick={() => {
                              if (selectedBathrooms.includes(num)) {
                                setSelectedBathrooms(selectedBathrooms.filter((b: any) => b !== num));
                              } else {
                                setSelectedBathrooms([...selectedBathrooms, num]);
                              }
                            }}
                          >
                            {num}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Developer/Owner */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-[14px] leading-[16px] font-semibold text-[#41415A]">Developer / Owner</h3>
                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] leading-[14px] text-[#41415A]">Name</label>
                    <Input
                      placeholder="e.g Royalty Properties"
                      className="h-10 w-full border-[#D5D5DD] bg-white px-3 text-sm"
                    />
                  </div>
                </div>

                {/* Verified Listing */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-[14px] leading-[16px] font-semibold text-[#41415A]">Verified Listing</h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <Checkbox id="all-listings-mobile" />
                      <label htmlFor="all-listings-mobile" className="text-[14px] leading-[16px] text-[#41415A]">
                        All Listings
                      </label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox id="verified-only-mobile" defaultChecked />
                      <label htmlFor="verified-only-mobile" className="text-[14px] leading-[16px] text-[#41415A]">
                        Verified Listings Only
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-4 flex items-center gap-3">
              <Button
                variant="secondary"
                className="h-12 flex-1 rounded-[32px] bg-[#F1F1F4] px-4 text-[14px] leading-[17px] text-[#1F2130] hover:bg-gray-200"
              >
                Clear
              </Button>
              <Button
                style={{
                  background: 'linear-gradient(180deg, #505050 0%, #1E1E1E 60%)',
                  boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
                }}
                className="h-12 flex-1 rounded-[40px] border border-[oklch(0.235_0_0_/_50%)] text-[14px] leading-[17px] font-semibold text-white"
              >
                Apply Filter
              </Button>
            </div>
          </div>

          {/* Mobile Results Header */}
          <div className="mb-4 px-4">
            <h1 className="mb-4 text-[16px] leading-[24px] font-medium text-[#535364]">124 Results</h1>
          </div>

          {/* Mobile Average Price */}
          <div className="mx-4 mb-6">
            <div className="flex w-full flex-col justify-center gap-3 rounded-[8px] bg-[#F8F8F8] p-4">
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
            <div className="flex w-full flex-col gap-4 rounded-[8px] bg-[#F8F8F8] p-4 text-[#41415A]">
              <h3 className="text-[12px] leading-[17px] font-semibold text-[#1F2130]">Quick Filter</h3>
              <div className="flex flex-wrap items-center gap-1">
                {propertyTypes.map((type, index) => (
                  <React.Fragment key={type}>
                    <span className="cursor-pointer text-[12px] leading-[17px] transition-colors hover:text-[#D4AF36] hover:underline">
                      {type}
                    </span>
                    {index < propertyTypes.length - 1 && <span className="mx-2 text-gray-300">|</span>}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-1">
                {locations.slice(0, 6).map((location, index) => (
                  <React.Fragment key={location}>
                    <span className="cursor-pointer text-[12px] leading-[17px] transition-colors hover:text-[#D4AF36] hover:underline">
                      {location}
                    </span>
                    {index < 5 && <span className="mx-2 text-gray-300">|</span>}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex">
                <span className="cursor-pointer text-[12px] leading-[17px] text-[#D4AF36] transition-colors hover:underline">
                  Show more
                </span>
              </div>
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
            {properties.map((property) => (
              <div key={property.id} className="flex flex-col gap-4 border-b border-[#F1F1F4] pb-6">
                <img src={property.images} alt="property" className="h-[200px] w-full rounded-[8px] object-cover" />

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <Badge className="h-[25px] w-fit rounded border border-[oklch(0.5931_0_0_/_30%)] bg-white px-2 py-0.5 text-[12px] leading-[18px] font-normal text-[#0B0B0D]">
                      For Sale
                    </Badge>
                    <p className="line-clamp-2 text-[14px] leading-[16px] text-[#7F7F7F]">{property.title}</p>
                    <p className="text-[18px] leading-[24px] font-bold text-[#1F2130]">{property.price}</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-[12px] leading-[14px] text-[#545767]">{property.location}</span>

                    <div className="flex items-center gap-4 text-[12px] leading-[14px] text-[oklch(0_0_0_/_80%)]">
                      <div className="flex items-center gap-1">
                        <BedDouble className="size-4 text-[#D4AF36]" />
                        <span>{property.bedrooms}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ShowerHead className="size-4 text-[#D4AF36]" />
                        <span>{property.bathrooms}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Square className="size-4 text-[#D4AF36]" />
                        <span>3,000 sq ft</span>
                      </div>
                    </div>

                    <p className="line-clamp-2 text-[12px] leading-[16px] text-gray-600">{property.area}</p>
                  </div>

                  <div className="mt-2 flex items-center gap-3">
                    <Button
                      asChild
                      variant={'secondary'}
                      className="h-10 flex-1 rounded-[40px] bg-[#F1F1F4] text-[12px] leading-[14px] font-semibold text-[#41415A] hover:bg-gray-200"
                    >
                      <Link params={{ id: String(property.id) }} to="/listing/$id">
                        View Details
                      </Link>
                    </Button>
                    <Button
                      style={{
                        background: 'linear-gradient(180deg, #D4AF36 0%, #B69118 60%)',
                        boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
                      }}
                      className="h-10 flex-1 rounded-[40px] border border-[oklch(0.7665_0.1393_91.15_/_50%)] text-[12px] leading-[14px] font-semibold text-white"
                    >
                      Contact
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingPage;
