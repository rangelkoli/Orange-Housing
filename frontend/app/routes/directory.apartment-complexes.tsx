import { Link } from "react-router";
import { DirectoryPage, type DirectoryItem } from "../components/DirectoryPage";
import { Plus, CreditCard, ArrowRight } from "lucide-react";

export default function ApartmentComplexesPage() {
  const items: DirectoryItem[] = [
    {
      id: 1,
      name: "The Marshall Syracuse",
      description: "Luxury student housing steps from Syracuse University. Featuring modern amenities, fully furnished units, and a vibrant community atmosphere.",
      address: "727 S Crouse Ave, Syracuse, NY 13210",
      phone: "(315) 555-0123",
      website: "https://example.com",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop",
      category: "Luxury Apartments"
    },
    {
      id: 2,
      name: "Theory Syracuse",
      description: "Upscale living with state-of-the-art fitness center, study lounges, and premium finishes. Walk to class in minutes.",
      address: "919 E Genesee St, Syracuse, NY 13210",
      phone: "(315) 555-0456",
      website: "https://example.com",
      image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1000&auto=format&fit=crop",
      category: "Student Housing"
    },
    {
      id: 3,
      name: "U Point Syracuse",
      description: "Modern apartments designed for the student lifestyle. All-inclusive rent, social events, and 24/7 support.",
      address: "404 University Ave, Syracuse, NY 13210",
      phone: "(315) 555-0789",
      website: "https://example.com",
      image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1000&auto=format&fit=crop",
      category: "Apartment Complex"
    },
    {
      id: 4,
      name: "Copper Beech Commons",
      description: "Spacious layouts and top-tier amenities including a gym, game room, and shuttle service to campus.",
      address: "300 University Ave, Syracuse, NY 13210",
      phone: "(315) 555-1011",
      website: "https://example.com",
      image: "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?q=80&w=1000&auto=format&fit=crop",
      category: "Student Living"
    },
    {
      id: 5,
      name: "505 on Walnut",
      description: "Exclusive luxury living with a rooftop terrace, indoor pool, and high-end furnishings.",
      address: "505 Walnut Ave, Syracuse, NY 13210",
      phone: "(315) 555-1213",
      website: "https://example.com",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000&auto=format&fit=crop",
      category: "Luxury Suites"
    },
    {
      id: 6,
      name: "Campus West",
      description: "Conveniently located on campus with a focus on academic success and community building.",
      address: "150 Henry St, Syracuse, NY 13210",
      phone: "(315) 555-1415",
      website: "https://example.com",
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1000&auto=format&fit=crop",
      category: "On-Campus Housing"
    }
  ];

  return (
    <DirectoryPage 
      title="Apartment Complex Directory" 
      subtitle="Discover the best apartment communities and student housing complexes in Syracuse."
      items={items}
      addListingLink="/directory/apartment-complexes/add"
      addListingText="Add Your Apartment Complex Here"
      isPaidListing={true}
    />
  );
}
