import React from "react";
import { Link } from "react-router";
import { Heart, ArrowRightLeft } from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import type { Listing } from "../types/listing";

interface ListingCardProps {
  home: Listing;
  layout?: 'grid' | 'list';
}

const ListingCard: React.FC<ListingCardProps> = ({ home, layout = 'grid' }) => {
  const isList = layout === 'list';

  return (
    <Card className={`group overflow-hidden border-border bg-white hover:shadow-xl transition-all duration-300 rounded-xl flex ${isList ? 'flex-col md:flex-row h-auto' : 'flex-col h-full'} gap-0 p-0`}>
      {/* Image Section */}
      <div className={`relative overflow-hidden ${isList ? 'w-full md:w-2/5 md:max-w-[300px] aspect-[4/3] md:aspect-auto' : 'aspect-[4/3] w-full'}`}>
        <img
          src={home.images[0]}
          alt={home.address}
          className='object-cover w-full h-full group-hover:scale-105 transition-transform duration-500'
        />
        <div className='absolute top-3 right-3 flex gap-2'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className='h-9 w-9 rounded-full bg-white flex items-center justify-center text-stone-400 hover:text-blue-600 transition-colors shadow-sm' title="Compare">
                  <ArrowRightLeft size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Compare</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className='h-9 w-9 rounded-full bg-white flex items-center justify-center text-stone-400 hover:text-red-500 transition-colors shadow-sm' title="Add to Favorites">
                  <Heart size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add to Favorites</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className='absolute bottom-0 left-0 bg-orange-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-tr-lg shadow-sm'>
          {home.availableDate}
        </div>
      </div>

      {/* Content Section */}
      <div className={`flex flex-col flex-grow ${isList ? 'justify-between' : ''}`}>
        <CardContent className={`p-5 ${isList ? 'pb-2' : 'flex-grow'}`}>
          <div className='mb-4'>
            <div className="flex justify-between items-start mb-2">
              <h3 className='text-xl font-bold text-stone-900 truncate pr-2'>
                {home.title}
              </h3>
              <span className="text-lg font-semibold text-orange-600 shrink-0">{home.price}</span>
            </div>

            <div className='space-y-0.5 mb-3'>
              <p className='text-stone-700 font-medium text-base truncate'>
                {home.address}
              </p>
              <p className='text-stone-500 text-sm truncate'>{home.city}</p>
            </div>

            <div className='flex items-center gap-4 text-stone-500 text-sm font-medium'>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-stone-700">{home.beds}</span> Beds
              </div>
              <span className='w-1 h-1 rounded-full bg-stone-300' />
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-stone-700">{home.baths}</span> Baths
              </div>
              {isList && (
                <>
                  <span className='w-1 h-1 rounded-full bg-stone-300' />
                  <span className="text-stone-400">1,200 sqft</span>
                </>
              )}
            </div>
            
            {isList && (
               <p className="mt-4 text-stone-500 text-sm line-clamp-2">
                 Beautiful modern home located in the heart of the city. Features include hardwood floors, updated kitchen with stainless steel appliances, and a spacious backyard perfect for entertaining.
               </p>
            )}
          </div>
        </CardContent>

        <CardFooter className={`p-5 ${isList ? 'pt-0 justify-end' : 'pt-0'}`}>
          <Button
            className={`${isList ? 'w-auto px-8' : 'w-full'} bg-[#1FA86A] hover:bg-orange-700 text-white font-semibold h-10 shadow-sm transition-all`}
            asChild
          >
            <Link to={`/listings/${home.id}`}>Details</Link>
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ListingCard;
