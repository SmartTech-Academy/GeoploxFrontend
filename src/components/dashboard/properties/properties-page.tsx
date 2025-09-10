'use client';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import type React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import {
  Search,
  Filter,
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

// TypeScript interfaces
interface Property {
  id: number;
  title: string;
  address: string;
  location: string;
  price: string;
  status: 'For Sale' | 'Rent' | 'Short Let';
  type: string;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  images: string[];
  description: string;
  features: string[];
  propertyId: string;
  added: string;
  leads: number;
  views: number;
  owner: {
    name: string;
    avatar: string;
    verified: boolean;
  };
}

type FilterType = 'all' | 'active' | 'archive';

const PropertiesPage: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const properties: Property[] = [
    {
      id: 1,
      title: '12 Ikolaba, GRA Agodi',
      address: '12 Ikolaba, GRA Agodi',
      location: 'Ogudu, Lagos',
      price: '₦500,000,000',
      status: 'For Sale',
      type: 'Duplex',
      beds: 4,
      baths: 4,
      sqft: 3000,
      image: assets.property1,
      images: [assets.property1, assets.property2, assets.property3, assets.property4],
      description:
        '5 Bedroom fully detached house with 2 maid rooms, an elevator, rooftop terraces (front and back), a swimming pool, a cinema/movie theater, etc. Land size: 800 square meters.',
      features: [
        'Smart house',
        '5 Bedrooms (All en-suite)',
        '2 maid rooms/ Boys quarters (BQ)',
        'Ante room/Foyer with a guest toilet',
        'Dedicated dinning space',
        'Elevator / lift',
        'Cinema',
        'Penthouse rooftop terraces (front & rear terraces)',
        'Swimming pool',
        'CCTV surveillance cameras',
        'A garden',
        'A fully equipped kitchen',
        'A spacious kitchen pantry',
        'A dedicated laundry room',
        'Family Lounges (2 nos.)',
        'High ceiling family living room',
      ],
      propertyId: '5J393039',
      added: '18 Jul, 2025',
      leads: 203,
      views: 4554,
      owner: {
        name: 'Royal Crest Properties',
        avatar: assets.landlord,
        verified: true,
      },
    },
    {
      id: 2,
      title: '456 Market Avenue',
      address: '456 Market Avenue',
      location: 'Ikeja, Lagos',
      price: '₦350,000,000',
      status: 'Rent',
      type: 'Duplex',
      beds: 3,
      baths: 3,
      sqft: 2500,
      image: assets.herohouse,
      images: [assets.houseinteriorbathroom, assets.houseinteriorkitchen],
      description: '3 Bedroom duplex in a serene environment with modern amenities.',
      features: ['Modern kitchen', 'Swimming pool', 'Garden', 'Security'],
      propertyId: '5J393040',
      added: '15 Jul, 2025',
      leads: 150,
      views: 3200,
      owner: {
        name: 'Royal Crest Properties',
        avatar: assets.landlord,
        verified: true,
      },
    },
    {
      id: 3,
      title: '789 Elm Street',
      address: '789 Elm Street',
      location: 'Agege, Lagos',
      price: '₦200,000,000',
      status: 'Short Let',
      type: 'Apartment',
      beds: 2,
      baths: 2,
      sqft: 1800,
      image: assets.property5,
      images: [assets.property3, assets.property5],
      description: '2 Bedroom apartment perfect for short stays.',
      features: ['Furnished', 'WiFi', 'Air conditioning', 'Parking'],
      propertyId: '5J393041',
      added: '12 Jul, 2025',
      leads: 89,
      views: 2100,
      owner: {
        name: 'Royal Crest Properties',
        avatar: assets.landlord,
        verified: true,
      },
    },
  ];

  const filteredProperties = properties; // You can add filtering logic here

  const EmptyState: React.FC = () => (
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
          <h5 className="text-[20px] leading-[28px] font-normal text-[#1F2130]">No property selected</h5>
          <p className="text-center text-[14px] leading-[20px] tracking-[-0.02em] text-[#71748C]">
            Select a property from the list <br />
            to view its details.
          </p>
        </div>
      </div>
    </div>
  );

  const PropertyList: React.FC = () => (
    <div className="flex h-full flex-col gap-4 bg-white lg:px-6">
      {/* Search Bar */}
      <div className="flex w-full flex-col gap-6 border-b border-[#E8E8E8] pb-4">
        <div className="relative pt-0.5">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 transform text-[#D4AF36]" />
          <Input
            type="text"
            placeholder="Search properties"
            className="h-10 self-stretch rounded-[8px] border border-[#D5D5DD] px-3 pl-10"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
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
              className={`h-8 min-w-[55px] rounded-full text-[12px] font-semibold ${
                filter === 'active'
                  ? 'text-primary border-[#EAEAEA] hover:bg-yellow-50'
                  : 'bg-[#ECECEC] text-[#41415C] hover:text-gray-800'
              }`}
            >
              Active
            </Button>
            <Button
              variant={filter === 'archive' ? 'outline' : 'ghost'}
              size="sm"
              onClick={() => setFilter('archive')}
              className={`h-8 min-w-[55px] rounded-full text-[12px] font-semibold ${
                filter === 'archive'
                  ? 'text-primary border-[#EAEAEA] hover:bg-yellow-50'
                  : 'bg-[#ECECEC] text-[#41415C] hover:text-gray-800'
              }`}
            >
              Archive
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="p-2"></Button>
          <Select defaultValue="this_month">
            <SelectTrigger className="h-8 w-fit rounded-[45px] border-0 border-[oklch(0.8754_0.0109_286.17)] bg-transparent text-[#41415A] shadow-none focus:ring-0">
              <div className="flex items-center gap-2">
                <Filter className="size-4 text-gray-600" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this_week">This week</SelectItem>
              <SelectItem value="this_month">This month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Property List */}
      <div className="flex-1 overflow-y-auto lg:pr-6">
        {filteredProperties.map((property) => (
          <div
            key={property.id}
            onClick={() => setSelectedProperty(property)}
            className={`cursor-pointer border-b border-[#E3E3E8] p-4 transition-colors hover:bg-gray-50 ${
              selectedProperty?.id === property.id ? 'bg-[#FDF9ED]' : ''
            }`}
          >
            <div className="flex w-full items-start gap-[14px]">
              <div className="relative">
                <img
                  src={property.image || '/placeholder.svg'}
                  alt={property.title}
                  className="size-[80px] rounded-[6px] object-cover"
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
                      <span className="text-[12px] leading-[14px] text-[#71748C]">{property.location}</span>
                    </div>
                  </div>
                  <Badge
                    className={`items-center rounded border border-[oklch(0.5931_0_0_/_30%)] bg-white text-[12px] leading-[21px] text-[#0B0B0D]`}
                  >
                    <div
                      className={cn(
                        'size-1.5 rounded-full',
                        property.status === 'Short Let'
                          ? 'bg-[#0AA6A9]'
                          : property.status === 'Rent'
                            ? 'bg-[#FDCE05]'
                            : 'bg-[#D20832]'
                      )}
                    />

                    {property.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const PropertyDetails: React.FC = () => {
    if (!selectedProperty) {
      return <EmptyState />;
    }

    const nextImage = () => {
      setCurrentImageIndex((prev) => (prev === selectedProperty.images.length - 1 ? 0 : prev + 1));
    };

    const prevImage = () => {
      setCurrentImageIndex((prev) => (prev === 0 ? selectedProperty.images.length - 1 : prev - 1));
    };

    return (
      <div className="flex h-full flex-col bg-white lg:pl-6">
        {/* Header */}
        <div className="flex flex-col items-start gap-4 border-b border-[#E8E8E8] p-4 md:flex-row md:items-center md:justify-between lg:p-6">
          <h1 className="text-[24px] font-semibold text-[#1F2130]">Property Details</h1>

          <Button
            asChild
            style={{
              background: 'linear-gradient(180deg, #505050 0%, #1E1E1E 60%)',
              boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
            }}
            className="h-10 rounded-[40px] border border-[oklch(0.235_0_0_/_50%)] p-4 text-[12px] leading-[12px] font-normal text-white"
          >
            <Link to="/properties/create">
              <HousePlus className="size-4" /> New Listing
            </Link>
          </Button>
        </div>

        <div className="flex w-full flex-col lg:flex-row">
          <div className="w-full lg:w-2/3">
            {/* Content */}
            <div className="flex h-auto flex-1 flex-col gap-4 overflow-y-auto p-4 lg:h-[calc(100svh-150px)] lg:p-6">
              {/* Image Gallery */}
              <div className="relative border-b border-[#F1F1F4] pb-6">
                <div className="relative h-[300px] overflow-hidden rounded-[10px]">
                  <img
                    src={selectedProperty.images[currentImageIndex] || '/placeholder.svg'}
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
                  {selectedProperty.images.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative h-[80px] w-[80px] overflow-hidden rounded-[6px] ${
                        currentImageIndex === index ? 'ring-2 ring-[#D4AF36]' : ''
                      }`}
                    >
                      <img
                        src={image || '/placeholder.svg'}
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
                        className={`items-center rounded border border-[oklch(0.5931_0_0_/_30%)] bg-white text-[12px] leading-[21px] text-[#0B0B0D]`}
                      >
                        <div
                          className={cn(
                            'size-1.5 rounded-full',

                            'bg-[#D20832]'
                          )}
                        />
                        For Sale
                      </Badge>
                      <Badge
                        className={`items-center rounded border border-[oklch(0.5931_0_0_/_30%)] bg-white text-[12px] leading-[21px] text-[#0B0B0D]`}
                      >
                        {selectedProperty.type}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h2 className="text-[14px] leading-[16px] font-semibold text-[#1F2130]">
                        {selectedProperty.title}
                      </h2>
                      <h3 className="text-[16px] leading-[21px] font-bold text-[#1F2130]">{selectedProperty.price}</h3>
                    </div>

                    <div className="flex items-center gap-1">
                      <MapPin className="size-4 text-gray-400" />
                      <span className="text-[12px] leading-[14px] text-[#41415A]">{selectedProperty.address}</span>
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
                      <DropdownMenuItem asChild className="flex items-center space-x-3">
                        <Link to="/properties/$id" params={{ id: String(selectedProperty.id) }}>
                          <Edit3 className="h-4 w-4 text-gray-600" />
                          <span>Edit Details</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center space-x-3">
                        <ArchiveRestore className="h-4 w-4 text-gray-600" />
                        <span>Archive</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setOpenDeleteModal(true)}
                        className="flex items-center space-x-3 text-red-600"
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
                    <span className="text-[14px] text-[#71748C]">{selectedProperty.beds} Beds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShowerHead className="text-primary size-4" />
                    <span className="text-[14px] text-[#71748C]">{selectedProperty.baths} Baths</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Square className="text-primary size-4" />
                    <span className="text-[14px] text-[#71748C]">{selectedProperty.sqft.toLocaleString()} sq ft</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="mb-3 text-[18px] font-semibold text-[#1F2130]">Property Details</h4>
                <p className="text-[14px] leading-[20px] text-[#71748C]">{selectedProperty.description}</p>
                <div className="mt-4">
                  <p className="text-[14px] leading-[20px] text-[#71748C]">
                    Located in a beautiful, serene, highly secured estate in the heart of Lekki.
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="mb-3 text-[18px] font-semibold text-[#1F2130]">Features include:</h4>
                <ul className="space-y-2">
                  {selectedProperty.features.map((feature, index) => (
                    <li key={index} className="text-[14px] leading-[20px] text-[#71748C]">
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
                <AvatarImage src={selectedProperty.owner.avatar || '/placeholder.svg'} />
                <AvatarFallback>RC</AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-1.5">
                <h3 className="text-[13px] leading-[16px] font-semibold text-[#1F2130]">
                  {selectedProperty.owner.name}
                </h3>

                {selectedProperty.owner.verified && (
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="fill-primary size-4 shrink-0 text-white" />
                    <span className="text-primary text-[12px] leading-[18px] font-semibold">Verified Owner</span>
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
                <span className="text-[12px] leading-[12px] text-[#71748C]">Status</span>
                <span className="text-[12px] leading-[12px] text-[#1F2130]">Active</span>
              </div>
              <div className="flex w-full items-center justify-between gap-2">
                <span className="text-[12px] leading-[12px] text-[#71748C]">Property ID</span>
                <span className="text-[12px] leading-[12px] text-[#1F2130]">{selectedProperty.propertyId}</span>
              </div>
              <div className="flex w-full items-center justify-between gap-2">
                <span className="text-[12px] leading-[12px] text-[#71748C]">Added</span>
                <span className="text-[12px] leading-[12px] text-[#1F2130]">{selectedProperty.added}</span>
              </div>
              <div className="flex w-full items-center justify-between gap-2">
                <span className="text-[12px] leading-[12px] text-[#71748C]">Leads</span>
                <span className="text-[12px] leading-[12px] text-[#1F2130]">{selectedProperty.leads}</span>
              </div>
              <div className="flex w-full items-center justify-between gap-2">
                <span className="text-[12px] leading-[12px] text-[#71748C]">Views</span>
                <span className="text-[12px] leading-[12px] text-[#1F2130]">
                  {selectedProperty.views.toLocaleString()}
                </span>
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

      <DeleteProperty setOpenDeleteModal={setOpenDeleteModal} openDeleteModal={openDeleteModal} />
    </div>
  );
};

export default PropertiesPage;
