import { Outlet, useRouterState } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { useEffect } from "react";
import NProgress from "nprogress";

// Configure NProgress once
NProgress.configure({
  showSpinner: false, // disable spinner
  trickleSpeed: 200, // adjust bar animation speed
  minimum: 0.08, // where the bar starts
});
function RouteLoader() {
  const { status } = useRouterState();

  useEffect(() => {
    if (status === "pending") {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [status]);

  return null;
}

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Main content */}
      <div className="h-full">
        <RouteLoader />
        <Outlet />
        <TanStackRouterDevtools />
      </div>
    </div>
  );
};

export default RootLayout;
