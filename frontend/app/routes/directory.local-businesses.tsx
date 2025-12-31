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
          const mappedData = result.data.map((item: any) => ({
            id: item.id,
            name: item.name || "Unnamed Business",
            description: item.contact_name ? `Contact: ${item.contact_name}` : "Local business helping with housing in Syracuse.",
            address: "Syracuse, NY",
            phone: item.phone,
            email: item.email,
            website: item.url,
            image: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?q=80&w=1000&auto=format&fit=crop",
            category: item.category || "Business"
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
      title="Local Businesses Directory" 
      subtitle="Discover local businesses that can help with your housing needs in Syracuse."
      items={items}
      addListingLink="/directory/local-businesses/add"
      addListingText="Add Your Business Here"
      isPaidListing={true}
      isLoading={isLoading}
    />
  );
}
