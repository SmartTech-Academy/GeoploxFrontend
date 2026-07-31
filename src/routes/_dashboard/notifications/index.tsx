import { WithSuspense } from "@/components/error-components";
import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const RouteComponent = WithSuspense(
  lazy(() => import("../../../components/dashboard/notifications/notifications-page")),
);

export const Route = createFileRoute("/_dashboard/notifications/")({
  component: RouteComponent,
});
