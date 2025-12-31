import { Link } from "react-router";
import { Heart, Trash2, ArrowLeft, Home, Bed, Bath, MapPin, Calendar } from "lucide-react";
import { useFavoritesStore } from "../stores/favoritesStore";
import ListingCard from "../components/ListingCard";
import { Button } from "@/components/ui/button";

export default function FavoritesPage() {
  const { favorites, clearFavorites, removeFavorite } = useFavoritesStore();

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-orange-600 transition-colors mb-3 no-underline"
              >
                <ArrowLeft size={16} />
                Back to Home
              </Link>
              <h1 className="text-3xl font-bold text-stone-900 font-serif flex items-center gap-3">
                <Heart className="h-8 w-8 text-red-500 fill-current" />
                My Favorites
              </h1>
              <p className="text-stone-500 mt-2">
                {favorites.length === 0 
                  ? "You haven't saved any listings yet" 
                  : `${favorites.length} saved listing${favorites.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            
            {favorites.length > 0 && (
              <Button
                variant="outline"
                onClick={clearFavorites}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
              >
                <Trash2 size={16} className="mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favorites.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-stone-100 mb-6">
              <Heart size={40} className="text-stone-300" />
            </div>
            <h2 className="text-2xl font-bold text-stone-900 mb-3 font-serif">No favorites yet</h2>
            <p className="text-stone-500 max-w-md mx-auto mb-8">
              Start exploring listings and click the heart icon to save your favorite properties here for easy access.
            </p>
            <Link to="/listings?type=rentals">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                <Home size={18} className="mr-2" />
                Browse Listings
              </Button>
            </Link>
          </div>
        ) : (
          /* Favorites Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((listing) => (
              <div key={listing.id} className="relative">
                <ListingCard home={listing} layout="grid" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
