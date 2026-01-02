import { DirectoryPage, type DirectoryItem } from "../components/DirectoryPage";
import { useState, useEffect } from "react";

export default function LocalBusinessesDirectoryPage() {
  const [items, setItems] = useState<DirectoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fetch("http://localhost:8000/directory/businesses/");
        const result = await response.json();
        if (result.success) {
          const mappedData = result.data.map((item: any, index: number) => ({
            id: item.id,
            name: item.name || "Unnamed Business",
            description: item.contact_name 
              ? `Authorized Partner • Contact: ${item.contact_name}` 
              : "Trusted local business providing essential housing services to the Syracuse community.",
            address: "Syracuse, NY",
            phone: item.phone,
            email: item.email,
            website: item.url,
            // Removed image to comply with user request
            category: item.category || "Local Business"
          }));
          setItems(mappedData);
        }
      } catch (error) {
        console.error("Error fetching businesses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  return (
    <DirectoryPage 
      title="Local Business Partners" 
      subtitle="Connect with trusted local businesses and service providers recommended for the Syracuse University community."
      items={items}
      addListingLink="/directory/local-businesses/add"
      addListingText="Partner With Us"
      searchPlaceholder="Search local businesses..."
      isPaidListing={true}
      isLoading={isLoading}
    />
  );
}
