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
// import { useUserOnboardingStatus } from '@/hooks/use-user-onboarding-status';
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

const navigation = [
  { name: 'Get Started', href: '/getting-started', icon: Home },
  { name: 'Listing', href: '/listing', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Blogs', href: '/blogs', icon: Newspaper },
  { name: 'Insights', href: '/insights', icon: CandlestickChart },
  { name: 'Admin Insights', href: '/admin-insights', icon: ChartCandlestick },
  { name: 'Pending Approvals', href: '/pending-approvals', icon: CircleCheck },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Managers', href: '/managers', icon: Users2 },
  { name: 'Properties', href: '/properties', icon: Home },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Performance', href: '/performance', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

// const onboardingNavigation = [{ name: 'Get Started', href: '/getting-started', icon: Home }];

const bottomNavigation = [
  { name: 'Help', href: '/help', icon: HelpCircle },
  { name: 'Logout', href: '/login', icon: LogOut },
];

export function AppSidebar() {
  const pathname = useLocation().pathname;
  //   const { isNewUser } = useUserOnboardingStatus();

  // Choose navigation based on user status
  const mainNavigation = navigation;

  return (
    <Sidebar className="border-r-0" style={{ backgroundColor: '#F8F8F8' }}>
      <SidebarHeader className="p-6">
        <img src={assets.logotext} alt="logo" width={126} height={40} className="h-10 w-[126px]" />
      </SidebarHeader>

      <SidebarContent className="w-full px-[14px]">
        <SidebarMenu className="w-full gap-1">
          {mainNavigation.map((item) => {
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
