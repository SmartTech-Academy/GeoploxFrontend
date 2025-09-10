'use client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
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

type ManagerFilterType = 'all' | 'account' | 'content';
interface ManagerPermissions {
  canResetPassword: boolean;
  canRevokeAccess: boolean;
  canManageContent: boolean;
  canManageAccounts: boolean;
}

type TabType = 'profile' | 'performance';

interface AssignedRegion {
  name: string;
  assignedOn: string;
}

interface AssignedDeveloper {
  user: string;
  email: string;
  assignedOn: string;
  region: string;
  developerEmail: string;
}

interface Manager {
  id: number;
  name: string;
  email: string;
  role: 'Content' | 'Account';
  avatar?: string;
  phoneNumber?: string;
  createdOn: string;
  status: 'active' | 'inactive';
  permissions: ManagerPermissions;
  assignedRegions: AssignedRegion[];
  assignedDevelopers: AssignedDeveloper[];
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
  {
    title: 'Total Listings',
    value: '45',
  },
  {
    title: 'Active Listing',
    value: '10',
  },
  {
    title: 'Archived Listing',
    value: '30',
  },
];

const TOTALS: PerformanceMetric[] = [
  { title: 'Total Clicks', value: '2.04K' },
  { title: 'Total Leads', value: '140' },
  { title: 'Total Views', value: '5.15K' },
  { title: 'Total Saves & shares', value: '565' },
];

