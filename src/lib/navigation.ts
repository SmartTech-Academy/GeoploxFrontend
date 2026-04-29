import {
  LayoutDashboard,
  Home,
  BarChart3,
  MessageSquare,
  Settings,
  Newspaper,
  CandlestickChart,
  CircleCheck,
  Users,
  Users2,
  ChartCandlestick,
  Star,
} from "lucide-react";

import { LucideIcon } from "lucide-react";
import { UserProfile } from "./types";

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export const adminNavigation: NavigationItem[] = [
  { name: "Listing", href: "/admin-listing", icon: Home },
  { name: "Pending Approvals", href: "/pending-approvals", icon: CircleCheck },
  { name: "Users", href: "/users", icon: Users },
  { name: "Managers", href: "/managers", icon: Users2 },
  { name: "Admin Insights", href: "/admin-insights", icon: ChartCandlestick },
];
export const contentManagerNavigation: NavigationItem[] = [
  { name: "Blogs", href: "/blogs", icon: Newspaper },
  { name: "Favorites", href: "/favorites", icon: Star },
  { name: "Insights", href: "/insights", icon: CandlestickChart },
];
export const accountOfficerNavigation: NavigationItem[] = [
  { name: "Listing", href: "/listing", icon: Home },
  { name: "Favorites", href: "/favorites", icon: Star },
  { name: "Pending Approvals", href: "/pending-approvals", icon: CircleCheck },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Users", href: "/users", icon: Users },
];
export const agentClientNavigation: NavigationItem[] = [
  { name: "Listing", href: "/listing", icon: Home },
  { name: "Favorites", href: "/favorites", icon: Star },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Settings", href: "/settings", icon: Settings },
];
export const propertyOwnerNavigation: NavigationItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Properties", href: "/properties", icon: Home },
  { name: "Favorites", href: "/favorites", icon: Star },
  { name: "Performance", href: "/performance", icon: BarChart3 },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Settings", href: "/settings", icon: Settings },
];
export const onboardingNavigation: NavigationItem[] = [
  { name: "Get Started", href: "/getting-started", icon: Home },
];

/**
 * Gets the primary navigation array for a given user.
 * @param user The user object.
 * @returns An array of navigation items.
 */
export const getPrimaryNavigation = (user: UserProfile | null | undefined) => {
  if (!user) {
    return [];
  }
  if (user.user_role === "admin") {
    return adminNavigation;
  }
  if (user.user_role === "manager") {
    return accountOfficerNavigation;
  }
  if (user.onboarding_status !== "active" && user.onboarding_status !== "newly_registered") {
    return onboardingNavigation;
  }
  switch (user.user_role) {
    case "developer":
    case "owner":
      return propertyOwnerNavigation;
    case "account_officer":
      return accountOfficerNavigation;
    case "content_manager":
      return contentManagerNavigation;
    case "agent":
    case "client":
      return agentClientNavigation;
    default:
      return [];
  }
};

export const getLoginRedirectPath = (user: UserProfile | null | undefined): string => {
  const navigation = getPrimaryNavigation(user);

  // Default to '/dashboard' if no specific navigation is found
  return navigation[0]?.href || "/dashboard";
};
