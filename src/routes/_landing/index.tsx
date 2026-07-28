import { DiscoverSection } from "@/components/landing/discover-section";
import { Hero } from "@/components/landing/hero";
import { PageMetaTags } from "@/components/page-meta-data";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_landing/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full">
      <PageMetaTags
        title="Real Estate Done Right"
        description="Find your perfect home or investment property. Buy, sell, and rent properties with direct access to listings from real owners and developers."
        keywords="real estate platform, property marketplace, buy sell rent"
      />

      <Hero />
      <DiscoverSection />
    </div>
  );
}