const ManagersPage = () => {
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
  const [filter, setFilter] = useState<ManagerFilterType>('all');
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [showRegionActions, setShowRegionActions] = useState(false);
  const [showDeveloperActions, setShowDeveloperActions] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const managers: Manager[] = [
    {
      id: 1,
      name: 'David Elson',
      email: 'rodger913@aol.com',
      role: 'Content',
      avatar: assets.messaging1,
      phoneNumber: '0805-555-3323',
      createdOn: 'July 20, 2025',
      status: 'active',
      permissions: {
        canResetPassword: true,
        canRevokeAccess: true,
        canManageContent: true,
        canManageAccounts: false,
      },
      assignedRegions: [
        { name: 'Lagos Mainland', assignedOn: 'July 20, 2025' },
        { name: 'Lekki-Ajah Axis', assignedOn: 'July 20, 2025' },
      ],
      assignedDevelopers: [
        {
          user: 'Sarah Bello',
          email: 'janet.lee@email.com',
          assignedOn: 'July 20, 2025',
          region: 'John Edet Real Estate',
          developerEmail: 'johnedetrstate@email.com',
        },
      ],
    },
    {
      id: 2,
      name: 'David Elson',
      email: 'rodger913@aol.com',
      role: 'Account',
      avatar: assets.messaging2,
      phoneNumber: '0805-555-3323',
      createdOn: 'July 18, 2025',
      status: 'active',
      permissions: {
        canResetPassword: true,
        canRevokeAccess: true,
        canManageContent: false,
        canManageAccounts: true,
      },
      assignedRegions: [
        { name: 'Lagos Mainland', assignedOn: 'July 20, 2025' },
        { name: 'Lekki-Ajah Axis', assignedOn: 'July 20, 2025' },
      ],
      assignedDevelopers: [
        {
          user: 'Sarah Bello',
          email: 'janet.lee@email.com',
          assignedOn: 'July 20, 2025',
          region: 'John Edet Real Estate',
          developerEmail: 'johnedetrstate@email.com',
        },
      ],
    },
    {
      id: 3,
      name: 'Kimberly Mastrangelo',
      email: 's.t.sharkey@outlook.com',
      role: 'Account',
      avatar: assets.messaging3,
      phoneNumber: '0805-555-3323',
      createdOn: 'July 15, 2025',
      status: 'active',
      permissions: {
        canResetPassword: true,
        canRevokeAccess: true,
        canManageContent: false,
        canManageAccounts: true,
      },
      assignedRegions: [
        { name: 'Lagos Mainland', assignedOn: 'July 20, 2025' },
        { name: 'Lekki-Ajah Axis', assignedOn: 'July 20, 2025' },
      ],
      assignedDevelopers: [
        {
          user: 'Sarah Bello',
          email: 'janet.lee@email.com',
          assignedOn: 'July 20, 2025',
          region: 'John Edet Real Estate',
          developerEmail: 'johnedetrstate@email.com',
        },
      ],
    },
    {
      id: 4,
      name: 'Daniel Hamilton',
      email: 'patricia651@outlook.com',
      role: 'Account',
      avatar: assets.messaging4,
      phoneNumber: '0805-555-3323',
      createdOn: 'July 12, 2025',
      status: 'active',
      permissions: {
        canResetPassword: true,
        canRevokeAccess: true,
        canManageContent: false,
        canManageAccounts: true,
      },
      assignedRegions: [
        { name: 'Lagos Mainland', assignedOn: 'July 20, 2025' },
        { name: 'Lekki-Ajah Axis', assignedOn: 'July 20, 2025' },
      ],
      assignedDevelopers: [
        {
          user: 'Sarah Bello',
          email: 'janet.lee@email.com',
          assignedOn: 'July 20, 2025',
          region: 'John Edet Real Estate',
          developerEmail: 'johnedetrstate@email.com',
        },
      ],
    },
    {
      id: 5,
      name: 'Bradley Lawlor',
      email: 'jerry73@aol.com',
      role: 'Account',
      avatar: assets.messaging5,
      phoneNumber: '0805-555-3323',
      createdOn: 'July 10, 2025',
      status: 'active',
      permissions: {
        canResetPassword: true,
        canRevokeAccess: true,
        canManageContent: false,
        canManageAccounts: true,
      },
      assignedRegions: [
        { name: 'Lagos Mainland', assignedOn: 'July 20, 2025' },
        { name: 'Lekki-Ajah Axis', assignedOn: 'July 20, 2025' },
      ],
      assignedDevelopers: [
        {
          user: 'Sarah Bello',
          email: 'janet.lee@email.com',
          assignedOn: 'July 20, 2025',
          region: 'John Edet Real Estate',
          developerEmail: 'johnedetrstate@email.com',
        },
      ],
    },
  ];

  const EmptyState = ({ type }: { type: 'manager' | 'list' }) => {
    if (type === 'manager') {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[#F9F9F9]">
          <div className="flex flex-col items-center justify-center gap-6">
            <img
              src={assets.messagingloading || '/placeholder.svg'}
              alt="loading"
              className="h-[84px] w-[224px] animate-pulse"
              width={224}
              height={84}
            />
            <div className="flex flex-col items-center justify-center gap-3">
              <h5 className="text-[20px] leading-[28px] font-normal text-[#1F2130]">No manager selected</h5>
              <p className="text-center text-[14px] leading-[20px] tracking-[-0.02em] text-[#71748C]">
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
          className="h-[112px] w-[211px] animate-pulse"
          width={211}
          height={112}
        />
        <div className="flex flex-col items-center justify-center gap-3">
          <h5 className="text-[20px] leading-[28px] font-semibold text-[#1F2130]">No managers found</h5>
          <p className="text-[14px] leading-[17px] tracking-[-0.02em] text-[#71748C]">
            No managers match your current filter.
          </p>
        </div>
      </div>
    );
  };

  const filteredManagers = managers.filter((manager) => {
    if (filter === 'all') return true;
    return manager.role.toLowerCase() === filter;
  });

  const ManagerList = () => (
    <div className="flex h-full flex-col gap-4 bg-white lg:pr-6">
      {/* Header and Search */}
      <div className="w-full pr-6">
        <div className="flex w-full flex-col gap-6 border-b border-[#E8E8E8] pb-4">
          <div className="relative p-0.5">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 transform text-[#D4AF36]" />
            <Input
              type="text"
              placeholder="Search managers"
              className="h-10 self-stretch rounded-[8px] border border-[#D5D5DD] px-3 pl-10"
            />
          </div>

          {/* Filter Tabs */}
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
                variant={filter === 'account' ? 'outline' : 'ghost'}
                size="sm"
                onClick={() => setFilter('account')}
                className={`h-8 min-w-[80px] rounded-full text-[12px] font-semibold ${
                  filter === 'account'
                    ? 'text-primary border-[#EAEAEA] hover:bg-yellow-50'
                    : 'bg-[#ECECEC] text-[#41415C] hover:text-gray-800'
                }`}
              >
                Account
              </Button>
              <Button
                variant={filter === 'content' ? 'outline' : 'ghost'}
                size="sm"
                onClick={() => setFilter('content')}
                className={`h-8 min-w-[90px] rounded-full text-[12px] font-semibold ${
                  filter === 'content'
                    ? 'text-primary border-[#EAEAEA] hover:bg-yellow-50'
                    : 'bg-[#ECECEC] text-[#41415C] hover:text-gray-800'
                }`}
              >
                Content
              </Button>
            </div>

            {/* Create Button */}
            <Button
              style={{
                background: 'linear-gradient(180deg, #505050 0%, #1E1E1E 60%)',
                boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
              }}
              className="h-8 w-fit rounded-[40px] border border-[oklch(0.235_0_0_/_50%)] p-4 text-[12px] leading-[12px] font-normal text-white"
            >
              <UserPlus2 className="size-4" />
              Create
            </Button>
          </div>
        </div>
      </div>

      {/* Manager List */}
      <div className="flex-1 overflow-y-auto pr-6 lg:pr-0">
        {filteredManagers.length === 0 ? (
          <EmptyState type="list" />
        ) : (
          <div className="w-full">
            {filteredManagers.map((manager) => (
              <div
                key={manager.id}
                onClick={() => setSelectedManager(manager)}
                className={cn(
                  `flex cursor-pointer items-center justify-between gap-[14px] p-4 transition-colors hover:bg-gray-50`,
                  selectedManager?.id === manager.id
                    ? 'border-none bg-[#FDF9ED]'
                    : 'border-b border-[#E3E3E8] last:border-none'
                )}
              >
                <div className="flex items-center gap-[14px]">
                  <Avatar className="size-[64px] rounded-[5px]">
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
                    <p className="truncate text-[12px] leading-[14px] tracking-[0.01em] text-[#71748C]">
                      {manager.email}
                    </p>
                  </div>
                </div>

                <Badge
                  className={`items-center rounded border border-[oklch(0.5931_0_0_/_30%)] bg-white text-[12px] leading-[21px] text-[#0B0B0D]`}
                >
                  <div
                    className={cn(
                      'mr-1 size-1.5 rounded-full',
                      manager.role === 'Content' ? 'bg-[#FDCE05]' : 'bg-[#0AA6A9]'
                    )}
                  />
                  {manager.role}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const ManagerView = () => {
    if (!selectedManager) {
      return <EmptyState type="manager" />;
    }

    return (
      <div className="flex h-full flex-1 flex-col rounded-[15px] border border-[#DDDDDD] lg:rounded-[15px]">
        {/* Manager Header */}
        <div className="relative min-h-[96px] rounded-t-[15px] bg-[#E9DAB9]">
          <div className="absolute inset-0 rounded-t-[15px] bg-gradient-to-r from-[#E9DAB9] to-[#F5E6C8]">
            <div className="absolute inset-0 bg-[oklch(0.7898_0.1514_90.07_/_20%)]/20" />
          </div>

          <div className="absolute top-6 flex w-full items-start justify-between gap-4 px-6">
            <Avatar className="size-[96px] rounded-[5px]">
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
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setOpenModal(true)} className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Assign Listing
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Reset Password
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                  <Ban className="h-4 w-4" />
                  Revoke Access
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-12 flex w-full flex-col items-start gap-4 border-b border-[#F1F1F4] px-4 pb-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-[20px] leading-[28px] font-semibold text-[#2E2E3E]">{selectedManager.name}</h2>
            <Badge
              className={`items-center rounded border border-[oklch(0.5931_0_0_/_30%)] bg-white text-[12px] leading-[21px] text-[#0B0B0D]`}
            >
              <div
                className={cn(
                  'mr-1 size-1.5 rounded-full',
                  selectedManager.role === 'Content' ? 'bg-[#FDCE05]' : 'bg-[#0AA6A9]'
                )}
              />
              {selectedManager.role}
            </Badge>
          </div>

          {/* Tabs */}
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

        {/* Manager Details */}
        <div className="w-full flex-1 overflow-y-auto bg-white p-4 lg:px-6 lg:py-4">
          {activeTab === 'profile' ? (
            <div className="flex w-full flex-col gap-4">
              <div className="flex items-center justify-between gap-10 self-stretch py-2">
                <label className="text-[14px] leading-[14px] text-[#71748C]">Email Address</label>
                <p className="text-[14px] leading-[14px] text-[#1F2130]">{selectedManager.email}</p>
              </div>
              <div className="flex items-center justify-between gap-10 self-stretch py-2">
                <label className="text-[14px] leading-[14px] text-[#71748C]">Phone Number</label>
                <p className="text-[14px] leading-[14px] text-[#1F2130]">{selectedManager.phoneNumber}</p>
              </div>
              <div className="flex items-center justify-between gap-10 self-stretch py-2">
                <label className="text-[14px] leading-[14px] text-[#71748C]">Created on</label>
                <p className="text-[14px] leading-[14px] text-[#1F2130]">{selectedManager.createdOn}</p>
              </div>

              <div className="">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Assigned Listing (by Region)</h3>
                  <button
                    onClick={() => setShowRegionActions(!showRegionActions)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-orange-600 hover:text-orange-700"
                  >
                    <Settings className="h-4 w-4" />
                    {showRegionActions ? 'Hide Actions' : 'Manage'}
                  </button>
                </div>

                <div className="space-y-4">
                  {selectedManager.assignedRegions.map((region, index) => (
                    <div key={index} className="rounded-lg bg-gray-50 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between py-1">
                            <label className="text-sm text-gray-500">Region</label>
                            <p className="text-sm text-gray-900">{region.name}</p>
                          </div>
                          <div className="flex items-center justify-between py-1">
                            <label className="text-sm text-gray-500">Assigned on</label>
                            <p className="text-sm text-gray-900">{region.assignedOn}</p>
                          </div>
                        </div>
                        {showRegionActions && (
                          <button className="ml-4 rounded-lg p-2 text-red-500 hover:bg-red-50 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assigned Listing (by Developer/Owner) Section */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Assigned Listing (by Developer / Owner )</h3>
                  <button
                    onClick={() => setShowDeveloperActions(!showDeveloperActions)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 text-sm',
                      showDeveloperActions ? 'text-[#008A00]' : 'text-[#D4AF36]'
                    )}
                  >
                    {showDeveloperActions ? (
                      <CircleCheck className="h-4 w-4 fill-[#008A00] text-white" />
                    ) : (
                      <Settings className="h-4 w-4" />
                    )}

                    {showDeveloperActions ? 'Save Changes' : 'Manage'}
                  </button>
                </div>

                <div className="space-y-4">
                  {selectedManager.assignedDevelopers.map((developer, index) => (
                    <div key={index} className="rounded-lg bg-gray-50 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between py-1">
                            <label className="text-sm text-gray-500">User</label>
                            <p className="text-sm text-gray-900">{developer.user}</p>
                          </div>
                          <div className="flex items-center justify-between py-1">
                            <label className="text-sm text-gray-500">Email Address</label>
                            <a href={`mailto:${developer.email}`} className="text-sm text-blue-600 hover:text-blue-800">
                              {developer.email}
                            </a>
                          </div>
                          <div className="flex items-center justify-between py-1">
                            <label className="text-sm text-gray-500">Assigned on</label>
                            <p className="text-sm text-gray-900">{developer.assignedOn}</p>
                          </div>
                          <div className="flex items-center justify-between py-1">
                            <label className="text-sm text-gray-500">Region</label>
                            <p className="text-sm text-gray-900">{developer.region}</p>
                          </div>
                          <div className="flex items-center justify-between py-1">
                            <label className="text-sm text-gray-500">Email Address</label>
                            <a
                              href={`mailto:${developer.developerEmail}`}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              {developer.developerEmail}
                            </a>
                          </div>
                        </div>
                        {showDeveloperActions && (
                          <button className="ml-4 rounded-lg p-2 text-red-500 hover:bg-red-50 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
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
                  className="h-8 rounded-[40px] bg-[#F9F9FB] p-4 text-[14px] leading-[20px] font-normal text-[#1F2130]"
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
                      <h6 className="text-[12px] leading-[14px] tracking-[-0.02em] text-[#7F7F7F] uppercase">
                        {item.title}
                      </h6>
                    </div>

                    <div className="flex items-baseline gap-2 px-6 pb-6">
                      <p className="text-[48px] leading-[48px] font-semibold tracking-[-1px] text-[#1F2130]">
                        {item.value}
                      </p>
                      <span className="text-[16px] leading-[22px] text-[#1F2130]">Properties</span>
                    </div>
                  </div>
                ))}
              </section>

              <section className="grid w-full grid-cols-1 gap-6 rounded-[8px]">
                <ListingActivities />
                <ConversionsChart />
              </section>

              <section className="grid w-full grid-cols-2 gap-5 self-stretch">
                {TOTALS.map((item, index) => (
                  <div
                    key={index}
                    className="isolate box-border flex grow flex-col items-start gap-5 rounded-[10px] border border-[#E2E2E2] bg-white"
                  >
                    <div className="box-border w-full border-b border-[#ECECEC] bg-[#F9F9F9] px-6 pt-6 pb-3">
                      <h6 className="text-[12px] leading-[14px] tracking-[-0.02em] text-[#7F7F7F] uppercase">
                        {item.title}
                      </h6>
                    </div>

                    <div className="flex items-baseline gap-2 px-6 pb-6">
                      <p className="text-[48px] leading-[48px] font-semibold tracking-[-1px] text-[#1F2130]">
                        {item.value}
                      </p>

                      <div className="flex items-center gap-1.5">
                        <MoveUpRight className="size-3 text-[#008A00]" />
                        <span className="text-[14px] leading-[16px] tracking-[-0.02em] text-[#008A00D2]">3.36</span>
                        <span className="text-[14px] leading-[16px] tracking-[-0.02em] text-[#71748C]">Last mth.</span>
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            </div>
          )}
        </div>
        <AssignModal open={openModal} onOpenChange={setOpenModal} />
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full flex-col items-start gap-0 self-stretch py-8 lg:flex-row">
      <PageMetaTags
        title="Property Managers"
        description="Manage your property management team and assign responsibilities for different listings."
        keywords="property managers, team management"
      />

      {/* Mobile View */}
      <div className="w-full lg:hidden">
        {!selectedManager ? (
          <ManagerList />
        ) : (
          <>
            <Button variant="link" onClick={() => setSelectedManager(null)} className="mb-4 px-4">
              &larr; Back to list
            </Button>
            <ManagerView />
          </>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden h-full w-full lg:flex">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={35} minSize={25} maxSize={50} className="border-r border-[#F1F1F4]">
            <div className="h-full w-full">
              <ManagerList />
            </div>
          </ResizablePanel>
          <ResizableHandle className="w-px bg-[#F1F1F4] hover:bg-gray-200" />
          <ResizablePanel defaultSize={65} minSize={50}>
            <div className="h-[calc(100svh-150px)] w-full overflow-y-auto pl-8">
              <ManagerView />
              <AssignModal open={openModal} onOpenChange={setOpenModal} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default ManagersPage;
