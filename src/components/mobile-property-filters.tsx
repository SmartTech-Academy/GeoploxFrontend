import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const MobilePropertyFilters = () => {
  const [priceRange, setPriceRange] = useState([10000000, 99000000]);
  const [landAreaMin, setLandAreaMin] = useState(3000);
  const [landAreaMax, setLandAreaMax] = useState(5000);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedBedrooms, setSelectedBedrooms] = useState<any>([2]);
  const [selectedBathrooms, setSelectedBathrooms] = useState<any>([3]);

  return (
    <div className="mb-6 flex flex-col gap-4 px-4">
      {/* Basic Filters Row 1 */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-[14px] leading-4 font-medium text-[#41415A]">Location</label>
          <Input placeholder="e.g Lekki, Lagos" className="h-8 w-full rounded-xl border border-[#D5D5DD] px-3" />
        </div>
      </div>

      {/* Basic Filters Row 2 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-[14px] leading-4 font-medium text-[#41415A]">Category</label>
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
          <label className="text-[14px] leading-4 font-medium text-[#41415A]">Property Type</label>
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
          <label className="text-[14px] leading-4 font-medium text-[#41415A]">Land Type</label>
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
          <label className="text-[14px] leading-4 font-medium text-[#41415A]">Keyword</label>
          <Input placeholder="Enter keyword" className="h-10 w-full rounded-xl border border-[#D5D5DD] bg-white px-3" />
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
            <h3 className="text-[14px] leading-4 font-semibold text-[#41415A]">Price Range</h3>
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
                  className="border-primary h-10 bg-white px-3 text-sm shadow-[0px_0px_3px_rgba(212,175,54,0.5)]"
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
            <h3 className="text-[14px] leading-4 font-semibold text-[#41415A]">Land Area</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[12px] leading-3.5 text-[#41415A]">Min.</label>
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
                <label className="text-[12px] leading-3.5 text-[#41415A]">Max.</label>
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
            <h3 className="text-[14px] leading-4 font-semibold text-[#41415A]">Bedroom/Bathroom</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[12px] leading-3.5 text-[#41415A]">Bedroom</label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, '5+'].map((num) => (
                    <Button
                      key={num}
                      variant={'outline'}
                      size="sm"
                      className={`h-10 rounded-xl px-3 text-[14px] leading-4 text-[#41415A] ${
                        selectedBedrooms.includes(num) ? 'border-[#D4AF36] bg-[#D4AF36] text-white' : 'border-[#D5D5DD]'
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
                <label className="text-[12px] leading-3.5 text-[#41415A]">Bathroom</label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, '5+'].map((num) => (
                    <Button
                      key={num}
                      variant={'outline'}
                      size="sm"
                      className={`h-10 rounded-xl px-3 text-[14px] leading-4 text-[#41415A] ${
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
            <h3 className="text-[14px] leading-4 font-semibold text-[#41415A]">Developer / Owner</h3>
            <div className="flex flex-col gap-2">
              <label className="text-[12px] leading-3.5 text-[#41415A]">Name</label>
              <Input
                placeholder="e.g Royalty Properties"
                className="h-10 w-full border-[#D5D5DD] bg-white px-3 text-sm"
              />
            </div>
          </div>

          {/* Verified Listing */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[14px] leading-4 font-semibold text-[#41415A]">Verified Listing</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Checkbox id="all-listings-mobile" />
                <label htmlFor="all-listings-mobile" className="text-[14px] leading-4 text-[#41415A]">
                  All Listings
                </label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="verified-only-mobile" defaultChecked />
                <label htmlFor="verified-only-mobile" className="text-[14px] leading-4 text-[#41415A]">
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
          className="h-12 flex-1 rounded-4xl bg-[#F1F1F4] px-4 text-[14px] leading-[17px] text-[#1F2130] hover:bg-gray-200"
        >
          Clear
        </Button>
        <Button
          style={{
            background: 'linear-gradient(180deg, #505050 0%, #1E1E1E 60%)',
            boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
          }}
          className="h-12 flex-1 rounded-[40px] border border-[oklch(0.235_0_0/50%)] text-[14px] leading-[17px] font-semibold text-white"
        >
          Apply Filter
        </Button>
      </div>
    </div>
  );
};
