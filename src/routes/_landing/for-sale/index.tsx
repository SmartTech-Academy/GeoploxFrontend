import { createFileRoute, redirect } from "@tanstack/react-router";
import { buildListingUrl } from "@/lib/url-grammar";

// Old query-string-based URL, replaced by the path-based grammar at /property-for-sale/... -
// redirects rather than rendering directly so this category only ever has one indexable/live
// URL shape (avoids duplicate content between the old and new pages for the same search).
export const Route = createFileRoute("/_landing/for-sale/")({
  beforeLoad: () => {
    const params = new URLSearchParams(window.location.search);
    const target = buildListingUrl({
      category: "property-for-sale",
      state: params.get("state") || undefined,
      city: params.get("city") || undefined,
      area: params.get("area") || undefined,
    });
    throw redirect({ href: target, replace: true, statusCode: 301 });
  },
});
