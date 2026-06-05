import { useState, useMemo, FC, useCallback } from "react";
import { ChevronRight, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { PageMetaTags } from "@/components/page-meta-data";
import { format, isValid, parseISO } from "date-fns";
import {
  useApproveRequest,
  useDeclineRequest,
  useGetApprovals,
  useVerifyUser,
} from "@/lib/services/approvals";
import { ApproveRequestDialog } from "@/components/dialogs/approve-request-dialog";
import { DeclineRequestDialog } from "@/components/dialogs/decline-request-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import assets from "@/assets";
import LoadingFallback from "@/components/loading-fallback";

// --- TYPE DEFINITIONS ---
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
  proofOfAddress: string;
  images: { url: string }[];
}

type Request = {
  id: string | number; // Use string for codec/slug, number for property ID
  date: string;
  type: "KYC" | "Listing";
  name: string;
  submittedBy: string;
  status: string;
  avatar: string;
  details: KYCDetails | ListingDetails;
  ownerId?: string;
};

const formatApprovalDate = (value?: string | null) => {
  if (!value) return "N/A";

  const parsedDate = parseISO(value);
  if (!isValid(parsedDate)) return "N/A";

  return format(parsedDate, "dd MMM, yyyy");
};

// --- EMPTY STATE COMPONENT ---
const EmptyState = ({ type }: { type: "request" | "list" }) => {
  const messages = {
    request: {
      title: "No request selected",
      body: "Select a request from the list\nto view details and take action.",
    },
    list: {
      title: "No requests found",
      body: "No pending requests match your current filter.",
    },
  };
  const { title, body } = messages[type];

  return (
    <div className="flex size-full flex-col items-center justify-center gap-4 bg-[#F9F9F9] p-4 text-center">
      <img src={assets.messagingloading} alt={title} className="h-auto w-56 animate-pulse" />
      <div className="flex flex-col items-center justify-center gap-2">
        <h5 className="text-xl font-semibold text-[#1F2130]">{title}</h5>
        <p className="text-sm whitespace-pre-line text-[#71748C]">{body}</p>
      </div>
    </div>
  );
};

// --- CLICKABLE DOCUMENT LINK ---
const DocumentLink = ({
  href,
  label,
  className,
}: {
  href?: string;
  label: string;
  className?: string;
}) => {
  if (!href) {
    return <p className={cn("text-sm text-gray-400", className)}>Not provided</p>;
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-2 text-blue-600 underline hover:text-blue-800",
        className,
      )}
    >
      <FileText className="size-4" />
      <span>View {label}</span>
    </a>
  );
};

