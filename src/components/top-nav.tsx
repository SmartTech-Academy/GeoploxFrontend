import { CheckCircle2, Home, Loader2, LogOut, RulerDimensionLine, Settings, Star } from 'lucide-react';
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
import { useAdminVerifyUser, useGetProfileData } from '@/lib/services/profile';
import { NotificationPopover } from '@/components/notification-popover';
import { queryClient } from '@/lib/queryClient';
import { toast } from 'sonner';

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
  '/notifications': 'Notifications',
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
  const { mutateAsync: adminVerifyUser, isPending: isVerifying } = useAdminVerifyUser();

  const pageTitle = getPageTitle(location.pathname);
  const { data: user } = useGetProfileData();

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return '';
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const getOnboardingStatus = (status: string | undefined) => {
    if (!status) return null;

    switch (status) {
      case 'active':
        return null; // Don't show anything if active
      case 'newly_registered':
        return 'Account under review';
      case 'inactive':
        return 'Account suspended';
      case 'onboarding_account_type':
      case 'onboarding_personal_information':
      case 'onboarding_business_information':
      case 'onboarding_kyc_documents':
      case 'onboarding_subscription_selection':
      case 'onboarding_completion':
        return 'Onboarding in progress';
      default:
        return 'Pending status';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    queryClient.invalidateQueries();
    navigate({ to: '/login' });
  };

  const handleAdminVerify = async () => {
    if (user?.codec) {
      await adminVerifyUser(user.codec);
      queryClient.invalidateQueries();
      toast.success('User verified successfully!');
    }
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
          <NotificationPopover />

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
              {user?.onboarding_status === 'newly_registered' && (
                <>
                  <DropdownMenuItem onClick={handleAdminVerify} className="cursor-pointer" disabled={isVerifying}>
                    {isVerifying ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    )}
                    <span>{isVerifying ? 'Verifying...' : 'Verify User'}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}

              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm leading-none font-medium">
                    {user?.firstname} {user?.lastname}
                  </p>
                  <p className="text-muted-foreground truncate text-xs leading-none">{user?.email_address}</p>
                  {getOnboardingStatus(user?.onboarding_status) && (
                    <p className="text-warning-foreground text-xs leading-none font-semibold">
                      {getOnboardingStatus(user?.onboarding_status)}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Homepage</span>
                  </Link>
                </DropdownMenuItem>
                {user?.plan && (
                  <DropdownMenuItem asChild>
                    <Link to="/settings" search={{ tab: 'subscriptions' }}>
                      <Star className="mr-2 h-4 w-4" />
                      <span>{user.plan.plan.name} Plan</span>
                    </Link>
                  </DropdownMenuItem>
                )}
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
