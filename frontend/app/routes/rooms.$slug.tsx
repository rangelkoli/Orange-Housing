import { useParams } from "react-router";
import ListingDetailPage from "../components/ListingDetailPage";
import { extractIdFromSlug } from "../utils/listingSlug";

export default function RoomDetailPage() {
  const { slug } = useParams();
  const listingId = extractIdFromSlug(slug || '') || slug || '';

  return (
    <ListingDetailPage
      listingId={listingId}
      listingType="rooms"
      backLink="/listings?type=rooms"
      backLinkText="Rooms for Rent"
    />
  );
}
