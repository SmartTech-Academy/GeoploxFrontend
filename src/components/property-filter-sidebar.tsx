import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useGetPropertyCategories, useGetPropertyTags } from "@/lib/services";
import statesAndLocalGov from "@/data/statesAndLocalGov.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { propertyFeatures, propertyStatus, propertyTypes, sortOptions } from "@/data/reuseable";

type CollapsibleSectionProps = {
  title: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onToggle}
      className={cn("border-b border-[#F1F1F4]", isOpen ? "pb-6" : "pb-0")}
    >
      <CollapsibleTrigger asChild>
        <button className="group mb-4 flex w-full items-center justify-between text-left">
          <h3 className="text-sm font-semibold tracking-[0.01em] text-[#41415A] transition-colors duration-200 group-hover:text-gray-900">
            {title}
          </h3>
          <div className="transition-transform duration-200 ease-in-out">
            {isOpen ? (
              <ChevronUp className="size-4 text-gray-500 group-hover:text-gray-700" />
            ) : (
              <ChevronDown className="size-4 text-gray-500 group-hover:text-gray-700" />
            )}
          </div>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden transition-all duration-300 ease-linear data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

interface PropertyFilterSidebarProps {
  filters: Record<string, any>;
  onFiltersChange: (newFilters: Record<string, any>) => void;
  onClear: () => void;
  inDash?: boolean;
}

