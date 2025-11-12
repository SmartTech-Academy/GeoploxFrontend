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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

import assets from '@/assets';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import DeleteProperty from '@/components/dialogs/delete-property';
import { PageMetaTags } from '@/components/page-meta-data';
import { useArchiveProperty, useDeleteProperty, useGetProperties } from '@/lib/services/properties';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import FilterPopover, { FilterValues } from './filter-popover';

// TypeScript interfaces
interface PropertyImage {
  url: string;
  is_cover: boolean;
  position: number;
}

interface PropertyOwner {
  id: number;
  name: string;
  phone_number: string;
  email_address: string;
  image_url: string;
  role: string;
}

interface Property {
  id: string;
  property_id: string;
  slug: string;
  title: string;
  desc: string;
  price: number;
  currency: string;
  property_type: string;
  status: 'published' | 'archived' | 'draft';
  is_verified: boolean;
  address: string;
  city: string;
  state: string;
  country: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  features: string[];
  images: PropertyImage[];
  owner: PropertyOwner;
  tags: string[];
  category: 'For Rent' | 'For Sale' | 'Short Let';
  views: number;
  power_ratio: number;
  created_at: string;
  updated_at: string;
}

type StatusFilterType = 'published' | 'archived' | 'draft';

const PropertiesPage: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('published');
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterValues>({});

  const { data: propertiesData, isLoading, isError } = useGetProperties({ status: statusFilter, ...filters }, true);
  const { mutate: archiveProperty, isPending: isArchiving } = useArchiveProperty();
  const { mutate: deleteProperty, isPending: isDeleting } = useDeleteProperty();

  const properties = useMemo(() => propertiesData?.data?.data?.data || [], [propertiesData]);

  useEffect(() => {
    if (properties.length > 0 && !selectedProperty) {
      setSelectedProperty(properties[0]);
    } else if (properties.length === 0) {
      setSelectedProperty(null);
    }
  }, [properties, selectedProperty]);

  const handleDelete = async () => {
    if (!selectedProperty) return;
    deleteProperty(selectedProperty.id, {
      onSuccess: () => {
        toast.success('Property deleted successfully.');
        setOpenDeleteModal(false);
        setSelectedProperty(null); // Deselect after deletion
      },
    });
  };

  const handleArchive = (action: 'archive' | 'restore') => {
    if (!selectedProperty) return;
    archiveProperty({ propertyId: selectedProperty.id, action });
  };

  const EmptyState = ({ type }: { type: 'chat' | 'list' }) => {
    if (type === 'chat') {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[#F9F9F9]">
          <div className="flex flex-col items-center justify-center gap-6">
            <img
              src={assets.messagingloading}
              alt="No properties"
              className="h-[84px] w-56 animate-pulse"
              width={224}
              height={84}
            />
            <div className="flex flex-col items-center justify-center gap-3">
              <h5 className="text-[20px] leading-7 font-normal text-[#1F2130]">No property selected</h5>
              <p className="text-center text-[14px] leading-5 tracking-[-0.02em] text-[#71748C]">
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
          <h5 className="text-[20px] leading-7 font-semibold text-[#1F2130]">Your property is empty</h5>
          <p className="text-[14px] leading-[17px] tracking-[-0.02em] text-[#71748C]">
            It looks like you haven’t created a proprety yet.
          </p>
        </div>
      </div>
    );
  };
  const PropertyList: React.FC = () => (
    <div className="flex h-full flex-col gap-4 bg-white lg:px-6">
      <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-4">
        <h1 className="text-[24px] font-semibold text-[#1F2130]">Properties</h1>
        <FilterPopover onApply={setFilters} />
      </div>
      <div className="flex w-full flex-col gap-6 border-b border-[#E8E8E8] pb-4">
        <div className="relative pt-0.5">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 transform text-[#D4AF36]" />
          <Input
            type="text"
            placeholder="Search properties"
            className="h-10 self-stretch rounded-xl border border-[#D5D5DD] px-3 pl-10"
            onChange={(e) => setFilters((prev) => ({ ...prev, q: e.target.value }))}
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-1.5">
            <Button
              variant={statusFilter === 'published' ? 'outline' : 'ghost'}
              size="sm"
              onClick={() => setStatusFilter('published')}
              className={`h-8 min-w-[55px] rounded-full text-[12px] font-semibold ${
                statusFilter === 'published'
                  ? 'text-primary border-[#EAEAEA] hover:bg-yellow-50'
                  : 'bg-[#ECECEC] text-[#41415C] hover:text-gray-800'
              }`}
            >
              Published
            </Button>
            <Button
              variant={statusFilter === 'draft' ? 'outline' : 'ghost'}
              size="sm"
              onClick={() => setStatusFilter('draft')}
              className={`h-8 min-w-[55px] rounded-full text-[12px] font-semibold ${
                statusFilter === 'draft'
                  ? 'text-primary border-[#EAEAEA] hover:bg-yellow-50'
                  : 'bg-[#ECECEC] text-[#41415C] hover:text-gray-800'
              }`}
            >
              Draft
            </Button>
            <Button
              variant={statusFilter === 'archived' ? 'outline' : 'ghost'}
              size="sm"
              onClick={() => setStatusFilter('archived')}
              className={`h-8 min-w-[55px] rounded-full text-[12px] font-semibold ${
                statusFilter === 'archived'
                  ? 'text-primary border-[#EAEAEA] hover:bg-yellow-50'
                  : 'bg-[#ECECEC] text-[#41415C] hover:text-gray-800'
              }`}
            >
              Archive
            </Button>
          </div>
        </div>
      </div>

      {/* Property List */}
      <div className="flex-1 overflow-y-auto lg:pr-6">
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
            const coverImage =
              property.images.find((img: PropertyImage) => img.is_cover)?.url || property.images[0]?.url;
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
                          <span className="text-[12px] leading-3.5 text-[#71748C]">
                            {property.city}, {property.state}
                          </span>
                        </div>
                      </div>
                      <Badge
                        className={`items-center rounded border border-[oklch(0.5931_0_0/30%)] bg-white text-[12px] leading-[21px] text-[#0B0B0D]`}
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
    </div>
  );

  const PropertyDetails: React.FC = () => {
    const nextImage = () => {
      if (selectedProperty) {
        setCurrentImageIndex((prev) => (prev === (selectedProperty.images?.length || 0) - 1 ? 0 : prev + 1));
      }
    };

    const prevImage = () => {
      if (selectedProperty) {
        setCurrentImageIndex((prev) => (prev === 0 ? (selectedProperty.images?.length || 0) - 1 : prev - 1));
      }
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
            className="h-10 rounded-[40px] border border-[oklch(0.235_0_0/50%)] p-4 text-[12px] leading-3 font-normal text-white"
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
                <div className="relative border-b border-[#F1F1F4] pb-6">
                  <div className="relative h-[300px] overflow-hidden rounded-[10px]">
                    <img
                      src={selectedProperty.images[currentImageIndex]?.url || '/placeholder.svg'}
                      alt={selectedProperty.title}
                      className="h-full w-full object-cover"
                    />
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
                  </div>

                  {/* Thumbnail Gallery */}
                  <div className="mt-4 flex gap-2">
                    {selectedProperty.images?.slice(0, 4).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative size-20 overflow-hidden rounded-[6px] ${
                          currentImageIndex === index ? 'ring-2 ring-[#D4AF36]' : ''
                        }`}
                      >
                        <img
                          src={image.url || '/placeholder.svg'}
                          alt={`${selectedProperty.title} ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Info */}
                <div className="flex w-full flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`items-center rounded border border-[oklch(0.5931_0_0/30%)] bg-white text-[12px] leading-[21px] text-[#0B0B0D]`}
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
                          className={`items-center rounded border border-[oklch(0.5931_0_0/30%)] bg-white text-[12px] leading-[21px] text-[#0B0B0D]`}
                        >
                          {selectedProperty.property_type}
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-2">
                        <h2 className="text-[14px] leading-4 font-semibold text-[#1F2130]">{selectedProperty.title}</h2>
                        <h3 className="text-[16px] leading-[21px] font-bold text-[#1F2130]">
                          {new Intl.NumberFormat('en-NG', {
                            style: 'currency',
                            currency: selectedProperty.currency,
                          }).format(selectedProperty.price)}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1">
                        <MapPin className="size-4 text-gray-400" />
                        <span className="text-[12px] leading-3.5 text-[#41415A]">{selectedProperty.address}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary rounded-full p-2 text-[14px] leading-[17px] font-semibold hover:bg-gray-100"
                        >
                          <Edit3 className="mr-2 size-4" />
                          Manage
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="flex items-center space-x-3">
                          <Crown className="h-4 w-4 text-gray-600" />
                          <span>Promote </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center space-x-3">
                          <Share2 className="h-4 w-4" />
                          <span>Share</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="flex cursor-pointer items-center space-x-3">
                          <Link to="/properties/$id" params={{ id: String(selectedProperty.id) }}>
                            <Edit3 className="h-4 w-4 text-gray-600" />
                            <span>Edit Details</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleArchive(selectedProperty.status === 'archived' ? 'restore' : 'archive')}
                          className="flex cursor-pointer items-center space-x-3"
                          disabled={isArchiving}
                        >
                          <ArchiveRestore className="h-4 w-4 text-gray-600" />
                          <span>{selectedProperty.status === 'archived' ? 'Restore' : 'Archive'}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setOpenDeleteModal(true)}
                          className="flex cursor-pointer items-center space-x-3 text-red-600"
                        >
                          <Trash2 className="h-4 w-4 text-gray-600" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Property Stats */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <BedDouble className="text-primary size-4" />
                      <span className="text-[14px] text-[#71748C]">{selectedProperty.bedrooms} Beds</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShowerHead className="text-primary size-4" />
                      <span className="text-[14px] text-[#71748C]">{selectedProperty.bathrooms} Baths</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Square className="text-primary size-4" />
                      <span className="text-[14px] text-[#71748C]">
                        {selectedProperty.area_sqft.toLocaleString()} sq ft
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h4 className="mb-3 text-[18px] font-semibold text-[#1F2130]">Property Details</h4>
                  <p className="text-[14px] leading-5 text-[#71748C]">{selectedProperty.desc}</p>
                  <div className="mt-4">
                    <p className="text-[14px] leading-5 text-[#71748C]">
                      Located in a beautiful, serene, highly secured estate in the heart of Lekki.
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="mb-3 text-[18px] font-semibold text-[#1F2130]">Features include:</h4>
                  <ul className="space-y-2">
                    {selectedProperty.features.map((feature, index) => (
                      <li key={index} className="text-[14px] leading-5 text-[#71748C]">
                        - {feature}
                      </li>
                    ))}
                  </ul>
                </div>
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
        <div className="w-full border-b border-[##F1F1F4] pb-4">
          <div className="flex flex-col items-start gap-5 self-stretch rounded-[5px] border border-[#E5E5E5] p-4">
            <div className="flex items-center gap-3 self-stretch">
              <Avatar className="size-[43px] rounded-[5px]">
                <AvatarImage src={selectedProperty.owner.image_url || '/placeholder.svg'} />
                <AvatarFallback>RC</AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-1.5">
                <h3 className="text-[13px] leading-4 font-semibold text-[#1F2130]">{selectedProperty.owner.name}</h3>

                {selectedProperty.is_verified ? (
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="fill-primary size-4 shrink-0 text-white" />
                    <span className="text-primary text-[12px] leading-[18px] font-semibold">Verified Owner</span>
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
                <span className="text-[12px] leading-3 text-[#71748C]">Status</span>
                <span className="text-[12px] leading-3 text-[#1F2130]">Active</span>
              </div>
              <div className="flex w-full items-center justify-between gap-2">
                <span className="text-[12px] leading-3 text-[#71748C]">Property ID</span>
                <span className="text-[12px] leading-3 text-[#1F2130]">{selectedProperty.property_id}</span>
              </div>
              <div className="flex w-full items-center justify-between gap-2">
                <span className="text-[12px] leading-3 text-[#71748C]">Added</span>
                <span className="text-[12px] leading-3 text-[#1F2130]">
                  {new Date(selectedProperty.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex w-full items-center justify-between gap-2">
                <span className="text-[12px] leading-3 text-[#71748C]">Leads</span>
                <span className="text-[12px] leading-3 text-[#1F2130]">N/A</span>
              </div>
              <div className="flex w-full items-center justify-between gap-2">
                <span className="text-[12px] leading-3 text-[#71748C]">Views</span>
                <span className="text-[12px] leading-3 text-[#1F2130]">{selectedProperty.views.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <img src={assets.citymap} alt="" width={224} height={358} />
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
          <div className="px-4">
            <PropertyList />
          </div>
        ) : (
          <>
            <Button variant="link" onClick={() => setSelectedProperty(null)} className="mb-4 px-4">
              &larr; Back to list
            </Button>
            <PropertyDetails />
          </>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden h-full w-full lg:flex">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
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
