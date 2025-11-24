import { DirectoryPage, type DirectoryItem } from "../components/DirectoryPage";

export default function BusinessDirectoryPage() {
  const items: DirectoryItem[] = [
    {
      id: 1,
      name: "Syracuse Movers Pro",
      description: "Reliable and affordable moving services for students and families. Local and long-distance moves.",
      address: "123 Moving Way, Syracuse, NY",
      phone: "(315) 555-2000",
      website: "https://example.com",
      image: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?q=80&w=1000&auto=format&fit=crop",
      category: "Moving Services"
    },
    {
      id: 2,
      name: "Sparkle Cleaners",
      description: "Professional cleaning services for move-in/move-out, deep cleaning, and regular maintenance.",
      address: "456 Clean St, Syracuse, NY",
      phone: "(315) 555-2100",
      website: "https://example.com",
      image: "https://images.unsplash.com/photo-1581578731117-104f8a746956?q=80&w=1000&auto=format&fit=crop",
      category: "Cleaning Services"
    },
    {
      id: 3,
      name: "Campus Storage Solutions",
      description: "Secure and convenient storage units for summer break or semester abroad. Student discounts available.",
      address: "789 Storage Blvd, Syracuse, NY",
      phone: "(315) 555-2200",
      website: "https://example.com",
      image: "https://images.unsplash.com/photo-1562207524-f05b165403ec?q=80&w=1000&auto=format&fit=crop",
      category: "Storage"
    },
    {
      id: 4,
      name: "Orange Tech Repair",
      description: "Fast and reliable repair for laptops, phones, and tablets. Located near campus.",
      address: "101 Tech Ave, Syracuse, NY",
      phone: "(315) 555-2300",
      website: "https://example.com",
      image: "https://images.unsplash.com/photo-1597872258083-ef52741e84cb?q=80&w=1000&auto=format&fit=crop",
      category: "Electronics Repair"
    },
    {
      id: 5,
      name: "Varsity Pizza & Subs",
      description: "A Syracuse tradition! Delicious pizza, wings, and subs. Great for late-night study breaks.",
      address: "802 S Crouse Ave, Syracuse, NY",
      phone: "(315) 555-2400",
      website: "https://example.com",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop",
      category: "Food & Dining"
    },
    {
      id: 6,
      name: "University Hill Pharmacy",
      description: "Full-service pharmacy with health and wellness products. Friendly staff and quick service.",
      address: "202 University Ave, Syracuse, NY",
      phone: "(315) 555-2500",
      website: "https://example.com",
      image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=1000&auto=format&fit=crop",
      category: "Health & Wellness"
    }
  ];

  return (
    <DirectoryPage 
      title="Business Directory" 
      subtitle="Support local businesses that make Syracuse a great place to live and study."
      items={items}
    />
  );
}
