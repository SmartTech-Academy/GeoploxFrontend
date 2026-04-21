import ListingProperties from "@/components/listing-properties";
import { PageMetaTags } from "@/components/page-meta-data";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_landing/for-rent/")({
  component: () => (
    <>
      <PageMetaTags
        title="Properties for Rent"
        listingType="rent"
        description="Discover rental properties across Nigeria. From apartments to houses, find your perfect rental home."
        keywords="rental properties, apartments for rent, house rental, lease property"
      />
      <ListingProperties />
    </>
  ),
});
