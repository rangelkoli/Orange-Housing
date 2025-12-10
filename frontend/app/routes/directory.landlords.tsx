import { useState } from "react";
import { Link } from "react-router";
import {
  Search,
  MapPin,
  Phone,
  Mail,
  Globe,
  ArrowLeft,
  ChevronRight,
  Building2,
  User,
  Home,
  Star,
  Shield,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { FaPhone } from "react-icons/fa";

interface LandlordItem {
  id: number;
  name: string;
  description: string;
  neighborhoods: string[];
  phone?: string;
  email?: string;
  website?: string;
  yearsActive?: number;
  propertyCount?: number;
  verified?: boolean;
  category: string;
}

export default function LandlordsDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const landlords: LandlordItem[] = [
    {
      id: 1,
      name: "John Smith Properties",
      description: "Experienced landlord with over 20 years in Syracuse real estate. Specializing in student housing near SU campus with responsive maintenance.",
      neighborhoods: ["University Hill", "Westcott", "Euclid"],
      phone: "(315) 555-0101",
      email: "john@example.com",
      website: "https://example.com",
      yearsActive: 20,
      propertyCount: 15,
      verified: true,
      category: "Individual Landlord"
    },
    {
      id: 2,
      name: "Maria Rodriguez Rentals",
      description: "Family-owned rental business offering quality homes and apartments throughout Syracuse neighborhoods. Known for fair pricing and excellent communication.",
      neighborhoods: ["Eastwood", "Sedgwick", "North Valley"],
      phone: "(315) 555-0202",
      email: "maria@example.com",
      yearsActive: 12,
      propertyCount: 8,
      verified: true,
      category: "Family Business"
    },
    {
      id: 3,
      name: "University District Landlords",
      description: "Collective of landlords focused on providing safe, affordable housing for Syracuse University students. Online applications available.",
      neighborhoods: ["University Hill", "Syracuse Univ", "Comstock"],
      phone: "(315) 555-0303",
      email: "info@udlandlords.com",
      website: "https://example.com",
      propertyCount: 50,
      verified: true,
      category: "Landlord Group"
    },
    {
      id: 4,
      name: "Thompson Family Homes",
      description: "Third-generation Syracuse landlords. We take pride in maintaining our properties and building lasting relationships with tenants.",
      neighborhoods: ["Tipperary Hill", "Geddes", "Westvale"],
      phone: "(315) 555-0404",
      email: "thompson@example.com",
      yearsActive: 35,
      propertyCount: 12,
      verified: false,
      category: "Family Business"
    },
    {
      id: 5,
      name: "Chen Housing Solutions",
      description: "Modern apartments with updated amenities. Flexible lease terms available for graduate students and young professionals.",
      neighborhoods: ["Downtown", "Armory Square", "Clinton Square"],
      phone: "(315) 555-0505",
      email: "chen@example.com",
      website: "https://example.com",
      yearsActive: 8,
      propertyCount: 6,
      verified: true,
      category: "Individual Landlord"
    },
    {
      id: 6,
      name: "Syracuse Student Housing Co-op",
      description: "Non-profit cooperative offering affordable housing options for students. Community-focused with shared resources.",
      neighborhoods: ["University Hill", "Meadbrook"],
      phone: "(315) 555-0606",
      email: "coop@example.com",
      propertyCount: 25,
      verified: true,
      category: "Housing Co-op"
    },
  ];

  // Filter landlords based on search
  const filteredLandlords = landlords.filter(
    (landlord) =>
      landlord.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      landlord.neighborhoods.some((n) =>
        n.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      landlord.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Get color based on name (for consistent avatar colors)
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-orange-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-amber-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="min-h-screen bg-[#F5F2EB] font-sans text-stone-900 flex flex-col">
      {/* Hero Section */}
      <div className="bg-stone-900 text-white py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">
            Landlords Directory
          </h1>
          <p className="text-xl text-stone-300 max-w-2xl mx-auto">
            Connect directly with trusted landlords in the Syracuse area
          </p>
        </div>
      </div>

      {/* Add Listing CTA - Top */}
      <div className="container mx-auto px-4 -mt-6 relative z-20 mb-6">
        <Link
          to="/directory/landlords/add"
          className="block max-w-4xl mx-auto w-full py-4 px-6 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-dashed border-orange-300 rounded-xl text-center hover:border-orange-400 hover:from-orange-100 hover:to-amber-100 transition-all group"
        >
          <span className="text-orange-600 font-semibold text-lg group-hover:text-orange-700">
            Add Your Landlord Listing Here
          </span>
          <span className="block text-stone-500 text-sm mt-1">
            List Here for 12 Months for only $100
          </span>
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="container mx-auto px-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-lg border border-stone-100 max-w-4xl mx-auto">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by landlord name, neighborhood, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="container mx-auto px-4 mb-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-stone-500 text-sm">
            Showing {filteredLandlords.length} landlord
            {filteredLandlords.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Landlords Grid */}
      <main className="flex-grow container mx-auto px-4 pb-12">
        <div className="max-w-5xl mx-auto space-y-4">
          {filteredLandlords.map((landlord) => (
            <div
              key={landlord.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-stone-100"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-20 h-20 ${getAvatarColor(
                        landlord.name
                      )} rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-md`}
                    >
                      {getInitials(landlord.name)}
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl font-bold text-stone-900 font-serif">
                            {landlord.name}
                          </h3>
                          {landlord.verified && (
                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                              <Shield size={12} />
                              Verified
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-orange-600 font-medium">
                          {landlord.category}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-stone-500">
                        {landlord.yearsActive && (
                          <div className="flex items-center gap-1">
                            <Calendar size={14} className="text-stone-400" />
                            <span>{landlord.yearsActive} years</span>
                          </div>
                        )}
                        {landlord.propertyCount && (
                          <div className="flex items-center gap-1">
                            <Home size={14} className="text-stone-400" />
                            <span>{landlord.propertyCount} properties</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-stone-600 text-sm mb-4 leading-relaxed">
                      {landlord.description}
                    </p>

                    {/* Neighborhoods */}
                    <div className="flex items-start gap-2 mb-4">
                      <MapPin
                        size={14}
                        className="text-orange-500 shrink-0 mt-0.5"
                      />
                      <div className="flex flex-wrap gap-1.5">
                        {landlord.neighborhoods.map((neighborhood) => (
                          <span
                            key={neighborhood}
                            className="bg-stone-100 text-stone-600 text-xs px-2 py-0.5 rounded-full"
                          >
                            {neighborhood}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Contact Buttons */}
                    <div className="flex flex-wrap gap-3">
                      {landlord.phone && (
                        <a
                          href={`tel:${landlord.phone}`}
                          className="inline-flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-lg text-stone-600 font-medium text-sm hover:bg-stone-50 hover:text-stone-900 hover:border-stone-300 transition-all"
                        >
                          <FaPhone size={12} />
                          Call
                        </a>
                      )}
                      {landlord.email && (
                        <a
                          href={`mailto:${landlord.email}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium text-sm hover:bg-orange-700 transition-all shadow-sm"
                        >
                          <Mail size={14} />
                          Email
                        </a>
                      )}
                      {landlord.website && (
                        <a
                          href={landlord.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-lg text-stone-600 font-medium text-sm hover:bg-stone-50 hover:text-stone-900 hover:border-stone-300 transition-all"
                        >
                          <Globe size={14} />
                          Website
                        </a>
                      )}
                      <button
                        className="inline-flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-lg text-stone-600 font-medium text-sm hover:bg-stone-50 hover:text-orange-600 hover:border-orange-200 transition-all"
                      >
                        <MessageSquare size={14} />
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredLandlords.length === 0 && (
            <div className="bg-white rounded-xl p-12 text-center border border-stone-100">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-stone-400" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                No landlords found
              </h3>
              <p className="text-stone-500 text-sm">
                Try adjusting your search terms or browse all listings
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 text-orange-600 font-medium text-sm hover:text-orange-700"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Add Listing CTA - Bottom */}
      <div className="container mx-auto px-4 pb-20">
        <Link
          to="/directory/landlords/add"
          className="block max-w-4xl mx-auto w-full py-4 px-6 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-dashed border-orange-300 rounded-xl text-center hover:border-orange-400 hover:from-orange-100 hover:to-amber-100 transition-all group"
        >
          <span className="text-orange-600 font-semibold text-lg group-hover:text-orange-700">
            Add Your Landlord Listing Here
          </span>
          <span className="block text-stone-500 text-sm mt-1">
            List Here for 12 Months for only $100
          </span>
        </Link>
      </div>
    </div>
  );
}
