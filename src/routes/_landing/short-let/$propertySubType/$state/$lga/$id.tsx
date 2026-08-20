import { createFileRoute, redirect } from "@tanstack/react-router";

// Old URL (no "in" separator between sub-type and state), replaced by the grammar-compliant
// path at .../$propertySubType/in/$state/$lga/$id.
export const Route = createFileRoute("/_landing/short-let/$propertySubType/$state/$lga/$id")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/short-let/$propertySubType/in/$state/$lga/$id",
      params,
      replace: true,
      statusCode: 301,
    });
  },
});
