import { WithSuspense } from "@/components/error-components";
import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const RouteComponent = WithSuspense(
  lazy(() => import("../../../components/dashboard/blogs/create-blogs")),
);
export const Route = createFileRoute("/_dashboard/blogs/create")({
  component: RouteComponent,
});
