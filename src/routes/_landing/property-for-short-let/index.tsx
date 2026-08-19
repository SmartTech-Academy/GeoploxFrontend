import ListingProperties from "@/components/listing-properties";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_landing/property-for-short-let/")({
  component: () => <ListingProperties grammarCategory="property-for-short-let" />,
});
