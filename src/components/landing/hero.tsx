import assets from "@/assets";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import { Search, Home, ChevronsUpDown, Check } from "lucide-react";
import { useState, useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import statesAndLocalGov from "@/data/statesAndLocalGov.json";
import { cn } from "@/lib/utils";

interface Location {
  label: string;
  value: {
    state?: string;
    city?: string;
    area?: string;
  };
}

export function Hero() {
  const navigate = useNavigate();
  const [listingType, setListingType] = useState("short-let");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const locations = useMemo(() => {
    const allLocations: Location[] = [];
    statesAndLocalGov.forEach((stateData: any) => {
      allLocations.push({
        label: stateData.state,
        value: { state: stateData.state },
      });

      if (stateData.lgas) {
        stateData.lgas.forEach((lga: string) => {
          const lgaLabel = `${lga}, ${stateData.state}`;
          if (!allLocations.some((l) => l.label === lgaLabel)) {
            allLocations.push({
              label: lgaLabel,
              value: { state: stateData.state, city: lga },
            });
          }

          if (stateData[lga]) {
            stateData[lga].forEach((area: string) => {
              const areaLabel = `${area}, ${lga}, ${stateData.state}`;
              if (!allLocations.some((l) => l.label === areaLabel)) {
                allLocations.push({
                  label: areaLabel,
                  value: { state: stateData.state, city: lga, area: area },
                });
              }
            });
          }
        });
      }
    });
    return allLocations;
  }, []);

  const [query, setQuery] = useState("");
  const filteredLocations = useMemo(() => {
    if (!query) return locations;
    const q = query.toLowerCase();
    return locations.filter((l) => l.label.toLowerCase().includes(q));
  }, [locations, query]);

  const handleFindProperty = () => {
    const searchParams: Record<string, string> = {};
    if (selectedLocation?.value.state) {
      searchParams.state = selectedLocation.value.state;
    }
    if (selectedLocation?.value.city) {
      searchParams.city = selectedLocation.value.city;
    }
    if (selectedLocation?.value.area) {
      searchParams.area = selectedLocation.value.area;
    }

    navigate({
      to: `/${listingType}`,
      search: searchParams,
    });
  };

  return (
    <section className="relative flex min-h-[700px] items-center justify-start">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${assets.herohouse})`,
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 landing-container w-full py-(--landing-header-height)">
        <div className="flex w-full flex-col items-start gap-[66px] py-24 lg:py-0">
          <div className="flex max-w-[639px] flex-col items-start gap-[17px]">
            <div className="flex flex-col items-start gap-[9px]">
              {/* Tagline */}
              <p className="text-[38px] leading-[43px] font-normal tracking-[-0.02em] text-white italic">
                Buy, Sell, Rent
              </p>

              {/* Main Heading */}
              <h1 className="text-[66px] leading-[79px] font-semibold tracking-[-0.02em] text-balance text-white">
                Real Estate Done Right
              </h1>
            </div>

            {/* Subheading */}
            <p className="text-[20px]/7 text-primary-foreground">
              Get direct access to listings from real owners and developers — where trust meets
              transparency.
            </p>

            {/* Additional tagline */}
            <p className="text-[14px]/5 text-primary-foreground">
              No fake Real Estate Consultant, no hidden fees.
            </p>
          </div>

          {/* Search Interface */}
          <div className="flex w-full flex-col items-center gap-3 rounded-4xl bg-[oklch(1_0_0/50%)] p-4 backdrop-blur-md lg:max-w-[817px] lg:flex-row">
            <div className="relative flex w-full flex-1 items-center gap-2">
              <Search className="absolute top-4 left-3 size-4 -translate-y-1/2 transform text-[#D4AF36]" />
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isPopoverOpen}
                    className="h-10 w-full justify-start rounded-[85px] border border-[#D5D5DD] bg-white py-[14px] pl-10 text-base text-gray-900 placeholder:text-gray-500 focus-visible:ring-0"
                  >
                    <span className="truncate pl-5">
                      {selectedLocation ? selectedLocation.label : "Search location"}
                    </span>
                    <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="max-h-60 w-[--radix-popover-trigger-width] overflow-y-auto p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search location..."
                      value={query}
                      onValueChange={setQuery}
                    />
                    <CommandEmpty>No location found.</CommandEmpty>
                    <CommandGroup>
                      {filteredLocations.map((location) => (
                        <CommandItem
                          key={location.label}
                          value={location.label}
                          onSelect={(currentValue) => {
                            const newSelectedLocation = locations.find(
                              (loc) => loc.label.toLowerCase() === currentValue.toLowerCase(),
                            );
                            setSelectedLocation(newSelectedLocation || null);
                            setIsPopoverOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 size-4",
                              selectedLocation?.label === location.label
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {location.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="h-px w-full bg-[oklch(0.9158_0_0/53.33%)] lg:h-[28px] lg:w-px" />

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2">
                <Select defaultValue={listingType} onValueChange={(value) => setListingType(value)}>
                  <SelectTrigger className="h-10 min-w-[138px] rounded-[45px] border-0 border-[oklch(0.8754_0.0109_286.17)] bg-white text-[#41415A] focus:ring-0">
                    <div className="flex items-center gap-2">
                      <Home className="size-4 text-[oklch(0.7665_0.1393_91.15)]" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short-let">Short Let</SelectItem>
                    <SelectItem value="for-rent">Rent</SelectItem>
                    <SelectItem value="for-sale">Sell</SelectItem>
                    <SelectItem value="joint-venture">Joint Venture</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="h-[28px] w-px bg-[oklch(0.9158_0_0/53.33%)]" />

              <Button
                style={{
                  background: "linear-gradient(180deg, #505050 0%, #1E1E1E 60%)",
                  border: "1px solid rgba(30, 30, 30, 0.5)",
                  boxShadow:
                    "0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)",
                }}
                onClick={handleFindProperty}
                className="flex h-10 items-center justify-center rounded-[40px] p-4 text-[14px] leading-[17px] font-semibold text-white"
              >
                Find Property
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
