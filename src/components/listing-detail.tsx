import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  MoreVertical,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Download,
  BadgeCheck,
  Lock,
  Images,
  BedDouble,
  ShowerHead,
  Square,
  Slash,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator as DropdownMenuSeparatorAction,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn, formatPrice } from '@/lib/utils';
import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from '@tanstack/react-router';
import { PageMetaTags } from './page-meta-data';
import {
  useBlacklistUser,
  useDeleteProperty,
  useFlagProperty,
  useGetPropertyDetails,
  useGetRelatedProperties,
  useRevokeUserVerification,
} from '@/lib/services';
import { ListingDetailSkeleton } from './listing-detail-skeleton';

import { ContactOwnerDialog } from './dialogs/contact-owner-dialog';
import DeletePropertyModal from './dialogs/delete-property';
import assets from '@/assets';
import { PropertyListingCardSkeleton } from './property-listing-card-skeleton';

const ListingDetail = () => {
  const location = useLocation();

  const getRoutePath = () => {
    if (location.pathname.startsWith('/buy/')) {
      return '/_landing/buy/$id';
    }
    if (location.pathname.startsWith('/for-rent/')) {
      return '/_landing/for-rent/$id';
    }
    if (location.pathname.startsWith('/for-sale/')) {
      return '/_landing/for-sale/$id';
    }
    if (location.pathname.startsWith('/admin-listing/')) {
      return '/_dashboard/admin-listing/$id';
    }
    if (location.pathname.startsWith('/listing/')) {
      return '/_dashboard/listing/$id';
    }
    // Add other paths like /for-sale if they exist
    return '/_landing/buy/$id'; // Fallback
  };

  const { id: slug } = useParams({ from: getRoutePath() });
  const navigate = useNavigate();
  const isDashboard = location.pathname.includes('/listing/');
  const isAdminListing = location.pathname.includes('/admin-listing/');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isContactDialogOpen, setContactDialogOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const { mutate: flagProperty, isPending: isFlagging } = useFlagProperty();
  const { mutate: deleteProperty, isPending: isDeleting } = useDeleteProperty();
  const { mutate: blacklistUser, isPending: isBlacklisting } = useBlacklistUser();
  const { mutate: revokeVerification, isPending: isRevoking } = useRevokeUserVerification();

  const { data: propertyDetailsResponse, isLoading: isLoadingDetails } = useGetPropertyDetails(slug, isDashboard);
  const { data: relatedPropertiesResponse, isLoading: isLoadingRelated } = useGetRelatedProperties(slug);

  const property = propertyDetailsResponse?.data.data;

  const displayTitle = property
    ? `${property.property_type} ${
        property.category.toLowerCase().startsWith('for') ? property.category : `for ${property.category}`
      } in ${property.state} | ${property.city}${
        property.bedrooms
          ? ` | ${property.bedrooms} Bedrooms`
          : property.features && property.features.length > 0
            ? ` | ${property.features[0]}`
            : ''
      }`
    : '';

  const handleDelete = () => {
    if (!property) return;
    deleteProperty(property.id, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        navigate({ to: '/admin-listing' });
      },
    });
  };

  const handleBlacklist = () => {
    if (!property) return;
    blacklistUser(property.owner.id);
  };

  const handleRevokeVerification = () => {
    if (!property) return;
    revokeVerification(property.owner.id);
  };

  const relatedProperties = relatedPropertiesResponse?.data.data ?? [];
  const images = property?.images.map((img: { url: string }) => img.url) ?? [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (isLoadingDetails) {
    return <ListingDetailSkeleton />;
  }

  if (!property) {
    return <div>Property not found.</div>;
  }

  return (
    <div
      className={cn(
        'min-h-screen w-full bg-white',
        isDashboard || isAdminListing ? 'py-8' : 'py-(--landing-header-height)'
      )}
    >
      {isDashboard ? (
        <PageMetaTags title={`Listing: ${displayTitle}`} description={property.desc} keywords="listing management" />
      ) : (
        <PageMetaTags
          title={displayTitle}
          description={property.desc}
          price={String(property.price)}
          location={`${property.city}, ${property.state}`}
          propertyType={property.property_type}
          listingType="buy"
          image={property.images.find((img: { is_cover: boolean }) => img.is_cover)?.url}
          keywords={`${property.property_type} in ${property.city}, ${property.tags.join(', ')}`}
        />
      )}

      <div
        className={cn('w-full', !isDashboard && !isAdminListing && 'landing-container flex flex-col gap-8 pt-[77px]')}
      >
        <header className="flex w-full flex-col items-center justify-between lg:flex-row">
          <div className="flex flex-col items-start self-stretch">
            <div className="flex flex-col gap-3 self-stretch py-[15px] lg:flex-row">
              {isAdminListing ? (
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link to="/admin-listing">Admin Listing</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                      <Slash />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                      <BreadcrumbPage>{displayTitle}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              ) : isDashboard ? (
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link to="/listing">Listing</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                      <Slash />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                      <BreadcrumbPage>{displayTitle}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              ) : (
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link to="/">Home</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                      <Slash />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link
                          to={
                            location.pathname.includes('/buy')
                              ? '/buy'
                              : location.pathname.includes('/rent')
                                ? '/for-rent'
                                : '/for-sale'
                          }
                        >
                          {location.pathname.includes('/buy')
                            ? 'Buy'
                            : location.pathname.includes('/for-rent')
                              ? 'Rent'
                              : 'Sell'}
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                      <Slash />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                      <BreadcrumbPage>{displayTitle}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              )}
            </div>

            <h1 className="text-[26px] leading-10 font-semibold text-[#1A2258]">{displayTitle}</h1>
          </div>

          <div className="flex items-start justify-end self-stretch">
            <div className="flex w-full items-center justify-between gap-2 self-stretch lg:justify-start">
              {!isAdminListing && (
                <>
                  <Button variant="ghost" className="text-[14px] leading-[21px] font-semibold text-[#1A2258]">
                    <Heart className="mr-2 size-4" />
                    Save to Favourites
                  </Button>

                  <Button variant="ghost" className="text-[14px] leading-[21px] font-semibold text-[#1A2258]">
                    <Share2 className="mr-2 size-4" />
                    Share
                  </Button>
                </>
              )}

              {isAdminListing && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => flagProperty(property.id)} disabled={isFlagging}>
                      {isFlagging ? 'Flagging...' : 'Flag Property'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleRevokeVerification} disabled={isRevoking}>
                      {isRevoking ? 'Revoking...' : 'Revoke Verification'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparatorAction />
                    <DropdownMenuItem
                      onClick={() => handleBlacklist()}
                      disabled={isBlacklisting}
                      className="text-red-600"
                    >
                      {isBlacklisting ? 'Blacklisting...' : 'Blacklist Owner'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparatorAction />
                    <DropdownMenuItem onClick={handleDelete} disabled={isDeleting} className="text-red-600">
                      {isDeleting ? 'Deleting...' : 'Delete Property'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </header>

        <div className="flex w-full flex-col gap-6 lg:flex-row">
          {/* Property Gallery */}
          <div className="flex flex-1 flex-col gap-11">
            <div className="relative flex flex-col gap-[19px]">
              {/* Main Image */}
              <div className="relative h-[500px] w-full overflow-hidden">
                <img
                  src={images[currentImageIndex] || '/placeholder.svg'}
                  alt="Property image"
                  className="h-full w-full object-cover"
                />

                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white"
                >
                  <ChevronRight className="size-5" />
                </button>

                {/* Download and Counter */}
                <div className="absolute right-2 bottom-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-[31px] rounded-[100px] bg-white p-[15px] py-1 text-[14px] leading-[21px] font-normal text-[#1A2258]"
                  >
                    <Download className="size-4" />
                    Download
                  </Button>
                  <div className="flex h-[31px] items-center justify-center gap-[3px] rounded-[100px] bg-white px-[15px] py-[4px] text-[14px] leading-[21px] font-semibold text-[#1A2258]">
                    <Images className="size-4" /> {currentImageIndex + 1}/{images.length}
                  </div>
                </div>

                {/* For Sale Badge */}
                <div className="absolute top-4 right-2">
                  <Heart className="size-6 fill-white text-white" />
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-4 overflow-x-auto">
                {images.slice(0, 5).map((image: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`size-[135.2px] shrink-0 overflow-hidden border-2 ${
                      currentImageIndex === index ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image || '/placeholder.svg'}
                      alt={`Thumbnail ${index + 1}`}
                      width={135.2}
                      height={135.2}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* seperation */}
            <div className="flex w-full flex-col gap-11">
              <div className="flex flex-col items-start gap-3 self-stretch border-b border-[#EAEBF0] pb-[21px]">
                <div className="flex items-center gap-3">
                  <Badge className="h-[25px] rounded border border-[oklch(0.5931_0_0/30%)] bg-white px-2 py-0.5 text-[14px] leading-[21px] font-normal text-[#0B0B0D]">
                    <div className="size-1.5 rounded-full bg-[#D20832]" /> {property.category}
                  </Badge>

                  <Badge className="h-[25px] rounded border border-[oklch(0.5931_0_0/30%)] bg-white px-2 py-0.5 text-[14px] leading-[21px] font-normal text-[#0B0B0D]">
                    {property.property_type}
                  </Badge>
                </div>

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                  <h3 className="font-dm_sans border-r border-[#F1F1F4] pr-5 text-[32px] leading-[42px] font-bold text-black">
                    {formatPrice(property.price, property.currency)}
                  </h3>

                  {/* Property Icons */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2.5 text-[18px] leading-[21px]">
                      <BedDouble className="text-primary size-6" />
                      <span className="text-black">{property.bedrooms} Beds</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-[18px] leading-[21px]">
                      <ShowerHead className="text-primary size-6" />
                      <span className="text-black">{property.bathrooms} Baths</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-[18px] leading-[21px]">
                      <Square className="text-primary size-6" />
                      <span className="text-black">{property.area_sqft.toLocaleString()} sq ft</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* propery details */}
              <div className="flex flex-col gap-10 self-start rounded-[10px] bg-white">
                <h2 className="text-[28px] leading-[34px] font-semibold tracking-[-0.5px] text-[#15181E]">
                  Property Details
                </h2>

                <div className="space-y-4 text-[16px] leading-7 text-[#4D5462]">
                  <p className="">{property.desc}</p>

                  <p>Price: {formatPrice(property.price, property.currency)}</p>
                  <div className={cn('flex flex-col gap-2', !showFullDescription && 'bg-white mask-b-from-1')}>
                    {property.features && property.features.length > 0 && (
                      <>
                        <p className="font-semibold">Features include:</p>
                        <ul className="list-disc space-y-1 pl-5 transition-all duration-300 ease-in-out">
                          {property.features
                            .slice(0, showFullDescription ? property.features.length : 2)
                            .map((feature: string) => (
                              <li key={feature}>{feature}</li>
                            ))}
                        </ul>
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-center">
                    <Button
                      variant="secondary"
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="h-10 rounded-[40px] bg-[#F1F1F4] p-4 text-[14px] leading-[17px] font-semibold text-[#41415A]"
                    >
                      {showFullDescription ? 'Show Less' : 'Show More'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-11">
              <div className="flex flex-col items-start gap-10 rounded-[10px] bg-white">
                <div className="flex flex-col items-start gap-6">
                  <h2 className="text-[28px] leading-[34px] font-semibold tracking-[-0.5px] text-[#15181E]">
                    Neighborhood
                  </h2>
                  <p className="text-[20px] leading-7 tracking-[-0.5px] text-[#4D5462]">
                    Use interactive map to explore the neighborhood and see how it matches your interests.
                  </p>
                </div>

                <div className="relative h-[385.37px] w-full overflow-hidden rounded-lg bg-gray-100">
                  <img
                    height={385.37}
                    width={894}
                    src={assets.interactiveneigbhoormap}
                    alt="Neighborhood Map"
                    className="h-full w-full object-cover"
                  />

                  {/* Expand Map Button */}
                  <button className="absolute top-4 right-4 rounded bg-white p-2 shadow-md hover:bg-gray-50">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                      />
                    </svg>
                  </button>
                </div>

                <div className="bg-[ flex flex-col gap-3 self-stretch bg-[oklch(0.5477_0.2177_21.48_/_5%)] p-3">
                  <h5 className="text-[12px] leading-[17px] font-semibold text-[#D20832]">Disclaimer</h5>

                  <p className="text-[12px] leading-[17px] text-[#41415A]">
                    Geoplox works to verify all property listings on our platform; this listing is provided and
                    maintained by (e.g., Efficacy Construction). Users are strongly advised to conduct independent due
                    diligence before making any transaction. Geoplox has no personal interest in the properties listed
                    and does not act as a broker or intermediary. Geoplox shall not in any way be held liable for the
                    actions of any property owner and developers on or off this website */
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Agent Contact Card */}
          <div className="flex flex-col items-end">
            <div className="flex w-[325px] shrink-0 flex-col items-start gap-5 self-stretch rounded-[5px] border border-[#E5E5E5] p-4">
              <div className="flex w-full items-center gap-4 border-b border-[#F1F1F4] pb-5">
                <Avatar className="size-[68px] rounded-[5px]">
                  <AvatarImage src={property?.owner?.image_url} alt={property.owner.name} />
                  <AvatarFallback>{property.owner.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex flex-col items-start gap-2 self-stretch">
                  <h4 className="text-[16px] leading-[19px] font-semibold text-[#1F2130]">{property.owner.name}</h4>
                  <div className="flex items-center gap-2">
                    {property.is_verified && <BadgeCheck className="text-primary size-4" />}
                    <span className="text-primary text-[12px] leading-[18px] font-semibold capitalize">
                      Verified {property.owner.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 self-stretch">
                <Button
                  onClick={() => setContactDialogOpen(true)}
                  style={{
                    background: 'linear-gradient(180deg, #D4AF36 0%, #B69118 60%)',
                    boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
                  }}
                  className="h-8 self-stretch rounded-[40px] border-[oklch(0.7665_0.1393_91.15/50%)] p-4 text-[14px] leading-[17px] font-semibold text-white"
                >
                  Contact <Lock className="size-3" />
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-8 self-stretch rounded-[40px] border border-[#E3E3E8] px-4 py-[15px] text-[14px] leading-4 font-normal text-[#1F2130]"
                >
                  <a href={`mailto:${property.owner.email_address}`}>
                    Email <img src={assets.gmail} alt="" className="size-4" width={16} height={16} />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-8 self-stretch rounded-[40px] border border-[#E3E3E8] px-4 py-[15px] text-[14px] leading-4 font-normal text-[#1F2130]"
                >
                  <a href={`https://wa.me/${property.owner.phone_number}`} target="_blank" rel="noopener noreferrer">
                    Whatsapp <img src={assets.whatsapp} alt="" className="size-4" width={16} height={16} />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
        {!(isDashboard || isAdminListing) && relatedProperties.length > 0 && (
          <div className="flex flex-col items-start gap-10">
            <h4 className="text-[28px] leading-[34px] font-semibold tracking-[-0.5px] text-[#15181E]">
              Recommended Properties
            </h4>

            <div className="grid w-full grid-cols-1 gap-x-5 gap-y-10 self-stretch md:grid-cols-2 lg:grid-cols-3">
              {isLoadingRelated
                ? Array.from({ length: 3 }).map((_, index) => <PropertyListingCardSkeleton key={index} />)
                : relatedProperties.slice(0, 3).map((property: any) => (
                    <Link
                      to={`/buy/$id`}
                      params={{ id: property.slug }}
                      key={property.id}
                      className="flex flex-col items-start gap-6 overflow-hidden"
                    >
                      <div className="relative">
                        <img
                          src={property.cover_image || '/placeholder.png'}
                          alt="Property"
                          width={397}
                          height={284}
                          className="h-[284.42px] w-full object-cover"
                        />

                        {property?.tags?.slice(0, 1)?.map((tag: string) => (
                          <Badge
                            key={tag}
                            className={cn(
                              'absolute top-4 left-4 h-[25px] rounded border border-[oklch(0.5931_0_0/30%)] bg-white px-2 py-0.5 text-[14px] leading-[21px] font-normal text-[#0B0B0D] capitalize'
                            )}
                          >
                            {' '}
                            <div
                              className={cn(
                                'size-1.5 rounded-full',
                                property.category === 'For Sale' && 'bg-[#D20832]',
                                property.category === 'For Rent' && 'bg-[#0CBA65]',
                                property.category === 'Short Let' && 'bg-[#1893DD]'
                              )}
                            />
                            {tag}
                          </Badge>
                        ))}

                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-4 right-4 bg-transparent hover:bg-transparent"
                        >
                          <Heart className="size-6 text-white" />
                        </Button>
                      </div>
                      <div className="flex flex-col items-start gap-3">
                        <h4 className="font-dm_sans text-[24px] leading-[31px] font-semibold text-[#1F2130]">
                          {formatPrice(property.price, property.currency)}
                        </h4>
                        <div className="flex flex-col items-start gap-[11px] self-stretch">
                          <p className="text-[16px] leading-[18px] text-[#41415A]">
                            {property.location.city}, {property.location.state}
                          </p>

                          <div className="flex items-end gap-3 self-stretch">
                            <div className="flex items-center gap-5 text-[14px] leading-4 text-[#41415A]">
                              <div className="flex items-center gap-2">
                                <BedDouble className="size-[18px] text-[#1F2130]" />
                                <span>{property.bedrooms} Beds</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <ShowerHead className="size-[18px] text-[#1F2130]" />
                                <span>{property.bathrooms} Baths</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Square className="size-[18px] text-[#1F2130]" />
                                <span>{property.area_sqft.toLocaleString()} sqft</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
            </div>

            <div className="flex w-full items-center justify-center">
              <Button
                variant="secondary"
                className="h-12 rounded-[40px] bg-[#F9F9F9] px-6 py-[15px] text-[16px] leading-[19xp] font-semibold text-[#1F2130]"
              >
                Explore Listing
                <ChevronRight className="size-4 fill-[#1F2130]" />
              </Button>
            </div>
          </div>
        )}
      </div>
      <ContactOwnerDialog propertyId={property.id} open={isContactDialogOpen} onOpenChange={setContactDialogOpen} />
      {isAdminListing && (
        <DeletePropertyModal
          openDeleteModal={isDeleteModalOpen}
          setOpenDeleteModal={setDeleteModalOpen}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default ListingDetail;