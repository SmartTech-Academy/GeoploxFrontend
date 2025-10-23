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

  const property = propertyData?.data?.data;

  // Transform API data to form values
  const initialData: Partial<PropertyFormValues> = property
    ? {
        id: property.id,
        listingTitle: property.title,
        listingType: property.category, // 'For Sale', 'Rent', 'Short Let'
        propertyType: property.property_type,
        landType: property.land_type, // Assuming this comes from API
        houseNumber: property.address, // API provides full address, splitting might be needed
        streetName: '', // API provides full address
        city: property.city,
        postalCode: '', // Not in API response
        state: property.state,
        localGovernment: property.city, // Assuming city is the local government
        propertyDescription: property.desc,
        bedrooms: String(property.bedrooms),
        bathrooms: String(property.bathrooms),
        totalArea: String(property.area_sqft),
        propertyPrice: String(property.price),
        currency: property.currency,
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
