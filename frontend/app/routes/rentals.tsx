import ListingsPage from "../components/ListingsPage";

export default function RentalsPage() {
  return (
    <ListingsPage
      title="Rentals"
      subtitle="Long-term rental properties available in Syracuse"
      apiEndpoint="/listings/rentals/"
      emptyStateMessage="No rental listings are currently available. Check back soon for new properties!"
    />
  );
}
