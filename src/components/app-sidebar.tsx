import assets from "@/assets";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

import { Link, useLocation } from "@tanstack/react-router";
import { HelpCircle, LogOut } from "lucide-react";
import { useGetProfileData } from "@/lib/services/profile";
import { Skeleton } from "./ui/skeleton";
import { getPrimaryNavigation } from "@/lib/navigation";
import { queryClient } from "@/lib/queryClient";

const bottomNavigation = [
  { name: "Help", href: "/contact", icon: HelpCircle },
  { name: "Logout", href: "/logout", icon: LogOut },
];

export function AppSidebar() {
  const pathname = useLocation().pathname;
  const { setOpenMobile } = useSidebar();
  const { data: user, isPending: isLoading } = useGetProfileData();

  const mainNavigation = getPrimaryNavigation(user);

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Invalidate all queries to clear cached data
    queryClient.cancelQueries();
    queryClient.clear(); // start fresh
    // Redirect to login, which will happen automatically from DashboardLayout's effect
    setOpenMobile(false);
    window.location.href = "/login";
  };

  return (
    <Sidebar className="border-r-0" style={{ backgroundColor: "#F8F8F8" }}>
      <SidebarHeader className="p-6">
        <img src={assets.logotext} alt="logo" width={126} height={40} className="h-10 w-[126px]" />
      </SidebarHeader>

      <SidebarContent className="w-full px-[14px]">
        <SidebarMenu className="w-full gap-1">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <SidebarMenuItem key={i}>
                  <Skeleton className="h-10 w-full rounded-xl" />
                </SidebarMenuItem>
              ))
            : mainNavigation.map((item) => {
                const isActive = pathname.includes(item.href);
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="h-10 w-full rounded-xl text-[16px] leading-[18px] hover:bg-white hover:text-[#D4AF36] data-[active=true]:bg-white data-[active=true]:font-medium data-[active=true]:text-[#D4AF36]"
                    >
                      <Link onClick={() => setOpenMobile(false)} to={item.href}>
                        <item.icon className={isActive ? "fill-[#D4AF36] text-[#D4AF36]" : ""} />
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
            if (item.name === "Logout") {
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    onClick={handleLogout}
                    isActive={isActive}
                    className="group h-10 rounded-xl text-[16px] leading-[18px] hover:bg-white hover:text-[#D4AF36] data-[active=true]:bg-white data-[active=true]:font-medium data-[active=true]:text-[#D4AF36]"
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
                  className="group h-10 rounded-xl text-[16px] leading-[18px] hover:bg-white hover:text-[#D4AF36] data-[active=true]:bg-white data-[active=true]:font-medium data-[active=true]:text-[#D4AF36]"
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
