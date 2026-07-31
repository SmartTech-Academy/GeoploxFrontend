import { useGetFavorites } from "@/lib/services/favorites";
import { PropertyListingCard } from "@/components/property-listing-card";
import { PropertyListingCardSkeleton } from "@/components/property-listing-card-skeleton";
import { EmptyState } from "@/components/empty-state";

const FavoritesPage = () => {
  const { data: favoritesResponse, isLoading } = useGetFavorites();
  const favorites =
    favoritesResponse?.data?.data?.data?.map((property: any) => ({
      ...property,
      cover_image:
        property.cover_image || property.images?.find((img: any) => img.is_cover)?.url || "",
      excerpt: property.excerpt || property.desc || "",
      location: {
        city: property.location?.city || property.city || "N/A",
        state: property.location?.state || property.state || "N/A",
      },
      category:
        typeof property.category === "string"
          ? property.category
          : property.category?.title || property.category?.slug || "N/A",
    })) || [];

  return (
    <div className="p-4">
      {/* PropertyListingCard is a horizontal row layout (fixed-width image block at
          lg: breakpoint) designed to be stacked one-per-row — the same way every other
          listing page in the app (For Sale, For Rent, dashboard Listing, etc.) renders
          it. A multi-column grid here squeezed that fixed-width image block into cells
          too narrow for it, causing images/text to overlap. */}
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <PropertyListingCardSkeleton key={i} />
          ))}
        </div>
      ) : favorites.length > 0 ? (
        <div className="flex flex-col gap-4">
          {favorites.map((property: any) => (
            <PropertyListingCard key={property.id} property={property} identifier={property.slug} />
          ))}
        </div>
      ) : (
        <EmptyState type="favorite" />
      )}
    </div>
  );
};

export default FavoritesPage;
