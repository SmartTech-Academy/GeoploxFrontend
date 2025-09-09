import {
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
import { cn } from '@/lib/utils';
import { useState } from 'react';
import assets from '@/assets';
import { Link, useLocation } from '@tanstack/react-router';
import { PageMetaTags } from './page-meta-data';

const propertyData = {
  'Trending Homes': [
    {
      id: 1,
      image: assets.trendinghome1,
      price: '₦500,000,000',
      location: 'Ikolabu, GRA Agodi Ibadan Oyo',
      beds: 4,
      baths: 4,
      sqft: '3,000 sq ft',
      status: 'For Sale',
      dotColor: 'bg-[#D20832]',
      statusColor: 'bg-white',
    },
    {
      id: 2,
      image: assets.trendinghome2,
      price: '₦500,000,000',
      location: 'Ikolabu, GRA Agodi Ibadan Oyo',
      beds: 4,
      baths: 4,
      sqft: '3,000 sq ft',
      status: 'For Rent',
      dotColor: 'bg-[#0CBA65]',
    },
    {
      id: 3,
      image: assets.trendinghome3,
      price: '₦500,000,000',
      location: 'Ikolabu, GRA Agodi Ibadan Oyo',
      beds: 4,
      baths: 4,
      sqft: '3,000 sq ft',
      status: 'Shortlet',
      dotColor: 'bg-[#1893DD]',
    },
    {
      id: 4,
      image: assets.trendinghome4,
      price: '₦500,000,000',
      location: 'Ikolabu, GRA Agodi Ibadan Oyo',
      beds: 4,
      baths: 4,
      sqft: '3,000 sq ft',
      status: 'For Sale',
      dotColor: 'bg-[#D20832]',
      statusColor: 'bg-white',
    },
    {
      id: 5,
      image: assets.trendinghome5,
      price: '₦500,000,000',
      location: 'Ikolabu, GRA Agodi Ibadan Oyo',
      beds: 4,
      baths: 4,
      sqft: '3,000 sq ft',
      status: 'For Sale',
      dotColor: 'bg-[#D20832]',
      statusColor: 'bg-white',
    },
    {
      id: 6,
      image: assets.trendinghome6,
      price: '₦500,000,000',
      location: 'Ikolabu, GRA Agodi Ibadan Oyo',
      beds: 4,
      baths: 4,
      sqft: '3,000 sq ft',
      status: 'For Sale',
      dotColor: 'bg-[#D20832]',
      statusColor: 'bg-white',
    },
  ],
  'All Homes': [
    {
      id: 7,
      image: assets.trendinghome4,
      price: '₦750,000,000',
      location: 'Victoria Island, Lagos',
      beds: 5,
      baths: 5,
      sqft: '4,500 sq ft',
      status: 'For Sale',
      dotColor: 'bg-[#D20832]',
      statusColor: 'bg-white',
    },
  ],
  Duplexes: [
    {
      id: 8,
      image: assets.trendinghome2,
      price: '₦400,000,000',
      location: 'Lekki, Lagos',
      beds: 4,
      baths: 3,
      sqft: '2,800 sq ft',
      status: 'For Rent',
      dotColor: 'bg-[#0CBA65]',
    },
  ],
  'Luxury Villas': [
    {
      id: 9,
      image: assets.trendinghome1,
      price: '₦1,200,000,000',
      location: 'Banana Island, Lagos',
      beds: 6,
      baths: 6,
      sqft: '6,000 sq ft',
      status: 'For Sale',
      dotColor: 'bg-[#D20832]',
      statusColor: 'bg-white',
    },
  ],
};

const ListingDetail = () => {
  const location = useLocation();
  const isDashboard = location.pathname.includes('/listing/');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const images = [
    assets.housebackyardwithgarden,
    assets.houseinteriorbedroom,
    assets.houseinteriorbathroom,
    assets.houseinteriorkitchen,
    assets.houseinteriorlivingroom,
    assets.modernhouseexteriorwithgarage,
    assets.houseinteriordiningroom,
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={cn('min-h-screen w-full bg-white', isDashboard ? 'py-8' : 'py-(--landing-header-height)')}>
      {location.pathname.includes('/listing/') ? (
        <PageMetaTags
          title="Listing: Waterfront Apartment"
          description="Manage your waterfront apartment listing - respond to inquiries and update availability."
          keywords="listing management, property inquiries"
        />
      ) : (
        <PageMetaTags
          title="Luxury Villa in Ikoyi"
          description="5-bedroom luxury villa with pool and garden in prime Ikoyi location"
          price="₦85,000,000"
          location="Ikoyi, Lagos"
          propertyType="Villa"
          listingType="buy"
          image="/properties/villa-ikoyi-001.jpg"
          keywords="Ikoyi villa, luxury property Lagos, 5 bedroom house"
        />
      )}

      <div className={cn('w-full', !isDashboard && 'landing-container flex flex-col gap-8 pt-[77px]')}>
        <header className="flex w-full flex-col items-center justify-between lg:flex-row">
          <div className="flex flex-col items-start self-stretch">
            <div className="flex flex-col gap-3 self-stretch py-[15px] lg:flex-row">
              {isDashboard ? (
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link to="/listing">Listing</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />

                    <BreadcrumbItem>
                      <BreadcrumbPage>Property in GRA Agodi</BreadcrumbPage>
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
                    <BreadcrumbSeparator />

                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link
                          to={
                            location.pathname.includes('/buy')
                              ? '/buy'
                              : location.pathname.includes('/rent')
                                ? '/rent'
                                : '/sell'
                          }
                        >
                          {location.pathname.includes('/buy')
                            ? 'Buy'
                            : location.pathname.includes('/rent')
                              ? 'Rent'
                              : 'Sell'}
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Property in GRA Agodi</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              )}
            </div>

            <h1 className="text-[26px] leading-[40px] font-semibold text-[#1A2258]">Ikolaba, GRA Agodi Ibadan Oyo</h1>
          </div>

          <div className="flex items-start justify-end self-stretch">
            <div className="flex w-full items-center justify-between gap-1 self-stretch lg:justify-start">
              <Button variant="ghost" className="text-[14px] leading-[21px] font-semibold text-[#1A2258]">
                <Heart className="size-4" />
                Save to Favourites
              </Button>

              <Button variant="ghost" className="text-[14px] leading-[21px] font-semibold text-[#1A2258]">
                <Share2 className="size-4" />
                Share
              </Button>
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
                    className="h-[31px] rounded-[100px] bg-white p-[15px] py-[5px] text-[14px] leading-[21px] font-normal text-[#1A2258]"
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
                {images.slice(0, 5).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`size-[135.2px] flex-shrink-0 overflow-hidden border-2 ${
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
                  <Badge className="h-[25px] rounded border border-[oklch(0.5931_0_0_/_30%)] bg-white px-2 py-0.5 text-[14px] leading-[21px] font-normal text-[#0B0B0D]">
                    <div className="size-1.5 rounded-full bg-[#D20832]" /> For Sale
                  </Badge>

                  <Badge className="h-[25px] rounded border border-[oklch(0.5931_0_0_/_30%)] bg-white px-2 py-0.5 text-[14px] leading-[21px] font-normal text-[#0B0B0D]">
                    Duplex
                  </Badge>
                </div>

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                  <h3 className="font-dm_sans border-r border-[#F1F1F4] pr-5 text-[32px] leading-[42px] font-bold text-black">
                    ₦500,000,000
                  </h3>

                  {/* Property Icons */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2.5 text-[18px] leading-[21px]">
                      <BedDouble className="text-primary size-6" />
                      <span className="text-black">4 Beds</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-[18px] leading-[21px]">
                      <ShowerHead className="text-primary size-6" />
                      <span className="text-black">4 Baths</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-[18px] leading-[21px]">
                      <Square className="text-primary size-6" />
                      <span className="text-black">3,000 sq ft</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* propery details */}
              <div className="flex flex-col gap-10 self-start rounded-[10px] bg-white">
                <h2 className="text-[28px] leading-[34px] font-semibold tracking-[-0.5px] text-[#15181E]">
                  Property Details
                </h2>

                <div className="space-y-4 text-[20px] leading-[28px] text-[#4D5462]">
                  <p className="">
                    5 Bedroom fully detached house with 2 maid rooms, an elevator, rooftop terraces (front and back), a
                    swimming pool, a cinema/movie theater, etc. Land size: 800 square meters.
                  </p>

                  <p>Price: ₦800 million</p>

                  <p>Located in a beautiful, serene, highly secured estate in the heart of Lekki.</p>

                  <div className={cn('flex flex-col gap-2', !showFullDescription && 'bg-white mask-b-from-1')}>
                    <p>Features include:</p>
                    <ul className="space-y-1 transition-all duration-300 ease-in-out">
                      <li>- Smart house.</li>
                      <li>- 5 Bedrooms (All en-suite).</li>
                      {showFullDescription && (
                        <>
                          <li>- 2 maid rooms/ Boys quarters (BQ)</li>
                          <li>- Ante room/Foyer with a guest toilet - Dedicated dining space</li>
                          <li>- Fully fitted kitchen with island and breakfast bar</li>
                          <li>- Swimming pool with pool house</li>
                          <li>- Cinema/movie theater room</li>
                          <li>- Elevator access to all floors</li>
                          <li>- Rooftop terraces (front and back)</li>
                          <li>- 24/7 security and power supply</li>
                          <li>- Ample parking space for multiple vehicles</li>
                          <li>- Beautiful landscaped gardens</li>
                          <li>- Modern fixtures and fittings throughout</li>
                        </>
                      )}
                    </ul>
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
                  <p className="text-[20px] leading-[28px] tracking-[-0.5px] text-[#4D5462]">
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
                <img src={assets.landlord} alt="Agent" width={68} height={68} className="size-[68px] rounded-[5px]" />

                <div className="flex flex-col items-start gap-2 self-stretch">
                  <h4 className="text-[16px] leading-[19px] font-semibold text-[#1F2130]">Royal Crest Properties</h4>
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="text-primary size-4" />
                    <span className="text-primary text-[12px] leading-[18px] font-semibold">Verified Agent</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 self-stretch">
                <Button
                  style={{
                    background: 'linear-gradient(180deg, #D4AF36 0%, #B69118 60%)',
                    boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
                  }}
                  className="h-8 self-stretch rounded-[40px] border-[oklch(0.7665_0.1393_91.15_/_50%)] p-4 text-[14px] leading-[17px] font-semibold text-white"
                >
                  Contact <Lock className="size-3" />
                </Button>

                <Button
                  variant="outline"
                  className="h-8 self-stretch rounded-[40px] border border-[#E3E3E8] px-4 py-[15px] text-[14px] leading-[16px] font-normal text-[#1F2130]"
                >
                  Email <img src={assets.gmail} alt="" className="size-4" width={16} height={16} />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 self-stretch rounded-[40px] border border-[#E3E3E8] px-4 py-[15px] text-[14px] leading-[16px] font-normal text-[#1F2130]"
                >
                  Whatsapp <img src={assets.whatsapp} alt="" className="size-4" width={16} height={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
        {!isDashboard && (
          <div className="flex flex-col items-start gap-10">
            <h4 className="text-[28px] leading-[34px] font-semibold tracking-[-0.5px] text-[#15181E]">
              Recommended Properties
            </h4>

            <div className="grid w-full grid-cols-1 gap-x-5 gap-y-10 self-stretch md:grid-cols-2 lg:grid-cols-3">
              {propertyData['Trending Homes' as keyof typeof propertyData]?.slice(0, 3).map((property) => (
                <div key={property.id} className="flex flex-col items-start gap-6 overflow-hidden">
                  <div className="relative">
                    <img
                      src={property.image || '/placeholder.png'}
                      alt="Property"
                      width={397}
                      height={284}
                      className="h-[284.42px] w-full object-cover"
                    />

                    <Badge
                      className={cn(
                        'absolute top-4 left-4 h-[25px] rounded border border-[oklch(0.5931_0_0_/_30%)] bg-white px-2 py-0.5 text-[14px] leading-[21px] font-normal text-[#0B0B0D]'
                      )}
                    >
                      <div className={cn('size-1.5 rounded-full', property.dotColor)} />

                      {property.status}
                    </Badge>
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
                      {property.price}
                    </h4>
                    <div className="flex flex-col items-start gap-[11px] self-stretch">
                      <p className="text-[16px] leading-[18px] text-[#41415A]">{property.location}</p>

                      <div className="flex items-end gap-3 self-stretch">
                        <div className="flex items-center gap-5 text-[14px] leading-[16px] text-[#41415A]">
                          <div className="flex items-center gap-2">
                            <BedDouble className="size-[18px] text-[#1F2130]" />
                            <span>{property.beds} Beds</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ShowerHead className="size-[18px] text-[#1F2130]" />
                            <span>{property.baths} Baths</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Square className="size-[18px] text-[#1F2130]" />
                            <span>{property.sqft}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
    </div>
  );
};

export default ListingDetail;
