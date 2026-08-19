/**
 * SEO URL grammar for listing/search pages:
 *   domain / category / type / sub-type / in / state / city / area / bedrooms
 *
 * Two rules make this work: an unused segment is dropped entirely (never blank/placeholder),
 * and segments never reorder - which is also what makes this parseable positionally without
 * needing a live location-taxonomy lookup at parse time (state/city/area always appear in that
 * order right after "in", bedrooms is always last).
 *
 * Property DETAIL pages (an individual listing) are a separate, already-working URL scheme
 * and are untouched here - this module is only for the search/listing pages.
 */

export type ListingCategorySlug =
  | "property-for-sale"
  | "property-for-rent"
  | "property-for-short-let"
  | "joint-venture";

// Grammar category slug -> the category slug already used by the backend/categories table
// and the app's existing (pre-grammar) route prefixes.
export const CATEGORY_SLUG_MAP: Record<ListingCategorySlug, string> = {
  "property-for-sale": "for-sale",
  "property-for-rent": "for-rent",
  "property-for-short-let": "short-let",
  "joint-venture": "joint-venture",
};

export const BACKEND_TO_GRAMMAR_CATEGORY: Record<string, ListingCategorySlug> = {
  "for-sale": "property-for-sale",
  "for-rent": "property-for-rent",
  "short-let": "property-for-short-let",
  "joint-venture": "joint-venture",
};

export const LISTING_CATEGORY_SLUGS: ListingCategorySlug[] = [
  "property-for-sale",
  "property-for-rent",
  "property-for-short-let",
  "joint-venture",
];

// Backend property_type value <-> grammar slug. Uses an explicit map rather than a generic
// slugifier because the backend's stored value has a typo ("Comercial Property") that must not
// leak into the URL - the grammar spec's slug is spelled correctly.
const TYPE_TO_SLUG: Record<string, string> = {
  "Flat/Apartment": "flat-apartment",
  House: "house",
  Land: "land",
  "Comercial Property": "commercial-property",
};
const SLUG_TO_TYPE: Record<string, string> = Object.fromEntries(
  Object.entries(TYPE_TO_SLUG).map(([label, slug]) => [slug, label]),
);

// Backend sub-type value <-> grammar slug. Covers every sub-type in src/data/reuseable.ts, not
// just the ones explicitly enumerated in the grammar spec (which didn't anticipate every
// app-specific sub-type, e.g. "Church"/"School") - extended consistently with the same
// kebab-case pattern the spec uses for the ones it does list.
const SUBTYPE_TO_SLUG: Record<string, string> = {
  Miniflat: "mini-flat",
  "Studio / Self Contain": "self-contain",
  "Detached Bungalow": "detached-bungalow",
  "Detached Duplex": "detached-duplex",
  "Semi-Detached Bungalow": "semi-detached-bungalow",
  "Semi-Detached Duplex": "semi-detached-duplex",
  "Terraced Duplex": "terraced-duplex",
  "Terraced Bungalow": "terraced-bungalow",
  "Commercial Land": "commercial-land",
  "Residential Land": "residential-land",
  "Mixed-use Land": "mixed-use-land",
  "Industrial Land": "industrial-land",
  Church: "church",
  Factory: "factory",
  "Filling Station": "filling-station",
  Warehouse: "warehouse",
  "Event center": "event-center",
  "Office Space": "office-space",
  "Hotel / Guest House": "hotel-guest-house",
  "Restaurant / Bar": "restaurant-bar",
  School: "school",
  Shop: "shop",
  "Tank Farm": "tank-farm",
  "Open Space": "open-space",
  "Plaza / Complex / Mall": "plaza-complex-mall",
};
const SLUG_TO_SUBTYPE: Record<string, string> = Object.fromEntries(
  Object.entries(SUBTYPE_TO_SLUG).map(([label, slug]) => [slug, label]),
);

export const CATEGORY_META: Record<
  ListingCategorySlug,
  { noun: string; title: string; description: string; keywords: string }
