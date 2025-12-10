import ListingsPage from "../components/ListingsPage";

export default function SubletsPage() {
  return (
    <ListingsPage
      title="Sublets & Short Term"
      subtitle="Short-term rentals and sublet opportunities in Syracuse"
      apiEndpoint="/listings/sublets/"
      emptyStateMessage="No sublet listings are currently available. Check back soon for new opportunities!"
    />
  );
}
