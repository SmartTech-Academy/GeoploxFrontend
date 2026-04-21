import ListingDetail from "@/components/listing-detail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_landing/for-sale/$propertySubType/$state/$lga/$id")({
  component: ListingDetail,
});
