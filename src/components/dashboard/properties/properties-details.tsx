import { useParams } from '@tanstack/react-router';
import PropertyForm, { PropertyFormValues } from './property-form';
import { PageMetaTags } from '@/components/page-meta-data';

const PropertiesDetails = () => {
  const params = useParams({
    from: '/_dashboard/properties/$id',
  });

  console.log('pearms', params);

  const initialData: Partial<PropertyFormValues> = {
    listingTitle: '',
    listingType: 'For Sale',
    propertyType: '',
    landType: '',
    houseNumber: '',
    streetName: '',
    city: '',
    postalCode: '',
    state: '',
    bedrooms: '0',
    bathrooms: '0',
    propertyDocument: undefined,
  };

  return (
    <>
      <PageMetaTags
        title="Property: Modern Duplex in Lekki"
        description="Manage your property listing - view inquiries, update details, and track performance metrics."
        price="₦45,000,000"
        location="Lekki, Lagos"
        propertyType="Duplex"
        keywords="property management, listing details"
      />
      <PropertyForm isEdit={true} initialData={initialData} />
    </>
  );
};

export default PropertiesDetails;
