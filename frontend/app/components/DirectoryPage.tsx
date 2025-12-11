

import { Search, MapPin, Phone, Globe, Mail } from "lucide-react";
import { Link } from "react-router";

export interface DirectoryItem {
  id: number;
  name: string;
  description: string;
  address: string;
  phone?: string;
  email?: string;
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
      <div className="bg-stone-900 text-white py-12 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-lg md:text-xl text-stone-300 max-w-2xl mx-auto">{subtitle}</p>
        </div>
      </div>

      {/* Add Listing CTA - Top */}
      {addListingLink && addListingText && (
        <div className="container mx-auto px-4 -mt-6 relative z-20 mb-6">
          <Link
            to={addListingLink}
            className="block max-w-4xl mx-auto w-full py-3 md:py-4 px-4 md:px-6 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-dashed border-orange-300 rounded-xl text-center hover:border-orange-400 hover:from-orange-100 hover:to-amber-100 transition-all group"
          >
            <span className="text-orange-600 font-semibold text-base md:text-lg group-hover:text-orange-700">
              {addListingText}
            </span>
            {isPaidListing && (
              <span className="block text-stone-500 text-xs md:text-sm mt-1">
                List Here for 12 Months for only $100
              </span>
            )}
          </Link>
        </div>
      )}

      {/* Search & Filter */}
      <div className="container mx-auto px-4 -mt-2 relative z-20 mb-8 md:mb-12">
        <div className="bg-white p-3 md:p-4 rounded-xl shadow-lg border border-stone-100 max-w-4xl mx-auto flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="flex-grow relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
            <input 
              type="text" 
              placeholder="Search directory..." 
              className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm md:text-base"
            />
          </div>
          <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 md:px-8 rounded-lg transition-colors shadow-md text-sm md:text-base">
            Search
          </button>
        </div>
      </div>

      {/* Directory Grid */}
      <main className="flex-grow container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 group flex flex-col">
              <div className="h-40 md:h-48 overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-white/90 backdrop-blur-sm px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold text-stone-800 uppercase tracking-wide">
                  {item.category}
                </div>
              </div>
              
              <div className="p-4 md:p-6 flex-grow flex flex-col">
                <h3 className="text-lg md:text-xl font-bold text-stone-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-1">{item.name}</h3>
                <p className="text-stone-500 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2 flex-grow">{item.description}</p>
                
                <div className="space-y-2 md:space-y-3 pt-3 md:pt-4 border-t border-stone-100">
                  <div className="flex items-start gap-2 md:gap-3 text-xs md:text-sm text-stone-600">
                    <MapPin size={14} className="text-orange-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{item.address}</span>
                  </div>
                  
                  {item.website && (
                    <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-stone-600">
                      <Globe size={14} className="text-orange-500 shrink-0" />
                      <a href={item.website} target="_blank" rel="noreferrer" className="hover:text-orange-600 hover:underline truncate">
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="mt-4 md:mt-6 grid grid-cols-2 gap-2 md:gap-3">
                  {item.phone && (
                    <a 
                      href={`tel:${item.phone}`}
                      className="py-2 md:py-2.5 border border-stone-200 rounded-lg text-center text-stone-600 font-medium hover:bg-stone-50 hover:text-stone-900 hover:border-stone-300 transition-colors flex items-center justify-center gap-1.5 md:gap-2 text-xs md:text-sm"
                    >
                      <Phone size={14} />
                      <span>Call Now</span>
                    </a>
                  )}
                  {item.email ? (
                    <a 
                      href={`mailto:${item.email}`}
                      className="py-2 md:py-2.5 bg-orange-600 text-white rounded-lg text-center font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-1.5 md:gap-2 text-xs md:text-sm shadow-sm"
                    >
                      <Mail size={14} />
                      <span>Email</span>
                    </a>
                  ) : item.website ? (
                    <a 
                      href={item.website}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2 md:py-2.5 bg-orange-600 text-white rounded-lg text-center font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-1.5 md:gap-2 text-xs md:text-sm shadow-sm"
                    >
                      <Globe size={14} />
                      <span>Website</span>
                    </a>
                  ) : null}
                  {!item.phone && !item.email && !item.website && (
                    <div className="col-span-2 py-2 md:py-2.5 border border-stone-200 rounded-lg text-center text-stone-400 text-xs md:text-sm">
                      Contact info coming soon
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Add Listing CTA - Bottom */}
      {addListingLink && addListingText && (
        <div className="container mx-auto px-4 pb-16 md:pb-20">
          <Link
            to={addListingLink}
            className="block max-w-4xl mx-auto w-full py-3 md:py-4 px-4 md:px-6 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-dashed border-orange-300 rounded-xl text-center hover:border-orange-400 hover:from-orange-100 hover:to-amber-100 transition-all group"
          >
            <span className="text-orange-600 font-semibold text-base md:text-lg group-hover:text-orange-700">
              {addListingText}
            </span>
            {isPaidListing && (
              <span className="block text-stone-500 text-xs md:text-sm mt-1">
                List Here for 12 Months for only $100
              </span>
            )}
          </Link>
        </div>
      )}
    </div>
  );
}

