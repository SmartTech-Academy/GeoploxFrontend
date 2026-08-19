import ListingProperties from "@/components/listing-properties";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_landing/joint-venture/$")({
  component: RouteComponent,
});

function RouteComponent() {
  const { _splat } = Route.useParams();
  return <ListingProperties grammarCategory="joint-venture" grammarSplat={_splat} />;
}
