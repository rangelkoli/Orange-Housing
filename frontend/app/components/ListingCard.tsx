import React from 'react';
import { Link } from 'react-router';
import { Heart } from 'lucide-react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import type { Listing } from '../types/listing';

interface ListingCardProps {
  home: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ home }) => {
  return (
    <Card className="group overflow-hidden border-border bg-white hover:shadow-xl transition-all duration-300 rounded-xl flex flex-col h-full gap-0 p-0">
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={home.images[0]} 
          alt={home.address} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <button className="h-9 w-9 rounded-full bg-white flex items-center justify-center text-stone-400 hover:text-red-500 transition-colors shadow-sm">
            <Heart size={20} />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 bg-orange-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-tr-lg shadow-sm">
          {home.availableDate}
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-5 flex-grow">
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-stone-900 mb-1">{home.price}</h3>
          <div className="flex items-center gap-2 text-stone-500 text-sm font-medium mb-3">
            <span>{home.beds} Beds</span>
            <span className="w-1 h-1 rounded-full bg-stone-300" />
            <span>{home.baths} Baths</span>
          </div>
          
          <div className="space-y-0.5">
            <p className="text-stone-700 font-medium text-base truncate">{home.address}</p>
            <p className="text-stone-500 text-sm truncate">{home.city}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 grid grid-cols-2 gap-3">
        <Button variant="outline" className="w-full border-stone-200 text-stone-700 hover:bg-stone-50 hover:text-stone-900 font-semibold h-10">
          Compare
        </Button>
        <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold h-10 shadow-sm" asChild>
          <Link to={`/listings/${home.id}`}>Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;
