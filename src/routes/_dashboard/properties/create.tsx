import { WithSuspense } from "@/components/error-components";
import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const RouteComponent = WithSuspense(
  lazy(() => import("../../../components/dashboard/properties/properties-create")),
);

export const Route = createFileRoute("/_dashboard/properties/create")({
  component: RouteComponent,
});
