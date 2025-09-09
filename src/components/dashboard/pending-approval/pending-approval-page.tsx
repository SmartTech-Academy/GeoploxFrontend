'use client';

import { useState } from 'react';
import { Filter, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import assets from '@/assets';
import { cn } from '@/lib/utils';
import { PageMetaTags } from '@/components/page-meta-data';

// Define types for better type safety
interface KYCDetails {
  accountType: string;
  personalPhone: string;
  personalWhatsapp: string;
  homeAddress: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessWhatsapp: string;
  businessAddress: string;
  proofOfAddress: string;
  govtIssuedId: string;
}

interface ListingDetails {
  listingTitle: string;
  listingType: string;
  propertyID: string;
  submitedBy: string;
  businessName: string;
  propertyType: string;
  propertyPrice: string;
  location: string;
  propertyDocument: string;
}

type Request = {
  id: number;
  date: string;
  type: 'KYC' | 'Listing';
  name: string;
  submittedBy: string;
  status: string;
  avatar: string;
  details: KYCDetails | ListingDetails;
};

const PendingApprovalPage = () => {
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [filter] = useState<'all' | 'kyc' | 'listing'>('all');

  const requests: Request[] = [
    {
      id: 1,
      date: '12 Mar, 2025',
      type: 'KYC',
      name: 'Janet Lee',
      submittedBy: 'janet.lee@email.com',
      status: 'pending',
      avatar: assets.messaging1,
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
      date: '12 Mar, 2025',
      type: 'Listing',
      name: '5139303',
      submittedBy: 'Realty Hub Ltd',
      status: 'pending',
      avatar: assets.messaging3,
      details: {
        listingTitle: '456 Market Avenue',
        listingType: 'For Sale',
        propertyID: '6477383',
        submitedBy: 'Realty Hub Ltd',
        businessName: 'Property Owner',
        propertyType: 'Duplex',
        propertyPrice: 'N56,000,000.00',
        location: '123 Bode Thomas Street, Yaba, Lagos Lagos State',
        propertyDocument: assets.proofofaddress,
      },
    },
    {
      id: 3,
      date: '12 Mar, 2025',
      type: 'KYC',
      name: 'Abdul Yusuf',
      submittedBy: 'abdul_y@gmail.com',
      status: 'pending',
      avatar: '/thoughtful-man.png',
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
      date: '12 Mar, 2025',
      type: 'Listing',
      name: '6477383',
      submittedBy: 'Ella Properties',
      status: 'pending',
      avatar: '/diverse-property-showcase.png',
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
      date: '12 Mar, 2025',
      type: 'Listing',
      name: 'U7848332',
      submittedBy: 'Coded Homes NG',
      status: 'pending',
      avatar: '/cozy-suburban-house.png',
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
      date: '12 Mar, 2025',
      type: 'KYC',
      name: 'John Edet',
      submittedBy: 'john.edet@outlook.com',
      status: 'pending',
      avatar: '/diverse-businessman.png',
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

  const EmptyState = ({ type }: { type: 'request' | 'list' }) => {
    if (type === 'request') {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[#F9F9F9]">
          <div className="flex flex-col items-center justify-center gap-6">
            <img
              src={assets.messagingloading}
              alt="No properties"
              className="h-[84px] w-[224px] animate-pulse"
              width={224}
              height={84}
            />
            <div className="flex flex-col items-center justify-center gap-3">
              <h5 className="text-[20px] leading-[28px] font-normal text-[#1F2130]">No request selected</h5>
              <p className="text-center text-[14px] leading-[20px] tracking-[-0.02em] text-[#71748C]">
                Select a request from the list
                <br /> to view details and take action.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      // This part of the empty state seems to be for when the list itself is empty.
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[#F9F9F9]">
        <div className="flex flex-col items-center justify-center gap-6">
          <img
            src={assets.messagingloading}
            alt="No properties"
            className="h-[84px] w-[224px] animate-pulse"
            width={224}
            height={84}
          />
          <div className="flex flex-col items-center justify-center gap-3">
            <h5 className="text-[20px] leading-[28px] font-semibold text-[#1F2130]">No requests found</h5>
            <p className="text-[14px] leading-[17px] tracking-[-0.02em] text-[#71748C]">
              No pending requests match your current filter.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const filteredRequests: Request[] =
    filter === 'kyc'
      ? requests.filter((req) => req.type === 'KYC')
      : filter === 'listing'
        ? requests.filter((req) => req.type === 'Listing')
        : requests;

  const RequestList = ({ onSelectRequest }: { onSelectRequest: any }) => (
    <div className="flex h-full w-full flex-col bg-white">
      {/* Header and Search */}
      <div className="flex w-full flex-col">
        <div className="flex items-center justify-between">
          <h1 className="text-[16px] leading-[22px] font-semibold text-[#1F2130]">Request ({requests.length})</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-fit rounded-[45px] border-0 border-[oklch(0.8754_0.0109_286.17)] bg-transparent text-[#41415A] shadow-none focus:ring-0"
              >
                <Filter className="size-4 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Sort by Date</DropdownMenuItem>
              <DropdownMenuItem>Sort by Type</DropdownMenuItem>
              <DropdownMenuItem>Sort by Name</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-4 gap-4 border-b border-[#E8E8E8] px-4 py-3 text-[12px] leading-[12px] font-normal text-[#71748C]">
        <div>Date</div>
        <div>Type</div>
        <div>Name / Property ID</div>
        <div>Submitted By</div>
      </div>

      {/* Request List */}
      <div className="w-full flex-1 overflow-y-auto">
        {filteredRequests.length === 0 ? (
          <EmptyState type="list" />
        ) : (
          filteredRequests.map((request, index) => (
            <div
              key={request.id}
              onClick={() => onSelectRequest(request)}
              className={cn(
                `relative grid cursor-pointer grid-cols-4 items-center gap-4 px-4 py-[18px] text-[14px] leading-[16px] text-[#41415A] transition-colors hover:bg-gray-50`,
                index % 2 === 0 ? 'bg-[#F8F8F8]' : 'bg-white',
                selectedRequest?.id === request.id && 'bg-[#FDFBF5]'
              )}
            >
              <div>{request.date}</div>
              <div>{request.type}</div>
              <div>
                {request.type === 'KYC' ? (
                  request.name
                ) : (
                  <span className="text-blue-600 underline">{request.name}</span>
                )}
              </div>
              <div className={cn(index % 2 === 0 ? 'text-[#3086FF] underline' : 'text-[#41415A]')}>
                {request.submittedBy}
              </div>
              {selectedRequest?.id === request.id && (
                <ChevronRight className="absolute top-5 -right-1 z-10 size-4 fill-[#41415A]" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  const RequestView = () => {
    if (!selectedRequest) {
      return <EmptyState type="request" />;
    }

    const isKYC = selectedRequest.type === 'KYC' && 'accountType' in selectedRequest.details;

    return (
      <div className="w-full px-4 lg:px-6">
        <div className="flex h-full flex-1 flex-col gap-4">
          {/* Request Header */}
          <div className="flex items-start gap-4 self-stretch">
            <h2 className="grow text-[16px] leading-[22px] font-semibold text-[#1F2130]">
              {isKYC ? 'KYC Request' : 'Listing Request'}{' '}
            </h2>

            <Button variant="link" className="p-0 text-[16px] leading-[22px] font-semibold text-[#D20832] underline">
              Decline
            </Button>

            <Button variant="link" className="p-0 text-[16px] leading-[22px] font-semibold text-[#008A00] underline">
              Approve
            </Button>
          </div>

          {/* Request Details */}
          <div className="flex flex-1 flex-col items-center gap-4 self-stretch overflow-y-auto rounded-[8px] border border-dashed border-[#D5D5DD] bg-white px-4 py-8">
            {isKYC ? (
              <img src={assets.landlord} className="size-[64px] rounded-full" width={64} height={64} />
            ) : (
              <img
                src={assets.housebackyardwithgarden}
                className="h-[186px] w-full rounded-[6px]"
                width={367}
                height={186}
              />
            )}

            {isKYC ? (
              <div className="flex w-full flex-col gap-4">
                {/* Personal Information */}
                <div className="w-full">
                  <div className="flex items-center justify-between gap-10 self-stretch py-2">
                    <label className="text-[14px] leading-[14px] text-[#71748C]">Account Type</label>
                    <p className="text-[14px] leading-[14px] text-[#1F2130]">
                      {(selectedRequest.details as KYCDetails).accountType}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-10 self-stretch py-2">
                    <label className="text-[14px] leading-[14px] text-[#71748C]">Personal Phone Number</label>
                    <p className="text-[14px] leading-[14px] text-[#1F2130]">
                      {(selectedRequest.details as KYCDetails).personalPhone}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-10 self-stretch py-2">
                    <label className="text-[14px] leading-[14px] text-[#71748C]">Personal Whatsapp Number</label>
                    <p className="text-[14px] leading-[14px] text-[#1F2130]">
                      {(selectedRequest.details as KYCDetails).personalWhatsapp}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-10 self-stretch py-2">
                    <label className="text-[14px] leading-[14px] text-[#71748C]">Home Address</label>
                    <p className="text-[14px] leading-[14px] text-[#1F2130]">
                      {(selectedRequest.details as KYCDetails).homeAddress}
                    </p>
                  </div>
                </div>

                {/* Business Information */}
                <div className="w-full border-t border-[#F1F1F4] pt-4">
                  <div className="flex items-center justify-between gap-10 self-stretch py-2">
                    <label className="text-[14px] leading-[14px] text-[#71748C]">Business Name</label>
                    <p className="text-[14px] leading-[14px] text-[#1F2130]">
                      {(selectedRequest.details as KYCDetails).businessName}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-10 self-stretch py-2">
                    <label className="text-[14px] leading-[14px] text-[#71748C]">Business Email Address</label>
                    <p className="text-[14px] leading-[14px] text-[#1F2130]">
                      {(selectedRequest.details as KYCDetails).businessEmail}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-10 self-stretch py-2">
                    <label className="text-[14px] leading-[14px] text-[#71748C]">Business Phone Number</label>
                    <p className="text-[14px] leading-[14px] text-[#1F2130]">
                      {(selectedRequest.details as KYCDetails).businessPhone}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-10 self-stretch py-2">
                    <label className="text-[14px] leading-[14px] text-[#71748C]">Business Whatsapp Number</label>
                    <p className="text-[14px] leading-[14px] text-[#1F2130]">
                      {(selectedRequest.details as KYCDetails).businessWhatsapp}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-10 self-stretch py-2">
                    <label className="text-[14px] leading-[14px] text-[#71748C]">Business Address</label>
                    <p className="text-[14px] leading-[14px] text-[#1F2130]">
                      {(selectedRequest.details as KYCDetails).businessAddress}
                    </p>
                  </div>
                </div>

                {/* Documents */}
                <div className="w-full border-t border-[#F1F1F4] pt-4">
                  <div className="flex w-full flex-col gap-1.5">
                    <label className="text-[14px] leading-[17px] text-[#41415A]">Proof of Address</label>
                    <div className="w-full max-w-md">
                      <img
                        src={(selectedRequest.details as KYCDetails).proofOfAddress || '/placeholder.svg'}
                        alt="Proof of Address"
                        className="h-auto w-full rounded-lg border border-[#E8E8E8]"
                      />
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-1.5">
                    <label className="text-[14px] leading-[17px] text-[#41415A]">Govt. Issued ID</label>
                    <div className="w-full max-w-md">
                      <img
                        src={(selectedRequest.details as KYCDetails).govtIssuedId || '/placeholder.svg'}
                        alt="Government Issued ID"
                        className="h-auto w-full rounded-lg border border-[#E8E8E8]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex w-full flex-col gap-4">
                {/* Personal Information */}
                <div className="w-full">
                  <div className="flex items-center justify-between gap-10 self-stretch py-2">
                    <label className="text-[14px] leading-[14px] text-[#71748C]">Listing Title</label>
                    <p className="text-[14px] leading-[14px] text-[#1F2130]">
                      {(selectedRequest.details as ListingDetails).listingTitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-10 self-stretch py-2">
                    <label className="text-[14px] leading-[14px] text-[#71748C]">Listing Type</label>
                    <p className="text-[14px] leading-[14px] text-[#1F2130]">
                      {(selectedRequest.details as ListingDetails).listingType}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-10 self-stretch py-2">
                    <label className="text-[14px] leading-[14px] text-[#71748C]">Property ID</label>
                    <p className="text-[14px] leading-[14px] text-[#065BCD] underline">
                      {(selectedRequest.details as ListingDetails).propertyID}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-10 self-stretch py-2">
                    <label className="text-[14px] leading-[14px] text-[#71748C]">Submitted By</label>
                    <p className="text-[14px] leading-[14px] text-[#1F2130]">
                      {(selectedRequest.details as ListingDetails).submitedBy}
                    </p>
                  </div>
                </div>

                {/* Business Information */}
                <div className="w-full border-t border-[#F1F1F4] pt-4">
                  <div className="flex items-center justify-between gap-10 self-stretch py-2">
                    <label className="text-[14px] leading-[14px] text-[#71748C]">Business Name</label>
                    <p className="text-[14px] leading-[14px] text-[#1F2130]">
                      {(selectedRequest.details as ListingDetails).businessName}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-10 self-stretch py-2">
                    <label className="text-[14px] leading-[14px] text-[#71748C]">Property Type</label>
                    <p className="text-[14px] leading-[14px] text-[#1F2130]">
                      {(selectedRequest.details as ListingDetails).propertyType}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-10 self-stretch py-2">
                    <label className="text-[14px] leading-[14px] text-[#71748C]">Property Price</label>
                    <p className="text-[14px] leading-[14px] text-[#1F2130]">
                      {(selectedRequest.details as ListingDetails).propertyPrice}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-10 self-stretch py-2">
                    <label className="text-[14px] leading-[14px] text-[#71748C]">Location</label>
                    <p className="text-[14px] leading-[14px] text-[#1F2130]">
                      {(selectedRequest.details as ListingDetails).location}
                    </p>
                  </div>
                </div>

                {/* Documents */}
                <div className="w-full border-t border-[#F1F1F4] pt-4">
                  <div className="flex w-full flex-col gap-1.5">
                    <label className="text-[14px] leading-[17px] text-[#41415A]">Property Document</label>
                    <div className="w-full max-w-md">
                      <img
                        src={(selectedRequest.details as ListingDetails).propertyDocument || '/placeholder.svg'}
                        alt="Proof of Address"
                        className="h-auto w-full rounded-lg border border-[#E8E8E8]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full flex-col items-start gap-0 self-stretch py-8 lg:flex-row">
      <PageMetaTags
        title="Pending Approvals"
        description="Review and approve pending property listings, user applications, and system requests."
        keywords="pending approvals, listing approval, content moderation"
      />

      {/* Mobile View */}
      <div className="w-full lg:hidden">
        {!selectedRequest ? (
          <RequestList onSelectRequest={setSelectedRequest} />
        ) : (
          <>
            <Button variant="link" onClick={() => setSelectedRequest(null)} className="mb-4 px-4">
              &larr; Back to list
            </Button>
            <RequestView />
          </>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden h-full w-full lg:flex">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={65} minSize={40} className="border-r border-[#F1F1F4]">
            <div className="h-full pr-6">
              <RequestList onSelectRequest={setSelectedRequest} />
            </div>
          </ResizablePanel>
          <ResizableHandle className="w-px hover:bg-gray-200" />
          <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
            <div className="h-[calc(100svh-150px)] w-full overflow-y-auto">
              <RequestView />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default PendingApprovalPage;
