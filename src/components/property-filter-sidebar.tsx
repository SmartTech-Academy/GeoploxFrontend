import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { useGetPropertyCategories, useGetPropertyTags } from '@/lib/services';

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
          <h3 className="text-sm font-semibold tracking-[0.01em] text-[#41415A] transition-colors duration-200 group-hover:text-gray-900">
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

interface PropertyFilterSidebarProps {
  // eslint-disable-next-line no-unused-vars
  onFiltersChange: (newFilters: Record<string, any>) => void;
  onClear: () => void;
}

export const PropertyFilterSidebar: React.FC<PropertyFilterSidebarProps> = ({ onFiltersChange, onClear }) => {
  const [priceRange, setPriceRange] = useState([10000000, 99000000]);
  const [landAreaMin, setLandAreaMin] = useState(3000);
  const [landAreaMax, setLandAreaMax] = useState(5000);

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
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [isVerifiedListingOpen, setIsVerifiedListingOpen] = useState(true);

  // Selection states
  const [selectedBedrooms, setSelectedBedrooms] = useState<any>([2]);
  const [selectedBathrooms, setSelectedBathrooms] = useState<any>([3]);

  const [location, setLocation] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [propertyType, setPropertyType] = useState({
    flat: false,
    apartment: true,
    house: true,
    land: false,
    commercial: true,
  });
  const [landType, setLandType] = useState({
    residential: false,
    commercialLand: true,
    industrial: true,
    mixedUse: false,
    others: true,
    allLands: true,
  });
  const [keyword, setKeyword] = useState<string>('');
  const [developerOwner, setDeveloperOwner] = useState<string>('');
  const [verifiedListing, setVerifiedListing] = useState({ allListings: false, verifiedOnly: true });
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  const { data: categoriesResponse } = useGetPropertyCategories();
  const { data: tagsResponse } = useGetPropertyTags();

  const categories = categoriesResponse?.data.data ?? [];
  const tags = tagsResponse?.data.data ?? [];

  const handleApplyFilters = useCallback(() => {
    const property_type = Object.entries(propertyType)
      .filter(([, value]) => value)
      .map(([key]) => key)
      .join(',');

    const bedrooms = selectedBedrooms.filter((b: any) => typeof b === 'number').join(',');
    const bathrooms = selectedBathrooms.filter((b: any) => typeof b === 'number').join(',');

    const tagsQuery = selectedTags.join(',');

    const newFilters: Record<string, any> = {
      category_id: selectedCategories.length > 0 ? selectedCategories[0] : undefined, // API expects a single integer
      property_type: property_type || undefined,
      city: location || undefined,
      q: keyword || undefined,
      min_price: priceRange[0],
      max_price: priceRange[1],
      min_area: landAreaMin,
      max_area: landAreaMax,
      bedrooms: bedrooms || undefined,
      bathrooms: bathrooms || undefined,
      developer_or_owners_name: developerOwner || undefined,
      verified: verifiedListing.verifiedOnly ? 1 : 0,
      tags: tagsQuery || undefined,
    };

    Object.keys(newFilters).forEach(
      (key) =>
        newFilters[key as keyof typeof newFilters] === undefined && delete newFilters[key as keyof typeof newFilters]
    );

    onFiltersChange(newFilters);
  }, [
    selectedCategories,
    propertyType,
    location,
    keyword,
    priceRange,
    landAreaMin,
    landAreaMax,
    selectedBedrooms,
    selectedBathrooms,
    developerOwner,
    verifiedListing,
    selectedTags,
    onFiltersChange,
  ]);

  const handleClearFilters = useCallback(() => {
    setPriceRange([10000000, 99000000]);
    setLandAreaMin(3000);
    setLandAreaMax(5000);
    setSelectedBedrooms([2]);
    setSelectedBathrooms([3]);
    setLocation('');
    setSelectedCategories([]);
    setPropertyType({ flat: false, apartment: true, house: true, land: false, commercial: true });
    setLandType({
      residential: false,
      commercialLand: true,
      industrial: true,
      mixedUse: false,
      others: true,
      allLands: true,
    });
    setKeyword('');
    setDeveloperOwner('');
    setVerifiedListing({ allListings: false, verifiedOnly: true });
    setSelectedTags([]);
    onClear();
  }, [onClear]);

  return (
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
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </CollapsibleSection>

        {/* Category */}
        <CollapsibleSection
          title="Category"
          isOpen={isCategoryOpen}
          onToggle={() => setIsCategoryOpen(!isCategoryOpen)}
        >
          <div className="flex w-full flex-col gap-4">
            {categories.map((category: { id: number; title: string }) => (
              <div key={category.id} className="flex items-center gap-3">
                <Checkbox
                  id={`cat-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) => {
                    setSelectedCategories((prev) =>
                      checked ? [...prev, category.id] : prev.filter((id) => id !== category.id)
                    );
                  }}
                />
                <label htmlFor={`cat-${category.id}`} className="text-[14px] leading-[16px] text-[#41415A]">
                  {category.title}
                </label>
              </div>
            ))}
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
              <Checkbox
                id="flat"
                checked={propertyType.flat}
                onCheckedChange={(checked) => setPropertyType((prev) => ({ ...prev, flat: !!checked }))}
              />
              <label htmlFor="flat" className="text-[14px] leading-[16px] text-[#41415A]">
                Flat
              </label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="apartment"
                checked={propertyType.apartment}
                onCheckedChange={(checked) => setPropertyType((prev) => ({ ...prev, apartment: !!checked }))}
              />
              <label htmlFor="apartment" className="text-[14px] leading-[16px] text-[#41415A]">
                Apartment
              </label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="house"
                checked={propertyType.house}
                onCheckedChange={(checked) => setPropertyType((prev) => ({ ...prev, house: !!checked }))}
              />
              <label htmlFor="house" className="text-[14px] leading-[16px] text-[#41415A]">
                House
              </label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="land"
                checked={propertyType.land}
                onCheckedChange={(checked) => setPropertyType((prev) => ({ ...prev, land: !!checked }))}
              />
              <label htmlFor="land" className="text-[14px] leading-[16px] text-[#41415A]">
                Land
              </label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="commercial"
                checked={propertyType.commercial}
                onCheckedChange={(checked) => setPropertyType((prev) => ({ ...prev, commercial: !!checked }))}
              />
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
              <Checkbox
                id="residential"
                checked={landType.residential}
                onCheckedChange={(checked) => setLandType((prev) => ({ ...prev, residential: !!checked }))}
              />
              <label htmlFor="residential" className="text-[14px] leading-[16px] text-[#41415A]">
                Residential
              </label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="commercial-land"
                checked={landType.commercialLand}
                onCheckedChange={(checked) => setLandType((prev) => ({ ...prev, commercialLand: !!checked }))}
              />
              <label htmlFor="commercial-land" className="text-[14px] leading-[16px] text-[#41415A]">
                Commercial
              </label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="industrial"
                checked={landType.industrial}
                onCheckedChange={(checked) => setLandType((prev) => ({ ...prev, industrial: !!checked }))}
              />
              <label htmlFor="industrial" className="text-[14px] leading-[16px] text-[#41415A]">
                Industrial
              </label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="mixed-use"
                checked={landType.mixedUse}
                onCheckedChange={(checked) => setLandType((prev) => ({ ...prev, mixedUse: !!checked }))}
              />
              <label htmlFor="mixed-use" className="text-[14px] leading-[16px] text-[#41415A]">
                Mixed-use
              </label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="others"
                checked={landType.others}
                onCheckedChange={(checked) => setLandType((prev) => ({ ...prev, others: !!checked }))}
              />
              <label htmlFor="others" className="text-[14px] leading-[16px] text-[#41415A]">
                Others
              </label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="all-lands"
                checked={landType.allLands}
                onCheckedChange={(checked) => setLandType((prev) => ({ ...prev, allLands: !!checked }))}
              />
              <label htmlFor="all-lands" className="text-[14px] leading-[16px] text-[#41415A]">
                All Lands
              </label>
            </div>
          </div>
        </CollapsibleSection>

        {/* Keyword */}
        <CollapsibleSection title="Keyword" isOpen={isKeywordOpen} onToggle={() => setIsKeywordOpen(!isKeywordOpen)}>
          <Input
            placeholder="Enter keyword"
            className="h-8 w-full rounded-[8px] border border-[#D5D5DD] px-3"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
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
              onValueChange={(value) => setPriceRange(value)}
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
              value={developerOwner}
              onChange={(e) => setDeveloperOwner(e.target.value)}
            />
          </div>
        </CollapsibleSection>

        {/* Tags */}
        <CollapsibleSection title="Tags" isOpen={isTagsOpen} onToggle={() => setIsTagsOpen(!isTagsOpen)}>
          <div className="flex w-full flex-col gap-4">
            {tags.map((tag: { id: number; name: string }) => (
              <div key={tag.id} className="flex items-center gap-3">
                <Checkbox
                  id={`tag-${tag.id}`}
                  checked={selectedTags.includes(tag.id)}
                  onCheckedChange={(checked) => {
                    setSelectedTags((prev) => (checked ? [...prev, tag.id] : prev.filter((id) => id !== tag.id)));
                  }}
                />
                <label htmlFor={`tag-${tag.id}`} className="text-[14px] leading-[16px] text-[#41415A] capitalize">
                  {tag.name}
                </label>
              </div>
            ))}
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
              <Checkbox
                id="all-listings"
                checked={verifiedListing.allListings}
                onCheckedChange={(checked) =>
                  setVerifiedListing((prev) => ({ ...prev, allListings: !!checked, verifiedOnly: !checked }))
                }
              />
              <label htmlFor="all-listings" className="text-[14px] leading-[16px] text-[#41415A]">
                All Listings
              </label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="verified-only"
                checked={verifiedListing.verifiedOnly}
                onCheckedChange={(checked) =>
                  setVerifiedListing((prev) => ({ ...prev, verifiedOnly: !!checked, allListings: !checked }))
                }
              />
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
            onClick={handleClearFilters}
          >
            Clear
          </Button>
          <Button
            style={{
              background: 'linear-gradient(180deg, #505050 0%, #1E1E1E 60%)',
              boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
            }}
            className="h-10 grow rounded-[40px] border border-[oklch(0.235_0_0_/_50%)] p-4 text-[14px] leading-[17px] font-semibold text-white"
            onClick={handleApplyFilters}
          >
            Apply Filter
          </Button>
        </div>
      </div>
    </div>
  );
};
