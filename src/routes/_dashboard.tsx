import DashboardLayout from "@/components/layouts/DashboardLayout";
import LoadingFallback from "@/components/loading-fallback";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard")({
  component: DashboardLayout,
  pendingComponent: () => <LoadingFallback />,
});
