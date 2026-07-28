import { WithSuspense } from "@/components/error-components";
import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const RouteComponent = WithSuspense(
  lazy(() => import("../../../components/dashboard/getting-started/getting-started")),
);

export const Route = createFileRoute("/_dashboard/getting-started/")({
  component: RouteComponent,
});
