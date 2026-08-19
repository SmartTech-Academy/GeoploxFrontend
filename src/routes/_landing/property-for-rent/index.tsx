import ListingProperties from "@/components/listing-properties";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_landing/property-for-rent/")({
  component: () => <ListingProperties grammarCategory="property-for-rent" />,
});
