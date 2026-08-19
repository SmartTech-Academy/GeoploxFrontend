import assets from "@/assets";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Link, useNavigate } from "@tanstack/react-router";
import { Home, LogOut, Menu, Settings, Star } from "lucide-react";
import { useGetProfileData } from "@/lib/services/profile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { queryClient } from "@/lib/queryClient";
import { clearStoredToken } from "@/lib/auth-token";
import { NotificationPopover } from "./notification-popover";
import { getLoginRedirectPath } from "@/lib/navigation";

const Topnav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { data: user } = useGetProfileData();

  const navigationLinks = [
    { to: "/property-for-rent", label: "For Rent" },
    { to: "/property-for-sale", label: "For Sale" },
    { to: "/property-for-short-let", label: "Short Let" },
    { to: "/joint-venture", label: "Joint Venture" },
    { to: "/blog", label: "Blog" },
    // { to: '/pricing', label: 'Pricing' },
  ];

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return "";
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const getOnboardingStatus = (status: string | undefined) => {
    if (!status) return null;
    switch (status) {
      case "active":
        return null;
      case "newly_registered":
        return "Account under review";
      case "inactive":
        return "Account suspended";
      default:
        return "Onboarding in progress";
    }
  };

  const handleLogout = () => {
    clearStoredToken();
    // Clear (not just invalidate one key) so no stale cached data from this session - profile,
    // chat, notifications, etc. - can linger and flash for whoever logs in next on this browser.
    queryClient.clear();
    navigate({ to: "/login" });
  };

  const isLoggedIn = !!user;

  const NavLink = ({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) => (
    <Link
      to={to}
      className="text-[14px] leading-[13px] font-normal text-[#1F2130] transition-colors hover:text-[#D4AF36] [&.active]:font-semibold [&.active]:text-[#D4AF36]"
      activeProps={{
        className: "text-[14px] leading-[13px] font-semibold text-[#D4AF36]",
      }}
      onClick={onClick}
    >
      {label}
    </Link>
  );

  return (
    <nav className="fixed inset-x-0 top-0 z-20 h-(--landing-header-height) w-full bg-[rgba(255,255,255,0.8)] shadow-[0px_4px_16px_rgba(0,0,0,0.08)] backdrop-blur-sm">
      <div className="landing-container flex h-(--landing-header-height) w-full items-center justify-between py-2.5">
        {/* Logo */}
        <Link to="/">
          <img
            src={assets.logotext}
            alt="logo"
            className="h-8 w-auto lg:h-10 lg:w-[126px]"
            width={126}
            height={40}
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex lg:items-center">
          {navigationLinks.map((link, index) => (
            <React.Fragment key={link.to}>
              <li key={link.to} className="isolate flex h-12 items-center justify-center px-4">
                <NavLink to={link.to} label={link.label} />
              </li>
              {index < navigationLinks.length - 1 && (
                <li key={`divider-${index}`} className="h-3 w-0.5 bg-[#B1B9C7]" />
              )}
            </React.Fragment>
          ))}
        </ul>

        {/* Desktop Auth Buttons */}
        {isLoggedIn ? (
          <div className="hidden items-center gap-4 lg:flex">
            <NotificationPopover />
            <div className="h-8 w-px bg-[#E2E2E2]" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative size-8 rounded-full">
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
                    <p className="truncate text-xs leading-none text-muted-foreground">
                      {user?.email_address}
                    </p>
                    {getOnboardingStatus(user?.onboarding_status) && (
                      <p className="text-xs leading-none font-semibold">
                        {getOnboardingStatus(user?.onboarding_status)} |{" "}
                        <span className="capitalize">{user?.user_role?.replace("_", " ")}</span>
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to={getLoginRedirectPath(user)}>
                      <Home className="mr-2 size-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  {user?.plan && (
                    <DropdownMenuItem asChild>
                      <Link to="/settings" search={{ tab: "subscriptions" }}>
                        <Star className="mr-2 size-4" />
                        <span>{user.plan.plan.name} Plan</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/settings">
                      <Settings className="mr-2 size-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 size-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="hidden items-center gap-3 lg:flex">
            <Button
              asChild
              className="h-10 rounded-[40px] bg-[#F1F1F4] px-4 py-[15px] text-[14px] leading-[17px] font-semibold text-[#1F2130] transition-colors hover:bg-[#1F2130] hover:text-white"
            >
              <Link to="/login">Sign in</Link>
            </Button>
            <Button
              style={{
                background: "linear-gradient(180deg, #505050 0%, #1E1E1E 60%)",
                border: "1px solid rgba(30, 30, 30, 0.5)",
                boxShadow:
                  "0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)",
              }}
              className="flex h-10 items-center justify-center rounded-[40px] p-4 text-[14px] leading-[17px] font-semibold text-white transition-opacity hover:opacity-90"
              asChild
            >
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        )}

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Mobile Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="size-10 p-0 hover:bg-[#F1F1F4]">
                <Menu className="size-6 text-[#1F2130]" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex h-full flex-col p-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-6">
                  <Link to="/">
                    <img src={assets.logotext} alt="logo" className="h-8 w-auto" />
                  </Link>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-1 flex-col gap-1 py-6">
                  {navigationLinks.map((link) => (
                    <div
                      key={link.to}
                      className="border-b border-gray-100 px-2 py-3 last:border-b-0"
                    >
                      <NavLink to={link.to} label={link.label} onClick={() => setIsOpen(false)} />
                    </div>
                  ))}
                </div>

                {/* Mobile Auth Buttons - Full Width */}
                {isLoggedIn ? (
                  <div className="border-t pt-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="size-10">
                        <AvatarImage src={user?.display_picture_url} alt={user?.username} />
                        <AvatarFallback className="bg-[#D4AF36] text-white">
                          {getInitials(user?.firstname, user?.lastname)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="font-semibold">
                          {user?.firstname} {user?.lastname}
                        </p>
                        <p className="text-sm text-muted-foreground">{user?.email_address}</p>
                        <p className="text-xs font-semibold capitalize">
                          {user?.user_role?.replace("_", " ")}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col gap-2">
                      <Button asChild variant="ghost" className="justify-start">
                        <Link to={getLoginRedirectPath(user)} onClick={() => setIsOpen(false)}>
                          <Home className="mr-2 size-4" />
                          Dashboard
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" className="justify-start">
                        <Link to="/settings" onClick={() => setIsOpen(false)}>
                          <Settings className="mr-2 size-4" />
                          Settings
                        </Link>
                      </Button>
                      <Button variant="ghost" className="justify-start" onClick={handleLogout}>
                        <LogOut className="mr-2 size-4" />
                        Log out
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 border-t pt-6">
                    <Button
                      asChild
                      className="h-12 rounded-[40px] bg-[#F1F1F4] text-[14px] font-semibold text-[#1F2130] transition-colors hover:bg-[#1F2130] hover:text-white"
                    >
                      <Link to="/login" onClick={() => setIsOpen(false)}>
                        Sign in
                      </Link>
                    </Button>

                    <Button
                      style={{
                        background: "linear-gradient(180deg, #505050 0%, #1E1E1E 60%)",
                        border: "1px solid rgba(30, 30, 30, 0.5)",
                        boxShadow:
                          "0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)",
                      }}
                      className="h-12 rounded-[40px] text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
                      asChild
                    >
                      <Link to="/register" onClick={() => setIsOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Topnav;
