import { useParams } from "react-router";
import ListingDetailPage from "../components/ListingDetailPage";
import { extractIdFromSlug } from "../utils/listingSlug";

export default function SubletDetailPage() {
  const { slug } = useParams();
  const listingId = extractIdFromSlug(slug || '') || slug || '';

  return (
    <ListingDetailPage
      listingId={listingId}
      listingType="sublets"
      backLink="/sublets"
      backLinkText="Sublets"
    />
  );
}
