import { WithSuspense } from "@/components/error-components";
import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const RouteComponent = WithSuspense(
  lazy(() => import("../../../components/dashboard/messaging/messaging-page")),
);

interface MessagesSearch {
  conversationId?: string;
}

export const Route = createFileRoute("/_dashboard/messages/")({
  validateSearch: (search: Record<string, unknown>): MessagesSearch => ({
    conversationId:
      typeof search.conversationId === "string" || typeof search.conversationId === "number"
        ? String(search.conversationId)
        : undefined,
  }),
  component: RouteComponent,
});
