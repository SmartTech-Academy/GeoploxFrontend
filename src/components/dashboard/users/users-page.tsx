'use client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Search, Settings, Ban, MoreVertical, MapPin, MoveUpRight, Download } from 'lucide-react';
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

interface User {
  id: number;
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
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessWhatsapp: string;
  businessAddress: string;
  proofOfAddress?: string;
  govtIssuedId?: string;
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

const UsersPage = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  const users: User[] = [
    {
      id: 1,
      name: 'David Elson',
      email: 'rodger913@aol.com',
      status: 'verified',
      avatar: assets.messaging1,
      joinedOn: 'July 20, 2025',
      details: {
        accountType: 'Property Owner',
        personalPhone: '0805-555-3323',
        personalWhatsapp: '0805-555-3323',
        homeAddress: '12, Oba Akinjobi Road, Ikeja GRA, Lagos State',
        businessName: 'Property Owner',
        businessEmail: 'rene_realty@forbes.com',
        businessPhone: '0805-555-3323',
        businessWhatsapp: '0805-555-3323',
        businessAddress: '12, Oba Akinjobi Road, Ikeja GRA, Lagos State',
        proofOfAddress: assets.proofofaddress,
        govtIssuedId: assets.govissueid,
      },
    },
    {
      id: 2,
      name: 'Rodger Struck',
      email: 'katie63@aol.com',
      status: 'unverified',
      avatar: assets.messaging2,
      joinedOn: 'July 20, 2025',
      details: {
        accountType: 'Property Owner',
        personalPhone: '0805-555-3323',
        personalWhatsapp: '0805-555-3323',
        homeAddress: '12, Oba Akinjobi Road, Ikeja GRA, Lagos State',
        businessName: 'Property Owner',
        businessEmail: 'rene_realty@forbes.com',
        businessPhone: '0805-555-3323',
        businessWhatsapp: '0805-555-3323',
        businessAddress: '12, Oba Akinjobi Road, Ikeja GRA, Lagos State',
        proofOfAddress: assets.proofofaddress,
        govtIssuedId: assets.govissueid,
      },
    },
    {
      id: 3,
      name: 'Kimberly Mastrangelo',
      email: 's.t.sharkey@outlook.com',
      status: 'verified',
      avatar: assets.messaging3,
      joinedOn: 'July 18, 2025',
      details: {
        accountType: 'Property Owner',
        personalPhone: '0805-555-3323',
        personalWhatsapp: '0805-555-3323',
        homeAddress: '12, Oba Akinjobi Road, Ikeja GRA, Lagos State',
        businessName: 'Property Owner',
        businessEmail: 'rene_realty@forbes.com',
        businessPhone: '0805-555-3323',
        businessWhatsapp: '0805-555-3323',
        businessAddress: '12, Oba Akinjobi Road, Ikeja GRA, Lagos State',
        proofOfAddress: assets.proofofaddress,
        govtIssuedId: assets.govissueid,
      },
    },
    {
      id: 4,
      name: 'Daniel Hamilton',
      email: 'patricia651@outlook.com',
      status: 'verified',
      avatar: assets.messaging4,
      joinedOn: 'July 15, 2025',
      details: {
        accountType: 'Property Owner',
        personalPhone: '0805-555-3323',
        personalWhatsapp: '0805-555-3323',
        homeAddress: '12, Oba Akinjobi Road, Ikeja GRA, Lagos State',
        businessName: 'Property Owner',
        businessEmail: 'rene_realty@forbes.com',
        businessPhone: '0805-555-3323',
        businessWhatsapp: '0805-555-3323',
        businessAddress: '12, Oba Akinjobi Road, Ikeja GRA, Lagos State',
        proofOfAddress: assets.proofofaddress,
        govtIssuedId: assets.govissueid,
      },
    },
    {
      id: 5,
      name: 'Bradley Lawlor',
      email: 'jerry73@aol.com',
      status: 'verified',
      avatar: assets.landlord,
      joinedOn: 'July 12, 2025',
      details: {
        accountType: 'Property Owner',
        personalPhone: '0805-555-3323',
        personalWhatsapp: '0805-555-3323',
        homeAddress: '12, Oba Akinjobi Road, Ikeja GRA, Lagos State',
        businessName: 'Property Owner',
        businessEmail: 'rene_realty@forbes.com',
        businessPhone: '0805-555-3323',
        businessWhatsapp: '0805-555-3323',
        businessAddress: '12, Oba Akinjobi Road, Ikeja GRA, Lagos State',
        proofOfAddress: assets.proofofaddress,
        govtIssuedId: assets.govissueid,
      },
    },
    {
      id: 6,
      name: 'Katie Sims',
      email: 'm.k.freund@aol.com',
      status: 'unverified',
      avatar: assets.messaging5,
      joinedOn: 'July 10, 2025',
      details: {
        accountType: 'Property Owner',
        personalPhone: '0805-555-3323',
        personalWhatsapp: '0805-555-3323',
        homeAddress: '12, Oba Akinjobi Road, Ikeja GRA, Lagos State',
        businessName: 'Property Owner',
        businessEmail: 'rene_realty@forbes.com',
        businessPhone: '0805-555-3323',
        businessWhatsapp: '0805-555-3323',
        businessAddress: '12, Oba Akinjobi Road, Ikeja GRA, Lagos State',
        proofOfAddress: assets.proofofaddress,
        govtIssuedId: assets.govissueid,
      },
    },
    {
      id: 7,
      name: 'Eddie Lake',
      email: 'k_pacheco@gmail.com',
      status: 'unverified',
      avatar: assets.messaging6,
      joinedOn: 'July 8, 2025',
      details: {
        accountType: 'Property Owner',
        personalPhone: '0805-555-3323',
        personalWhatsapp: '0805-555-3323',
        homeAddress: '12, Oba Akinjobi Road, Ikeja GRA, Lagos State',
        businessName: 'Property Owner',
        businessEmail: 'rene_realty@forbes.com',
        businessPhone: '0805-555-3323',
        businessWhatsapp: '0805-555-3323',
        businessAddress: '12, Oba Akinjobi Road, Ikeja GRA, Lagos State',
        proofOfAddress: assets.proofofaddress,
        govtIssuedId: assets.govissueid,
      },
    },
  ];

