import { ChevronRight, ChevronLeft } from "lucide-react";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useNavigate, useSearch } from "@tanstack/react-router";
import PersonalInformationSection from "./PersonalInformationSection";
import BusinessInformationSection from "./BusinessInformationSection";
import SecurityNotificationsSection from "./SecurityNotificationsSection";
import SubscriptionsSection from "./SubscriptionsSection";
import React from "react";
import { Button } from "@/components/ui/button";
import { PageMetaTags } from "@/components/page-meta-data";
import { useGetProfileData } from "@/lib/services/profile";
import LoadingFallback from "@/components/loading-fallback";

interface SidebarItemProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ id, label, isActive, onClick }) => (
  <div
    id={id}
    onClick={onClick}
    className={`flex cursor-pointer items-center justify-between gap-4 rounded-[5px] p-6 text-[16px] leading-[18px] font-normal transition-colors ${
      isActive
        ? "bg-[#FDF9ED] font-semibold text-[#4E4E4E]"
        : "bg-white text-[#41415A] hover:bg-gray-50 hover:text-gray-900"
    }`}
  >
    <span>{label}</span>
    {isActive && <ChevronRight className="size-4 fill-[#41415A]" />}
  </div>
);

const SettingsSidebar = ({ user, activeTab, handleTabChange }: any) => (
  <div className="flex h-full flex-col bg-white pr-6">
    <div className="flex w-full flex-col">
      <SidebarItem
        id="personal"
        label="Personal Information"
        isActive={activeTab === "personal" || !activeTab}
        onClick={() => handleTabChange("personal")}
      />
      {user?.user_role === "developer" && (
        <SidebarItem
          id="business"
          label="Business Information"
          isActive={activeTab === "business"}
          onClick={() => handleTabChange("business")}
        />
      )}
      {(user?.user_role === "agent" || user?.user_role === "client") && (
        <SidebarItem
          id="subscriptions"
          label="Subscriptions"
          isActive={activeTab === "subscriptions"}
          onClick={() => handleTabChange("subscriptions")}
        />
      )}
      <SidebarItem
        id="security"
        label="Security"
        isActive={activeTab === "security"}
        onClick={() => handleTabChange("security")}
      />
    </div>
  </div>
);

const SettingsPage = () => {
  // Get initial tab from URL or default to personal
  const search = useSearch({
    from: "/_dashboard/settings/",
  }) as { tab?: string };

  const activeTab = search.tab;
  const navigate = useNavigate();
  const { data: user, isPending: isProfileLoading } = useGetProfileData();

  const handleTabChange = (tab: string) => {
    navigate({
      to: "/settings",
      search: { tab }, // Simplified search object
      replace: true, // avoid pushing new history entries on tab switch
      viewTransition: true,
    });
  };

  const renderContent = () => {
    if (isProfileLoading) {
      return <LoadingFallback />;
    }

    switch (activeTab || "personal") {
      case "personal":
        return <PersonalInformationSection user={user} />;
      case "business":
        return <BusinessInformationSection user={user} />;
      case "security":
        return <SecurityNotificationsSection />;
      case "subscriptions":
        return <SubscriptionsSection />;
      default:
        return <PersonalInformationSection user={user} />;
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-start gap-0 self-stretch py-8 lg:flex-row">
      <PageMetaTags
        title={`${
          (activeTab || "personal").charAt(0).toUpperCase() + (activeTab || "personal").slice(1)
        } | Account Settings`}
        description="Manage your account preferences, notification settings, and profile information."
        keywords="account settings, profile management, preferences"
      />

      {/* Mobile View */}
      <div className="w-full lg:hidden">
        {!activeTab ? (
          <div className="px-4">
            <SettingsSidebar user={user} activeTab={activeTab} handleTabChange={handleTabChange} />
          </div>
        ) : (
          <div className="w-full">
            <Button
              variant="link"
              onClick={() => navigate({ to: "/settings", replace: true })}
              className="mb-4 px-4 text-[#41415A]"
            >
              <ChevronLeft className="mr-2 size-4" />
              Back to Settings
            </Button>
            <div className="px-4">{renderContent()}</div>
          </div>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden size-full lg:flex">
        <ResizablePanelGroup orientation="horizontal" className="size-full">
          {/* Sidebar Panel */}
          <ResizablePanel
            defaultSize="35%"
            minSize="25%"
            maxSize="50%"
            className="border-r border-[#F1F1F4]"
          >
            <SettingsSidebar user={user} activeTab={activeTab} handleTabChange={handleTabChange} />
          </ResizablePanel>

          {/* Resizable Handle */}
          <ResizableHandle withHandle className="w-px bg-gray-200 hover:bg-gray-300" />

          {/* Content Panel */}
          <ResizablePanel defaultSize="65%" minSize="50%">
            <div className="flex h-full overflow-y-auto p-8">{renderContent()}</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default SettingsPage;
