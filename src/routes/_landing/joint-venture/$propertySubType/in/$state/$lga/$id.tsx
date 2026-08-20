import ListingDetail from "@/components/listing-detail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_landing/joint-venture/$propertySubType/in/$state/$lga/$id")({
  component: ListingDetail,
});
