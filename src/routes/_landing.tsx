import LandingLayout from "@/components/layouts/LandingLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_landing")({
  component: LandingLayout,
});
