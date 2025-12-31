import { useSearchParams } from "react-router";
import ListingsPage from "../components/ListingsPage";

// Configuration for different listing types
const LISTING_TYPE_CONFIG: Record<string, {
  title: string;
  subtitle: string;
  apiEndpoint: string;
  emptyStateMessage: string;
}> = {
  all: {
    title: "All Listings",
    subtitle: "Browse all available properties in Syracuse",
    apiEndpoint: "/listings/",
    emptyStateMessage: "No listings are currently available. Check back soon for new properties!",
  },
  rentals: {
    title: "Rentals",
    subtitle: "Long-term rental properties available in Syracuse",
    apiEndpoint: "/listings/rentals/",
    emptyStateMessage: "No rental listings are currently available. Check back soon for new properties!",
  },
  sublets: {
    title: "Sublets & Short Term",
    subtitle: "Short-term rentals and sublet opportunities in Syracuse",
    apiEndpoint: "/listings/sublets/",
    emptyStateMessage: "No sublet listings are currently available. Check back soon for new opportunities!",
  },
  rooms: {
    title: "Rooms for Rent",
    subtitle: "Find rooms for rent in Syracuse",
    apiEndpoint: "/listings/rooms/",
    emptyStateMessage: "No room for rent listings are currently available. Check back soon for new opportunities!",
  },
  "short-term": {
    title: "Short-Term Rentals",
    subtitle: "Find short-term rental options in Syracuse",
    apiEndpoint: "/listings/short-term/",
    emptyStateMessage: "No short-term rental listings are currently available. Check back soon for new opportunities!",
  },
};

export default function AllListingsPage() {
  const [searchParams] = useSearchParams();
  const listingType = searchParams.get("type") || "all";
  
  // Get config for the current type, fallback to "all" if invalid
  const config = LISTING_TYPE_CONFIG[listingType] || LISTING_TYPE_CONFIG.all;

  return (
    <ListingsPage
      title={config.title}
      subtitle={config.subtitle}
      apiEndpoint={config.apiEndpoint}
      emptyStateMessage={config.emptyStateMessage}
    />
  );
}