export const PropertyFilterSidebar: React.FC<PropertyFilterSidebarProps> = ({
  filters,
  onFiltersChange,
  onClear,
  inDash,
}) => {
  const [draftFilters, setDraftFilters] = useState(filters);

  useEffect(() => {
    setDraftFilters(filters);
  }, [filters]);

  const handleDraftChange = (key: string, value: any) => {
    setDraftFilters((prev) => ({ ...prev, [key]: value }));
  };
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isPropertyTypeOpen, setIsPropertyTypeOpen] = useState(false);
  const [isPropertyStatusOpen, setIsPropertyStatusOpen] = useState(false);
  const [isPropertyFeaturesOpen, setIsPropertyFeaturesOpen] = useState(false);
  const [isKeywordOpen, setIsKeywordOpen] = useState(false);
  const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(false);
  const [isLandAreaOpen, setIsLandAreaOpen] = useState(false);

  const [isBedroomBathroomOpen, setIsBedroomBathroomOpen] = useState(false);
  //   const [isDeveloperOwnerOpen, setIsDeveloperOwnerOpen] = useState(false);
  const [isPropertyIdOpen, setIsPropertyIdOpen] = useState(false);
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  //   const [isVerifiedOpen, setIsVerifiedOpen] = useState(false);

  const { data: categoriesResponse } = useGetPropertyCategories();
  const { data: tagsResponse } = useGetPropertyTags();

  const categories = categoriesResponse?.data.data ?? [];
  const tags = tagsResponse?.data.data ?? [];

  const lgas = draftFilters.state
    ? statesAndLocalGov.find((s) => s.state === draftFilters.state)?.lgas || []
    : [];
  const areas =
    draftFilters.state && draftFilters.city
      ? (statesAndLocalGov.find((s) => s.state === draftFilters.state) as any)?.[
          draftFilters.city
        ] || []
      : [];

  const handleApplyFilters = () => {
    const newFilters = { ...draftFilters };

    // Clean up '5+' bedrooms/bathrooms
    if (newFilters.bedrooms) {
      newFilters.bedrooms = String(newFilters.bedrooms)
        .split(",")
        .map((b) => (b === "5+" ? 5 : b))
        .join(",");
    }
    if (newFilters.bathrooms) {
      newFilters.bathrooms = String(newFilters.bathrooms)
        .split(",")
        .map((b) => (b === "5+" ? 5 : b))
        .join(",");
    }

    Object.keys(newFilters).forEach(
      (key) =>
        (newFilters[key as keyof typeof newFilters] === undefined ||
          newFilters[key as keyof typeof newFilters] === null ||
          newFilters[key as keyof typeof newFilters] === "") &&
        delete newFilters[key as keyof typeof newFilters],
    );

    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    onClear();
  };

  const selectedBedrooms = String(draftFilters.bedrooms || "")
    .split(",")
    .filter(Boolean);
  const selectedBathrooms = String(draftFilters.bathrooms || "")
    .split(",")
    .filter(Boolean);

  return (
    <div
      className={cn(
        "flex h-[calc(100vh-100px)] w-full shrink-0 flex-col items-start gap-[17px] overflow-y-auto border-r border-[#F1F1F4] pt-8 pr-8 lg:w-[334px]",
        inDash && "pl-8",
      )}
    >
      <div className="flex w-full flex-col gap-8">
        {/* Sort */}
        <CollapsibleSection
          title="Sort By"
          isOpen={isSortOpen}
          onToggle={() => setIsSortOpen(!isSortOpen)}
        >
          <Select
            value={draftFilters.sort || "newest"}
            onValueChange={(val) => handleDraftChange("sort", val)}
          >
            <SelectTrigger className="h-8 w-full text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CollapsibleSection>
        {/* Location */}
        <CollapsibleSection
          title="Location"
          isOpen={isLocationOpen}
          onToggle={() => setIsLocationOpen(!isLocationOpen)}
        >
          <div className="flex flex-col gap-3">
            <Select
              value={draftFilters.state || ""}
              onValueChange={(val) => {
                setDraftFilters((prev) => ({
                  ...prev,
                  state: val,
                  city: undefined,
                  area: undefined,
                }));
              }}
            >
              <SelectTrigger className="h-8 w-full text-sm">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {statesAndLocalGov.map((s) => (
                  <SelectItem key={s.state} value={s.state}>
                    {s.state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {draftFilters.state && (
              <Select
                value={draftFilters.city || ""}
                onValueChange={(val) => {
                  setDraftFilters((prev) => ({ ...prev, city: val, area: undefined }));
                }}
              >
                <SelectTrigger className="h-8 w-full text-sm">
                  <SelectValue placeholder="Select LGA" />
                </SelectTrigger>
                <SelectContent>
                  {lgas.map((lga: string) => (
                    <SelectItem key={lga} value={lga}>
                      {lga}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {draftFilters.city && areas.length > 0 && (
              <Select
                value={draftFilters.area || ""}
                onValueChange={(val) => handleDraftChange("area", val)}
              >
                <SelectTrigger className="h-8 w-full text-sm">
                  <SelectValue placeholder="Select Area" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((area: string) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CollapsibleSection>

        {/* Category */}
        <CollapsibleSection
          title="Category"
          isOpen={isCategoryOpen}
          onToggle={() => setIsCategoryOpen(!isCategoryOpen)}
        >
          <Select
            value={String(draftFilters.category_id || "")}
            onValueChange={(val) => handleDraftChange("category_id", Number(val))}
          >
            <SelectTrigger className="h-8 w-full text-sm">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category: { id: number; title: string }) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CollapsibleSection>

        {/* Property Type */}
        <CollapsibleSection
          title="Property Type & Sub Type"
          isOpen={isPropertyTypeOpen}
          onToggle={() => setIsPropertyTypeOpen(!isPropertyTypeOpen)}
        >
          <div className="flex w-full flex-col gap-4">
            {propertyTypes.map((type) => {
              const isChecked = String(draftFilters.property_type || "")
                .split(",")
                .includes(type.types);
              return (
                <div key={type.types} className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={type.types}
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        const currentTypes = String(draftFilters.property_type || "")
                          .split(",")
                          .filter(Boolean);
                        const newTypes = checked
                          ? [...currentTypes, type.types]
                          : currentTypes.filter((t) => t !== type.types);
                        handleDraftChange("property_type", newTypes.join(","));
                      }}
                    />
                    <label htmlFor={type.types} className="text-[14px]/4 text-[#41415A]">
                      {type.types}
                    </label>
                  </div>
                  {isChecked && (
                    <div className="ml-6 flex flex-col gap-2">
                      {type.sub_types.map((sub) => (
                        <div key={sub} className="flex items-center gap-3">
                          <Checkbox
                            id={sub}
                            checked={String(draftFilters.filter_property_sub_type || "")
                              .split(",")
                              .includes(sub)}
                            onCheckedChange={(checked) => {
                              const currentSubs = String(
                                draftFilters.filter_property_sub_type || "",
                              )
                                .split(",")
                                .filter(Boolean);
                              const newSubs = checked
                                ? [...currentSubs, sub]
                                : currentSubs.filter((s) => s !== sub);
                              handleDraftChange("filter_property_sub_type", newSubs.join(","));
                            }}
                          />
                          <label htmlFor={sub} className="text-[13px]/4 text-[#6B7280]">
                            {sub}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CollapsibleSection>

        {/* Property Status */}
        <CollapsibleSection
          title="Property Status"
          isOpen={isPropertyStatusOpen}
          onToggle={() => setIsPropertyStatusOpen(!isPropertyStatusOpen)}
        >
          <div className="flex w-full flex-col gap-4">
            {propertyStatus.map((status) => (
              <div key={status} className="flex items-center gap-3">
                <Checkbox
                  id={status}
                  checked={String(draftFilters.property_status || "")
                    .split(",")
                    .includes(status)}
                  onCheckedChange={(checked) => {
                    const currentStatus = String(draftFilters.property_status || "")
                      .split(",")
                      .filter(Boolean);
                    const newStatus = checked
                      ? [...currentStatus, status]
                      : currentStatus.filter((s) => s !== status);
                    handleDraftChange("property_status", newStatus.join(","));
                  }}
                />
                <label htmlFor={status} className="text-[14px]/4 text-[#41415A]">
                  {status}
                </label>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Property Features */}
        <CollapsibleSection
          title="Property Features"
          isOpen={isPropertyFeaturesOpen}
          onToggle={() => setIsPropertyFeaturesOpen(!isPropertyFeaturesOpen)}
        >
          <div className="flex h-40 w-full flex-col gap-4 overflow-y-scroll">
            {propertyFeatures.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <Checkbox
                  id={feature}
                  checked={String(draftFilters.property_features || "")
                    .split(",")
                    .includes(feature)}
                  onCheckedChange={(checked) => {
                    const currentFeatures = String(draftFilters.property_features || "")
                      .split(",")
                      .filter(Boolean);
                    const newFeatures = checked
                      ? [...currentFeatures, feature]
                      : currentFeatures.filter((f) => f !== feature);
                    handleDraftChange("property_features", newFeatures.join(","));
                  }}
                />
                <label htmlFor={feature} className="text-[14px]/4 text-[#41415A]">
                  {feature}
                </label>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Keyword */}
        <CollapsibleSection
          title="Keyword"
          isOpen={isKeywordOpen}
          onToggle={() => setIsKeywordOpen(!isKeywordOpen)}
        >
          <Input
            placeholder="Enter keyword"
            className="h-8 w-full rounded-xl border border-[#D5D5DD] px-3"
            value={draftFilters.q || ""}
            onChange={(e) => handleDraftChange("q", e.target.value)}
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
              value={[draftFilters.min_price || 1000000, draftFilters.max_price || 200000000]}
              onValueChange={(value) => {
                handleDraftChange("min_price", value[0]);
                handleDraftChange("max_price", value[1]);
              }}
              max={200000000}
              min={1000000}
              step={1000000}
              className="w-full"
            />
            <div className="flex items-center gap-2">
              <Input
                value={`₦${(draftFilters.min_price || 1000000).toLocaleString()}`}
                className="border-primary h-8 bg-white px-3 text-sm shadow-[0px_0px_3px_rgba(212,175,54,0.5)]"
                readOnly
              />
              <svg
                width="20"
                height="2"
                viewBox="0 0 20 2"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect y="0.5" width="20" height="1" fill="#D9D9D9" />
              </svg>
              <Input
                value={`₦${(draftFilters.max_price || 200000000).toLocaleString()}`}
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
              <label className="text-[14px]/4 text-[#41415A]">Min.</label>
              <div className="relative">
                <Input
                  type="number"
                  value={draftFilters.min_area ?? ""}
                  onChange={(e) =>
                    handleDraftChange(
                      "min_area",
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                  className="h-8 border-[#D5D5DD] bg-white px-3 pr-8 text-sm"
                />
                <span className="absolute top-2 right-2 text-xs text-gray-400">sq m</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[14px]/4 text-[#41415A]">Max.</label>
              <div className="relative">
                <Input
                  type="number"
                  value={draftFilters.max_area ?? ""}
                  onChange={(e) =>
                    handleDraftChange(
                      "max_area",
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                  className="h-8 border-[#D5D5DD] bg-white px-3 pr-8 text-sm"
                />
                <span className="absolute top-2 right-2 text-xs text-gray-400">sq m</span>
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
              <label className="text-[14px]/4 text-[#41415A]">Bedroom</label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, "5+"].map((num) => (
                  <Button
                    key={num}
                    variant={"outline"}
                    size="sm"
                    className={`h-8 rounded-xl px-3 text-[14px]/4 text-[#41415A] ${
                      selectedBedrooms.includes(String(num))
                        ? "border-primary hover:border-primary"
                        : "border-[#D5D5DD]"
                    }`}
                    onClick={() => {
                      const newBedrooms = selectedBedrooms.includes(String(num))
                        ? selectedBedrooms.filter((b) => b !== String(num))
                        : [...selectedBedrooms, String(num)];
                      handleDraftChange("bedrooms", newBedrooms.join(","));
                    }}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[14px]/4 text-[#41415A]">Bathroom</label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, "5+"].map((num) => (
                  <Button
                    key={num}
                    variant={"outline"}
                    size="sm"
                    className={`h-8 rounded-xl px-3 text-[14px]/4 text-[#41415A] ${
                      selectedBathrooms.includes(String(num))
                        ? "border-primary hover:border-primary"
                        : "border-[#D5D5DD]"
                    }`}
                    onClick={() => {
                      const newBathrooms = selectedBathrooms.includes(String(num))
                        ? selectedBathrooms.filter((b) => b !== String(num))
                        : [...selectedBathrooms, String(num)];
                      handleDraftChange("bathrooms", newBathrooms.join(","));
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
        {/* <CollapsibleSection
          title="Developer or Owner's Name"
          isOpen={isDeveloperOwnerOpen}
          onToggle={() => setIsDeveloperOwnerOpen(!isDeveloperOwnerOpen)}
        >
          <div className="flex w-full flex-col gap-2">
            <Input
              placeholder="e.g. Olivia"
              className="h-8 w-full border-[#D5D5DD] bg-white px-3 text-sm"
              value={draftFilters.developer_or_owners_name || ''}
              onChange={(e) => handleDraftChange('developer_or_owners_name', e.target.value)}
            />
          </div>
        </CollapsibleSection> */}

        {/* Verified Listing */}
        {/* <CollapsibleSection
          title="Verification Status"
          isOpen={isVerifiedOpen}
          onToggle={() => setIsVerifiedOpen(!isVerifiedOpen)}
        >
          <RadioGroup
            value={String(draftFilters.verified ?? 'all')}
            onValueChange={(val) => handleDraftChange('verified', val === 'all' ? undefined : val)}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="v-all" />
              <Label htmlFor="v-all">All Listings</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="v-verified" />
              <Label htmlFor="v-verified">Verified Only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="0" id="v-unverified" />
              <Label htmlFor="v-unverified">Unverified Only</Label>
            </div>
          </RadioGroup>
        </CollapsibleSection> */}

        {/* Property ID */}
        <CollapsibleSection
          title="Property ID"
          isOpen={isPropertyIdOpen}
          onToggle={() => setIsPropertyIdOpen(!isPropertyIdOpen)}
        >
          <div className="flex w-full flex-col gap-2">
            <Input
              placeholder="Search Properties by ID"
              className="h-8 w-full border-[#D5D5DD] bg-white px-3 text-sm"
              value={draftFilters.property_id || ""}
              onChange={(e) => handleDraftChange("property_id", e.target.value)}
            />
          </div>
        </CollapsibleSection>

        {/* Tags */}
        <CollapsibleSection
          title="Tags"
          isOpen={isTagsOpen}
          onToggle={() => setIsTagsOpen(!isTagsOpen)}
        >
          <div className="flex w-full flex-col gap-4">
            {tags.map((tag: { id: number; name: string }) => {
              const selectedTags = String(draftFilters.tags || "")
                .split(",")
                .filter(Boolean)
                .map(Number);
              return (
                <div key={tag.id} className="flex items-center gap-3">
                  <Checkbox
                    id={`tag-${tag.id}`}
                    checked={selectedTags.includes(tag.id)}
                    onCheckedChange={(checked) => {
                      const newTags = checked
                        ? [...selectedTags, tag.id]
                        : selectedTags.filter((id) => id !== tag.id);
                      handleDraftChange("tags", newTags.join(","));
                    }}
                  />
                  <label
                    htmlFor={`tag-${tag.id}`}
                    className="text-[14px]/4 text-[#41415A] capitalize"
                  >
                    {tag.name}
                  </label>
                </div>
              );
            })}
          </div>
        </CollapsibleSection>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 self-stretch">
          <Button
            variant="secondary"
            className="h-10 grow rounded-4xl bg-[#F1F1F4] px-4 py-[15px] text-[14px] leading-[17px] text-[#1F2130] hover:bg-gray-50"
            onClick={handleClearFilters}
          >
            Clear
          </Button>
          <Button
            style={{
              background: "linear-gradient(180deg, #505050 0%, #1E1E1E 60%)",
              boxShadow:
                "0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)",
            }}
            className="h-10 grow rounded-[40px] border border-[oklch(0.235_0_0/50%)] p-4 text-[14px] leading-[17px] font-semibold text-white"
            onClick={handleApplyFilters}
          >
            Apply Filter
          </Button>
        </div>
      </div>
    </div>
  );
};
