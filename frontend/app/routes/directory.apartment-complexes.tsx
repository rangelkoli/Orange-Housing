import { useState, useEffect } from "react";
import { Link } from "react-router";
import { 
  Building, 
  Search, 
  Phone, 
  Mail, 
  Globe, 
  ArrowRight,
  Building2,
  CheckCircle2
} from "lucide-react";

interface ComplexItem {
  id: number;
  name: string;
  description: string;
  phone?: string;
  email?: string;
  website?: string;
  category: string;
}

export default function ApartmentComplexesPage() {
  const [items, setItems] = useState<ComplexItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchComplexes = async () => {
      try {
        const response = await fetch("http://localhost:8000/directory/complexes/");
        const result = await response.json();
        if (result.success) {
          const mappedData = result.data.map((item: any) => ({
            id: item.id,
            name: item.name || "Unnamed Complex",
            description: item.contact_name ? `Contact: ${item.contact_name}` : "Premium apartment community offering exceptional living spaces and amenities.",
            phone: item.phone,
            email: item.email,
            website: item.url,
            category: item.category || "Apartment Complex"
          }));
          setItems(mappedData);
        }
      } catch (error) {
        console.error("Error fetching complexes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplexes();
  }, []);

  // Filter items based on search
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 flex flex-col">
      {/* Hero Section - Enterprise Style */}
      <div className="bg-stone-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900 to-stone-800" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-6">
              <Building2 size={14} />
              <span>Residential Directory</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Apartment Complexes
            </h1>
            <p className="text-xl text-stone-300 max-w-2xl leading-relaxed">
              Browse our curated list of verified apartment communities. Find the perfect place to call home with premium amenities and trusted management.
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar - Floating */}
      <div className="container mx-auto px-4 -mt-8 relative z-20 mb-12">
        <div className="bg-white p-2 rounded-xl shadow-xl border border-stone-100 max-w-2xl flex items-center gap-2">
          <div className="flex-grow relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by complex name or category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:outline-none text-stone-900 placeholder:text-stone-400"
            />
          </div>
          <button className="bg-stone-900 hover:bg-stone-800 text-white font-medium py-3 px-6 rounded-lg transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
            All Listings
            {!isLoading && (
              <span className="text-sm font-normal text-stone-500 bg-stone-100 px-2 py-1 rounded-full">
                {filteredItems.length}
              </span>
            )}
          </h2>
          
          <Link 
            to="/directory/apartment-complexes/add"
            className="inline-flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700 transition-colors text-sm"
          >
            Add Your Property <ArrowRight size={16} />
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-stone-200 border-t-orange-600 rounded-full animate-spin mb-4" />
            <p className="text-stone-500 font-medium">Loading directory...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredItems.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center border border-stone-200 shadow-sm">
            <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-stone-400" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">No complexes found</h3>
            <p className="text-stone-500 text-sm max-w-xs mx-auto mb-6">
              We couldn't find any apartment complexes matching your search.
            </p>
            <button 
              onClick={() => setSearchQuery("")}
              className="text-orange-600 font-medium hover:underline"
            >
              Clear search filters
            </button>
          </div>
        )}

        {/* Grid Layout - Enterprise Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-lg border border-stone-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group relative overflow-hidden"
            >
              {/* Top Accent Line */}
              <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-amber-500" />
              
              <div className="p-6 flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="bg-stone-100 text-stone-600 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded">
                    {item.category}
                  </div>
                  <Building size={16} className="text-stone-300 group-hover:text-orange-400 transition-colors" />
                </div>
                
                <h3 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-orange-600 transition-colors">
                  {item.name}
                </h3>
                
                <div className="flex-grow">
                  <p className="text-stone-500 text-sm leading-relaxed mb-6 line-clamp-3">
                    {item.description}
                  </p>
                </div>
                
                {/* Divider */}
                <div className="h-px w-full bg-stone-100 mb-4" />
                
                {/* Actions */}
                <div className="flex items-center gap-3">
                  {item.phone ? (
                    <a 
                      href={`tel:${item.phone}`}
                      className="flex-1 inline-flex justify-center items-center gap-2 py-2 text-sm font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 rounded-md transition-colors border border-stone-200"
                      title="Call Now"
                    >
                      <Phone size={14} className="text-stone-500" />
                      <span>Call</span>
                    </a>
                  ) : (
                    <button disabled className="flex-1 py-2 text-sm font-medium text-stone-400 bg-stone-50 rounded-md border border-stone-100 cursor-not-allowed flex justify-center items-center gap-2">
                       <Phone size={14} className="text-stone-300" />
                       <span className="opacity-50">Call</span>
                    </button>
                  )}
                  
                  {item.website ? (
                    <a 
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex justify-center items-center gap-2 py-2 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors shadow-sm"
                    >
                      <span>Visit Site</span>
                      <ArrowRight size={14} />
                    </a>
                  ) : item.email ? (
                    <a 
                      href={`mailto:${item.email}`}
                      className="flex-1 inline-flex justify-center items-center gap-2 py-2 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors shadow-sm"
                    >
                      <Mail size={14} />
                      <span>Email</span>
                    </a>
                  ) : (
                     <button disabled className="flex-1 py-2 text-sm font-medium text-stone-400 bg-stone-100 rounded-md cursor-not-allowed">
                       No Contact
                     </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      {/* Bottom CTA */}
      <div className="bg-stone-100 border-t border-stone-200 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Are you a property manager?</h2>
          <p className="text-stone-600 mb-8 max-w-xl mx-auto">
            List your apartment complex in our directory to reach thousands of students and residents looking for their next home.
          </p>
          <Link
            to="/directory/apartment-complexes/add"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors shadow-sm"
          >
            Create Your Listing
          </Link>
        </div>
      </div>
    </div>
  );
}
