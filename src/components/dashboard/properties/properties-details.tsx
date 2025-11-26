import { useParams } from '@tanstack/react-router';
import PropertyForm, { PropertyFormValues } from './property-form';
import { PageMetaTags } from '@/components/page-meta-data';
import { useGetDashboardPropertyDetails } from '@/lib/services/properties';
import { Skeleton } from '@/components/ui/skeleton';

const PropertiesDetails = () => {
  const params = useParams({
    from: '/_dashboard/properties/$id',
  });

  const { data: propertyData, isLoading, isError } = useGetDashboardPropertyDetails(params.id);

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="mb-4 h-8 w-1/4" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (isError) {
    return <div className="p-8 text-red-500">Error loading property details.</div>;
  }

  const property = propertyData?.data?.data?.data;

  const toTitleCase = (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Transform API data to form values
  const initialData: Partial<PropertyFormValues> = property
    ? {
        id: property.id,
        listingTitle: property.title,
        listingType: property.category, // 'For Sale', 'Rent', 'Short Let'
        propertyType: toTitleCase(property.property_type),
        // landType: property.land_type, // Not in API response
        // Splitting address into houseNumber and streetName
        houseNumber: property.address?.split(' ')[0] || '',
        streetName: property.address?.split(' ').slice(1).join(' ') || '',
        // city: property.city, // API provides LGA as city
        // postalCode: '', // Not in API response
        state: property.state,
        localGovernment: property.city, // API provides LGA in the 'city' field
        propertyDescription: property.desc,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        totalArea: property.area_sqft,
        propertyPrice: property.price,
        currency: property.currency,
        propertyImages: property.images?.map((img: { url: string }) => img.url) || [],
        nearbyAmenities: property.features || [],
      }
    : {};

  return (
    <>
      <PageMetaTags title={`Edit Property: ${property?.title || 'Loading...'}`} description={property?.desc} />
      <PropertyForm isEdit={true} initialData={initialData} />
    </>
  );
};

export default PropertiesDetails;
