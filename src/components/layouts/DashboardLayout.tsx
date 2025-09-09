import { Suspense, useState } from 'react';
import LoadingFallback from '../loading-fallback';
import { Outlet } from '@tanstack/react-router';
import { AppSidebar } from '../app-sidebar';
import { TopNav } from '../top-nav';
import { SidebarInset, SidebarProvider } from '../ui/sidebar';
import { useUserOnboardingStatus } from '@/hooks/use-user-onboarding-status';
import { cn } from '@/lib/utils';
import { Toaster } from '../ui/sonner';

const DashboardLayout = () => {
  const { isLoading } = useUserOnboardingStatus();
  const [useMaxWidth, setUseMaxWith] = useState(true);

  if (isLoading) return <LoadingFallback />;
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <TopNav setUseMaxWith={setUseMaxWith} />
          <Toaster />
          <main className="min-h-dvh w-full flex-1 overflow-auto border-[#E1E1E6] bg-white shadow-[0px_0px_10px_rgba(0,_0,_0,_0.08)]">
            <div
              className={cn(
                'animate-in fade-in-0 slide-in-from-bottom-4 mx-auto w-full transition-all duration-300 ease-linear',
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