> = {
  "property-for-sale": {
    noun: "for Sale",
    title: "Properties for Sale in Nigeria",
    description:
      "Browse verified properties for sale across Nigeria - houses, flats, land and commercial property with confirmed title.",
    keywords: "properties for sale, houses for sale Nigeria, land for sale, buy property",
  },
  "property-for-rent": {
    noun: "for Rent",
    title: "Properties for Rent in Nigeria",
    description:
      "Discover rental properties across Nigeria. From apartments to houses, find your perfect rental home.",
    keywords: "rental properties, apartments for rent, house rental, lease property",
  },
  "property-for-short-let": {
    noun: "Short Let",
    title: "Short Let Apartments in Nigeria",
    description:
      "Find fully furnished short let apartments and homes across Nigeria, verified and ready for immediate stay.",
    keywords: "short let Nigeria, furnished apartments, short stay rental, serviced apartment",
  },
  "joint-venture": {
    noun: "Joint Venture",
    title: "Joint Venture Property Opportunities in Nigeria",
    description:
      "Explore joint venture property opportunities across Nigeria - partner with landowners and developers to maximize your investment.",
    keywords: "joint venture property Nigeria, land partnership, JV real estate, development partnership",
  },
};

const locationSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export interface ListingUrlParams {
  category: ListingCategorySlug;
  propertyType?: string; // backend value, e.g. "House"
  propertySubType?: string; // backend value
  state?: string;
  city?: string;
  area?: string;
  bedrooms?: number;
}

export interface ParsedListingUrl {
  category: ListingCategorySlug;
  backendCategorySlug: string;
  propertyType?: string;
  propertySubType?: string;
  state?: string;
  city?: string;
  area?: string;
  bedrooms?: number;
}

const BEDROOM_PATTERN = /^(\d+)-bedroom$/;

/** Builds a grammar-compliant path from filter values. Unused segments are simply omitted. */
export function buildListingUrl(params: ListingUrlParams): string {
  const segments: string[] = [`/${params.category}`];

  if (params.propertyType && TYPE_TO_SLUG[params.propertyType]) {
    segments.push(TYPE_TO_SLUG[params.propertyType]);
    if (params.propertySubType && SUBTYPE_TO_SLUG[params.propertySubType]) {
      segments.push(SUBTYPE_TO_SLUG[params.propertySubType]);
    }
  }

  if (params.state) {
    segments.push("in", locationSlug(params.state));
    if (params.city) {
      segments.push(locationSlug(params.city));
      if (params.area) {
        segments.push(locationSlug(params.area));
      }
    }
  }

  if (params.bedrooms) {
    segments.push(`${params.bedrooms}-bedroom`);
  }

  return segments.join("/");
}

/**
 * Parses the segments after the category (the router's splat) back into filter values.
 * `stateBySlug`/`cityBySlug`/`areaBySlug` resolve a location slug back to its real display
 * name (case/hyphenation as stored) - pass lookups built from the locations API tree; when
 * omitted the slug itself (title-cased) is used as a best-effort fallback.
 */
export function parseListingUrl(
  category: ListingCategorySlug,
  splat: string | undefined,
  lookup?: {
    resolveState?: (slug: string) => string | undefined;
    resolveCity?: (stateSlug: string, citySlug: string) => string | undefined;
    resolveArea?: (stateSlug: string, citySlug: string, areaSlug: string) => string | undefined;
  },
): ParsedListingUrl {
  const segments = (splat ?? "").split("/").filter(Boolean);
  const result: ParsedListingUrl = {
    category,
    backendCategorySlug: CATEGORY_SLUG_MAP[category],
  };

  let i = 0;

  if (segments[i] && segments[i] !== "in" && SLUG_TO_TYPE[segments[i]]) {
    result.propertyType = SLUG_TO_TYPE[segments[i]];
    i++;
    if (segments[i] && segments[i] !== "in" && SLUG_TO_SUBTYPE[segments[i]]) {
      result.propertySubType = SLUG_TO_SUBTYPE[segments[i]];
      i++;
    }
  }

  if (segments[i] === "in") {
    i++;
    const stateSlug = segments[i];
    if (stateSlug && !BEDROOM_PATTERN.test(stateSlug)) {
      result.state = lookup?.resolveState?.(stateSlug) ?? titleCaseSlug(stateSlug);
      i++;

      const citySlug = segments[i];
      if (citySlug && !BEDROOM_PATTERN.test(citySlug)) {
        result.city = lookup?.resolveCity?.(stateSlug, citySlug) ?? titleCaseSlug(citySlug);
        i++;

        const areaSlug = segments[i];
        if (areaSlug && !BEDROOM_PATTERN.test(areaSlug)) {
          result.area =
            lookup?.resolveArea?.(stateSlug, citySlug, areaSlug) ?? titleCaseSlug(areaSlug);
          i++;
        }
      }
    }
  }

  const bedroomMatch = segments[i]?.match(BEDROOM_PATTERN);
  if (bedroomMatch) {
    result.bedrooms = parseInt(bedroomMatch[1], 10);
  }

  return result;
}

function titleCaseSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
