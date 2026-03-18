import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMemo, useState } from 'react';
import { Search, Settings, Ban, MoreVertical, MapPin, MoveUpRight, Download, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import assets from '@/assets';
import { cn } from '@/lib/utils';
import { PageMetaTags } from '@/components/page-meta-data';
import ListingActivities from '@/components/charts/ListingActivities';
import { ConversionsChart } from '@/components/charts/ConversionsChart';
import { useBlacklistUser, useGetUsers, useGetUserPerformance, useVerifyUser } from '@/lib/services/users';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { VerifyUserDialog } from '@/components/dialogs/verify-user-dialog';
import { BlacklistUserDialog } from '@/components/dialogs/blacklist-user-dialog';
import { useDebounce } from '@/hooks/use-debounce';
import { EmptyState } from '@/components/empty-state';

interface User {
  id: string;
  name: string;
  email: string;
  status: 'verified' | 'unverified' | 'blacklisted';
  avatar?: string;
  joinedOn: string;
  details: UserDetails;
}

interface UserDetails {
  accountType: string;
  personalPhone: string;
  personalWhatsapp: string;
  homeAddress: string;
  businessName?: string;
  businessEmail?: string;
  businessPhone?: string;
  businessWhatsapp?: string;
  businessAddress?: string;
  proofOfAddress?: string;
  govtIssuedId?: string;
  hasBusiness: boolean;
}

interface OverviewMetric {
  title: string;
  value: string;
}

interface PerformanceMetric {
  title: string;
  value: string;
  change?: {
    percentage: string;
    trend: 'up' | 'down';
  };
}

type FilterType = 'all' | 'verified' | 'unverified' | 'blacklisted';

type TabType = 'profile' | 'performance';

const OVERVIEW: OverviewMetric[] = [
  { title: 'Total Listings', value: '45' },
  { title: 'Active Listing', value: '10' },
  { title: 'Archived Listing', value: '30' },
];

const TOTALS: PerformanceMetric[] = [
  { title: 'Total Clicks', value: '2.04K' },
  { title: 'Total Leads', value: '140' },
  { title: 'Total Views', value: '5.15K' },
  { title: 'Total Saves & shares', value: '565' },
];

const conversionChartData = [
  { month: 'Jan', rent: 186, forSale: 80, shortLet: 200 },
  { month: 'Feb', rent: 305, forSale: 200, shortLet: 100 },
  { month: 'Mar', rent: 237, forSale: 120, shortLet: 150 },
  { month: 'Apr', rent: 73, forSale: 190, shortLet: 50 },
  { month: 'May', rent: 209, forSale: 130, shortLet: 180 },
  { month: 'Jun', rent: 214, forSale: 140, shortLet: 220 },
];

// Helper to determine if a URL is a PDF
const isPdf = (url?: string) => url?.toLowerCase().endsWith('.pdf');

// A document preview component that handles both images and PDFs, and missing docs
const DocumentPreview = ({ url, label }: { url?: string; label: string }) => {
  if (!url) {
    return (
      <div className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#E8E8E8] bg-[#F9F9F9]">
        <FileText className="size-6 text-[#C0C0C8]" />
        <p className="text-[12px] text-[#A0A0B0]">No document uploaded</p>
      </div>
    );
  }

  if (isPdf(url)) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border border-[#E8E8E8] bg-[#F9F9F9] transition-colors hover:bg-[#F1F1F4]"
      >
        <FileText className="size-8 text-[#D4AF36]" />
        <span className="text-[12px] font-medium text-[#41415A]">View PDF</span>
        <ExternalLink className="size-3 text-[#71748C]" />
      </a>
    );
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="group relative block w-full">
      <img
        src={url}
        alt={label}
        className="h-auto max-h-48 w-full rounded-lg border border-[#E8E8E8] object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 transition-colors group-hover:bg-black/10">
        <ExternalLink className="size-5 text-white opacity-0 drop-shadow-sm transition-opacity group-hover:opacity-100" />
      </div>
    </a>
  );
};

