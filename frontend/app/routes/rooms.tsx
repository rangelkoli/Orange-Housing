import ListingsPage from "../components/ListingsPage";

export default function RoomsPage() {
  return (
    <ListingsPage
      title="Rooms for Rent"
      subtitle="Find shared housing and rooms for rent in Syracuse"
      apiEndpoint="/listings/rooms/"
      emptyStateMessage="No room for rent listings are currently available. Check back soon for new opportunities!"
    />
  );
}
