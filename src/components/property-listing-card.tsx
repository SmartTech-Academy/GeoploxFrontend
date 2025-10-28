import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BedDouble, ShowerHead, Square } from 'lucide-react';
import { Link, useLocation } from '@tanstack/react-router';
import { formatPrice } from '@/lib/utils';

export interface Property {
  id: string;
  slug: string;
  title: string;
  price: number;
  currency: string;
  location: {
    city: string;
    state: string;
  };
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  excerpt: string;
  cover_image: string;
  thumbnail_images?: string[];
  category: string;
}

interface PropertyListingCardProps {
  property: Property;
}

export const PropertyListingCard: React.FC<PropertyListingCardProps> = ({ property }) => {
  const location = useLocation();

  return (
    <div className="flex w-full items-center justify-between gap-[89px] self-stretch border-b border-[#F1F1F4] pb-10">
      <div className="grid h-[266px] w-[463px] grid-cols-2 gap-2">
        {/* Large Image - spans 2 rows */}
        <div className="row-span-2">
          <img src={property.cover_image} alt={property.title} className="h-full w-full object-cover" />
        </div>

        {/* Small Image 1 */}
        <div className="h-[129px] w-full">
          <img
            src={property.thumbnail_images?.[0] || property.cover_image}
            alt={`${property.title} - view 1`}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Small Image 2 */}
        <div className="h-[129px]">
          <img
            src={property.thumbnail_images?.[1] || property.cover_image}
            alt={`${property.title} - view 2`}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="flex flex-col items-start gap-9">
        <div className="flex flex-col gap-4 self-stretch">
          <div className="flex flex-col items-start gap-2.5">
            <Badge className="h-[25px] rounded border border-[oklch(0.5931_0_0_/_30%)] bg-white px-2 py-0.5 text-[14px] leading-[21px] font-normal text-[#0B0B0D]">
              {property.category}
            </Badge>

            <p className="text-[16px] leading-[18px] text-[#7F7F7F]">{property.title}</p>

            <p className="font-dm_sans text-[20px] leading-[26px] font-bold text-[#1F2130]">
              {formatPrice(property.price, property.currency)}
            </p>
          </div>

          <div className="flex flex-col items-start gap-[11px] self-stretch">
            <span className="text-[14px] leading-4 text-[#545767]">
              {property.location.city}, {property.location.state}
            </span>

            <div className="flex w-full items-center gap-5 self-stretch text-[14px] leading-4 text-[oklch(0_0_0_/_80%)]">
              <div className="flex items-center gap-2">
                <BedDouble className="text-primary size-[18px]" />
                <span>{property.bedrooms} Beds</span>
              </div>
              <div className="flex items-center gap-2">
                <ShowerHead className="text-primary size-[18px]" />
                <span>{property.bathrooms} Baths</span>
              </div>
              <div className="flex items-center gap-2">
                <Square className="text-primary size-[18px]" />
                <span>{property.area_sqft.toLocaleString()} sq ft</span>
              </div>
            </div>

            <p className="mb-4 line-clamp-2 text-sm text-gray-600">{property.excerpt}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-stretch">
          <Button
            asChild
            variant={'secondary'}
            className="h-8 w-1/2 rounded-[40px] bg-[#F1F1F4] p-4 text-[14px] leading-[17px] font-semibold text-[#41415A]"
          >
            <Link
              params={{ id: property.slug }}
              to={
                location.pathname.includes('/buy')
                  ? '/buy/$id'
                  : location.pathname.includes('/rent')
                    ? '/rent/$id'
                    : '/sell/$id'
              }
            >
              View Details
            </Link>
          </Button>

          <Button
            style={{
              background: 'linear-gradient(180deg, #D4AF36 0%, #B69118 60%)',
              boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
            }}
            className="h-8 w-1/2 rounded-[40px] border border-[oklch(0.7665_0.1393_91.15/50%)] p-4 text-[14px] leading-[17px] font-semibold text-white"
          >
            Contact
          </Button>
        </div>
      </div>
    </div>
  );
};
