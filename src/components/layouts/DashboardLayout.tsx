import { Suspense, useEffect, useState } from 'react';
import LoadingFallback from '../loading-fallback';
import { Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import { AppSidebar } from '../app-sidebar';
import { TopNav } from '../top-nav';
import { SidebarInset, SidebarProvider } from '../ui/sidebar';
import { cn } from '@/lib/utils';
import { Toaster } from '../ui/sonner';
import { useGetProfileData } from '@/lib/services/profile';
import PermissionDenied from '../permission-denied';
import { getPrimaryNavigation } from '@/lib/navigation';

const DashboardLayout = () => {
  const [useMaxWidth, setUseMaxWith] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user, isPending, isError } = useGetProfileData();

  useEffect(() => {
    const token = localStorage.getItem('token');

    // If there's no token OR the profile fetch fails, the session is invalid.
    // Log the user out and redirect to the login page.

    if (!token) {
      localStorage.removeItem('token');
    }

    if (!token && isError) {
      localStorage.removeItem('token');
      navigate({ to: '/login' });
      return;
    }

    if (
      user &&
      user.user_role !== 'admin' &&
      user.onboarding_status !== 'active' &&
      user.onboarding_status !== 'newly_registered' &&
      location.pathname !== '/getting-started'
    ) {
      navigate({ to: '/getting-started' });
    }
  }, [navigate, location.pathname, user, isError]);

  if (isPending) return <LoadingFallback />;

  // 🔹 Permission check happens here
  const allowedNav = getPrimaryNavigation(user);
  // Always allow access to the getting-started page during onboarding
  const allowedPaths = ['/getting-started', ...allowedNav.map((item) => item.href)];

  const isAllowed = allowedPaths.some((p) => location.pathname.startsWith(p));

  if (!isAllowed) {
    return <PermissionDenied />; // ⬅️ Show the PermissionDenied component
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
                'mx-auto w-full animate-in transition-all duration-300 ease-linear fade-in-0 slide-in-from-bottom-4',
                useMaxWidth ? 'max-w-[1216px] px-8' : 'max-w-full px-8'
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
