import type React from 'react';
import { useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Square,
  ChevronLeft,
  ChevronRight,
  Crown,
  Share2,
  Edit3,
  ArchiveRestore,
  Trash2,
  BedDouble,
  ShowerHead,
  BadgeCheck,
  HousePlus,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import assets from '@/assets';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import DeleteProperty from '@/components/dialogs/delete-property';
import { PageMetaTags } from '@/components/page-meta-data';
import { useArchiveProperty, useDeleteProperty, useGetProperties } from '@/lib/services/properties';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { PropertyFilterSidebar } from '@/components/property-filter-sidebar';
import Map from '@/components/google-map';

// Updated TypeScript interfaces to match API response
interface PropertyOwner {
  id: string;
  name: string;
  phone_number: string;
  email_address: string;
  image_url: string;
  role: string;
}

interface PropertyLocation {
  country: string;
  state: string;
  city: string;
  area: string;
  address: string;
}

interface Property {
  id: string;
  slug: string;
  title: string;
  category: 'For Rent' | 'For Sale' | 'Short Let';
  excerpt: string;
  desc: string;
  price: number;
  currency: string;
  property_type: string;
  property_sub_type: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  is_verified: boolean;
  property_status: string[] | null;
  status: 'published' | 'archived' | 'draft';
  features: string[];
  cover_image: string;
  thumbnail_images: string[];
  owner: PropertyOwner;
  location: PropertyLocation;
  tags: string[];
  power_ratio: number;
  created_at: string;
}

type StatusFilterType = 'published' | 'archived' | 'draft';

const PropertiesPage: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('published');
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);

  const {
    data: propertiesData,
    isLoading,
    isError
  } = useGetProperties(
    {
      status: statusFilter,
      ...filters,
      page: currentPage,
      per_page: perPage
    },
    true
  );

  const { mutate: archiveProperty, isPending: isArchiving } = useArchiveProperty();
  const { mutate: deleteProperty, isPending: isDeleting } = useDeleteProperty();

  // Extract pagination metadata from API response
  const paginationMeta = useMemo(() => {
    return propertiesData?.data?.data?.meta || {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
      from: 0,
      to: 0
    };
  }, [propertiesData]);

  const handleShare = () => {
    if (!selectedProperty) return;
    const shareUrl = `${window.location.origin}/listing/${selectedProperty.slug}`;
    if (navigator.share) {
      navigator
        .share({
          title: selectedProperty.title,
          url: shareUrl,
        })
        .catch((error) => console.error('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast.success('Link copied to clipboard!');
      });
    }
  };

  // Extract properties from the nested data structure
  const properties = useMemo(() => {
    // The API response structure is: data.data.data (nested arrays)
    const rawData = propertiesData?.data?.data?.data;
    if (Array.isArray(rawData)) {
      return rawData;
    }
    return [];
  }, [propertiesData]);

  useEffect(() => {
    if (properties.length > 0 && !selectedProperty) {
      setSelectedProperty(properties[0]);
    } else if (properties.length === 0) {
      setSelectedProperty(null);
    }
  }, [properties]);

  const handleDelete = async () => {
    if (!selectedProperty) return;
    deleteProperty(selectedProperty.id, {
      onSuccess: () => {
        toast.success('Property deleted successfully.');
        setOpenDeleteModal(false);
        setSelectedProperty(null);
      },
    });
  };

  const handleArchive = (action: 'archive' | 'restore') => {
    if (!selectedProperty) return;
    archiveProperty({ propertyId: selectedProperty.id, action });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of list when changing page
    const listContainer = document.querySelector('.property-list-container');
    if (listContainer) {
      listContainer.scrollTop = 0;
    }
  };

  // Handle per page change
  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const EmptyState = ({ type }: { type: 'chat' | 'list' }) => {
    if (type === 'chat') {
      return (
        <div className="flex size-full flex-col items-center justify-center gap-4 bg-[#F9F9F9]">
          <div className="flex flex-col items-center justify-center gap-6">
            <img
              src={assets.messagingloading}
              alt="No properties"
              className="h-[84px] w-56 animate-pulse"
              width={224}
              height={84}
            />
            <div className="flex flex-col items-center justify-center gap-3">
              <h5 className="text-[20px]/7 font-normal text-[#1F2130]">No property selected</h5>
              <p className="text-center text-[14px]/5 tracking-[-0.02em] text-[#71748C]">
                Select a property from the list <br />
                to view its details.
              </p>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="flex w-full flex-col items-center justify-center gap-8 self-stretch py-14">
        <img src={assets.chatloading} className="h-28 w-[211px] animate-pulse" width={211} height={112} />
        <div className="flex flex-col items-center justify-center gap-3">
          <h5 className="text-[20px]/7 font-semibold text-[#1F2130]">Your property is empty</h5>
          <p className="text-[14px] leading-[17px] tracking-[-0.02em] text-[#71748C]">
            It looks like you haven&apos;t created a property yet.
          </p>
        </div>
      </div>
    );
  };

  const PropertyList: React.FC = () => (
    <div className="flex h-full flex-col gap-4 bg-white lg:px-6">
      <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-4">
        <h1 className="text-[24px] font-semibold text-[#1F2130]">Properties</h1>
        <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2">
              <Filter className="size-4 text-gray-600" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-sm p-0">
            <PropertyFilterSidebar
              filters={filters}
              onFiltersChange={(newFilters) => {
                setFilters(newFilters);
                setCurrentPage(1); // Reset to first page when filters change
                setIsFilterSheetOpen(false);
              }}
              onClear={() => {
                setFilters({});
                setCurrentPage(1); // Reset to first page when clearing filters
                setIsFilterSheetOpen(false);
              }}
            />
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex w-full flex-col gap-6 border-b border-[#E8E8E8] pb-4">
        <div className="relative pt-0.5">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 transform text-[#D4AF36]" />
          <Input
            type="text"
            placeholder="Search properties"
            className="h-10 self-stretch rounded-xl border border-[#D5D5DD] px-3 pl-10"
            onChange={(e) => {
              setFilters((prev) => ({ ...prev, q: e.target.value }));
              setCurrentPage(1); // Reset to first page when searching
            }}
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-1.5">
            <Button
              variant={statusFilter === 'published' ? 'outline' : 'ghost'}
              size="sm"
              onClick={() => {
                setStatusFilter('published');
                setCurrentPage(1); // Reset to first page when changing status filter
              }}
              className={`h-8 min-w-[55px] rounded-full text-[12px] font-semibold ${
                statusFilter === 'published'
                  ? 'border-[#EAEAEA] text-primary hover:bg-yellow-50'
                  : 'bg-[#ECECEC] text-[#41415C] hover:text-gray-800'
              }`}
            >
              Published
            </Button>
            <Button
              variant={statusFilter === 'draft' ? 'outline' : 'ghost'}
              size="sm"
              onClick={() => {
                setStatusFilter('draft');
                setCurrentPage(1);
              }}
              className={`h-8 min-w-[55px] rounded-full text-[12px] font-semibold ${
                statusFilter === 'draft'
                  ? 'border-[#EAEAEA] text-primary hover:bg-yellow-50'
                  : 'bg-[#ECECEC] text-[#41415C] hover:text-gray-800'
              }`}
            >
              Draft
            </Button>
            <Button
              variant={statusFilter === 'archived' ? 'outline' : 'ghost'}
              size="sm"
              onClick={() => {
                setStatusFilter('archived');
                setCurrentPage(1);
              }}
              className={`h-8 min-w-[55px] rounded-full text-[12px] font-semibold ${
                statusFilter === 'archived'
                  ? 'border-[#EAEAEA] text-primary hover:bg-yellow-50'
                  : 'bg-[#ECECEC] text-[#41415C] hover:text-gray-800'
              }`}
            >
              Archive
            </Button>
          </div>

          {/* Per Page Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Show:</span>
            <select
              value={perPage}
              onChange={(e) => handlePerPageChange(Number(e.target.value))}
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Property List with pagination */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="property-list-container flex-1 overflow-y-auto lg:pr-6">
          {isLoading ? (
            <div className="space-y-4 p-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : isError ? (
            <div className="p-4 text-center text-red-500">Failed to load properties.</div>
          ) : properties.length === 0 ? (
            <EmptyState type="list" />
          ) : (
            properties.map((property: Property) => {
              // Use cover_image as the main image, fallback to first thumbnail
              const coverImage = property.cover_image || property.thumbnail_images?.[0];
              return (
                <div
                  key={property.id}
                  onClick={() => setSelectedProperty(property)}
                  className={`cursor-pointer border-b border-[#E3E3E8] p-4 transition-colors hover:bg-gray-50 ${
                    selectedProperty?.id === property.id ? 'bg-[#FDF9ED]' : ''
                  }`}
                >
                  <div className="flex w-full items-start gap-3.5">
                    <div className="relative">
                      <img
                        src={coverImage || '/placeholder.svg'}
                        alt={property.title}
                        className="size-20 rounded-[6px] object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="truncate text-[14px] leading-[17px] font-semibold text-[#41415A]">
                            {property.title}
                          </h3>
                          <div className="mt-1 flex items-center gap-1">
                            <MapPin className="size-3 text-gray-400" />
                            <span className="text-[12px]/3.5 text-[#71748C]">
                              {property.location.city}, {property.location.state}
                            </span>
                          </div>
                        </div>
                        <Badge
                          className={`items-center rounded-sm border border-[oklch(0.5931_0_0/30%)] bg-white text-[12px] leading-[21px] text-[#0B0B0D]`}
                        >
                          <div
                            className={cn(
                              'mr-1 size-1.5 rounded-full',
                              property.category === 'Short Let'
                                ? 'bg-[#0AA6A9]'
                                : property.category === 'For Rent'
                                  ? 'bg-[#FDCE05]'
                                  : 'bg-[#D20832]'
                            )}
                          />
                          {property.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Component */}
        {!isLoading && !isError && properties.length > 0 && paginationMeta.last_page > 1 && (
          <div className="border-t border-[#E8E8E8] px-4 py-3">
            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <div className="text-sm text-gray-600">
                Showing {paginationMeta.from || 0} to {paginationMeta.to || 0} of {paginationMeta.total || 0} properties
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>

                  {(() => {
                    const { current_page, last_page } = paginationMeta;
                    const pages = [];
                    const maxVisible = 5;

                    if (last_page <= maxVisible) {
                      for (let i = 1; i <= last_page; i++) {
                        pages.push(i);
                      }
                    } else {
                      if (current_page <= 3) {
                        for (let i = 1; i <= 4; i++) pages.push(i);
                        pages.push('ellipsis');
                        pages.push(last_page);
                      } else if (current_page >= last_page - 2) {
                        pages.push(1);
                        pages.push('ellipsis');
                        for (let i = last_page - 3; i <= last_page; i++) pages.push(i);
                      } else {
                        pages.push(1);
                        pages.push('ellipsis');
                        for (let i = current_page - 1; i <= current_page + 1; i++) pages.push(i);
                        pages.push('ellipsis');
                        pages.push(last_page);
                      }
                    }

                    return pages.map((page, index) => (
                      <PaginationItem key={index}>
                        {page === 'ellipsis' ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            onClick={() => handlePageChange(page as number)}
                            isActive={current_page === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ));
                  })()}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={currentPage === paginationMeta.last_page ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const PropertyDetails: React.FC = () => {
    // Get all images from thumbnail_images and cover_image
    const allImages = useMemo(() => {
      if (!selectedProperty) return [];
      const images = [...(selectedProperty.thumbnail_images || [])];
      if (selectedProperty.cover_image && !images.includes(selectedProperty.cover_image)) {
        images.unshift(selectedProperty.cover_image);
      }
      return images;
    }, []);

    const nextImage = () => {
      setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
    };

    const prevImage = () => {
      setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
    };

    return (
      <div className="flex h-full flex-col bg-white lg:pl-6">
        {/* Header */}
        <div className="flex flex-col items-start gap-4 border-b border-[#E8E8E8] p-4 md:flex-row md:items-center md:justify-between lg:p-6">
          <h1 className="text-[24px] font-semibold text-[#1F2130]">
            {selectedProperty ? 'Property Details' : 'No Property Selected'}
          </h1>
          <Button
            asChild
            style={{
              background: 'linear-gradient(180deg, #505050 0%, #1E1E1E 60%)',
              boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
            }}
            className="h-10 rounded-[40px] border border-[oklch(0.235_0_0/50%)] p-4 text-[12px]/3 font-normal text-white"
          >
            <Link to="/properties/create">
              <HousePlus className="mr-2 size-4" /> New Listing
            </Link>
          </Button>
        </div>

        {!selectedProperty ? (
          <EmptyState type="chat" />
        ) : (
          <div className="flex w-full flex-col lg:flex-row">
            <div className="w-full lg:w-2/3">
              {/* Content */}
              <div className="flex h-auto flex-1 flex-col gap-4 overflow-y-auto p-4 lg:h-[calc(100svh-150px)] lg:p-6">
                {/* Image Gallery */}
                {allImages.length > 0 && (
                  <div className="relative border-b border-[#F1F1F4] pb-6">
                    <div className="relative h-[300px] overflow-hidden rounded-[10px]">
                      <img
                        src={allImages[currentImageIndex] || '/placeholder.svg'}
                        alt={selectedProperty.title}
                        className="size-full object-cover"
                      />
                      {allImages.length > 1 && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={prevImage}
                            className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white"
                          >
                            <ChevronLeft className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={nextImage}
                            className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white"
                          >
                            <ChevronRight className="size-4" />
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Thumbnail Gallery */}
                    {allImages.length > 1 && (
                      <div className="mt-4 flex gap-2 overflow-x-auto">
                        {allImages.slice(0, 4).map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`relative size-20 shrink-0 overflow-hidden rounded-[6px] ${
                              currentImageIndex === index ? 'ring-2 ring-[#D4AF36]' : ''
                            }`}
                          >
                            <img
                              src={image || '/placeholder.svg'}
                              alt={`${selectedProperty.title} ${index + 1}`}
                              className="size-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Property Info */}
                <div className="flex w-full flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`items-center rounded-sm border border-[oklch(0.5931_0_0/30%)] bg-white text-[12px] leading-[21px] text-[#0B0B0D]`}
                        >
                          <div
                            className={cn(
                              'mr-1 size-1.5 rounded-full',
                              selectedProperty.category === 'Short Let'
                                ? 'bg-[#0AA6A9]'
                                : selectedProperty.category === 'For Rent'
                                  ? 'bg-[#FDCE05]'
                                  : 'bg-[#D20832]'
                            )}
                          />
                          {selectedProperty.category}
                        </Badge>
                        <Badge
                          className={`items-center rounded-sm border border-[oklch(0.5931_0_0/30%)] bg-white text-[12px] leading-[21px] text-[#0B0B0D]`}
                        >
                          {selectedProperty.property_type}
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-2">
                        <h2 className="text-[14px]/4 font-semibold text-[#1F2130]">{selectedProperty.title}</h2>
                        <h3 className="text-[16px] leading-[21px] font-bold text-[#1F2130]">
                          {new Intl.NumberFormat('en-NG', {
                            style: 'currency',
                            currency: selectedProperty.currency,
                          }).format(selectedProperty.price)}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1">
                        <MapPin className="size-4 text-gray-400" />
                        <span className="text-[12px]/3.5 text-[#41415A]">
                          {selectedProperty.location.address ||
                           `${selectedProperty.location.city}, ${selectedProperty.location.state}`}
                        </span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full p-2 text-[14px] leading-[17px] font-semibold text-primary hover:bg-gray-100"
                        >
                          <Edit3 className="mr-2 size-4" />
                          Manage
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={handleShare} className="flex items-center space-x-3">
                          <Crown className="size-4 text-gray-600" />
                          <span>Promote </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleShare} className="flex items-center space-x-3">
                          <Share2 className="size-4" />
                          <span>Share</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="flex cursor-pointer items-center space-x-3">
                          <Link to="/properties/$id" params={{ id: selectedProperty.id }}>
                            <Edit3 className="size-4 text-gray-600" />
                            <span>Edit Details</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleArchive(selectedProperty.status === 'archived' ? 'restore' : 'archive')}
                          className="flex cursor-pointer items-center space-x-3"
                          disabled={isArchiving}
                        >
                          <ArchiveRestore className="size-4 text-gray-600" />
                          <span>{selectedProperty.status === 'archived' ? 'Restore' : 'Archive'}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setOpenDeleteModal(true)}
                          className="flex cursor-pointer items-center space-x-3 text-red-600"
                        >
                          <Trash2 className="size-4 text-gray-600" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Property Stats */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <BedDouble className="size-4 text-primary" />
                      <span className="text-[14px] text-[#71748C]">{selectedProperty.bedrooms} Beds</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShowerHead className="size-4 text-primary" />
                      <span className="text-[14px] text-[#71748C]">{selectedProperty.bathrooms} Baths</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Square className="size-4 text-primary" />
                      <span className="text-[14px] text-[#71748C]">
                        {selectedProperty.area_sqft?.toLocaleString() || 'N/A'} sq ft
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h4 className="mb-3 text-[18px] font-semibold text-[#1F2130]">Property Details</h4>
                  <p className="text-[14px]/5 text-[#71748C]">{selectedProperty.desc || selectedProperty.excerpt}</p>
                </div>

                {/* Features */}
                {selectedProperty.features && selectedProperty.features.length > 0 && (
                  <div className="mb-6">
                    <h4 className="mb-3 text-[18px] font-semibold text-[#1F2130]">Features include:</h4>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      {selectedProperty.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="size-1.5 rounded-full bg-primary" />
                          <span className="text-[14px]/5 text-[#71748C]">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full border-l border-gray-200 lg:w-1/3">
              <PropertyStats />
            </div>
          </div>
        )}
      </div>
    );
  };

  const PropertyStats: React.FC = () => {
    if (!selectedProperty) return null;

    return (
      <div className="flex flex-col items-start gap-4 pt-6 pl-4">
        <div className="w-full border-b border-[#F1F1F4] pb-4">
          <div className="flex flex-col items-start gap-5 self-stretch rounded-[5px] border border-[#E5E5E5] p-4">
            <div className="flex items-center gap-3 self-stretch">
              <Avatar className="size-[43px] rounded-[5px]">
                <AvatarImage src={selectedProperty.owner.image_url || '/placeholder.svg'} />
                <AvatarFallback>{selectedProperty.owner.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-1.5">
                <h3 className="text-[13px]/4 font-semibold text-[#1F2130]">{selectedProperty.owner.name}</h3>

                {selectedProperty.is_verified ? (
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="size-4 shrink-0 fill-primary text-white" />
                    <span className="text-[12px] leading-[18px] font-semibold text-primary">Verified Owner</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="size-4 shrink-0 text-gray-400" />
                    <span className="text-[12px] leading-[18px] font-medium text-gray-500">Not Verified</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Property Stats */}
        <div className="flex w-full border-b border-[#F1F1F4] pb-4">
          <div className="box-border flex w-full flex-col items-start gap-5 self-stretch rounded-[5px] border border-[#E5E5E5] p-4">
            <div className="flex flex-col items-start gap-2 self-stretch">
              <div className="flex w-full items-center justify-between gap-2">
                <span className="text-[12px]/3 text-[#71748C]">Status</span>
                <span className="text-[12px]/3 text-[#1F2130] capitalize">{selectedProperty.status}</span>
              </div>
              <div className="flex w-full items-center justify-between gap-2">
                <span className="text-[12px]/3 text-[#71748C]">Property ID</span>
                <span className="text-[12px]/3 text-[#1F2130]">{selectedProperty.id}</span>
              </div>
              <div className="flex w-full items-center justify-between gap-2">
                <span className="text-[12px]/3 text-[#71748C]">Added</span>
                <span className="text-[12px]/3 text-[#1F2130]">
                  {new Date(selectedProperty.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex w-full items-center justify-between gap-2">
                <span className="text-[12px]/3 text-[#71748C]">Property Type</span>
                <span className="text-[12px]/3 text-[#1F2130]">{selectedProperty.property_type}</span>
              </div>
              <div className="flex w-full items-center justify-between gap-2">
                <span className="text-[12px]/3 text-[#71748C]">Sub Type</span>
                <span className="text-[12px]/3 text-[#1F2130]">{selectedProperty.property_sub_type}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[358px] w-full">
          <Map
            address={selectedProperty.location.address}
            city={selectedProperty.location.city}
            state={selectedProperty.location.state}
            country={selectedProperty.location.country}
          />
        </div>
      </div>
    );
  };


  return (
    <div className="flex h-screen w-full flex-col items-start gap-0 self-stretch py-8 lg:flex-row">
      <PageMetaTags
        title="Manage Properties"
        description="View and manage all your listed properties, track performance, and update details."
        keywords="property management, listing management"
      />

      {/* Mobile View */}
     <div className="w-full lg:hidden">
  {!selectedProperty ? (
    <div className="h-full">

      <PropertyList />
    </div>
  ) : (
    <div className="flex h-screen flex-col">
      <div className="sticky top-0 z-10 border-b border-[#E8E8E8] bg-white px-4 py-2">
        <Button
          variant="ghost"
          onClick={() => {
            setSelectedProperty(null);
            setCurrentImageIndex(0);
          }}
          className="p-0 text-[#71748C] hover:bg-transparent"
        >
          <ChevronLeft className="mr-1 size-5" />
          Back to list
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <PropertyDetails />
      </div>
    </div>
  )}
</div>

      {/* Desktop View */}
      <div className="hidden size-full lg:flex">
        <ResizablePanelGroup direction="horizontal" className="size-full">
          <ResizablePanel defaultSize={25} minSize={20} maxSize={35} className="border-r border-[#F1F1F4]">
            <div className="h-full">
              <PropertyList />
            </div>
          </ResizablePanel>
          <ResizableHandle className="w-px hover:bg-gray-200" />
          <ResizablePanel defaultSize={75} minSize={60}>
            <PropertyDetails />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <DeleteProperty
        setOpenDeleteModal={setOpenDeleteModal}
        openDeleteModal={openDeleteModal}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default PropertiesPage;
