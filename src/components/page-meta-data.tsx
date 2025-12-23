import assets from '@/assets';

/**
 * Generate image source with fallback and type handling
 * @param {string | File | undefined} imageData - Image source to process
 * @returns {string} Processed image source
 */
function getImageSource(imageData: string | File | undefined) {
  // If imageData is undefined or null, use default logo
  if (!imageData) return '/logo.svg';

  // If it's already a string (like a URL or base64), return as-is
  if (typeof imageData === 'string') return imageData;

  // If it's a File object, create a URL for it
  if (imageData instanceof File) {
    return URL.createObjectURL(imageData);
  }

  // Fallback to default logo if nothing matches
  return '/logo.svg';
}

interface MetaInfoOptions {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string | File;
  price?: string;
  location?: string;
  propertyType?: string;
  listingType?: 'buy' | 'rent' | 'sell';
}

function generateMetaInfo(options: MetaInfoOptions = {}) {
  // Default site-wide information
  const defaults = {
    siteName: 'Geoplox',
    baseTitle: 'Geoplox - Real Estate Done Right',
    baseDescription:
      'Find your perfect home or investment property. Buy, for-sale, and for-rent properties with direct access to listings from real owners and developers. No fake agents, no hidden fees.',
    baseKeywords:
      'real estate, property, buy house, for-rent apartment, for-sale property, homes for sale, rental properties, real estate listings, property investment, residential, commercial',
    baseImage: assets.logotext || '/logo.svg',
  };

  // Generate dynamic content based on listing type and property details
  const generateDynamicTitle = () => {
    if (options.title) {
      return `${options.title} | ${defaults.siteName}`;
    }

    let dynamicTitle = defaults.siteName;

    if (options.propertyType && options.location) {
      const action =
        options.listingType === 'rent' ? 'for Rent' : options.listingType === 'sell' ? 'for Sale' : 'Available';
      dynamicTitle = `${options.propertyType} ${action} in ${options.location} | ${defaults.siteName}`;
    } else if (options.listingType) {
      const action =
        options.listingType === 'rent'
          ? 'Properties for Rent'
          : options.listingType === 'sell'
            ? 'Properties for Sale'
            : options.listingType === 'buy'
              ? 'Properties to Buy'
              : 'Properties';
      dynamicTitle = `${action} | ${defaults.siteName}`;
    }

    return dynamicTitle;
  };

  const generateDynamicDescription = () => {
    if (options.description) {
      return options.description;
    }

    let dynamicDesc = defaults.baseDescription;

    if (options.propertyType && options.location && options.price) {
      const action = options.listingType === 'rent' ? 'rent' : 'buy';
      dynamicDesc = `${options.propertyType} available to ${action} in ${options.location} for ${options.price}. Direct access to property listings from real owners and developers. No fake agents, no hidden fees.`;
    } else if (options.listingType) {
      const actions = {
        buy: 'Discover your dream home with our extensive collection of properties for sale.',
        rent: 'Find the perfect rental property that suits your lifestyle and budget.',
        sell: 'List your property and connect directly with potential buyers.',
      };
      dynamicDesc = `${actions[options.listingType]} ${defaults.baseDescription}`;
    }

    return dynamicDesc;
  };

  const generateDynamicKeywords = () => {
    const keywords = [defaults.baseKeywords];

    if (options.keywords) {
      keywords.unshift(options.keywords);
    }

    // Add location-specific keywords
    if (options.location) {
      keywords.push(`${options.location} real estate, properties in ${options.location}, ${options.location} homes`);
    }

    // Add property type keywords
    if (options.propertyType) {
      keywords.push(`${options.propertyType}, ${options.propertyType} for sale, ${options.propertyType} for rent`);
    }

    // Add listing type keywords
    if (options.listingType) {
      const typeKeywords = {
        buy: 'homes for sale, buy property, purchase real estate, property investment',
        rent: 'rental properties, apartments for for-rent, house rental, lease property',
        sell: 'for-sale property, list property, property listing, real estate agent',
      };
      keywords.push(typeKeywords[options.listingType]);
    }

    return keywords.join(', ');
  };

  // Merge provided options with defaults
  const meta = {
    title: generateDynamicTitle(),
    description: generateDynamicDescription(),
    keywords: generateDynamicKeywords(),
    image: getImageSource(options.image || defaults.baseImage),
  };

  return {
    // Standard Meta Tags
    getMetaTitle: () => meta.title,
    getMetaDescription: () => meta.description,
    getMetaKeywords: () => meta.keywords,

    // Open Graph Meta Tags
    getOgTitle: () => meta.title,
    getOgDescription: () => meta.description,
    getOgImage: () => meta.image,
    getOgUrl: () => window.location.href,
    getOgType: () => 'website',
    getOgSiteName: () => defaults.siteName,

    // Twitter Card Meta Tags
    getTwitterTitle: () => meta.title,
    getTwitterDescription: () => meta.description,
    getTwitterImage: () => meta.image,
    getTwitterCard: () => 'summary_large_image',

    // Real Estate Specific Meta Tags
    getPropertyPrice: () => options.price,
    getPropertyLocation: () => options.location,
    getPropertyType: () => options.propertyType,
    getListingType: () => options.listingType,
  };
}

