import { useParams } from "react-router";
import ListingDetailPage from "../components/ListingDetailPage";
import { extractIdFromSlug } from "../utils/listingSlug";

export default function RentalDetailPage() {
  const { slug } = useParams();
  const listingId = extractIdFromSlug(slug || '') || slug || '';

  return (
    <ListingDetailPage
      listingId={listingId}
      listingType="rentals"
      backLink="/listings?type=rentals"
      backLinkText="Rentals"
    />
  );
}
