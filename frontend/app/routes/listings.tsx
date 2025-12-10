import ListingsPage from "../components/ListingsPage";

export default function AllListingsPage() {
  return (
    <ListingsPage
      title="All Listings"
      subtitle="Browse all available properties in Syracuse"
      apiEndpoint="/listings/"
      emptyStateMessage="No listings are currently available. Check back soon for new properties!"
    />
  );
}
