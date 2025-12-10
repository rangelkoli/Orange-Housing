import { DirectoryPage, type DirectoryItem } from "../components/DirectoryPage";

export default function NonProfitsDirectoryPage() {
  const items: DirectoryItem[] = [
    {
      id: 1,
      name: "Syracuse Housing Authority",
      description: "Providing affordable housing solutions and assistance programs for Syracuse residents in need.",
      address: "516 Burt St, Syracuse, NY 13202",
      phone: "(315) 475-6181",
      website: "https://example.com",
      image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1000&auto=format&fit=crop",
      category: "Housing Authority"
    },
    {
      id: 2,
      name: "Rescue Mission Alliance",
      description: "Offering emergency shelter, transitional housing, and support services to those experiencing homelessness.",
      address: "155 Gifford St, Syracuse, NY 13202",
      phone: "(315) 472-6251",
      website: "https://example.com",
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=1000&auto=format&fit=crop",
      category: "Emergency Shelter"
    },
    {
      id: 3,
      name: "Interfaith Works",
      description: "Building bridges and providing housing assistance, refugee services, and community programs in Central NY.",
      address: "1010 James St, Syracuse, NY 13203",
      phone: "(315) 449-3552",
      website: "https://example.com",
      image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1000&auto=format&fit=crop",
      category: "Community Services"
    },
    {
      id: 4,
      name: "Catholic Charities of Onondaga County",
      description: "Comprehensive social services including housing assistance, counseling, and family support programs.",
      address: "240 E Onondaga St, Syracuse, NY 13202",
      phone: "(315) 424-1800",
      website: "https://example.com",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop",
      category: "Social Services"
    },
    {
      id: 5,
      name: "Habitat for Humanity Syracuse",
      description: "Building affordable homes and strengthening communities through volunteer-driven construction and home repair.",
      address: "812 N Salina St, Syracuse, NY 13208",
      phone: "(315) 472-1470",
      website: "https://example.com",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop",
      category: "Housing Construction"
    },
  ];

  return (
    <DirectoryPage 
      title="Syracuse NonProfits/Charity Directory" 
      subtitle="Discover organizations dedicated to helping the Syracuse community with housing and social services."
      items={items}
      addListingLink="/directory/nonprofits/add"
      addListingText="Add Your Syracuse NonProfit/Charity Here"
      isPaidListing={false}
    />
  );
}
