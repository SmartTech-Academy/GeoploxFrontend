import { WithSuspense } from "@/components/error-components";
import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const RouteComponent = WithSuspense(
  lazy(() => import("../../../components/dashboard/managers-users/managers-users-page")),
);

export const Route = createFileRoute("/_dashboard/managers-users/")({
  component: RouteComponent,
});
