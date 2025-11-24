import { DirectoryPage, type DirectoryItem } from "../components/DirectoryPage";

export default function LandlordsPage() {
  const items: DirectoryItem[] = [
    {
      id: 1,
      name: "Orange Property Management",
      description: "Managing over 50 properties in the University Hill area. 24/7 maintenance and online tenant portal.",
      address: "100 College Place, Syracuse, NY",
      phone: "(315) 555-3000",
      website: "https://example.com",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop",
      category: "Property Management"
    },
    {
      id: 2,
      name: "Smith Family Rentals",
      description: "Family-owned and operated since 1995. Offering well-maintained single-family homes for students.",
      address: "200 Euclid Ave, Syracuse, NY",
      phone: "(315) 555-3100",
      website: "https://example.com",
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1000&auto=format&fit=crop",
      category: "Private Landlord"
    },
    {
      id: 3,
      name: "University Area Housing",
      description: "Specializing in affordable off-campus housing options. Studios, 1-bedroom, and shared apartments available.",
      address: "300 Westcott St, Syracuse, NY",
      phone: "(315) 555-3200",
      website: "https://example.com",
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1000&auto=format&fit=crop",
      category: "Housing Agency"
    },
    {
      id: 4,
      name: "Elite Student Living",
      description: "Premium rental properties with modern finishes and inclusive utility packages.",
      address: "400 Comstock Ave, Syracuse, NY",
      phone: "(315) 555-3300",
      website: "https://example.com",
      image: "https://images.unsplash.com/photo-1600596542815-2495db9dc2c3?q=80&w=1000&auto=format&fit=crop",
      category: "Property Management"
    },
    {
      id: 5,
      name: "Green Homes Syracuse",
      description: "Eco-friendly housing options with energy-efficient appliances and sustainable practices.",
      address: "500 Meadowbrook Dr, Syracuse, NY",
      phone: "(315) 555-3400",
      website: "https://example.com",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop",
      category: "Eco-Friendly Rentals"
    },
    {
      id: 6,
      name: "Historic Hill Properties",
      description: "Charming apartments in restored historic buildings. Experience the character of Syracuse.",
      address: "600 James St, Syracuse, NY",
      phone: "(315) 555-3500",
      website: "https://example.com",
      image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=1000&auto=format&fit=crop",
      category: "Historic Rentals"
    }
  ];

  return (
    <DirectoryPage 
      title="Landlords & Property Managers" 
      subtitle="Connect with trusted landlords and property management companies in the Syracuse area."
      items={items}
    />
  );
}
