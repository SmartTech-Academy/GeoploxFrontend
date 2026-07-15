import { useParams } from "@tanstack/react-router";
import PropertyForm, { PropertyFormValues } from "./property-form";
import { PageMetaTags } from "@/components/page-meta-data";
import { useGetDashboardPropertyDetails } from "@/lib/services/properties";
import { Skeleton } from "@/components/ui/skeleton";

const PropertiesDetails = () => {
  const params = useParams({
    from: "/_dashboard/properties/$id",
  });

  const { data: propertyData, isLoading, isError } = useGetDashboardPropertyDetails(params.id);

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="mb-4 h-8 w-1/4" />
        <Skeleton className="h-100 w-full" />
      </div>
    );
  }

  if (isError) {
    return <div className="p-8 text-red-500">Error loading property details.</div>;
  }

  const property = propertyData?.data?.data?.data;

  const toTitleCase = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const categorySlugMap: Record<string, PropertyFormValues["category_slug"]> = {
    "For Rent": "for-rent",
    "For Sale": "for-sale",
    "Short Let": "short-let",
    "Joint Venture": "joint-venture",
  };

  // Transform API data to form values
  const initialData: Partial<PropertyFormValues> = property
    ? {
        id: property.id,
        title: property.title,
        category_slug: categorySlugMap[property.category] ?? "for-rent",
        property_type: toTitleCase(property.property_type),
        sub_type: property.property_sub_type || "",
        address: property.address || "",
        country: property.country || "",
        state: property.state,
        lga_or_city: property.city, // API provides LGA in the 'city' field
        area: property.area || "",
        description: property.desc,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area_sqft: property.area_sqft,
        price: property.price,
        currency: property.currency,
        images: property.images?.map((img: { url: string }) => img.url) || [],
        propertyDocument: property.property_document || "",
        proofOfAddress: property.proof_of_address || "",
        features: property.features || [],
        status: property.property_status || [],
      }
    : {};

  return (
    <>
      <PageMetaTags
        title={`Edit Property: ${property?.title || "Loading..."}`}
        description={property?.desc}
      />
      <PropertyForm isEdit={true} initialData={initialData} />
    </>
  );
};

export default PropertiesDetails;
