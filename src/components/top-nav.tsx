import { Bell, RulerDimensionLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useLocation } from '@tanstack/react-router';
import React from 'react';

// Route title mapping for dashboard pages
const routeTitleMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/properties': 'Properties',
  '/properties/create': 'Create Property',
  '/listing': 'Listings',
  '/messages': 'Messages',
  '/users': 'Users',
  '/managers': 'Property Managers',
  '/performance': 'Performance',
  '/insights': 'Market Insights',
  '/settings': 'Settings',
  '/pending-approvals': 'Pending Approvals',
  '/getting-started': 'Getting Started',
  '/blogs': 'Blog Posts',
  '/blogs/create': 'Create Blog Post',
};

// Function to get page title based on current route
function getPageTitle(pathname: string): string {
  // Handle dynamic routes (with IDs)
  if (pathname.startsWith('/properties/') && pathname !== '/properties/create') {
    return 'Property Details';
  }

  if (pathname.startsWith('/listing/')) {
    return 'Listing Details';
  }

  // Handle static routes
  return routeTitleMap[pathname] || 'Dashboard';
}

interface TopNavProps {
  setUseMaxWith: React.Dispatch<React.SetStateAction<boolean>>;
}

export function TopNav({ setUseMaxWith }: TopNavProps) {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="h-[74px] border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <Button
            variant="ghost"
            size="icon"
            className="hidden size-7 lg:inline-flex"
            onClick={() => setUseMaxWith((prev) => !prev)}
          >
            <RulerDimensionLine />
          </Button>
          <h1 className="text-[24px] leading-[29px] font-semibold text-[#4E4E4E]">{pageTitle}</h1>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative size-8 rounded-full border-[0.5px] border-[#D5D5DD]">
            <Bell className="size-4" />
            <span className="absolute top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>

          <div className="h-8 w-px bg-[#E2E2E2]" />

          <Avatar className="size-8">
            <AvatarImage src="/diverse-user-avatars.png" alt="User" />
            <AvatarFallback className="bg-[#D4AF36] text-sm font-medium text-white">JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
