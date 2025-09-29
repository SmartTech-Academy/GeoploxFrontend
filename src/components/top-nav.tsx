import { Bell, LogOut, RulerDimensionLine, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useGetProfileData } from '@/lib/services/profile';
import { useQueryClient } from '@tanstack/react-query';

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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pageTitle = getPageTitle(location.pathname);
  const { data: user } = useGetProfileData();

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return '';
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    queryClient.invalidateQueries();
    navigate({ to: '/login' });
  };

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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="size-8">
                  <AvatarImage src={user?.display_picture_url} alt={user?.username} />
                  <AvatarFallback className="bg-[#D4AF36] text-sm font-medium text-white">
                    {getInitials(user?.firstname, user?.lastname)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm leading-none font-medium">
                    {user?.firstname} {user?.lastname}
                  </p>
                  <p className="text-muted-foreground text-xs leading-none">{user?.email_address}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
