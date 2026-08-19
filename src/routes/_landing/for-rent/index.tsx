import { createFileRoute, redirect } from "@tanstack/react-router";
import { buildListingUrl } from "@/lib/url-grammar";

// Old query-string-based URL, replaced by the path-based grammar at /property-for-rent/...
export const Route = createFileRoute("/_landing/for-rent/")({
  beforeLoad: () => {
    const params = new URLSearchParams(window.location.search);
    const target = buildListingUrl({
      category: "property-for-rent",
      state: params.get("state") || undefined,
      city: params.get("city") || undefined,
      area: params.get("area") || undefined,
    });
    throw redirect({ href: target, replace: true, statusCode: 301 });
  },
});
