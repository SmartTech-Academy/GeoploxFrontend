import { useState, useMemo, FC } from 'react';
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
import { format, parseISO } from 'date-fns';
import { useApproveRequest, useDeclineRequest, useGetApprovals, useVerifyUser } from '@/lib/services/approvals';
import { ApproveRequestDialog } from '@/components/dialogs/approve-request-dialog';
import { DeclineRequestDialog } from '@/components/dialogs/decline-request-dialog';

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
  ownerId?: string;
};

const EmptyState = ({ type }: { type: 'request' | 'list' }) => {
  if (type === 'request') {
    return (
      <div className="flex size-full  flex-col items-center justify-center gap-4 bg-[#F9F9F9]">
        <div className="flex flex-col items-center justify-center gap-6">
          <img
            src={assets.messagingloading}
            alt="No properties"
            className="h-[84px] w-56 animate-pulse"
            width={224}
            height={84}
          />
          <div className="flex flex-col items-center justify-center gap-3">
            <h5 className="text-[20px]/7  font-normal text-[#1F2130]">No request selected</h5>
            <p className="text-[14px] leading-[17px] tracking-[-0.02em] text-[#71748C]">
              Select a request from the list
              <br /> to view details and take action.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex size-full  flex-col items-center justify-center gap-4 bg-[#F9F9F9]">
      <div className="flex flex-col items-center justify-center gap-6">
        <img
          src={assets.messagingloading}
          alt="No properties"
          className="h-[84px] w-56 animate-pulse"
          width={224}
          height={84}
        />
        <div className="flex flex-col items-center justify-center gap-3">
          <h5 className="text-[20px]/7  font-semibold text-[#1F2130]">No requests found</h5>
          <p className="text-[14px] leading-[17px] tracking-[-0.02em] text-[#71748C]">
            No pending requests match your current filter.
          </p>
        </div>
      </div>
    </div>
  );
};

const RequestList = ({
  requests,
  onSelectRequest,
  selectedRequest,
}: {
  requests: Request[];
  onSelectRequest: (req: Request) => void;
  selectedRequest: Request | null;
}) => (
  <div className="flex size-full  flex-col bg-white">
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
    <div className="grid grid-cols-4 gap-4 border-b border-[#E8E8E8] px-4 py-3 text-[12px]/3  font-normal text-[#71748C]">
      <div>Date</div>
      <div>Type</div>
      <div>Name / Property ID</div>
      <div>Submitted By</div>
    </div>

    {/* Request List */}
    <div className="w-full flex-1 overflow-y-auto">
      {requests.length === 0 ? (
        <EmptyState type="list" />
      ) : (
        requests.map((request, index) => (
          <div
            key={request.id}
            onClick={() => onSelectRequest(request)}
            className={cn(
              `relative grid cursor-pointer grid-cols-4 items-center gap-4 px-4 py-[18px] text-[14px]/4  text-[#41415A] transition-colors hover:bg-gray-50`,
              index % 2 === 0 ? 'bg-[#F8F8F8]' : 'bg-white',
              selectedRequest?.id === request.id && 'bg-[#FDFBF5]'
            )}
          >
            <div>{request.date}</div>
            <div>{request.type}</div>
            <div>
              {request.type === 'KYC' ? request.name : <span className="text-blue-600 underline">{request.name}</span>}
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

interface RequestViewProps {
  selectedRequest: Request | null;
  onActionComplete: () => void;
}

const RequestView: FC<RequestViewProps> = ({ selectedRequest, onActionComplete }) => {
  const commonMutationOptions = {
    onSuccess: () => {
      setApproveDialogOpen(false);
      setDeclineDialogOpen(false);
      onActionComplete();
    },
  };

  const { mutate: approveProperty, isPending: isApprovingProperty } = useApproveRequest(commonMutationOptions);
  const { mutate: verifyUser, isPending: isVerifyingUser } = useVerifyUser(commonMutationOptions);
  const { mutate: declineRequest, isPending: isDeclining } = useDeclineRequest(commonMutationOptions);

  const isApproving = isApprovingProperty || isVerifyingUser;
  const isPending = isApproving || isDeclining;

  const [isApproveDialogOpen, setApproveDialogOpen] = useState(false);
  const [isDeclineDialogOpen, setDeclineDialogOpen] = useState(false);

  if (!selectedRequest) {
    return <EmptyState type="request" />;
  }

  const isKYC = selectedRequest.type === 'KYC' && 'accountType' in selectedRequest.details;

  const handleApprove = () => {
    if (!selectedRequest) return;
    if (selectedRequest.type === 'KYC') {
      verifyUser(String(selectedRequest.id));
    } else {
      approveProperty(String(selectedRequest.id));
    }
  };

  const handleDecline = (reason: string) => {
    if (!selectedRequest) return;
    // This assumes the decline endpoint can handle both user and property IDs.
    // This might need to be split like the approval logic if the backend has separate endpoints.
    declineRequest({
      id: String(selectedRequest.id),
      reason,
    });
  };

  return (
    <div className="w-full px-4 lg:px-6">
      <div className="flex h-full flex-1 flex-col gap-4">
        {/* Request Header */}
        <div className="flex items-start gap-4 self-stretch">
          <h2 className="grow text-[16px] leading-[22px] font-semibold text-[#1F2130]">
            {isKYC ? 'KYC Request' : 'Listing Request'}{' '}
          </h2>

          <Button
            variant="link"
            className="p-0 text-[16px] leading-[22px] font-semibold text-[#D20832] underline"
            onClick={() => setDeclineDialogOpen(true)}
            disabled={isPending}
          >
            Decline
          </Button>

          <Button
            variant="link"
            className="p-0 text-[16px] leading-[22px] font-semibold text-[#008A00] underline"
            onClick={() => setApproveDialogOpen(true)}
            disabled={isPending}
          >
            Approve
          </Button>
        </div>

        {/* Request Details */}
        <div className="flex flex-1 flex-col items-center gap-4 self-stretch overflow-y-auto rounded-xl border border-dashed border-[#D5D5DD] bg-white px-4 py-8">
          {isKYC ? (
            <img src={assets.landlord} className="size-16 rounded-full" width={64} height={64} />
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
                  <label className="text-[14px]/3.5  text-[#71748C]">Account Type</label>
                  <p className="text-[14px]/3.5  text-[#1F2130]">
                    {(selectedRequest.details as KYCDetails).accountType}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-10 self-stretch py-2">
                  <label className="text-[14px]/3.5  text-[#71748C]">Personal Phone Number</label>
                  <p className="text-[14px]/3.5  text-[#1F2130]">
                    {(selectedRequest.details as KYCDetails).personalPhone}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-10 self-stretch py-2">
                  <label className="text-[14px]/3.5  text-[#71748C]">Personal Whatsapp Number</label>
                  <p className="text-[14px]/3.5  text-[#1F2130]">
                    {(selectedRequest.details as KYCDetails).personalWhatsapp}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-10 self-stretch py-2">
                  <label className="text-[14px]/3.5  text-[#71748C]">Home Address</label>
                  <p className="text-[14px]/3.5  text-[#1F2130]">
                    {(selectedRequest.details as KYCDetails).homeAddress}
                  </p>
                </div>
              </div>

              {/* Business Information */}
              <div className="w-full border-t border-[#F1F1F4] pt-4">
                <div className="flex items-center justify-between gap-10 self-stretch py-2">
                  <label className="text-[14px]/3.5  text-[#71748C]">Business Name</label>
                  <p className="text-[14px]/3.5  text-[#1F2130]">
                    {(selectedRequest.details as KYCDetails).businessName}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-10 self-stretch py-2">
                  <label className="text-[14px]/3.5  text-[#71748C]">Business Email Address</label>
                  <p className="text-[14px]/3.5  text-[#1F2130]">
                    {(selectedRequest.details as KYCDetails).businessEmail}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-10 self-stretch py-2">
                  <label className="text-[14px]/3.5  text-[#71748C]">Business Phone Number</label>
                  <p className="text-[14px]/3.5  text-[#1F2130]">
                    {(selectedRequest.details as KYCDetails).businessPhone}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-10 self-stretch py-2">
                  <label className="text-[14px]/3.5  text-[#71748C]">Business Whatsapp Number</label>
                  <p className="text-[14px]/3.5  text-[#1F2130]">
                    {(selectedRequest.details as KYCDetails).businessWhatsapp}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-10 self-stretch py-2">
                  <label className="text-[14px]/3.5  text-[#71748C]">Business Address</label>
                  <p className="text-[14px]/3.5  text-[#1F2130]">
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
                  <label className="text-[14px]/3.5  text-[#71748C]">Listing Title</label>
                  <p className="text-[14px]/3.5  text-[#1F2130]">
                    {(selectedRequest.details as ListingDetails).listingTitle}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-10 self-stretch py-2">
                  <label className="text-[14px]/3.5  text-[#71748C]">Listing Type</label>
                  <p className="text-[14px]/3.5  text-[#1F2130]">
                    {(selectedRequest.details as ListingDetails).listingType}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-10 self-stretch py-2">
                  <label className="text-[14px]/3.5  text-[#71748C]">Property ID</label>
                  <p className="text-[14px]/3.5  text-[#065BCD] underline">
                    {(selectedRequest.details as ListingDetails).propertyID}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-10 self-stretch py-2">
                  <label className="text-[14px]/3.5  text-[#71748C]">Submitted By</label>
                  <p className="text-[14px]/3.5  text-[#1F2130]">
                    {(selectedRequest.details as ListingDetails).submitedBy}
                  </p>
                </div>
              </div>

              {/* Business Information */}
              <div className="w-full border-t border-[#F1F1F4] pt-4">
                <div className="flex items-center justify-between gap-10 self-stretch py-2">
                  <label className="text-[14px]/3.5  text-[#71748C]">Business Name</label>
                  <p className="text-[14px]/3.5  text-[#1F2130]">
                    {(selectedRequest.details as ListingDetails).businessName}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-10 self-stretch py-2">
                  <label className="text-[14px]/3.5  text-[#71748C]">Property Type</label>
                  <p className="text-[14px]/3.5  text-[#1F2130]">
                    {(selectedRequest.details as ListingDetails).propertyType}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-10 self-stretch py-2">
                  <label className="text-[14px]/3.5  text-[#71748C]">Property Price</label>
                  <p className="text-[14px]/3.5  text-[#1F2130]">
                    {(selectedRequest.details as ListingDetails).propertyPrice}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-10 self-stretch py-2">
                  <label className="text-[14px]/3.5  text-[#71748C]">Location</label>
                  <p className="text-[14px]/3.5  text-[#1F2130]">
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
                      alt="Property Document"
                      className="h-auto w-full rounded-lg border border-[#E8E8E8]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ApproveRequestDialog
        open={isApproveDialogOpen}
        onOpenChange={setApproveDialogOpen}
        onConfirm={handleApprove}
        isPending={isApproving}
        requestType={selectedRequest.type}
      />

      <DeclineRequestDialog
        open={isDeclineDialogOpen}
        onOpenChange={setDeclineDialogOpen}
        onConfirm={handleDecline}
        isPending={isDeclining}
      />
    </div>
  );
};

const PendingApprovalPage = () => {
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [filter] = useState<'all' | 'kyc' | 'listing'>('all');

  const { data: approvalsData } = useGetApprovals();

  const requests: Request[] = useMemo(() => {
    const users = approvalsData?.data.data.users.items || [];
    const properties = approvalsData?.data.data.properties.items || [];

    const kycRequests: Request[] = users.map((user: any) => ({
      id: user.codec,
      date: format(parseISO(user.approval_request_date), 'dd MMM, yyyy'),
      type: 'KYC',
      name: `${user.firstname} ${user.lastname}`,
      submittedBy: user.email_address,
      status: 'pending',
      avatar: user.display_picture_url || assets.messaging1,
      details: {
        accountType: user.user_role,
        personalPhone: user.phone_number,
        personalWhatsapp: user.whatsapp_number,
        homeAddress: user.home_address,
        businessName: user.business?.name || 'N/A',
        businessEmail: user.business?.email || 'N/A',
        businessPhone: user.business?.phone || 'N/A',
        businessWhatsapp: user.business?.whatsapp || 'N/A',
        businessAddress: user.business?.address || 'N/A',
        proofOfAddress: user.government_id_doc_url,
        govtIssuedId: user.government_id_doc_url,
      },
    }));

    const listingRequests: Request[] = properties.map((prop: any) => ({
      id: prop.id,
      date: format(parseISO(prop.approval_request_date), 'dd MMM, yyyy'),
      type: 'Listing',
      name: prop.title,
      submittedBy: prop.owner.name,
      ownerId: prop.owner.id,
      status: 'pending',
      avatar: prop.images.find((img: any) => img.is_cover)?.url || assets.messaging3,
      details: {
        listingTitle: prop.title,
        listingType: prop.category?.title || 'N/A',
        propertyID: prop.id,
        submitedBy: prop.owner.name,
        businessName: prop.owner.role,
        propertyType: prop.property_type,
        propertyPrice: new Intl.NumberFormat('en-NG', { style: 'currency', currency: prop.currency }).format(
          prop.price
        ),
        location: `${prop.address}, ${prop.city}, ${prop.state}`,
        propertyDocument: prop.property_document,
      },
    }));

    return [...kycRequests, ...listingRequests];
  }, [approvalsData]);

  const filteredRequests: Request[] =
    filter === 'kyc'
      ? requests.filter((req) => req.type === 'KYC')
      : filter === 'listing'
        ? requests.filter((req) => req.type === 'Listing')
        : requests;

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
          <RequestList requests={filteredRequests} onSelectRequest={setSelectedRequest} selectedRequest={null} />
        ) : (
          <>
            <Button variant="link" onClick={() => setSelectedRequest(null)} className="mb-4 px-4">
              &larr; Back to list
            </Button>
            <RequestView selectedRequest={selectedRequest} onActionComplete={() => setSelectedRequest(null)} />
          </>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden size-full  lg:flex">
        <ResizablePanelGroup direction="horizontal" className="size-full ">
          <ResizablePanel defaultSize={65} minSize={40} className="border-r border-[#F1F1F4]">
            <div className="h-full pr-6">
              <RequestList
                requests={filteredRequests}
                onSelectRequest={setSelectedRequest}
                selectedRequest={selectedRequest}
              />
            </div>
          </ResizablePanel>
          <ResizableHandle className="w-px hover:bg-gray-200" />
          <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
            <div className="h-[calc(100svh-150px)] w-full overflow-y-auto">
              <RequestView selectedRequest={selectedRequest} onActionComplete={() => setSelectedRequest(null)} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default PendingApprovalPage;
