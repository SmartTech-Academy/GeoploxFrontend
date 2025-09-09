import ListingProperties from '@/components/listing-properties';
import { PageMetaTags } from '@/components/page-meta-data';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_landing/sell/')({
  component: () => (
    <>
      <PageMetaTags
        title="Properties for Sale"
        listingType="buy"
        description="Browse thousands of properties for sale. Find your dream home with transparent pricing and direct owner contact."
        keywords="homes for sale, buy property, real estate investment, house purchase"
      />

      <ListingProperties />
    </>
  ),
});