  const EmptyState = ({ type }: { type: 'user' | 'list' }) => {
    if (type === 'user') {
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
              <h5 className="text-[20px] leading-[28px] font-normal text-[#1F2130]">No user selected</h5>
              <p className="text-center text-[14px] leading-[20px] tracking-[-0.02em] text-[#71748C]">
                Select a user from the list
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
          <h5 className="text-[20px] leading-[28px] font-semibold text-[#1F2130]">No users found</h5>
          <p className="text-[14px] leading-[17px] tracking-[-0.02em] text-[#71748C]">
            No users match your current filter.
          </p>
        </div>
      </div>
    );
  };

  const filteredUsers =
    filter === 'verified'
      ? users.filter((user) => user.status === 'verified')
      : filter === 'unverified'
        ? users.filter((user) => user.status === 'unverified')
        : filter === 'blacklisted'
          ? users.filter((user) => user.status === 'blacklisted')
          : users;

  const UserList = () => (
    <div className="flex h-full flex-col gap-4 bg-white">
      {/* Header and Search */}
      <div className="w-full pr-6">
        <div className="flex w-full flex-col gap-6 border-b border-[#E8E8E8] pb-4">
          <div className="relative p-0.5">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 transform text-[#D4AF36]" />
            <Input
              type="text"
              placeholder="Search users"
              className="h-10 self-stretch rounded-[8px] border border-[#D5D5DD] px-3 pl-10"
            />
          </div>

          {/* Filter Tabs */}
          <div className="w-full">
            <div className="flex flex-wrap items-center gap-1.5">
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
                variant={filter === 'verified' ? 'outline' : 'ghost'}
                size="sm"
                onClick={() => setFilter('verified')}
                className={`h-8 min-w-[80px] rounded-full text-[12px] font-semibold ${
                  filter === 'verified'
                    ? 'text-primary border-[#EAEAEA] hover:bg-yellow-50'
                    : 'bg-[#ECECEC] text-[#41415C] hover:text-gray-800'
                }`}
              >
                Verified
              </Button>
              <Button
                variant={filter === 'unverified' ? 'outline' : 'ghost'}
                size="sm"
                onClick={() => setFilter('unverified')}
                className={`h-8 min-w-[90px] rounded-full text-[12px] font-semibold ${
                  filter === 'unverified'
                    ? 'text-primary border-[#EAEAEA] hover:bg-yellow-50'
                    : 'bg-[#ECECEC] text-[#41415C] hover:text-gray-800'
                }`}
              >
                Unverified
              </Button>
              <Button
                variant={filter === 'blacklisted' ? 'outline' : 'ghost'}
                size="sm"
                onClick={() => setFilter('blacklisted')}
                className={`h-8 min-w-[90px] rounded-full text-[12px] font-semibold ${
                  filter === 'blacklisted'
                    ? 'text-primary border-[#EAEAEA] hover:bg-yellow-50'
                    : 'bg-[#ECECEC] text-[#41415C] hover:text-gray-800'
                }`}
              >
                Blacklisted
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto pr-6 lg:pr-0">
        {filteredUsers.length === 0 ? (
          <EmptyState type="list" />
        ) : (
          <div className="w-full">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={cn(
                  `flex cursor-pointer items-center justify-between gap-[14px] p-4 transition-colors hover:bg-gray-50`,
                  selectedUser?.id === user.id
                    ? 'border-none bg-[#FDF9ED]'
                    : 'border-b border-[#E3E3E8] last:border-none'
                )}
              >
                <div className="flex items-center gap-[14px]">
                  <Avatar className="size-[64px] rounded-[5px]">
                    <AvatarImage src={user.avatar || '/placeholder.svg'} alt={user.name} />
                    <AvatarFallback className="bg-gray-200 text-gray-600">
                      {user.name
                        .split(' ')
                        .map((n: any) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex min-w-0 flex-col items-start gap-2.5">
                    <h3 className="truncate text-[14px] leading-[17px] font-semibold text-[#41415A]">{user.name}</h3>

                    <p className="inline-flex items-center truncate text-[12px] leading-[14px] tracking-[0.01em] text-[#71748C]">
                      <MapPin className="size-2.5" />
                      {user.email}
                    </p>
                  </div>
                </div>

                <Badge
                  className={`items-center rounded border border-[oklch(0.5931_0_0_/_30%)] bg-white text-[12px] leading-[21px] text-[#0B0B0D]`}
                >
                  <div
                    className={cn(
                      'size-1.5 rounded-full !capitalize',
                      user.status === 'verified'
                        ? 'bg-[#0AA6A9]'
                        : user.status === 'unverified'
                          ? 'bg-[#FDCE05]'
                          : 'bg-[#D20832]'
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

  const UserView = () => {
    if (!selectedUser) {
      return <EmptyState type="user" />;
    }

    return (
      <div className="flex h-full flex-1 flex-col rounded-[15px] border border-[#DDDDDD] lg:rounded-[15px]">
        {/* User Header */}
        <div className="relative min-h-[96px] rounded-t-[15px] bg-[#E9DAB9]">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${assets.yellowbackground})`,
            }}
          >
            <div className="absolute inset-0 bg-[oklch(0.7898_0.1514_90.07_/_20%)]/20" />
          </div>

          <div className="absolute top-6 flex w-full items-start justify-between gap-4 px-6">
            <Avatar className="size-[96px] rounded-[5px]">
              <AvatarImage src={selectedUser.avatar || '/placeholder.svg'} alt={selectedUser.name} />
              <AvatarFallback className="bg-gray-200 text-xl font-bold text-gray-600">
                {selectedUser.name
                  .split(' ')
                  .map((n: any) => n[0])
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
                <DropdownMenuItem className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Verify User
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                  <Ban className="h-4 w-4" />
                  Blacklist User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-12 flex w-full flex-col items-start gap-4 border-b border-[#F1F1F4] px-4 pb-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-[20px] leading-[28px] font-semibold text-[#2E2E3E]">{selectedUser.name}</h2>

            <Badge
              className={`items-center rounded border border-[oklch(0.5931_0_0_/_30%)] bg-white text-[12px] leading-[21px] text-[#0B0B0D]`}
            >
              <div
                className={cn(
                  'size-1.5 rounded-full',
                  selectedUser.status === 'verified'
                    ? 'bg-[#0AA6A9]'
                    : selectedUser.status === 'unverified'
                      ? 'bg-[#FDCE05]'
                      : 'bg-[#D20832]'
                )}
              />
              {selectedUser.status}
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

        {/* User Details */}
        <div className="w-full flex-1 overflow-y-auto bg-white p-4 lg:py-4">
          {activeTab === 'profile' ? (
            <div className="flex w-full flex-col gap-4">
              {/* Personal Information */}
              <div className="w-full">
                <div className="flex items-center justify-between gap-10 self-stretch py-2">
                  <label className="text-[14px] leading-[14px] text-[#71748C]">Account Type</label>
                  <p className="text-[14px] leading-[14px] text-[#1F2130]">{selectedUser.details.accountType}</p>
                </div>
                <div className="flex items-center justify-between gap-10 self-stretch py-2">
                  <label className="text-[14px] leading-[14px] text-[#71748C]">Property Owner</label>
                  <p className="text-[14px] leading-[14px] text-[#1F2130]">{selectedUser.details.accountType}</p>
                </div>
                <div className="flex items-center justify-between gap-10 self-stretch py-2">
                  <label className="text-[14px] leading-[14px] text-[#71748C]">Personal Phone Number</label>
                  <p className="text-[14px] leading-[14px] text-[#1F2130]">{selectedUser.details.personalPhone}</p>
                </div>
                <div className="flex items-center justify-between gap-10 self-stretch py-2">
                  <label className="text-[14px] leading-[14px] text-[#71748C]">Personal Whatsapp Number</label>
                  <p className="text-[14px] leading-[14px] text-[#1F2130]">{selectedUser.details.personalWhatsapp}</p>
                </div>
                <div className="flex items-center justify-between gap-10 self-stretch py-2">
                  <label className="text-[14px] leading-[14px] text-[#71748C]">Joined on</label>
                  <p className="text-[14px] leading-[14px] text-[#1F2130]">{selectedUser.joinedOn}</p>
                </div>
                <div className="flex items-center justify-between gap-10 self-stretch py-2">
                  <label className="text-[14px] leading-[14px] text-[#71748C]">Home Address</label>
                  <p className="text-[14px] leading-[14px] text-[#1F2130]">{selectedUser.details.homeAddress}</p>
                </div>
                <div className="flex items-center justify-between gap-10 self-stretch py-2">
                  <label className="text-[14px] leading-[14px] text-[#71748C]">Business Name</label>
                  <p className="text-[14px] leading-[14px] text-[#1F2130]">{selectedUser.details.businessName}</p>
                </div>

                <div className="flex items-center justify-between gap-10 self-stretch py-2">
                  <label className="text-[14px] leading-[17px] text-[#41415A]">Business Email Address</label>
                  <p className="text-[14px] leading-[14px] text-[#1F2130]">{selectedUser.details.businessEmail}</p>
                </div>
                <div className="flex items-center justify-between gap-10 self-stretch py-2">
                  <label className="text-[14px] leading-[14px] text-[#71748C]">Business Phone Number</label>
                  <p className="text-[14px] leading-[14px] text-[#1F2130]">{selectedUser.details.businessPhone}</p>
                </div>
                <div className="flex items-center justify-between gap-10 self-stretch py-2">
                  <label className="text-[14px] leading-[14px] text-[#71748C]">Business Whatsapp Number</label>
                  <p className="text-[14px] leading-[14px] text-[#1F2130]">{selectedUser.details.businessWhatsapp}</p>
                </div>
                <div className="flex items-center justify-between gap-10 self-stretch py-2">
                  <label className="text-[14px] leading-[14px] text-[#71748C]">Business Address</label>
                  <p className="text-[14px] leading-[14px] text-[#1F2130]">{selectedUser.details.businessAddress}</p>
                </div>
              </div>

              {/* Documents */}
              <div className="flex w-full flex-col gap-4 border-t border-[#F1F1F4] pt-4 md:flex-row">
                <div className="flex w-full flex-col gap-1.5">
                  <label className="text-[14px] leading-[17px] text-[#41415A]">Proof of Address</label>
                  <div className="w-full">
                    <img
                      src={selectedUser.details.proofOfAddress || '/placeholder.svg'}
                      alt="Proof of Address"
                      className="h-auto w-full rounded-lg border border-[#E8E8E8]"
                    />
                  </div>
                </div>

                <div className="flex w-full flex-col gap-1.5">
                  <label className="text-[14px] leading-[17px] text-[#41415A]">Govt. Issued ID</label>
                  <div className="w-full">
                    <img
                      src={selectedUser.details.govtIssuedId || '/placeholder.svg'}
                      alt="Gov issue id"
                      className="h-auto w-full rounded-lg border border-[#E8E8E8]"
                    />
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
                  className="h-8 rounded-[40px] bg-[#F9F9FB] p-4 text-[14px] leading-[20px] font-normal text-[#1F2130]"
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

              <section className="grid w-full grid-cols-1 gap-5 self-stretch md:grid-cols-2">
                {TOTALS.map((item, index) => (
                  <div
                    key={index}
                    className="isolate box-border flex grow flex-col items-start gap-5 rounded-[10px] border border-[#E2E2E2] bg-white"
                  >
                    <div className="box-border w-full rounded-t-[10px] border-b border-[#ECECEC] bg-[#F9F9F9] px-6 pt-6 pb-3">
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
      </div>
    );
  };

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
          <UserList />
        ) : (
          <>
            <Button variant="link" onClick={() => setSelectedUser(null)} className="mb-4 px-4">
              &larr; Back to list
            </Button>
            <UserView />
          </>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden h-full w-full lg:flex">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={35} minSize={25} maxSize={50} className="border-r border-[#F1F1F4]">
            <div className="h-full w-full">
              <UserList />
            </div>
          </ResizablePanel>
          <ResizableHandle className="w-px bg-[#F1F1F4] hover:bg-gray-200" />
          <ResizablePanel defaultSize={65} minSize={50}>
            <div className="h-[calc(100svh-150px)] w-full overflow-y-auto pl-8">
              <UserView />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default UsersPage;
