import ListingsPage from "../components/ListingsPage";

export default function ShortTermPage() {
  return (
    <ListingsPage
      title="Short-Term Rentals"
      subtitle="Find short-term rental options in Syracuse"
      apiEndpoint="/listings/short-term/"
      emptyStateMessage="No short-term rental listings are currently available. Check back soon for new opportunities!"
    />
  );
}
