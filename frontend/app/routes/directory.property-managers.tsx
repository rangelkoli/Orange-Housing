import { DirectoryPage, type DirectoryItem } from "../components/DirectoryPage";

export default function PropertyManagersDirectoryPage() {
  const items: DirectoryItem[] = [
    {
      id: 1,
      name: "Syracuse Property Management",
      description: "Full-service property management company handling rentals, maintenance, and tenant relations throughout Central New York.",
      address: "100 Clinton Square, Syracuse, NY 13202",
      phone: "(315) 555-1001",
      website: "https://example.com",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop",
      category: "Full Service"
    },
    {
      id: 2,
      name: "University Hill Management",
      description: "Specialists in university area properties. We handle everything from finding tenants to 24/7 maintenance.",
      address: "800 University Ave, Syracuse, NY 13210",
      phone: "(315) 555-2002",
      website: "https://example.com",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop",
      category: "Student Housing"
    },
    {
      id: 3,
      name: "CNY Realty Services",
      description: "Professional property management with a personal touch. Serving landlords and tenants in Syracuse since 1995.",
      address: "500 S Salina St, Syracuse, NY 13202",
      phone: "(315) 555-3003",
      website: "https://example.com",
      image: "https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?q=80&w=1000&auto=format&fit=crop",
      category: "Property Management"
    },
    {
      id: 4,
      name: "Upstate Management Group",
      description: "Modern property management solutions with online portals, quick maintenance response, and transparent pricing.",
      address: "200 Madison St, Syracuse, NY 13202",
      phone: "(315) 555-4004",
      website: "https://example.com",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop",
      category: "Property Management"
    },
  ];

  return (
    <DirectoryPage 
      title="Property Managers Directory" 
      subtitle="Find professional property management services in the Syracuse area."
      items={items}
      addListingLink="/directory/property-managers/add"
      addListingText="Add Your Property Management Company Here"
      isPaidListing={true}
    />
  );
}
