import { useMemo, useState } from "react";
import { MapPin, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { PageMetaTags } from "@/components/page-meta-data";
import assets from "@/assets";
import { useGetManagersAssignedUsers } from "@/lib/services/managers";
import { useGetProfileData } from "@/lib/services/profile";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ManagerUser {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email?: string;
  username?: string;
  role?: string;
  status?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  joinedOn?: string;
  business?: {
    name?: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
    address?: string;
  } | null;
  avatar?: string;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const DetailRow = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="flex items-start justify-between gap-10 self-stretch py-2">
    <label className="shrink-0 text-[14px] leading-[17px] text-[#71748C]">{label}</label>
    <p className="text-right text-[14px] leading-[17px] break-all text-[#1F2130]">
      {value || <span className="text-[#C0C0C8]">-</span>}
    </p>
  </div>
);

const ManagersUsersPage = () => {
  const [selectedUser, setSelectedUser] = useState<ManagerUser | null>(null);
  const { data: profileData, isLoading: isLoadingProfile } = useGetProfileData();
  const managerId =
    profileData?.codec || (profileData as any)?.manager_codec || (profileData as any)?.id || "";
  const { data: usersData, isLoading: isLoadingUsers } = useGetManagersAssignedUsers(managerId);

  const users = useMemo(() => {
    const apiUsers = usersData?.data?.data?.assigned_users;

    if (!Array.isArray(apiUsers)) return [];

    return apiUsers.map(
      (apiUser: any): ManagerUser => ({
        id: apiUser.codec || apiUser.id,
        firstName: apiUser.firstname || apiUser.fname || "",
        lastName: apiUser.lastname || apiUser.lname || "",
        name:
          [apiUser.firstname || apiUser.fname, apiUser.lastname || apiUser.lname]
            .filter(Boolean)
            .join(" ") || "Unnamed User",
        email: apiUser.email_address || apiUser.email,
        username: apiUser.username,
        role: apiUser.user_role,
        status: apiUser.onboarding_status,
        phone: apiUser.phone_number || apiUser.phone,
        whatsapp: apiUser.whatsapp_number,
        address: [apiUser.home_address, apiUser.local_gov_area, apiUser.state]
          .filter(Boolean)
          .join(", "),
        joinedOn: apiUser.entity_creation_date
          ? format(new Date(apiUser.entity_creation_date), "MMMM d, yyyy")
          : undefined,
        business: apiUser.business
          ? {
              name: apiUser.business.name,
              email: apiUser.business.email,
              phone: apiUser.business.phone,
              whatsapp: apiUser.business.whatsapp,
              address: apiUser.business.address,
            }
          : null,
        avatar: apiUser.display_picture_url,
      }),
    );
  }, [usersData]);

  const isLoading = isLoadingProfile || isLoadingUsers;

  return (
    <div className="flex h-screen w-full flex-col items-start gap-0 self-stretch py-8 lg:flex-row">
      <PageMetaTags
        title="Users"
        description="View assigned owners and developers."
        keywords="owners, developers, manager users"
      />

      <div className="w-full lg:hidden">
        {!selectedUser ? (
          <ManagerUsersList
            users={users}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            isLoading={isLoading}
          />
        ) : (
          <>
            <Button variant="link" onClick={() => setSelectedUser(null)} className="mb-4 px-4">
              &larr; Back to list
            </Button>
            <ManagerUserView selectedUser={selectedUser} />
          </>
        )}
      </div>

      <div className="hidden size-full lg:flex">
        <ResizablePanelGroup orientation="horizontal" className="size-full">
          <ResizablePanel
            defaultSize={35}
            minSize={25}
            maxSize={50}
            className="border-r border-[#F1F1F4]"
          >
            <ManagerUsersList
              users={users}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              isLoading={isLoading}
            />
          </ResizablePanel>
          <ResizableHandle className="w-px bg-[#F1F1F4] hover:bg-gray-200" />
          <ResizablePanel defaultSize={65} minSize={50}>
            <div className="h-[calc(100svh-150px)] w-full overflow-y-auto pl-8">
              <ManagerUserView selectedUser={selectedUser} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

interface ManagerUsersListProps {
  users: ManagerUser[];
  selectedUser: ManagerUser | null;
  setSelectedUser: (user: ManagerUser | null) => void;
  isLoading: boolean;
}

const ManagerUsersList = ({
  users,
  selectedUser,
  setSelectedUser,
  isLoading,
}: ManagerUsersListProps) => (
  <div className="flex h-full flex-col gap-4 bg-white">
    <div className="w-full pr-6">
      <div className="flex w-full flex-col gap-1 border-b border-[#E8E8E8] pb-4">
        <h2 className="text-[18px]/7 font-semibold text-[#2E2E3E]">Users</h2>
        <p className="text-[13px]/5 text-[#71748C]">Owners and developers assigned to you.</p>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto pr-6 lg:pr-0">
      {isLoading ? (
        <div className="space-y-2 p-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="size-16 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <EmptyState type="list" />
      ) : (
        <div className="w-full">
          {users.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => setSelectedUser(user)}
              className={cn(
                "flex w-full cursor-pointer items-center justify-between gap-3.5 p-4 text-left transition-colors hover:bg-gray-50",
                selectedUser?.id === user.id
                  ? "border-none bg-[#FDF9ED]"
                  : "border-b border-[#E3E3E8] last:border-none",
              )}
            >
              <div className="flex min-w-0 items-center gap-3.5">
                <Avatar className="size-16 rounded-[5px]">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="bg-gray-200 text-gray-600">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex min-w-0 flex-col items-start gap-2.5">
                  <h3 className="truncate text-[14px] leading-[17px] font-semibold text-[#41415A]">
                    {user.name}
                  </h3>
                  <p className="inline-flex items-center gap-1 truncate text-[12px]/3.5 tracking-[0.01em] text-[#71748C]">
                    <MapPin className="size-2.5" />
                    {user.email || user.role || "Assigned user"}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
);

const ManagerUserView = ({ selectedUser }: { selectedUser: ManagerUser | null }) => {
  if (!selectedUser) {
    return <EmptyState type="user" />;
  }

  return (
    <div className="flex h-full flex-1 flex-col rounded-[15px] border border-[#DDDDDD] lg:rounded-[15px]">
      <div className="relative min-h-24 rounded-t-[15px] bg-[#E9DAB9]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${assets.yellowbackground})` }}
        >
          <div className="absolute inset-0 bg-[oklch(0.7898_0.1514_90.07/20%)]/20" />
        </div>

        <div className="absolute top-6 flex w-full items-start justify-between gap-4 px-6">
          <Avatar className="size-24 rounded-[5px]">
            <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} alt={selectedUser.name} />
            <AvatarFallback className="bg-gray-200 text-xl font-bold text-gray-600">
              {getInitials(selectedUser.name)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="mt-12 flex w-full items-center gap-4 border-b border-[#F1F1F4] px-4 pb-4">
        <h2 className="text-[20px]/7 font-semibold text-[#2E2E3E]">{selectedUser.name}</h2>
      </div>

      <div className="w-full flex-1 overflow-y-auto bg-white p-4 lg:py-4">
        <div className="flex w-full flex-col gap-6">
          <div className="w-full">
            <div className="mb-3 flex items-center gap-2">
              <UserRound className="size-4 text-[#D4AF36]" />
              <p className="text-[12px] font-semibold tracking-widest text-[#A0A0B0] uppercase">
                Profile
              </p>
            </div>
            <DetailRow label="Full Name" value={selectedUser.name} />
            <DetailRow label="Username" value={selectedUser.username} />
            <DetailRow label="Email Address" value={selectedUser.email} />
            <DetailRow label="Account Type" value={selectedUser.role} />
            <DetailRow label="Status" value={selectedUser.status} />
            <DetailRow label="First Name" value={selectedUser.firstName} />
            <DetailRow label="Last Name" value={selectedUser.lastName} />
            <DetailRow label="Phone Number" value={selectedUser.phone} />
            <DetailRow label="WhatsApp Number" value={selectedUser.whatsapp} />
            <DetailRow label="Joined On" value={selectedUser.joinedOn} />
            <DetailRow label="Home Address" value={selectedUser.address} />
          </div>

          {selectedUser.business ? (
            <div className="w-full border-t border-[#F1F1F4] pt-4">
              <p className="mb-3 text-[12px] font-semibold tracking-widest text-[#A0A0B0] uppercase">
                Business Information
              </p>
              <DetailRow label="Business Name" value={selectedUser.business.name} />
              <DetailRow label="Business Email Address" value={selectedUser.business.email} />
              <DetailRow label="Business Phone Number" value={selectedUser.business.phone} />
              <DetailRow label="Business WhatsApp Number" value={selectedUser.business.whatsapp} />
              <DetailRow label="Business Address" value={selectedUser.business.address} />
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-[#E8E8E8] bg-[#FAFAFA] p-4 text-[13px] text-[#A0A0B0]">
              No business information on file for this user.
            </div>
          )}

          <div className="w-full border-t border-[#F1F1F4] pt-4">
            <p className="mb-3 text-[12px] font-semibold tracking-widest text-[#A0A0B0] uppercase">
              System
            </p>
            <DetailRow label="User ID" value={selectedUser.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagersUsersPage;
