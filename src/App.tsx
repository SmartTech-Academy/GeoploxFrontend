// Import the generated route tree
import { Suspense, lazy } from "react";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { queryClient } from "./lib/queryClient";

// Dynamically imported (and only in dev) so the devtools panel never ends up in the production
// bundle at all, rather than just being present-but-unrendered.
const TanStackRouterDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-router-devtools").then((m) => ({
        default: m.TanStackRouterDevtools,
      })),
    )
  : null;

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: "intent",
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  defaultStaleTime: 5000,
  scrollRestoration: true,
  defaultViewTransition: true,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
function App() {
  return (
    <>
      <RouterProvider router={router} />
      {TanStackRouterDevtools && (
        <Suspense fallback={null}>
          <TanStackRouterDevtools router={router} />
        </Suspense>
      )}
    </>
  );
}
export default App;
