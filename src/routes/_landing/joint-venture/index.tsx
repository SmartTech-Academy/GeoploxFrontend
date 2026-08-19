import ListingProperties from "@/components/listing-properties";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_landing/joint-venture/")({
  component: () => <ListingProperties grammarCategory="joint-venture" />,
});
