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
      {/* <h1 className="mb-4 text-2xl font-bold">My Favorites</h1> */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <PropertyListingCardSkeleton key={i} />
          ))}
        </div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((property: any) => (
            <PropertyListingCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <EmptyState type="favorite" />
      )}
    </div>
  );
};

export default FavoritesPage;
