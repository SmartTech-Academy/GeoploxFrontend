import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMemo, useState } from 'react';
import {
  Search,
  Settings,
  Ban,
  MoreVertical,
  UserPlus2,
  MoveUpRight,
  Download,
  Trash2,
  CircleCheck,
  User,
} from 'lucide-react';
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
import { cn } from '@/lib/utils';
import assets from '@/assets';
import AssignModal from '@/components/dialogs/assign-modal';
import { PageMetaTags } from '@/components/page-meta-data';
import ListingActivities from '@/components/charts/ListingActivities';
import { ConversionsChart } from '@/components/charts/ConversionsChart';
import { CreateManagerDialog } from '@/components/dialogs/create-manager-dialog';
import { useDebounce } from '@/hooks/use-debounce';
import { useGetManagers, useGetManagersAssignedUsers, useToggleManagerAccess } from '@/lib/services/managers';
import { format } from 'date-fns';
import { toast } from 'sonner';

type ManagerFilterType = 'all' | 'active' | 'suspended';

type TabType = 'profile' | 'performance';

interface Manager {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phoneNumber?: string;
  createdOn?: string;
  status: 'active' | 'suspended' | 'unknown';
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

const listingActivitiesData = [
  {
    slug: 'for-for-rent' as const,
    label: 'Rent',
    points: [
      { x: '2025-01-01', y: 18 },
      { x: '2025-02-01', y: 22 },
      { x: '2025-03-01', y: 19 },
      { x: '2025-04-01', y: 35 },
      { x: '2025-05-01', y: 29 },
      { x: '2025-06-01', y: 42 },
    ],
  },
  {
    slug: 'for-sale' as const,
    label: 'For Sale',
    points: [
      { x: '2025-01-01', y: 12 },
      { x: '2025-02-01', y: 19 },
      { x: '2025-03-01', y: 14 },
      { x: '2025-04-01', y: 28 },
      { x: '2025-05-01', y: 24 },
      { x: '2025-06-01', y: 38 },
    ],
  },
  {
    slug: 'shortlet' as const,
    label: 'Short Let',
    points: [
      { x: '2025-01-01', y: 15 },
      { x: '2025-02-01', y: 10 },
      { x: '2025-03-01', y: 25 },
      { x: '2025-04-01', y: 20 },
      { x: '2025-05-01', y: 33 },
      { x: '2025-06-01', y: 24 },
    ],
  },
];

const ManagersPage = () => {
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
  const [filter, setFilter] = useState<ManagerFilterType>('all');
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [showRegionActions, setShowRegionActions] = useState(false);
  const [showDeveloperActions, setShowDeveloperActions] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openCreateManager, setOpenCreateManager] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [conversionPeriod, setConversionPeriod] = useState('last_6_months');

  const { data: managersData, isLoading: isLoadingManagers } = useGetManagers({
    users_per_page: 20,
    users_page: 1,
    search_user: debouncedSearchQuery || undefined,
    status: filter,
  });

  const managers: Manager[] = useMemo(() => {
    const list = managersData?.data?.data?.managers;
    if (!Array.isArray(list)) return [];

    return list
      .map((m: any): Manager | null => {
        const id = m?.manager_codec || m?.codec || (m?.id ? String(m.id) : '');
        if (!id) return null;

        const rawStatus = String(m?.onboarding_status || m?.status || '').toLowerCase();
        const status: Manager['status'] =
          rawStatus === 'active' ? 'active' : rawStatus === 'suspended' ? 'suspended' : 'unknown';

        const createdAt = m?.created_at || m?.entity_creation_date;
        const createdOn = createdAt ? format(new Date(createdAt), 'MMMM d, yyyy') : undefined;

        return {
          id,
          name: `${m?.firstname || ''} ${m?.lastname || ''}`.trim() || m?.username || 'Manager',
          email: m?.email_address || m?.email || '',
          phoneNumber: m?.phone_number || m?.phone || undefined,
          avatar: m?.image || m?.display_picture_url || undefined,
          createdOn,
          status,
        };
      })
      .filter(Boolean) as Manager[];
  }, [managersData]);

