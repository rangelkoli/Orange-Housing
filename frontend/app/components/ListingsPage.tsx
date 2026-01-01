import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import { LayoutGrid, List, Map, ChevronLeft, ChevronRight } from "lucide-react";

import type { Listing } from "../types/listing";
import ListingFilter from "./ListingsFilter";
import ListingCard from "./ListingCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";
console.log("[DEBUG] VITE_BACKEND_URL:", import.meta.env.VITE_BACKEND_URL, "| Using:", BACKEND_URL);
const ITEMS_PER_PAGE = 24;

interface ListingsPageProps {
  title: string;
  subtitle?: string;
  apiEndpoint: string;
  emptyStateMessage?: string;
}

export default function ListingsPage({
  title,
  subtitle,
  apiEndpoint,
  emptyStateMessage = "No listings found in this category.",
}: ListingsPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [sortOption, setSortOption] = useState<string>("default");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get current page from URL search params (default to 1)
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Fetch listings from backend with search params
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build API URL with search params (exclude page and type params)
        const apiParams = new URLSearchParams(searchParams);
        apiParams.delete("page"); // Remove page from API call since we paginate client-side
        apiParams.delete("type"); // Remove type since it's handled by apiEndpoint
        const queryString = apiParams.toString();
        const url = queryString 
          ? `${BACKEND_URL}${apiEndpoint}?${queryString}`
          : `${BACKEND_URL}${apiEndpoint}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data);
        if (data.listings && data.listings.length > 0) {
          setListings(data.listings);
        } else {
          setListings([]);
        }
      } catch (err) {
        console.error("Error fetching listings:", err);
        setError("Failed to load listings. Please try again later.");
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [apiEndpoint, searchParams]);

  // Sorting Logic
  const sortedListings = useMemo(() => {
    return [...listings].sort((a, b) => {
      if (sortOption === "price_asc") {
        const priceA = parseInt(a.price.replace(/[^0-9]/g, ""));
        const priceB = parseInt(b.price.replace(/[^0-9]/g, ""));
        return priceA - priceB;
      } else if (sortOption === "price_desc") {
        const priceA = parseInt(a.price.replace(/[^0-9]/g, ""));
        const priceB = parseInt(b.price.replace(/[^0-9]/g, ""));
        return priceB - priceA;
      } else if (sortOption === "beds_desc") {
        return b.beds - a.beds;
      }
      return 0; // Default order
    });
  }, [listings, sortOption]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedListings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedListings = sortedListings.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    
    const newParams = new URLSearchParams(searchParams);
    if (page === 1) {
      newParams.delete("page");
    } else {
      newParams.set("page", page.toString());
    }
    setSearchParams(newParams);
    
    // Scroll to top of listings
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('ellipsis');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Reset to page 1 when sort option or listing type changes
  useEffect(() => {
    if (currentPage !== 1 && sortedListings.length > 0) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("page");
      setSearchParams(newParams);
    }
  }, [sortOption, apiEndpoint]);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col max-w-7xl mx-auto mt-12">
      <ListingFilter />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-stone-900 font-serif">
              {title} <span className="text-stone-500 text-lg font-normal ml-2 font-mono">{sortedListings.length} results</span>
            </h2>
            {subtitle && (
              <p className="text-stone-500 text-sm mt-1">{subtitle}</p>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-stone-500 font-medium hidden md:inline">Sort by:</span>
                <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="w-[180px] bg-white border-stone-200 font-mono text-xs">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="default">Recommended</SelectItem>
                        <SelectItem value="price_asc">Price: Low to High</SelectItem>
                        <SelectItem value="price_desc">Price: High to Low</SelectItem>
                        <SelectItem value="beds_desc">Most Bedrooms</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="h-8 w-px bg-stone-200 mx-2 hidden md:block" />

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

        {/* Loading Skeleton */}
        {loading && (
          <div className={`
            grid gap-8 
            ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-3xl mx-auto'}
          `}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                {/* Image Skeleton */}
                <div className="relative h-56 bg-stone-200 animate-pulse">
                  <div className="absolute top-4 left-4 w-24 h-6 bg-stone-300 rounded-full" />
                  <div className="absolute top-4 right-4 w-8 h-8 bg-stone-300 rounded-full" />
                  {/* Image dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {[1, 2, 3].map((dot) => (
                      <div key={dot} className="w-2 h-2 bg-stone-300 rounded-full" />
                    ))}
                  </div>
                </div>
                
                {/* Content Skeleton */}
                <div className="p-5 space-y-4">
                  {/* Title */}
                  <div className="space-y-2">
                    <div className="h-6 bg-stone-200 rounded-lg animate-pulse w-3/4" />
                    <div className="h-4 bg-stone-100 rounded animate-pulse w-1/2" />
                  </div>
                  
                  {/* Stats */}
                  <div className="flex gap-4">
                    <div className="h-4 bg-stone-100 rounded animate-pulse w-16" />
                    <div className="h-4 bg-stone-100 rounded animate-pulse w-16" />
                    <div className="h-4 bg-stone-100 rounded animate-pulse w-20" />
                  </div>
                  
                  {/* Price and Button */}
                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-stone-100">
                    <div className="h-7 bg-stone-200 rounded-lg animate-pulse w-28" />
                    <div className="h-10 bg-stone-100 rounded-xl animate-pulse w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}


        {/* Error Message */}
        {error && !loading && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && sortedListings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
              <LayoutGrid size={32} className="text-stone-400" />
            </div>
            <h3 className="text-lg font-semibold text-stone-700 mb-2">No Listings Available</h3>
            <p className="text-stone-500 max-w-md">{emptyStateMessage}</p>
          </div>
        )}

        {/* Content Area */}
        {!loading && (
          <>
            {viewMode === 'map' ? (
              <div className="w-full h-[600px] bg-stone-100 rounded-2xl border border-stone-200 flex flex-col items-center justify-center text-stone-400">
                <Map size={48} className="mb-4 opacity-50" />
                <p className="text-lg font-medium">Map view is coming soon</p>
              </div>
            ) : (
              <>
                {/* Showing X-Y of Z results */}
                {sortedListings.length > 0 && (
                  <p className="text-sm text-stone-500 mb-6">
                    Showing {startIndex + 1}-{Math.min(endIndex, sortedListings.length)} of {sortedListings.length} listings
                  </p>
                )}
                
                <div className={`
                  grid gap-8 
                  ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-3xl mx-auto'}
                `}>
                  {paginatedListings.map((home) => (
                    <ListingCard key={home.id} home={home} layout={viewMode === 'list' ? 'list' : 'grid'} />
                  ))}
                </div>
              </>
            )}
            
            {/* Pagination (only show if not in map mode and more than one page) */}
            {viewMode !== 'map' && totalPages > 1 && (
              <div className="mt-12 flex flex-wrap justify-center items-center gap-2">
                {/* Previous Button */}
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-stone-200 rounded-lg text-stone-500 hover:bg-white hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft size={16} />
                  <span className="hidden sm:inline">Previous</span>
                </button>
                
                {/* Page Numbers */}
                {getPageNumbers().map((page, index) => (
                  page === 'ellipsis' ? (
                    <span key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center text-stone-400 font-mono text-sm">
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg font-medium font-mono text-sm transition-colors ${
                        currentPage === page
                          ? 'bg-orange-600 text-white shadow-md'
                          : 'border border-stone-200 text-stone-600 hover:bg-white hover:text-orange-600 hover:border-orange-200'
                      }`}
                    >
                      {page}
                    </button>
                  )
                ))}
                
                {/* Next Button */}
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-stone-200 rounded-lg text-stone-600 hover:bg-white hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm flex items-center gap-1 transition-colors"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
