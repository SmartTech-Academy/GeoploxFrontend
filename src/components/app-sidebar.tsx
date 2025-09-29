'use client';

import assets from '@/assets';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';

import { Link, useLocation } from '@tanstack/react-router';
import {
  LayoutDashboard,
  Home,
  BarChart3,
  MessageSquare,
  Settings,
  HelpCircle,
  LogOut,
  Newspaper,
  CandlestickChart,
  CircleCheck,
  Users,
  Users2,
  ChartCandlestick,
} from 'lucide-react';

import { useGetProfileData } from '@/lib/services/profile';
import { useQueryClient } from '@tanstack/react-query';
import { Skeleton } from './ui/skeleton';

const adminNavigation = [
  { name: 'Listing', href: '/listing', icon: Home },
  { name: 'Pending Approvals', href: '/pending-approvals', icon: CircleCheck },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Managers', href: '/managers', icon: Users2 },
  { name: 'Admin Insights', href: '/admin-insights', icon: ChartCandlestick },
];

const contentManagerNavigation = [
  { name: 'Blogs', href: '/blogs', icon: Newspaper },
  { name: 'Insights', href: '/insights', icon: CandlestickChart },
];

const accountOfficerNavigation = [
  { name: 'Listing', href: '/listing', icon: Home },
  { name: 'Pending Approvals', href: '/pending-approvals', icon: CircleCheck },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Users', href: '/users', icon: Users },
];

const agentClientNavigation = [
  { name: 'Listing', href: '/listing', icon: Home },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Settings', href: '/settings', icon: Settings },
];
const propertyOwnerNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Properties', href: '/properties', icon: Home },
  { name: 'Performance', href: '/performance', icon: BarChart3 },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const onboardingNavigation = [{ name: 'Get Started', href: '/getting-started', icon: Home }];

const bottomNavigation = [
  { name: 'Help', href: '/contact', icon: HelpCircle },
  { name: 'Logout', href: '/logout', icon: LogOut },
];

export function AppSidebar() {
  const pathname = useLocation().pathname;
  const { data: user, isLoading } = useGetProfileData();
  const queryClient = useQueryClient();

  const getNavigation = () => {
    if (isLoading || !user) {
      return [];
    }
    if (user.onboarding_status !== 'active' && user.onboarding_status !== 'newly_registered') {
      return onboardingNavigation;
    }
    switch (user.user_role) {
      case 'admin':
        return adminNavigation;
      case 'developer':
      case 'owner':
        return propertyOwnerNavigation;
      case 'account_officer':
        return accountOfficerNavigation;
      case 'content_manager':
        return contentManagerNavigation;
      case 'agent':
      case 'client':
        return agentClientNavigation;
      default:
        return [];
    }
  };

  const mainNavigation = getNavigation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    // Invalidate all queries to clear cached data
    queryClient.invalidateQueries();
    // Redirect to login, which will happen automatically from DashboardLayout's effect
  };

  return (
    <Sidebar className="border-r-0" style={{ backgroundColor: '#F8F8F8' }}>
      <SidebarHeader className="p-6">
        <img src={assets.logotext} alt="logo" width={126} height={40} className="h-10 w-[126px]" />
      </SidebarHeader>

      <SidebarContent className="w-full px-[14px]">
        <SidebarMenu className="w-full gap-1">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <SidebarMenuItem key={i}>
                  <Skeleton className="h-10 w-full rounded-[8px]" />
                </SidebarMenuItem>
              ))
            : mainNavigation.map((item) => {
                const isActive = pathname.includes(item.href);
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="h-10 w-full rounded-[8px] text-[16px] leading-[18px] hover:bg-white hover:text-[#D4AF36] data-[active=true]:bg-white data-[active=true]:font-medium data-[active=true]:text-[#D4AF36]"
                    >
                      <Link to={item.href}>
                        <item.icon className={isActive ? 'fill-[#D4AF36] text-[#D4AF36]' : ''} />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
        </SidebarMenu>

        <div className="w-full">
          <SidebarSeparator className="my-4 w-full" />
        </div>

        <SidebarMenu className="w-full gap-1">
          {bottomNavigation.map((item) => {
            const isActive = pathname.includes(item.href);
            if (item.name === 'Logout') {
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    onClick={handleLogout}
                    isActive={isActive}
                    className="group h-10 rounded-[8px] text-[16px] leading-[18px] hover:bg-white hover:text-[#D4AF36] data-[active=true]:bg-white data-[active=true]:font-medium data-[active=true]:text-[#D4AF36]"
                  >
                    <item.icon className="" />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            }
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className="group h-10 rounded-[8px] text-[16px] leading-[18px] hover:bg-white hover:text-[#D4AF36] data-[active=true]:bg-white data-[active=true]:font-medium data-[active=true]:text-[#D4AF36]"
                >
                  <Link to={item.href}>
                    <item.icon className="" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}
