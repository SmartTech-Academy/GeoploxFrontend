import ListingProperties from "@/components/listing-properties";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_landing/property-for-sale/$")({
  component: RouteComponent,
});

function RouteComponent() {
  const { _splat } = Route.useParams();
  return <ListingProperties grammarCategory="property-for-sale" grammarSplat={_splat} />;
}
