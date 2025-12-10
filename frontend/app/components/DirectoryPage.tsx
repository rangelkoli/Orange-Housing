

import { Search, MapPin, Phone, Globe, ArrowRight } from "lucide-react";
import { Link } from "react-router";

export interface DirectoryItem {
  id: number;
  name: string;
  description: string;
  address: string;
  phone?: string;
  website?: string;
  image: string;
  category: string;
}

interface DirectoryPageProps {
  title: string;
  subtitle: string;
  items: DirectoryItem[];
  addListingLink?: string;
  addListingText?: string;
  isPaidListing?: boolean;
}

export function DirectoryPage({ title, subtitle, items, addListingLink, addListingText, isPaidListing = true }: DirectoryPageProps) {
  return (
    <div className="min-h-screen bg-[#F5F2EB] font-sans text-stone-900 flex flex-col">
      
      {/* Hero Section */}
      <div className="bg-stone-900 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-xl text-stone-300 max-w-2xl mx-auto">{subtitle}</p>
        </div>
      </div>

      {/* Add Listing CTA - Top */}
      {addListingLink && addListingText && (
        <div className="container mx-auto px-4 -mt-6 relative z-20 mb-6">
          <Link
            to={addListingLink}
            className="block max-w-4xl mx-auto w-full py-4 px-6 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-dashed border-orange-300 rounded-xl text-center hover:border-orange-400 hover:from-orange-100 hover:to-amber-100 transition-all group"
          >
            <span className="text-orange-600 font-semibold text-lg group-hover:text-orange-700">
              {addListingText}
            </span>
            {isPaidListing && (
              <span className="block text-stone-500 text-sm mt-1">
                List Here for 12 Months for only $100
              </span>
            )}
          </Link>
        </div>
      )}

      {/* Search & Filter */}
      <div className="container mx-auto px-4 -mt-2 relative z-20 mb-12">
        <div className="bg-white p-4 rounded-xl shadow-lg border border-stone-100 max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
            <input 
              type="text" 
              placeholder="Search directory..." 
              className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>
          <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-md">
            Search
          </button>
        </div>
      </div>

      {/* Directory Grid */}
      <main className="flex-grow container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 group flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-stone-800 uppercase tracking-wide">
                  {item.category}
                </div>
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-orange-600 transition-colors">{item.name}</h3>
                <p className="text-stone-500 text-sm mb-4 line-clamp-2 flex-grow">{item.description}</p>
                
                <div className="space-y-3 mt-auto pt-4 border-t border-stone-100">
                  <div className="flex items-start gap-3 text-sm text-stone-600">
                    <MapPin size={16} className="text-orange-500 shrink-0 mt-0.5" />
                    <span>{item.address}</span>
                  </div>
                  
                  {item.phone && (
                    <div className="flex items-center gap-3 text-sm text-stone-600">
                      <Phone size={16} className="text-orange-500 shrink-0" />
                      <span>{item.phone}</span>
                    </div>
                  )}
                  
                  {item.website && (
                    <div className="flex items-center gap-3 text-sm text-stone-600">
                      <Globe size={16} className="text-orange-500 shrink-0" />
                      <a href={item.website} target="_blank" rel="noreferrer" className="hover:text-orange-600 hover:underline truncate">
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
                
                <Link to="#" className="mt-6 w-full py-2.5 border border-stone-200 rounded-lg text-center text-stone-600 font-medium hover:bg-stone-50 hover:text-orange-600 transition-colors flex items-center justify-center gap-2 group-hover:border-orange-200">
                  View Details <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Add Listing CTA - Bottom */}
      {addListingLink && addListingText && (
        <div className="container mx-auto px-4 pb-20">
          <Link
            to={addListingLink}
            className="block max-w-4xl mx-auto w-full py-4 px-6 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-dashed border-orange-300 rounded-xl text-center hover:border-orange-400 hover:from-orange-100 hover:to-amber-100 transition-all group"
          >
            <span className="text-orange-600 font-semibold text-lg group-hover:text-orange-700">
              {addListingText}
            </span>
            {isPaidListing && (
              <span className="block text-stone-500 text-sm mt-1">
                List Here for 12 Months for only $100
              </span>
            )}
          </Link>
        </div>
      )}
    </div>
  );
}