interface PageMetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string | File;
  price?: string;
  location?: string;
  propertyType?: string;
  listingType?: 'buy' | 'rent' | 'sell';
}

export function PageMetaTags({
  title,
  description,
  keywords,
  image,
  price,
  location,
  propertyType,
  listingType,
}: PageMetaTagsProps) {
  const {
    getMetaTitle,
    getMetaDescription,
    getMetaKeywords,
    getOgTitle,
    getOgDescription,
    getOgImage,
    getOgUrl,
    getOgType,
    getOgSiteName,
    getTwitterTitle,
    getTwitterDescription,
    getTwitterImage,
    getTwitterCard,
    getPropertyPrice,
    getPropertyLocation,
    getPropertyType,
    getListingType,
  } = generateMetaInfo({
    title,
    description,
    keywords,
    image,
    price,
    location,
    propertyType,
    listingType,
  });

  return (
    <>
      <title>{getMetaTitle()}</title>
      <meta name="description" content={getMetaDescription()} />
      <meta name="keywords" content={getMetaKeywords()} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={getOgTitle()} />
      <meta property="og:description" content={getOgDescription()} />
      <meta property="og:image" content={getOgImage()} />
      <meta property="og:url" content={getOgUrl()} />
      <meta property="og:type" content={getOgType()} />
      <meta property="og:site_name" content={getOgSiteName()} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={getTwitterCard()} />
      <meta name="twitter:title" content={getTwitterTitle()} />
      <meta name="twitter:description" content={getTwitterDescription()} />
      <meta name="twitter:image" content={getTwitterImage()} />

      {/* Real Estate Specific Meta Tags */}
      {getPropertyPrice() && <meta name="property:price" content={getPropertyPrice()!} />}
      {getPropertyLocation() && <meta name="property:location" content={getPropertyLocation()!} />}
      {getPropertyType() && <meta name="property:type" content={getPropertyType()!} />}
      {getListingType() && <meta name="listing:type" content={getListingType()!} />}

      {/* Additional SEO Meta Tags for Real Estate */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Geoplox" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Schema.org structured data would go in a separate script tag */}
    </>
  );
}

// Usage Examples:
/*
// For a property listing page
<PageMetaTags
  title="Beautiful 3BR Apartment"
  description="Spacious 3-bedroom apartment with modern amenities in prime location"
  price="$2,500/month"
  location="Downtown Miami"
  propertyType="Apartment"
  listingType="for-rent"
  image="/property-images/apartment-1.jpg"
/>

// For a general buy page
<PageMetaTags
  title="Properties for Sale"
  listingType="buy"
  keywords="homes for sale, real estate investment, property purchase"
/>

// For a location-specific page
<PageMetaTags
  title="Real Estate in Lagos"
  location="Lagos"
  description="Find the best properties for sale and for-rent in Lagos"
/>
*/
