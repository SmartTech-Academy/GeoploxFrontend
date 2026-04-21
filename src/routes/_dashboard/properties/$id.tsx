import { WithSuspense } from "@/components/error-components";
import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const RouteComponent = WithSuspense(
  lazy(() => import("../../../components/dashboard/properties/properties-details")),
);
export const Route = createFileRoute("/_dashboard/properties/$id")({
  component: RouteComponent,
});
