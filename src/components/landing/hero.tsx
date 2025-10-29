import assets from '@/assets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from '@tanstack/react-router';
import { Search, Home } from 'lucide-react';
import { useState } from 'react';

export function Hero() {
  const navigate = useNavigate();
  const [listingType, setListingType] = useState('buy');

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
      <div className="landing-container relative z-10 w-full py-(--landing-header-height)">
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
            <p className="text-primary-foreground text-[20px] leading-7">
              Get direct access to listings from real owners and developers — where trust meets transparency.
            </p>

            {/* Additional tagline */}
            <p className="text-primary-foreground text-[14px] leading-5">No fake agents, no hidden fees.</p>
          </div>

          {/* Search Interface */}
          <div className="flex w-full flex-col items-center gap-3 rounded-4xl bg-[oklch(1_0_0_/_50%)] p-4 backdrop-blur-[12px] lg:max-w-[817px] lg:flex-row">
            <div className="relative flex w-full flex-1 items-center gap-2">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 transform text-[#D4AF36]" />
              <Input
                placeholder="Search location"
                className="h-10 rounded-[85px] border border-[#D5D5DD] bg-white py-[14px] pl-10 text-base text-gray-900 placeholder:text-gray-500 focus-visible:ring-0"
              />
            </div>

            <div className="h-px w-full bg-[oklch(0.9158_0_0_/_53.33%)] lg:h-[28px] lg:w-px" />

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
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="rent">Rent</SelectItem>
                    <SelectItem value="sell">Sell</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="h-[28px] w-px bg-[oklch(0.9158_0_0_/_53.33%)]" />

              <Button
                style={{
                  background: 'linear-gradient(180deg, #505050 0%, #1E1E1E 60%)',
                  border: '1px solid rgba(30, 30, 30, 0.5)',
                  boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
                }}
                onClick={() => navigate({ to: `/${listingType}` })}
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
