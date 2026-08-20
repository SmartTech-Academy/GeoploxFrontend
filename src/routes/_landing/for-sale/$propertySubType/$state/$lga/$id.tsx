import { createFileRoute, redirect } from "@tanstack/react-router";

// Old URL (no "in" separator between sub-type and state), replaced by the grammar-compliant
// path at .../$propertySubType/in/$state/$lga/$id - redirects rather than rendering directly
// so this listing only ever has one indexable/live URL for the same property.
export const Route = createFileRoute("/_landing/for-sale/$propertySubType/$state/$lga/$id")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/for-sale/$propertySubType/in/$state/$lga/$id",
      params,
      replace: true,
      statusCode: 301,
    });
  },
});
