import { DirectoryPage, type DirectoryItem } from "../components/DirectoryPage";

export default function LocalBusinessesDirectoryPage() {
  const items: DirectoryItem[] = [
    {
      id: 1,
      name: "Syracuse Moving Company",
      description: "Professional moving services for apartments and homes. Local and long-distance moves with careful handling of your belongings.",
      address: "150 Solar St, Syracuse, NY 13204",
      phone: "(315) 555-5001",
      website: "https://example.com",
      image: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?q=80&w=1000&auto=format&fit=crop",
      category: "Moving Services"
    },
    {
      id: 2,
      name: "CNY Home Inspections",
      description: "Certified home inspectors providing thorough inspections for renters and buyers. Know before you sign!",
      address: "300 Erie Blvd, Syracuse, NY 13202",
      phone: "(315) 555-5002",
      website: "https://example.com",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop",
      category: "Home Services"
    },
    {
      id: 3,
      name: "Syracuse Furniture Outlet",
      description: "Affordable new and gently used furniture perfect for apartments and student housing. Delivery available!",
      address: "2401 S Salina St, Syracuse, NY 13205",
      phone: "(315) 555-5003",
      website: "https://example.com",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop",
      category: "Furniture"
    },
    {
      id: 4,
      name: "University Cleaners",
      description: "Professional cleaning services for move-in and move-out. Deep cleaning, carpet cleaning, and regular maintenance.",
      address: "720 S Crouse Ave, Syracuse, NY 13210",
      phone: "(315) 555-5004",
      website: "https://example.com",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000&auto=format&fit=crop",
      category: "Cleaning Services"
    },
    {
      id: 5,
      name: "Salt City Storage",
      description: "Secure storage units in various sizes. Climate controlled options available. Perfect for between semesters!",
      address: "500 N State St, Syracuse, NY 13203",
      phone: "(315) 555-5005",
      website: "https://example.com",
      image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1000&auto=format&fit=crop",
      category: "Storage"
    },
  ];

  return (
    <DirectoryPage 
      title="Local Businesses Directory" 
      subtitle="Discover local businesses that can help with your housing needs in Syracuse."
      items={items}
      addListingLink="/directory/local-businesses/add"
      addListingText="Add Your Business Here"
      isPaidListing={true}
    />
  );
}
