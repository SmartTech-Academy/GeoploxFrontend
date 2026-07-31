import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BedDouble, ShowerHead, Square, Trash2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { formatPrice, slugify } from "@/lib/utils";
import { useRemoveFromFavorites, useCreateConversation } from "@/lib/services";
import { toast } from "sonner";
import { FavoriteButton } from "./favorite-button";
import { LazyImage } from "./ui/lazy-image";

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
  images?: {
    url: string;
    is_cover: boolean;
    position: number;
  }[];
  category: string;
  property_type: string;
  is_favourited?: boolean;
  owner?: {
    id: string;
    name: string;
    email_address?: string;
    phone_number?: string;
    image_url?: string;
    role?: string;
  };
}

const getPropertyBasePath = (category?: string) => {
  switch (category?.toLowerCase()) {
    case "for rent":
      return "/for-rent";
    case "short let":
      return "/short-let";
    case "joint venture":
      return "/joint-venture";
    case "for sale":
    default:
      return undefined;
  }
};

interface PropertyListingCardProps {
  property: Property;
  isDashboard?: boolean;
  identifier?: string;
}

export const PropertyListingCard: React.FC<PropertyListingCardProps> = ({
  property,
  isDashboard,
  identifier,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);

  const { mutate: createConversation } = useCreateConversation();
  const { mutate: removeFromFavorites, isPending } = useRemoveFromFavorites(["favorites"]);

  const pathname = location?.pathname || "";
  const isAdminListing = pathname.includes("/admin-listing");
  const isFavoritesPage = pathname.includes("/favorites");

  const handleContactClick = () => {
    if (!property.owner?.id) {
      toast.error("Owner information is unavailable.");
      return;
    }

    setIsCreatingConversation(true);
    createConversation(
      {
        participant_user_id: property.owner.id,
        subject: `Enquiry about ${property.title || property.property_type} in ${property.location.city}`,
      },
      {
        onSuccess: () => {
          setIsCreatingConversation(false);
          toast.success("Chat opened successfully!");
          navigate({ to: "/messages" });
        },
        onError: () => {
          setIsCreatingConversation(false);
          toast.error("Failed to open chat. Please try again.");
        },
      },
    );
  };

  const detailPath = (() => {
    if (isDashboard) {
      return isAdminListing ? `/admin-listing/${identifier}` : `/listing/${identifier}`;
    }

    const { property_type, category, location } = property;
    const { state, city } = location;

    const slugifiedParams = {
      propertyType: slugify(property_type),
      propertySubType: slugify(category),
      state: slugify(state),
      lga: slugify(city),
    };

    // Prefer the property's own category (correct even in mixed-category contexts like
    // /favorites); fall back to the current section's path only when category is missing.
    let basePath = getPropertyBasePath(category);
    if (!basePath) {
      if (pathname.includes("/short-let")) {
        basePath = "/short-let";
      } else if (pathname.includes("/for-rent")) {
        basePath = "/for-rent";
      } else if (pathname.includes("/joint-venture")) {
        basePath = "/joint-venture";
      } else {
        basePath = "/for-sale";
      }
    }

    return `${basePath}/${slugifiedParams.propertyType}/${slugifiedParams.state}/${slugifiedParams.lga}/${identifier}`;
  })();

  const displayTitle = `${property.bedrooms ? `${property.bedrooms} Bedroom ` : ""}${property.property_type} ${
    property.category && typeof property.category === "string"
      ? property.category.toLowerCase().startsWith("for")
        ? property.category
        : `for ${property.category}`
      : ""
  } in ${property.location.city} ${property.location.state}`;

  return (
    <div className="flex w-full flex-col items-center justify-between gap-4 self-stretch border-b border-[#F1F1F4] pb-10 lg:flex-row lg:gap-[89px]">
      <div className="flex w-full gap-2 lg:w-[463px] lg:shrink-0">
        {/* Large Image - a flex row stretches this to exactly match the rendered height
            of the two stacked thumbnails beside it. The image is absolutely positioned so
            its own natural aspect ratio never influences that height (otherwise a tall
            source photo's intrinsic proportions can win out over the flex stretch). */}
        <div className="relative w-1/2 overflow-hidden rounded-[12px] bg-[#F5F5F7]">
          <LazyImage
            src={property.cover_image}
            alt={property.title}
            containerClassName="absolute inset-0 size-full"
            className="size-full object-cover"
          />
          {!isFavoritesPage && (
            <FavoriteButton
              propertyId={property.id}
              isFavorited={property.is_favourited}
              className="absolute top-3 right-3"
            />
          )}
        </div>

        <div className="flex w-1/2 flex-col gap-2">
          {/* Small Image 1 */}
          <div className="aspect-[4/3] overflow-hidden rounded-[12px] bg-[#F5F5F7]">
            <LazyImage
              src={
                property?.thumbnail_images?.[1] ||
                property?.images?.[1]?.url ||
                property.cover_image
              }
              alt={`${property.title} - view 1`}
              containerClassName="size-full"
              className="size-full object-cover"
            />
          </div>
          {/* Small Image 2 */}
          <div className="aspect-[4/3] overflow-hidden rounded-[12px] bg-[#F5F5F7]">
            <LazyImage
              src={
                property?.thumbnail_images?.[2] ||
                property?.images?.[2]?.url ||
                property.cover_image
              }
              alt={`${property.title} - view 2`}
              containerClassName="size-full"
              className="size-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start gap-9">
        <div className="flex flex-col gap-4 self-stretch">
          <div className="flex flex-col items-start gap-2.5">
            {property.category && typeof property.category === "string" && (
              <Badge className="h-[25px] rounded-sm border border-[oklch(0.5931_0_0/30%)] bg-white px-2 py-0.5 text-[14px] leading-[21px] font-normal text-[#0B0B0D]">
                {property.category}
              </Badge>
            )}

            <p className="text-[16px] leading-[18px] text-[#7F7F7F]">{displayTitle}</p>

            <p className="font-dm_sans text-[20px] leading-[26px] font-bold text-[#1F2130]">
              {formatPrice(property.price, property.currency)}
            </p>
          </div>

          <div className="flex flex-col items-start gap-[11px] self-stretch">
            <span className="text-[14px]/4 text-[#545767]">
              {property.location.city}, {property.location.state}
            </span>

            <div className="flex w-full items-center gap-5 self-stretch text-[14px]/4 text-[oklch(0_0_0/80%)]">
              <div className="flex items-center gap-2">
                <BedDouble className="size-[18px] text-primary" />
                <span>{property.bedrooms} Beds</span>
              </div>
              <div className="flex items-center gap-2">
                <ShowerHead className="size-[18px] text-primary" />
                <span>{property.bathrooms} Baths</span>
              </div>
              {!!property.area_sqft && (
                <div className="flex items-center gap-2">
                  <Square className="size-[18px] text-primary" />
                  <span>{property.area_sqft.toLocaleString()} sq ft</span>
                </div>
              )}
            </div>

            <p className="mb-4 line-clamp-2 text-sm text-gray-600">{property.excerpt}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-stretch">
          <Button
            asChild
            variant={"secondary"}
            className="h-8 w-1/2 rounded-[40px] bg-[#F1F1F4] p-4 text-[14px] leading-[17px] font-semibold text-[#41415A]"
          >
            <Link to={detailPath}>View Details</Link>
          </Button>
          {isFavoritesPage ? (
            <Button
              variant="destructive"
              className="h-8 w-1/2 rounded-[40px] p-4 text-[14px] leading-[17px] font-semibold"
              onClick={() => removeFromFavorites(property.id)}
              disabled={isPending}
            >
              <Trash2 className="mr-2 size-4" />
              Remove
            </Button>
          ) : (
            <Button
              style={{
                background: "linear-gradient(180deg, #D4AF36 0%, #B69118 60%)",
                boxShadow:
                  "0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)",
              }}
              className="h-8 w-1/2 rounded-[40px] border border-[oklch(0.7665_0.1393_91.15/50%)] p-4 text-[14px] leading-[17px] font-semibold text-white"
              onClick={handleContactClick}
              disabled={isCreatingConversation}
            >
              {isCreatingConversation ? "Opening Chat..." : "Contact"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
