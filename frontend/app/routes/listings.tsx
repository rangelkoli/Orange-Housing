import { useState } from "react";
import { SlidersHorizontal, LayoutGrid, List, Map } from "lucide-react";
import type { Listing } from "../types/listing";
import ListingFilter from "../components/ListingsFilter";
import ListingCard from "../components/ListingCard";

export default function ListingsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');

  // Mock Data
  const listings: Listing[] = [
    {
      id: 1,
      price: "$2,200/mo",
      beds: 4,
      baths: 2,
      address: "454 Serenity Lane",
      city: "Syracuse, NY 13202",
      images: [
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1000&auto=format&fit=crop"
      ],
      availableDate: "Available Now"
    },
    {
      id: 2,
      price: "$1,800/mo",
      beds: 2,
      baths: 2,
      address: "122 Elmwood Residences",
      city: "Syracuse, NY 13207",
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1000&auto=format&fit=crop",
      ],
      availableDate: "Aug 1st"
    },
    {
      id: 3,
      price: "$950/mo",
      beds: 1,
      baths: 1,
      address: "890 University Ave #4B",
      city: "Syracuse, NY 13210",
      images: [
        "https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000&auto=format&fit=crop",
      ],
      availableDate: "Available Now"
    },
    {
      id: 4,
      price: "$3,100/mo",
      beds: 5,
      baths: 3,
      address: "220 Comstock Ave",
      city: "Syracuse, NY 13210",
      images: [
        "https://images.unsplash.com/photo-1600596542815-2495db9dc2c3?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop",
      ],
      availableDate: "Sep 1st"
    },
    {
      id: 5,
      price: "$1,200/mo",
      beds: 2,
      baths: 1,
      address: "55 Westcott St",
      city: "Syracuse, NY 13210",
      images: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1000&auto=format&fit=crop",
      ],
      availableDate: "Available Now"
    },
    {
      id: 6,
      price: "$800/room",
      beds: 1,
      baths: 1,
      address: "Shared House - Euclid Ave",
      city: "Syracuse, NY 13210",
      images: [
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000&auto=format&fit=crop",
      ],
      availableDate: "Oct 15th"
    }
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col max-w-7xl mx-auto mt-12">
      <ListingFilter />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl font-bold text-stone-900">
            All Listings <span className="text-stone-500 text-lg font-normal ml-2">142 results</span>
          </h2>
          
          <div className="flex items-center gap-3">
            {/* View Switcher */}
            <div className="flex items-center bg-white border border-stone-200 rounded-lg p-1 shadow-sm">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-orange-100 text-orange-600 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
                title="Grid View"
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-orange-100 text-orange-600 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
                title="List View"
              >
                <List size={18} />
              </button>
              <button 
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-md transition-all ${viewMode === 'map' ? 'bg-orange-100 text-orange-600 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
                title="Map View"
              >
                <Map size={18} />
              </button>
            </div>

          </div>
        </div>

        {/* Content Area */}
        {viewMode === 'map' ? (
          <div className="w-full h-[600px] bg-stone-100 rounded-2xl border border-stone-200 flex flex-col items-center justify-center text-stone-400">
            <Map size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">Map view is coming soon</p>
          </div>
        ) : (
          <div className={`
            grid gap-8 
            ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-3xl mx-auto'}
          `}>
            {listings.map((home) => (
              <ListingCard key={home.id} home={home} />
            ))}
          </div>
        )}
        
        {/* Pagination (only show if not in map mode) */}
        {viewMode !== 'map' && (
          <div className="mt-12 flex justify-center gap-2">
            <button className="px-4 py-2 border border-stone-200 rounded-lg text-stone-500 hover:bg-white hover:text-orange-600 disabled:opacity-50">Previous</button>
            <button className="w-10 h-10 bg-orange-600 text-white rounded-lg font-medium">1</button>
            <button className="w-10 h-10 border border-stone-200 rounded-lg text-stone-600 hover:bg-white hover:text-orange-600">2</button>
            <button className="w-10 h-10 border border-stone-200 rounded-lg text-stone-600 hover:bg-white hover:text-orange-600">3</button>
            <span className="w-10 h-10 flex items-center justify-center text-stone-400">...</span>
            <button className="w-10 h-10 border border-stone-200 rounded-lg text-stone-600 hover:bg-white hover:text-orange-600">12</button>
            <button className="px-4 py-2 border border-stone-200 rounded-lg text-stone-600 hover:bg-white hover:text-orange-600">Next</button>
          </div>
        )}
      </main>
    </div>
  );
}