  const filteredManagers = managers;

  return (
    <div className="flex h-screen w-full flex-col items-start gap-0 self-stretch py-8 lg:flex-row">
      <PageMetaTags
        title="Property Managers"
        description="Manage your property management team and assign responsibilities for different listings."
        keywords="property managers, team management"
      />

      {/* Mobile View */}
      <div className="w-full lg:hidden">
        <div className={selectedManager ? 'hidden' : ''}>
          <ManagerList
            managers={filteredManagers}
            selectedManager={selectedManager}
            setSelectedManager={setSelectedManager}
            filter={filter}
            setFilter={setFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isLoading={isLoadingManagers}
            onCreate={() => setOpenCreateManager(true)}
          />
        </div>
        <div className={selectedManager ? '' : 'hidden'}>
          <Button variant="link" onClick={() => setSelectedManager(null)} className="mb-4 px-4">
            &larr; Back to list
          </Button>
          <ManagerView
            selectedManager={selectedManager}
            setSelectedManager={setSelectedManager}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            showRegionActions={showRegionActions}
            setShowRegionActions={setShowRegionActions}
            showDeveloperActions={showDeveloperActions}
            setShowDeveloperActions={setShowDeveloperActions}
            setOpenModal={setOpenModal}
            conversionPeriod={conversionPeriod}
            setConversionPeriod={setConversionPeriod}
          />
          <AssignModal
            open={openModal}
            onOpenChange={setOpenModal}
            managerId={selectedManager?.id}
            managerName={selectedManager?.name}
          />
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden size-full lg:flex">
        <ResizablePanelGroup direction="horizontal" className="size-full">
          <ResizablePanel defaultSize={35} minSize={25} maxSize={50} className="border-r border-[#F1F1F4]">
            <div className="size-full">
              <ManagerList
                managers={filteredManagers}
                selectedManager={selectedManager}
                setSelectedManager={setSelectedManager}
                filter={filter}
                setFilter={setFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isLoading={isLoadingManagers}
                onCreate={() => setOpenCreateManager(true)}
              />
            </div>
          </ResizablePanel>
          <ResizableHandle className="w-px bg-[#F1F1F4] hover:bg-gray-200" />
          <ResizablePanel defaultSize={65} minSize={50}>
            <div className="h-[calc(100svh-150px)] w-full overflow-y-auto pl-8">
              <ManagerView
                selectedManager={selectedManager}
                setSelectedManager={setSelectedManager}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                showRegionActions={showRegionActions}
                setShowRegionActions={setShowRegionActions}
                showDeveloperActions={showDeveloperActions}
                setShowDeveloperActions={setShowDeveloperActions}
                setOpenModal={setOpenModal}
                conversionPeriod={conversionPeriod}
                setConversionPeriod={setConversionPeriod}
              />
              <AssignModal
                open={openModal}
                onOpenChange={setOpenModal}
                managerId={selectedManager?.id}
                managerName={selectedManager?.name}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <CreateManagerDialog open={openCreateManager} onOpenChange={setOpenCreateManager} />
    </div>
  );
};

const EmptyState = ({ type }: { type: 'manager' | 'list' }) => {
  if (type === 'manager') {
    return (
      <div className="flex size-full flex-col items-center justify-center gap-4 bg-[#F9F9F9]">
        <div className="flex flex-col items-center justify-center gap-6">
          <img
            src={assets.messagingloading || '/placeholder.svg'}
            alt="loading"
            className="h-[84px] w-56 animate-pulse"
            width={224}
            height={84}
          />
          <div className="flex flex-col items-center justify-center gap-3">
            <h5 className="text-[20px]/7 font-normal text-[#1F2130]">No manager selected</h5>
            <p className="text-center text-[14px]/5 tracking-[-0.02em] text-[#71748C]">
              Select a manager from the list
              <br /> to view details and take action.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-8 self-stretch py-14">
      <img
        src={assets.chatloading || '/placeholder.svg'}
        className="h-28 w-[211px] animate-pulse"
        width={211}
        height={112}
      />
      <div className="flex flex-col items-center justify-center gap-3">
        <h5 className="text-[20px]/7 font-semibold text-[#1F2130]">No managers found</h5>
        <p className="text-[14px] leading-[17px] tracking-[-0.02em] text-[#71748C]">
          No managers match your current filter.
        </p>
      </div>
    </div>
  );
};

interface ManagerListProps {
  managers: Manager[];
  selectedManager: Manager | null;
  setSelectedManager: (manager: Manager | null) => void;
  filter: ManagerFilterType;
  setFilter: (filter: ManagerFilterType) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isLoading: boolean;
  onCreate: () => void;
}

const ManagerList = ({
  managers,
  selectedManager,
  setSelectedManager,
  filter,
  setFilter,
  searchQuery,
  setSearchQuery,
  isLoading,
  onCreate,
}: ManagerListProps) => (
  <div className="flex h-full flex-col gap-4 bg-white lg:pr-6">
    <div className="w-full pr-6">
      <div className="flex w-full flex-col gap-6 border-b border-[#E8E8E8] pb-4">
        <div className="relative p-0.5">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 transform text-[#D4AF36]" />
          <Input
            type="text"
            placeholder="Search managers"
            className="h-10 self-stretch rounded-lg border border-[#D5D5DD] px-3 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex w-full flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-1.5">
            <Button
              variant={filter === 'all' ? 'outline' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
              className={`h-8 min-w-[55px] rounded-full text-[12px] font-semibold ${
                filter === 'all'
                  ? 'text-primary border-[#EAEAEA] hover:bg-yellow-50'
                  : 'bg-[#ECECEC] text-[#41415C] hover:text-gray-800'
              }`}
            >
              All
            </Button>
            <Button
              variant={filter === 'active' ? 'outline' : 'ghost'}
              size="sm"
              onClick={() => setFilter('active')}
              className={`h-8 min-w-20 rounded-full text-[12px] font-semibold ${
                filter === 'active'
                  ? 'text-primary border-[#EAEAEA] hover:bg-yellow-50'
                  : 'bg-[#ECECEC] text-[#41415C] hover:text-gray-800'
              }`}
            >
              Active
            </Button>
            <Button
              variant={filter === 'suspended' ? 'outline' : 'ghost'}
              size="sm"
              onClick={() => setFilter('suspended')}
              className={`h-8 min-w-[90px] rounded-full text-[12px] font-semibold ${
                filter === 'suspended'
                  ? 'text-primary border-[#EAEAEA] hover:bg-yellow-50'
                  : 'bg-[#ECECEC] text-[#41415C] hover:text-gray-800'
              }`}
            >
              Suspended
            </Button>
          </div>

          <Button
            style={{
              background: 'linear-gradient(180deg, #505050 0%, #1E1E1E 60%)',
              boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
            }}
            className="h-8 w-fit rounded-[40px] border border-[oklch(0.235_0_0/50%)] p-4 text-[12px]/3 font-normal text-white"
            onClick={onCreate}
          >
            <UserPlus2 className="size-4" />
            Create
          </Button>
        </div>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto pr-6 lg:pr-0">
      {isLoading ? (
        <div className="p-4 text-[12px] text-[#71748C]">Loading managers...</div>
      ) : managers.length === 0 ? (
        <EmptyState type="list" />
      ) : (
        <div className="w-full">
          {managers.map((manager) => (
            <div
              key={manager.id}
              onClick={() => setSelectedManager(manager)}
              className={cn(
                'flex cursor-pointer items-center justify-between gap-3.5 p-4 transition-colors hover:bg-gray-50',
                selectedManager?.id === manager.id
                  ? 'border-none bg-[#FDF9ED]'
                  : 'border-b border-[#E3E3E8] last:border-none'
              )}
            >
              <div className="flex items-center gap-3.5">
                <Avatar className="size-16 rounded-[5px]">
                  <AvatarImage src={manager.avatar || '/placeholder.svg'} alt={manager.name} />
                  <AvatarFallback className="bg-gray-200 text-gray-600">
                    {manager.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex min-w-0 flex-col items-start gap-2.5">
                  <h3 className="truncate text-[14px] leading-[17px] font-semibold text-[#41415A]">{manager.name}</h3>
                  <p className="truncate text-[12px]/3.5 tracking-[0.01em] text-[#71748C]">{manager.email}</p>
                </div>
              </div>

              <Badge className="items-center rounded-sm border border-[oklch(0.5931_0_0/30%)] bg-white text-[12px] leading-[21px] text-[#0B0B0D]">
                <div
                  className={cn(
                    'mr-1 size-1.5 rounded-full',
                    manager.status === 'active'
                      ? 'bg-[#008A00]'
                      : manager.status === 'suspended'
                        ? 'bg-[#D64545]'
                        : 'bg-[#A0A0B0]'
                  )}
                />
                {manager.status === 'unknown' ? 'Unknown' : manager.status}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

interface ManagerViewProps {
  selectedManager: Manager | null;
  setSelectedManager: (manager: Manager | null) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  showRegionActions: boolean;
  setShowRegionActions: (show: boolean) => void;
  showDeveloperActions: boolean;
  setShowDeveloperActions: (show: boolean) => void;
  setOpenModal: (open: boolean) => void;
  conversionPeriod: string;
  setConversionPeriod: (period: string) => void;
}

const ManagerView = ({
  selectedManager,
  setSelectedManager,
  activeTab,
  setActiveTab,
  showRegionActions,
  setShowRegionActions,
  showDeveloperActions,
  setShowDeveloperActions,
  setOpenModal,
  conversionPeriod,
  setConversionPeriod,
}: ManagerViewProps) => {
  const { data: assignedUsersData, isLoading: isLoadingAssignedUsers } = useGetManagersAssignedUsers(
    selectedManager?.id ?? ''
  );
  const { mutate: toggleAccess, isPending: isTogglingAccess } = useToggleManagerAccess({
    onSuccess: (_res, variables) => {
      if (!selectedManager) return;
      const nextStatus: Manager['status'] = variables.managers_access_toggle === 'no' ? 'suspended' : 'active';
      setSelectedManager({ ...selectedManager, status: nextStatus });
    },
  });

  if (!selectedManager) {
    return <EmptyState type="manager" />;
  }

  const assignedUsers = Array.isArray(assignedUsersData?.data?.data?.assigned_users)
    ? assignedUsersData.data.data.assigned_users
    : [];

  const handleToggleAccess = () => {
    const nextToggle: 'yes' | 'no' = selectedManager.status === 'suspended' ? 'yes' : 'no';
    const actionLabel = nextToggle === 'no' ? 'suspend' : 'restore';
    const ok = window.confirm(`Are you sure you want to ${actionLabel} access for ${selectedManager.name}?`);
    if (!ok) return;
    toggleAccess({ manager_codec: selectedManager.id, managers_access_toggle: nextToggle });
  };

  return (
    <div className="flex h-full flex-1 flex-col rounded-[15px] border border-[#DDDDDD] lg:rounded-[15px]">
      {/* Manager Header */}
      <div className="relative min-h-24 rounded-t-[15px] bg-[#E9DAB9]">
        <div className="absolute inset-0 rounded-t-[15px] bg-linear-to-r from-[#E9DAB9] to-[#F5E6C8]">
          <div className="absolute inset-0 bg-[oklch(0.7898_0.1514_90.07/20%)]/20" />
        </div>

        <div className="absolute top-6 flex w-full items-start justify-between gap-4 px-6">
          <Avatar className="size-24 rounded-[5px]">
            <AvatarImage src={selectedManager.avatar || '/placeholder.svg'} alt={selectedManager.name} />
            <AvatarFallback className="bg-gray-200 text-xl font-bold text-gray-600">
              {selectedManager.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="secondary" className="size-10 rounded-[6px] bg-white text-[#41415A]">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setOpenModal(true)} className="flex items-center gap-2">
                <User className="size-4" />
                Assign Users
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => toast.info('Password reset is not available here.')}
              >
                <Settings className="size-4" />
                Reset Password
              </DropdownMenuItem>
              <DropdownMenuItem
                className={cn(
                  'flex items-center gap-2',
                  selectedManager.status === 'suspended' ? 'text-[#008A00]' : 'text-red-600'
                )}
                onClick={handleToggleAccess}
                disabled={isTogglingAccess}
              >
                <Ban className="size-4" />
                {selectedManager.status === 'suspended' ? 'Restore Access' : 'Revoke Access'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-12 flex w-full flex-col items-start gap-4 border-b border-[#F1F1F4] px-4 pb-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div className="flex items-center gap-4">
          <h2 className="text-[20px]/7 font-semibold text-[#2E2E3E]">{selectedManager.name}</h2>
          <Badge className="items-center rounded-sm border border-[oklch(0.5931_0_0/30%)] bg-white text-[12px] leading-[21px] text-[#0B0B0D]">
            <div
              className={cn(
                'mr-1 size-1.5 rounded-full',
                selectedManager.status === 'active'
                  ? 'bg-[#008A00]'
                  : selectedManager.status === 'suspended'
                    ? 'bg-[#D64545]'
                    : 'bg-[#A0A0B0]'
              )}
            />
            {selectedManager.status === 'unknown' ? 'Unknown' : selectedManager.status}
          </Badge>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`border-b-2 pb-2 text-[16px] transition-colors ${
              activeTab === 'profile'
                ? 'border-[#D4AF36] font-semibold text-[#D4AF36]'
                : 'border-transparent text-[#71748C] hover:text-[#1F2130]'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`border-b-2 pb-2 text-[16px] transition-colors ${
              activeTab === 'performance'
                ? 'border-[#D4AF36] font-semibold text-[#D4AF36]'
                : 'border-transparent text-[#71748C] hover:text-[#1F2130]'
            }`}
          >
            Performance
          </button>
        </div>
      </div>

      <div className="w-full flex-1 overflow-y-auto bg-white p-4 lg:px-6 lg:py-4">
        {activeTab === 'profile' ? (
          <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between gap-10 self-stretch py-2">
              <label className="text-[14px]/3.5 text-[#71748C]">Email Address</label>
              <p className="text-[14px]/3.5 text-[#1F2130]">{selectedManager.email}</p>
            </div>
            <div className="flex items-center justify-between gap-10 self-stretch py-2">
              <label className="text-[14px]/3.5 text-[#71748C]">Phone Number</label>
              <p className="text-[14px]/3.5 text-[#1F2130]">{selectedManager.phoneNumber || '—'}</p>
            </div>
            <div className="flex items-center justify-between gap-10 self-stretch py-2">
              <label className="text-[14px]/3.5 text-[#71748C]">Created on</label>
              <p className="text-[14px]/3.5 text-[#1F2130]">{selectedManager.createdOn || '—'}</p>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Assigned Listings (by Region)</h3>
                <button
                  onClick={() => setShowRegionActions(!showRegionActions)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[#71748C] hover:text-[#41415A]"
                >
                  <Settings className="size-4" />
                  {showRegionActions ? 'Hide' : 'Info'}
                </button>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 text-[12px] text-[#71748C]">
                Region-based assignments are not available from the current API.
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Assigned Users (Developer / Owner)</h3>
                <button
                  onClick={() => setShowDeveloperActions(!showDeveloperActions)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 text-sm',
                    showDeveloperActions ? 'text-[#008A00]' : 'text-[#D4AF36]'
                  )}
                >
                  {showDeveloperActions ? (
                    <CircleCheck className="size-4 fill-[#008A00] text-white" />
                  ) : (
                    <Settings className="size-4" />
                  )}
                  {showDeveloperActions ? 'Done' : 'Manage'}
                </button>
              </div>

              <div className="space-y-4">
                {isLoadingAssignedUsers ? (
                  <div className="rounded-lg bg-gray-50 p-4 text-[12px] text-[#71748C]">Loading...</div>
                ) : assignedUsers.length === 0 ? (
                  <div className="rounded-lg bg-gray-50 p-4 text-[12px] text-[#71748C]">No assigned users.</div>
                ) : (
                  assignedUsers.map((u: any) => {
                    const name = `${u?.fname || ''} ${u?.lname || ''}`.trim() || 'User';
                    const assignedOn = u?.pivot?.created_at
                      ? format(new Date(u.pivot.created_at), 'MMMM d, yyyy')
                      : '—';
                    return (
                      <div key={u?.id} className="rounded-lg bg-gray-50 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between py-1">
                              <label className="text-sm text-gray-500">User</label>
                              <p className="text-sm text-gray-900">{name}</p>
                            </div>
                            <div className="flex items-center justify-between py-1">
                              <label className="text-sm text-gray-500">Email Address</label>
                              <a href={`mailto:${u?.email}`} className="text-sm text-blue-600 hover:text-blue-800">
                                {u?.email || '—'}
                              </a>
                            </div>
                            <div className="flex items-center justify-between py-1">
                              <label className="text-sm text-gray-500">Phone</label>
                              <p className="text-sm text-gray-900">{u?.phone || '—'}</p>
                            </div>
                            <div className="flex items-center justify-between py-1">
                              <label className="text-sm text-gray-500">Assigned on</label>
                              <p className="text-sm text-gray-900">{assignedOn}</p>
                            </div>
                          </div>
                          {showDeveloperActions && (
                            <button
                              className="ml-4 rounded-lg p-2 text-red-500 hover:bg-red-50 hover:text-red-700"
                              onClick={() => toast.info('Unassign is not available yet.')}
                            >
                              <Trash2 className="size-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
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
                className="h-8 rounded-[40px] bg-[#F9F9FB] p-4 text-[14px]/5 font-normal text-[#1F2130]"
              >
                Export
                <Download className="size-4" />
              </Button>
            </header>

            <section className="grid grid-cols-3 gap-5 self-stretch">
              {OVERVIEW.map((item, index) => (
                <div
                  key={index}
                  className="isolate box-border flex grow flex-col items-start gap-5 rounded-[10px] border border-[#E2E2E2] bg-white"
                >
                  <div className="box-border w-full border-b border-[#ECECEC] bg-[#F9F9F9] px-6 pt-6 pb-3">
                    <h6 className="text-[12px]/3.5 tracking-[-0.02em] text-[#7F7F7F] uppercase">{item.title}</h6>
                  </div>
                  <div className="flex items-baseline gap-2 px-6 pb-6">
                    <p className="text-[48px]/12 font-semibold tracking-[-1px] text-[#1F2130]">{item.value}</p>
                    <span className="text-[16px] leading-[22px] text-[#1F2130]">Properties</span>
                  </div>
                </div>
              ))}
            </section>

            <section className="grid w-full grid-cols-1 gap-6 rounded-lg">
              <ListingActivities data={listingActivitiesData} isLoading={false} />
              <ConversionsChart
                data={conversionChartData}
                period={conversionPeriod}
                onPeriodChange={setConversionPeriod}
              />
            </section>

            <section className="grid w-full grid-cols-2 gap-5 self-stretch">
              {TOTALS.map((item, index) => (
                <div
                  key={index}
                  className="isolate box-border flex grow flex-col items-start gap-5 rounded-[10px] border border-[#E2E2E2] bg-white"
                >
                  <div className="box-border w-full border-b border-[#ECECEC] bg-[#F9F9F9] px-6 pt-6 pb-3">
                    <h6 className="text-[12px]/3.5 tracking-[-0.02em] text-[#7F7F7F] uppercase">{item.title}</h6>
                  </div>
                  <div className="flex items-baseline gap-2 px-6 pb-6">
                    <p className="text-[48px]/12 font-semibold tracking-[-1px] text-[#1F2130]">{item.value}</p>
                    <div className="flex items-center gap-1.5">
                      <MoveUpRight className="size-3 text-[#008A00]" />
                      <span className="text-[14px]/4 tracking-[-0.02em] text-[#008A00D2]">3.36</span>
                      <span className="text-[14px]/4 tracking-[-0.02em] text-[#71748C]">Last mth.</span>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagersPage;
