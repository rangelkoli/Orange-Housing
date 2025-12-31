import { DirectoryPage, type DirectoryItem } from "../components/DirectoryPage";

import { useState, useEffect } from "react";

export default function PropertyManagersDirectoryPage() {
  const [items, setItems] = useState<DirectoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await fetch("http://localhost:8000/directory/managers/");
        const result = await response.json();
        if (result.success) {
          const mappedData = result.data.map((item: any) => ({
            id: item.id,
            name: item.name || "Unnamed Manager",
            description: item.contact_name ? `Contact: ${item.contact_name}` : "Professional property management in Syracuse.",
            address: "Syracuse, NY",
            phone: item.phone,
            email: item.email,
            website: item.url,
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop",
            category: item.category || "Manager"
          }));
          setItems(mappedData);
        }
      } catch (error) {
        console.error("Error fetching managers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchManagers();
  }, []);

  return (
    <DirectoryPage 
      title="Property Managers Directory" 
      subtitle="Find professional property management services in the Syracuse area."
      items={items}
      addListingLink="/directory/property-managers/add"
      addListingText="Add Your Property Management Company Here"
      isPaidListing={true}
      isLoading={isLoading}
    />
  );
}