// --- PAGINATION COMPONENT ---
const PaginationComponent = ({
  meta,
  onPageChange,
}: {
  meta: any;
  onPageChange: (page: number) => void;
}) => {
  if (!meta || meta.last_page <= 1) return null;

  const pageNumbers = [];
  for (let i = 1; i <= meta.last_page; i++) {
    pageNumbers.push(i);
  }

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (meta.current_page > 1) onPageChange(meta.current_page - 1);
            }}
            className={meta.current_page === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        {pageNumbers.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(page);
              }}
              isActive={page === meta.current_page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (meta.current_page < meta.last_page) onPageChange(meta.current_page + 1);
            }}
            className={meta.current_page === meta.last_page ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

// --- REQUEST LIST COMPONENT ---
const RequestList = ({
  requests,
  onSelectRequest,
  selectedRequest,
  title,
}: {
  requests: Request[];
  onSelectRequest: (req: Request) => void;
  selectedRequest: Request | null;
  title: string;
}) => (
  <div className="flex size-full flex-col bg-white">
    <div className="px-4 pt-2">
      <h1 className="text-lg font-semibold text-[#1F2130]">
        {title} ({requests.length})
      </h1>
    </div>

    <div className="grid grid-cols-3 gap-4 border-b border-[#E8E8E8] px-4 py-3 text-sm font-medium text-[#71748C]">
      <div>Date</div>
      <div>Name / Property Title</div>
      <div>Submitted By</div>
    </div>

    <div className="w-full flex-1 overflow-y-auto">
      {requests.length === 0 ? (
        <EmptyState type="list" />
      ) : (
        requests.map((request, _index) => (
          <div
            key={request.id}
            onClick={() => onSelectRequest(request)}
            className={cn(
              "relative grid cursor-pointer grid-cols-3 items-center gap-4 p-4 text-sm text-[#41415A] transition-colors hover:bg-gray-50",
              selectedRequest?.id === request.id && "bg-[#FEFBF5]",
            )}
          >
            <div>{request.date}</div>
            <div className="truncate font-medium">{request.name}</div>
            <div className="truncate text-gray-500">{request.submittedBy}</div>
            {selectedRequest?.id === request.id && (
              <ChevronRight className="absolute top-1/2 right-1 -translate-y-1/2 transform text-gray-700" />
            )}
          </div>
        ))
      )}
    </div>
  </div>
);

// --- REQUEST VIEW COMPONENT ---
const RequestView: FC<{ selectedRequest: Request | null; onActionComplete: () => void }> = ({
  selectedRequest,
  onActionComplete,
}) => {
  const commonMutationOptions = {
    onSuccess: () => {
      setApproveDialogOpen(false);
      setDeclineDialogOpen(false);
      onActionComplete();
    },
  };

  const { mutate: approveProperty, isPending: isApprovingProperty } =
    useApproveRequest(commonMutationOptions);
  const { mutate: verifyUser, isPending: isVerifyingUser } = useVerifyUser(commonMutationOptions);
  const { mutate: declineRequest, isPending: isDeclining } =
    useDeclineRequest(commonMutationOptions);

  const isApproving = isApprovingProperty || isVerifyingUser;
  const isPending = isApproving || isDeclining;

  const [isApproveDialogOpen, setApproveDialogOpen] = useState(false);
  const [isDeclineDialogOpen, setDeclineDialogOpen] = useState(false);

  if (!selectedRequest) return <EmptyState type="request" />;

  const isKYC = selectedRequest.type === "KYC" && "accountType" in selectedRequest.details;
  const details = selectedRequest.details as any; // Use any for easier access in JSX

  const handleApprove = () => {
    if (!selectedRequest) return;
    if (isKYC) {
      verifyUser(String(selectedRequest.id));
    } else {
      approveProperty(String(selectedRequest.id));
    }
  };

  const handleDecline = (reason: string) => {
    if (!selectedRequest) return;
    declineRequest({ id: String(selectedRequest.id), reason });
  };

  const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex items-start justify-between gap-4 self-stretch py-2.5">
      <label className="text-sm text-gray-500">{label}</label>
      <div className="text-right text-sm font-medium text-gray-800">{value}</div>
    </div>
  );

  return (
    <div className="w-full px-4 py-2 lg:px-6">
      <div className="flex h-full flex-1 flex-col gap-4">
        {/* Header */}
        <div className="flex items-start gap-4">
          <h2 className="grow text-lg font-semibold text-[#1F2130]">
            {isKYC ? "KYC Request" : "Listing Request"}
          </h2>
          <Button
            variant="link"
            className="p-0 font-semibold text-[#D20832]"
            onClick={() => setDeclineDialogOpen(true)}
            disabled={isPending}
          >
            Decline
          </Button>
          <Button
            variant="link"
            className="p-0 font-semibold text-[#008A00]"
            onClick={() => setApproveDialogOpen(true)}
            disabled={isPending}
          >
            Approve
          </Button>
        </div>

        {/* Details */}
        <div className="flex-1 overflow-y-auto rounded-xl border border-dashed border-gray-200 bg-white p-4">
          <div className="flex flex-col items-center gap-4">
            <img
              src={selectedRequest.avatar}
              className={cn(
                "rounded-full object-cover",
                isKYC ? "size-20" : "h-48 w-full rounded-lg",
              )}
            />

            {isKYC ? (
              <>
                <DetailRow label="Account Type" value={details.accountType} />
                <DetailRow label="Personal Phone" value={details.personalPhone} />
                <DetailRow label="Personal Whatsapp" value={details.personalWhatsapp} />
                <DetailRow label="Home Address" value={details.homeAddress} />
                <hr className="my-2 w-full" />
                <DetailRow label="Business Name" value={details.businessName} />
                <DetailRow label="Business Email" value={details.businessEmail} />
                <DetailRow label="Business Phone" value={details.businessPhone} />
                <DetailRow label="Business Whatsapp" value={details.businessWhatsapp} />
                <DetailRow label="Business Address" value={details.businessAddress} />
                <hr className="my-2 w-full" />
                <DetailRow
                  label="Proof of Address"
                  value={<DocumentLink href={details.proofOfAddress} label="Document" />}
                />
                <DetailRow
                  label="Government ID"
                  value={<DocumentLink href={details.govtIssuedId} label="ID" />}
                />
              </>
            ) : (
              <>
                <DetailRow label="Listing Title" value={details.listingTitle} />
                <DetailRow label="Listing Type" value={details.listingType} />
                <DetailRow label="Property ID" value={details.propertyID} />
                <DetailRow label="Submitted By" value={details.submitedBy} />
                <hr className="my-2 w-full" />
                <DetailRow label="Business Name" value={details.businessName} />
                <DetailRow label="Property Type" value={details.propertyType} />
                <DetailRow label="Property Price" value={details.propertyPrice} />
                <DetailRow label="Location" value={details.location} />
                {/* <hr className="my-2 w-full" />
                <DetailRow
                  label="Property Document"
                  value={<DocumentLink href={details.propertyDocument} label="Document" />}
                />
                <DetailRow
                  label="Proof of Address"
                  value={<DocumentLink href={details.proofOfAddress} label="Document" />}
                /> */}
                <hr className="my-2 w-full" />
                <div className="w-full">
                  <label className="text-sm text-gray-500">Images</label>
                  <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {details.images?.map((img: { url: string }, index: number) => (
                      <a
                        href={img.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={index}
                        className="relative aspect-square"
                      >
                        <img
                          src={img.url}
                          alt={`Property Image ${index + 1}`}
                          className="size-full rounded-md object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                          <ImageIcon className="size-6 text-white" />
                        </div>
                      </a>
                    )) || <p className="text-sm text-gray-400">No images provided</p>}
                  </div>
                </div>
              </>
            )}
          </div>
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

// --- MAIN PAGE COMPONENT ---
const PendingApprovalPage = () => {
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [activeTab, setActiveTab] = useState<"kyc" | "listing">("kyc");
  const [kycPage, setKycPage] = useState(1);
  const [listingPage, setListingPage] = useState(1);

  const page = activeTab === "kyc" ? kycPage : listingPage;
  const { data: approvalsData, isLoading } = useGetApprovals({ page });

  const { kycRequests, listingRequests, kycMeta, listingMeta } = useMemo(() => {
    const users = approvalsData?.data.data.users.items || [];
    const properties = approvalsData?.data.data.properties.items || [];

    const kycReqs: Request[] = users.map(
      (user: any): Request => ({
        id: user.codec,
        date: formatApprovalDate(user.approval_request_date),
        type: "KYC",
        name: `${user.firstname} ${user.lastname}`,
        submittedBy: user.email_address,
        status: "pending",
        avatar: user.display_picture_url || assets.adozollion,
        details: {
          accountType: user.user_role,
          personalPhone: user.phone_number,
          personalWhatsapp: user.whatsapp_number,
          homeAddress: user.home_address,
          businessName: user.business?.name || "N/A",
          businessEmail: user.business?.email || "N/A",
          businessPhone: user.business?.phone || "N/A",
          businessWhatsapp: user.business?.whatsapp || "N/A",
          businessAddress: user.business?.address || "N/A",
          proofOfAddress: user.proof_of_address,
          govtIssuedId: user.government_id_doc_url,
        },
      }),
    );

    const listingReqs: Request[] = properties.map(
      (prop: any): Request => ({
        id: prop.id,
        date: formatApprovalDate(prop.approval_request_date),
        type: "Listing",
        name: prop.title,
        submittedBy: prop.owner.name,
        ownerId: prop.owner.id,
        status: "pending",
        avatar: prop.images.find((img: any) => img.is_cover)?.url || assets.realproperties,
        details: {
          listingTitle: prop.title,
          listingType: prop.category?.title || "N/A",
          propertyID: prop.id,
          submitedBy: prop.owner.name,
          businessName: prop.owner.role,
          propertyType: prop.property_type,
          propertyPrice: new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: prop.currency,
          }).format(prop.price),
          location: `${prop.address}, ${prop.city}, ${prop.state}`,
          propertyDocument: prop.property_document,
          proofOfAddress: prop.proof_of_address,
          images: prop.images,
        },
      }),
    );

    return {
      kycRequests: kycReqs,
      listingRequests: listingReqs,
      kycMeta: approvalsData?.data.data.users.meta,
      listingMeta: approvalsData?.data.data.properties.meta,
    };
  }, [approvalsData]);

  const handleTabChange = (value: string) => {
    setSelectedRequest(null); // Clear selection when switching tabs
    setActiveTab(value as "kyc" | "listing");
  };

  const onActionComplete = useCallback(() => {
    setSelectedRequest(null);
    // Invalidation is handled by the mutation hooks, so data will refetch
  }, []);

  //   const currentRequests = activeTab === "kyc" ? kycRequests : listingRequests;
  //   const currentMeta = activeTab === "kyc" ? kycMeta : listingMeta;
  //   const onPageChange = activeTab === "kyc" ? setKycPage : setListingPage;

  if (isLoading && !approvalsData) {
    return <LoadingFallback />;
  }

  return (
    <div className="flex h-screen w-full flex-col items-start gap-0 self-stretch px-4 py-8 lg:flex-row">
      <PageMetaTags title="Pending Approvals" description="Review and manage pending requests." />

      {/* Mobile View */}
      <div className="w-full lg:hidden">
        {!selectedRequest ? (
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="kyc">KYC</TabsTrigger>
              <TabsTrigger value="listing">Listings</TabsTrigger>
            </TabsList>
            <TabsContent value="kyc">
              <RequestList
                requests={kycRequests}
                onSelectRequest={setSelectedRequest}
                selectedRequest={null}
                title="KYC"
              />
              <PaginationComponent meta={kycMeta} onPageChange={setKycPage} />
            </TabsContent>
            <TabsContent value="listing">
              <RequestList
                requests={listingRequests}
                onSelectRequest={setSelectedRequest}
                selectedRequest={null}
                title="Listings"
              />
              <PaginationComponent meta={listingMeta} onPageChange={setListingPage} />
            </TabsContent>
          </Tabs>
        ) : (
          <>
            <Button variant="link" onClick={() => setSelectedRequest(null)} className="mb-4 px-0">
              &larr; Back to list
            </Button>
            <RequestView selectedRequest={selectedRequest} onActionComplete={onActionComplete} />
          </>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden size-full lg:flex">
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel defaultSize={50} minSize={30}>
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="flex h-full flex-col"
            >
              <TabsList className="mx-4 grid w-auto grid-cols-2">
                <TabsTrigger value="kyc">KYC</TabsTrigger>
                <TabsTrigger value="listing">Listings</TabsTrigger>
              </TabsList>
              <TabsContent value="kyc" className="flex-1 overflow-hidden">
                <RequestList
                  requests={kycRequests}
                  onSelectRequest={setSelectedRequest}
                  selectedRequest={selectedRequest}
                  title="KYC Requests"
                />
                <PaginationComponent meta={kycMeta} onPageChange={setKycPage} />
              </TabsContent>
              <TabsContent value="listing" className="flex-1 overflow-hidden">
                <RequestList
                  requests={listingRequests}
                  onSelectRequest={setSelectedRequest}
                  selectedRequest={selectedRequest}
                  title="Listing Requests"
                />
                <PaginationComponent meta={listingMeta} onPageChange={setListingPage} />
              </TabsContent>
            </Tabs>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="size-full overflow-y-auto">
              <RequestView selectedRequest={selectedRequest} onActionComplete={onActionComplete} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default PendingApprovalPage;
