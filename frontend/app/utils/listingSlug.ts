import type { Listing } from "../types/listing";

/**
 * Generates an SEO-friendly slug for a listing
 * Format: {location}-{bedrooms}bed-{listingId}
 * Example: university-hill-3bed-123
 */
export function generateListingSlug(listing: Listing): string {
    // Extract location from city or use default
    const location = listing.location || listing.city?.split(',')[0] || 'syracuse';

    // Sanitize the location string for URL
    const sanitizedLocation = location
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')         // Replace spaces with hyphens
        .replace(/-+/g, '-')          // Remove consecutive hyphens
        .trim();

    const beds = listing.beds || 0;

    return `${sanitizedLocation}-${beds}bed-${listing.id}`;
}

/**
 * Extracts the listing ID from a slug
 * @param slug The URL slug (e.g., "university-hill-3bed-123")
 * @returns The listing ID
 */
export function extractIdFromSlug(slug: string): string | null {
    // The ID is always the last part after the last hyphen
    const match = slug.match(/-(\d+)$/);
    return match ? match[1] : null;
}

/**
 * Get the route prefix based on listing type code
 * @param typeCode The listing type code (1=rentals, 2=sublets, 3=rooms)
 * @returns The route prefix
 */
export function getListingTypeRoute(typeCode?: number): string {
    switch (typeCode) {
        case 1:
            return 'rentals';
        case 2:
            return 'sublets';
        case 3:
            return 'rooms';
        default:
            return 'rentals'; // Default to rentals
    }
}

/**
 * Generates the full URL path for a listing detail page
 * @param listing The listing object
 * @returns The full URL path (e.g., "/rentals/university-hill-3bed-123")
 */
export function getListingDetailUrl(listing: Listing): string {
    const typeRoute = getListingTypeRoute(listing.typeCode);
    const slug = generateListingSlug(listing);
    return `/${typeRoute}/${slug}`;
}