// A single detail row — omits itself if value is empty and hideIfEmpty is true
const DetailRow = ({
  label,
  value,
  hideIfEmpty = false,
}: {
  label: string;
  value?: string | null;
  hideIfEmpty?: boolean;
}) => {
  if (hideIfEmpty && !value) return null;

  return (
    <div className="flex items-start justify-between gap-10 self-stretch py-2">
      <label className="shrink-0 text-[14px] leading-[17px] text-[#71748C]">{label}</label>
      <p className="text-right text-[14px] leading-[17px] text-[#1F2130]">
        {value || <span className="text-[#C0C0C8]">—</span>}
      </p>
    </div>
  );
};

const UsersPage = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [conversionPeriod, setConversionPeriod] = useState('last_6_months');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data: usersData, isLoading: isLoadingUsers } = useGetUsers({
    status: filter,
    search_user: debouncedSearchQuery,
  });

  const users = useMemo(() => {
    if (!usersData?.data?.data?.users) return [];
    return usersData.data.data.users.map(
      (apiUser: any): User => ({
        id: apiUser.codec,
        name: `${apiUser.firstname} ${apiUser.lastname}`,
        email: apiUser.email_address,
        status: apiUser.onboarding_status === 'active' ? 'verified' : 'unverified',
        avatar: apiUser.display_picture_url,
        joinedOn: format(new Date(apiUser.entity_creation_date), 'MMMM d, yyyy'),
        details: {
          accountType: apiUser.user_role,
          personalPhone: apiUser.phone_number,
          personalWhatsapp: apiUser.whatsapp_number,
          homeAddress: [apiUser.home_address, apiUser.local_gov_area, apiUser.state].filter(Boolean).join(', '),
          hasBusiness: !!apiUser.business,
          businessName: apiUser.business?.name,
          businessEmail: apiUser.business?.email,
          businessPhone: apiUser.business?.phone,
          businessWhatsapp: apiUser.business?.whatsapp,
          businessAddress: apiUser.business?.address,
          proofOfAddress: apiUser.government_id_doc_url,
          govtIssuedId: apiUser.government_id_doc_url,
        },
      })
    );
  }, [usersData]);

  return (
    <div className="flex h-screen w-full flex-col items-start gap-0 self-stretch py-8 lg:flex-row">
      <PageMetaTags
        title="User Management"
        description="Manage user accounts, permissions, and platform access for your real estate business."
        keywords="user management, account administration"
      />

      {/* Mobile View */}
      <div className="w-full lg:hidden">
        {!selectedUser ? (
          <UserList
            users={users}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            filter={filter}
            setFilter={setFilter}
            isLoading={isLoadingUsers}
            setSearchQuery={setSearchQuery}
          />
        ) : (
          <>
            <Button variant="link" onClick={() => setSelectedUser(null)} className="mb-4 px-4">
              &larr; Back to list
            </Button>
            <UserView
              selectedUser={selectedUser}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              conversionPeriod={conversionPeriod}
              setConversionPeriod={setConversionPeriod}
            />
          </>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden size-full  lg:flex">
        <ResizablePanelGroup direction="horizontal" className="size-full ">
          <ResizablePanel defaultSize={35} minSize={25} maxSize={50} className="border-r border-[#F1F1F4]">
            <UserList
              users={users}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              filter={filter}
              setFilter={setFilter}
              isLoading={isLoadingUsers}
              setSearchQuery={setSearchQuery}
            />
          </ResizablePanel>
          <ResizableHandle className="w-px bg-[#F1F1F4] hover:bg-gray-200" />
          <ResizablePanel defaultSize={65} minSize={50}>
            <div className="h-[calc(100svh-150px)] w-full overflow-y-auto pl-8">
              <UserView
                selectedUser={selectedUser}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                conversionPeriod={conversionPeriod}
                setConversionPeriod={setConversionPeriod}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

interface UserListProps {
  users: User[];
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  isLoading: boolean;
  setSearchQuery: (query: string) => void;
}

const UserList = ({
  users,
  selectedUser,
  setSelectedUser,
  filter,
  setFilter,
  isLoading,
  setSearchQuery,
}: UserListProps) => (
  <div className="flex h-full flex-col gap-4 bg-white">
    <div className="w-full pr-6">
      <div className="flex w-full flex-col gap-6 border-b border-[#E8E8E8] pb-4">
        <div className="relative p-0.5">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 transform text-[#D4AF36]" />
          <Input
            type="text"
            placeholder="Search users"
            className="h-10 self-stretch rounded-xl border border-[#D5D5DD] px-3 pl-10"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="w-full">
          <div className="flex flex-wrap items-center gap-1.5">
            {(['all', 'verified', 'unverified', 'blacklisted'] as FilterType[]).map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'outline' : 'ghost'}
                size="sm"
                onClick={() => setFilter(f)}
                className={`h-8 rounded-full text-[12px] font-semibold capitalize ${
                  filter === f
                    ? 'border-[#EAEAEA] text-primary hover:bg-yellow-50'
                    : 'bg-[#ECECEC] text-[#41415C] hover:text-gray-800'
                }`}
              >
                {f}
              </Button>
            ))}
          </div>
        </div>
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
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={cn(
                'flex cursor-pointer items-center justify-between gap-3.5 p-4 transition-colors hover:bg-gray-50',
                selectedUser?.id === user.id ? 'border-none bg-[#FDF9ED]' : 'border-b border-[#E3E3E8] last:border-none'
              )}
            >
              <div className="flex items-center gap-3.5">
                <Avatar className="size-16 rounded-[5px]">
                  <AvatarImage src={user.avatar || '/placeholder.svg'} alt={user.name} />
                  <AvatarFallback className="bg-gray-200 text-gray-600">
                    {user.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex min-w-0 flex-col items-start gap-2.5">
                  <h3 className="truncate text-[14px] leading-[17px] font-semibold text-[#41415A]">{user.name}</h3>
                  <p className="inline-flex items-center truncate text-[12px]/3.5  tracking-[0.01em] text-[#71748C]">
                    <MapPin className="size-2.5" />
                    {user.email}
                  </p>
                </div>
              </div>

              <Badge className="items-center rounded-sm border border-[oklch(0.5931_0_0/30%)] bg-white text-[12px] leading-[21px] text-[#0B0B0D]">
                <div
                  className={cn(
                    'size-1.5 rounded-full',
                    user.status === 'verified' ? 'bg-[#0AA6A9]' : user.status === 'unverified' ? 'bg-[#FDCE05]' : 'bg-[#D20832]'
                  )}
                />
                {user.status}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

interface UserViewProps {
  selectedUser: User | null;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  conversionPeriod: string;
  setConversionPeriod: (period: string) => void;
}

const UserView = ({ selectedUser, activeTab, setActiveTab, conversionPeriod, setConversionPeriod }: UserViewProps) => {
  const [isVerifyOpen, setVerifyOpen] = useState(false);
  const [isBlacklistOpen, setBlacklistOpen] = useState(false);

  const { mutate: verifyUser, isPending: isVerifying } = useVerifyUser();
  const { mutate: blacklistUser, isPending: isBlacklisting } = useBlacklistUser();

  const { data: performanceData, isLoading: isLoadingPerformance } = useGetUserPerformance({
    period: conversionPeriod,
    filter: 'all',
    user_codec: selectedUser?.id || '',
  });

  const handleVerify = () => {
    if (selectedUser) verifyUser(selectedUser.id, { onSuccess: () => setVerifyOpen(false) });
  };

  const handleBlacklist = () => {
    if (selectedUser) blacklistUser(selectedUser.id, { onSuccess: () => setBlacklistOpen(false) });
  };

  if (!selectedUser) {
    return <EmptyState type="user" />;
  }

  const { details } = selectedUser;

  return (
    <>
      <div className="flex h-full flex-1 flex-col rounded-[15px] border border-[#DDDDDD] lg:rounded-[15px]">
        {/* User Header Banner */}
        <div className="relative min-h-24 rounded-t-[15px] bg-[#E9DAB9]">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${assets.yellowbackground})` }}
          >
            <div className="absolute inset-0 bg-[oklch(0.7898_0.1514_90.07/20%)]/20" />
          </div>

          <div className="absolute top-6 flex w-full items-start justify-between gap-4 px-6">
            <Avatar className="size-24 rounded-[5px]">
              <AvatarImage src={selectedUser.avatar || '/placeholder.svg'} alt={selectedUser.name} />
              <AvatarFallback className="bg-gray-200 text-xl font-bold text-gray-600">
                {selectedUser.name.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="secondary" className="size-10 rounded-[6px] bg-white text-[#41415A]">
                  <MoreVertical className="size-4 " />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setVerifyOpen(true)} className="flex items-center gap-2">
                  <Settings className="size-4 " />
                  Verify User
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setBlacklistOpen(true)} className="flex items-center gap-2 text-red-600">
                  <Ban className="size-4 " />
                  Blacklist User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Name + Tabs */}
        <div className="mt-12 flex w-full flex-col items-start gap-4 border-b border-[#F1F1F4] px-4 pb-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-[20px]/7  font-semibold text-[#2E2E3E]">{selectedUser.name}</h2>
            <Badge className="items-center rounded-sm border border-[oklch(0.5931_0_0/30%)] bg-white text-[12px] leading-[21px] text-[#0B0B0D]">
              <div
                className={cn(
                  'size-1.5 rounded-full',
                  selectedUser.status === 'verified' ? 'bg-[#0AA6A9]' : selectedUser.status === 'unverified' ? 'bg-[#FDCE05]' : 'bg-[#D20832]'
                )}
              />
              {selectedUser.status}
            </Badge>
          </div>

          <div className="flex items-center gap-6">
            {(['profile', 'performance'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 pb-2 text-[16px] capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-[#D4AF36] font-semibold text-[#D4AF36]'
                    : 'border-transparent text-[#71748C] hover:text-[#1F2130]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="w-full flex-1 overflow-y-auto bg-white p-4 lg:py-4">
          {activeTab === 'profile' ? (
            <div className="flex w-full flex-col gap-6">

              {/* Personal Info */}
              <div className="w-full">
                <DetailRow label="Account Type" value={details.accountType} />
                <DetailRow label="Personal Phone Number" value={details.personalPhone} />
                <DetailRow label="Personal WhatsApp Number" value={details.personalWhatsapp} />
                <DetailRow label="Joined On" value={selectedUser.joinedOn} />
                <DetailRow label="Home Address" value={details.homeAddress} />
              </div>

              {/* Business Info — only shown if the user has a business */}
              {details.hasBusiness ? (
                <div className="w-full border-t border-[#F1F1F4] pt-4">
                  <p className="mb-3 text-[12px] font-semibold tracking-widest text-[#A0A0B0] uppercase">
                    Business Information
                  </p>
                  <DetailRow label="Business Name" value={details.businessName} />
                  <DetailRow label="Business Email Address" value={details.businessEmail} />
                  <DetailRow label="Business Phone Number" value={details.businessPhone} />
                  <DetailRow label="Business WhatsApp Number" value={details.businessWhatsapp} />
                  <DetailRow label="Business Address" value={details.businessAddress} />
                </div>
              ) : (
                <div className="flex w-full items-center gap-3 rounded-lg border border-dashed border-[#E8E8E8] bg-[#FAFAFA] p-4">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#F1F1F4]">
                    <Ban className="size-4 text-[#C0C0C8]" />
                  </div>
                  <p className="text-[13px] text-[#A0A0B0]">No business information on file for this user.</p>
                </div>
              )}

              {/* Documents */}
              <div className="w-full border-t border-[#F1F1F4] pt-4">
                <p className="mb-3 text-[12px] font-semibold tracking-widest text-[#A0A0B0] uppercase">
                  Documents
                </p>
                <div className="flex w-full flex-col gap-4 md:flex-row">
                  <div className="flex w-full flex-col gap-1.5">
                    <label className="text-[14px] leading-[17px] text-[#41415A]">Proof of Address</label>
                    <DocumentPreview url={details.proofOfAddress} label="Proof of Address" />
                  </div>
                  <div className="flex w-full flex-col gap-1.5">
                    <label className="text-[14px] leading-[17px] text-[#41415A]">Govt. Issued ID</label>
                    <DocumentPreview url={details.govtIssuedId} label="Govt. Issued ID" />
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex w-full flex-col items-start gap-5 py-8">
              <header className="flex w-full items-center justify-between gap-2 self-stretch">
                <Select defaultValue="all">
                  <SelectTrigger className="h-10 min-w-[138px] rounded-[45px] border-0 border-[oklch(0.8754_0.0109_286.17)] bg-[#F9F9F9] text-[#41415A] focus:ring-0">
                    <div className="flex items-center gap-2">
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Properties</SelectItem>
                    <SelectItem value="rent">For Rent</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="secondary"
                  className="h-8 rounded-[40px] bg-[#F9F9FB] p-4 text-[14px]/5  font-normal text-[#1F2130]"
                >
                  Export
                  <Download className="size-4" />
                </Button>
              </header>

              <section className="grid grid-cols-1 gap-5 self-stretch md:grid-cols-2 lg:grid-cols-3">
                {OVERVIEW.map((item, index) => (
                  <div
                    key={index}
                    className="isolate box-border flex grow flex-col items-start gap-5 rounded-[10px] border border-[#E2E2E2] bg-white"
                  >
                    <div className="box-border w-full border-b border-[#ECECEC] bg-[#F9F9F9] px-6 pt-6 pb-3">
                      <h6 className="text-[12px]/3.5  tracking-[-0.02em] text-[#7F7F7F] uppercase">
                        {item.title}
                      </h6>
                    </div>
                    <div className="flex items-baseline gap-2 px-6 pb-6">
                      <p className="text-[48px]/12  font-semibold tracking-[-1px] text-[#1F2130]">{item.value}</p>
                      <span className="text-[16px] leading-[22px] text-[#1F2130]">Properties</span>
                    </div>
                  </div>
                ))}
              </section>

              <section className="grid w-full grid-cols-1 gap-6 rounded-xl">
                <ListingActivities data={performanceData?.data?.data?.series || []} isLoading={isLoadingPerformance} />
                <ConversionsChart
                  data={conversionChartData}
                  period={conversionPeriod}
                  onPeriodChange={setConversionPeriod}
                />
              </section>

              <section className="grid w-full grid-cols-1 gap-5 self-stretch md:grid-cols-2">
                {TOTALS.map((item, index) => (
                  <div
                    key={index}
                    className="isolate box-border flex grow flex-col items-start gap-5 rounded-[10px] border border-[#E2E2E2] bg-white"
                  >
                    <div className="box-border w-full rounded-t-[10px] border-b border-[#ECECEC] bg-[#F9F9F9] px-6 pt-6 pb-3">
                      <h6 className="text-[12px]/3.5  tracking-[-0.02em] text-[#7F7F7F] uppercase">{item.title}</h6>
                    </div>
                    <div className="flex items-baseline gap-2 px-6 pb-6">
                      <p className="text-[48px]/12  font-semibold tracking-[-1px] text-[#1F2130]">{item.value}</p>
                      <div className="flex items-center gap-1.5">
                        <MoveUpRight className="size-3 text-[#008A00]" />
                        <span className="text-[14px]/4  tracking-[-0.02em] text-[#008A00D2]">3.36</span>
                        <span className="text-[14px]/4  tracking-[-0.02em] text-[#71748C]">Last mth.</span>
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            </div>
          )}
        </div>
      </div>

      <VerifyUserDialog
        open={isVerifyOpen}
        onOpenChange={setVerifyOpen}
        onConfirm={handleVerify}
        isPending={isVerifying}
      />
      <BlacklistUserDialog
        open={isBlacklistOpen}
        onOpenChange={setBlacklistOpen}
        onConfirm={handleBlacklist}
        isPending={isBlacklisting}
      />
    </>
  );
};

export default UsersPage;
