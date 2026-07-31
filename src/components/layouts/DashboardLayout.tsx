import { Suspense, useEffect, useState } from "react";
import LoadingFallback from "../loading-fallback";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { AppSidebar } from "../app-sidebar";
import { TopNav } from "../top-nav";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { cn } from "@/lib/utils";
import { Toaster } from "../ui/sonner";
import { useGetProfileData } from "@/lib/services/profile";
import PermissionDenied from "../permission-denied";
import { getPrimaryNavigation } from "@/lib/navigation";

const DashboardLayout = () => {
  const [useMaxWidth, setUseMaxWith] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user, isPending, isError } = useGetProfileData();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // No token at all: there's nothing to authenticate, so go straight to login instead of
    // waiting on a disabled query that will never resolve.
    if (!token) {
      navigate({ to: "/login" });
      return;
    }

    // A genuine fetch failure on this authenticated endpoint (after the query's own retries
    // are exhausted) means the session/token itself is invalid - expired, revoked, etc. - not
    // that the user lacks permission for this particular route. Treat it as an auth failure
    // and send them to login, rather than falling through to the permission check below with
    // an undefined user (which used to render "Permission Denied" for what was really just an
    // expired session or a transient failed request).
    if (isError) {
      localStorage.removeItem("token");
      navigate({ to: "/login" });
      return;
    }

    if (
      user &&
      user.user_role !== "admin" &&
      user.onboarding_status !== "active" &&
      user.onboarding_status !== "newly_registered" &&
      location.pathname !== "/getting-started"
    ) {
      navigate({ to: "/getting-started" });
    }
  }, [navigate, location.pathname, user, isError]);

  const token = localStorage.getItem("token");

  // While there's no token, the profile is still loading, or it just failed, the effect above
  // is already handling the redirect to login - show the loading state during that brief
  // window instead of ever computing (and flashing) the permission check against an undefined
  // user.
  if (!token || isPending || isError) return <LoadingFallback />;

  // 🔹 Permission check happens here - only once we have a confirmed, successfully-loaded user.
  const allowedNav = getPrimaryNavigation(user);
  // Always allow access to getting-started (onboarding) and notifications (the bell icon in the
  // shared TopNav links here for every role, but no role's nav array lists it as a sidebar item -
  // without this it would 404 into Permission Denied for every single user).
  const allowedPaths = [
    "/getting-started",
    "/notifications",
    ...allowedNav.map((item) => item.href),
  ];

  const isAllowed = allowedPaths.some((p) => location.pathname.startsWith(p));

  if (!isAllowed) {
    return <PermissionDenied />; // ⬅️ Genuinely disallowed - show it and let it stay.
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <TopNav setUseMaxWith={setUseMaxWith} />
          <Toaster />
          <main className="min-h-dvh w-full flex-1 overflow-auto border-[#E1E1E6] bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.08)]">
            <div
              className={cn(
                "mx-auto w-full animate-in transition-all duration-300 ease-linear fade-in-0 slide-in-from-bottom-4",
                useMaxWidth ? "max-w-[1216px] px-8" : "max-w-full px-8",
              )}
            >
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </Suspense>
  );
};
export default DashboardLayout;
