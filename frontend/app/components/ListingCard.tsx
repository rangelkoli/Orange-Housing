import React, { useState } from "react";
import { useNavigate } from "react-router";
import { 
  Heart, 
  ArrowRightLeft, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Calendar, 
  MapPin, 
  Bed, 
  Bath, 
  Mail 
} from "lucide-react";
import { FaPhone } from "react-icons/fa";
import type { Listing } from "../types/listing";
import { getListingDetailUrl } from "../utils/listingSlug";

interface ListingCardProps {
  home: Listing;
  layout?: 'grid' | 'list';
}

const ListingCard: React.FC<ListingCardProps> = ({ home, layout = 'grid' }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const isList = layout === 'list';

  const handleCardClick = () => {
    const url = getListingDetailUrl(home);
    navigate(url);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (home.images && home.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % home.images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (home.images && home.images.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + home.images.length) % home.images.length
      );
    }
  };

  // If list view, use a horizontal layout but keep the styling
  if (isList) {
    return (
      <div 
        onClick={handleCardClick}
        className='bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-stone-100 cursor-pointer relative flex flex-col md:flex-row h-auto md:h-64'
      >
        {/* Image Section - Fixed width in list view */}
        <div className='relative w-full md:w-72 h-64 md:h-full shrink-0 overflow-hidden'>
          <img
            src={home.images[currentImageIndex]}
            alt={home.address}
            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-10">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2">
              <Eye size={16} className="text-stone-800" />
              <span className="text-sm font-semibold text-stone-800">View</span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevImage}
            className='absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 rounded-full hover:bg-white text-stone-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-20'
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={nextImage}
            className='absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 rounded-full hover:bg-white text-stone-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-20'
          >
            <ChevronRight size={18} />
          </button>

          {/* Availability Banner */}
          <div className="absolute bottom-0 left-0 z-20">
            <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-tr-lg shadow-sm flex items-center gap-2 border border-stone-100">
              <Calendar size={14} className="text-orange-600" />
              <span className="text-xs font-semibold text-stone-800 uppercase tracking-wide font-mono">
                {home.availableDate}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className='p-6 flex flex-col flex-grow justify-between'>
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className='text-xl font-bold text-stone-900 tracking-tight line-clamp-1 font-serif'>
                {home.title}
              </h3>
              <span className="text-lg font-bold text-orange-600 font-mono">{home.price}</span>
            </div>
            
            <div className='flex items-start gap-2 text-stone-500 mb-4'>
              <MapPin size={16} className="mt-0.5 shrink-0 text-stone-400" />
              <p className="text-sm font-medium leading-snug">
                {home.address}, {home.city}
              </p>
            </div>

            <div className='flex items-center gap-6 text-stone-700'>
              <div className="flex items-center gap-2">
                <Bed size={18} className="text-orange-500" />
                <span className="font-semibold font-mono">{home.beds}</span>
                <span className="text-stone-500 text-sm">Beds</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath size={18} className="text-orange-500" />
                <span className="font-semibold font-mono">{home.baths}</span>
                <span className="text-stone-500 text-sm">Baths</span>
              </div>
            </div>
          </div>

          <div className='flex gap-3 mt-4 md:mt-0'>
            <button 
              onClick={(e) => { e.stopPropagation(); }}
              className='flex-1 py-2.5 border border-stone-200 rounded-lg text-stone-600 font-medium hover:bg-stone-50 hover:text-stone-900 hover:border-stone-300 transition-all duration-200 flex items-center justify-center gap-2 group/btn font-mono uppercase text-xs'
            >
              <FaPhone size={16} className="text-stone-400 group-hover/btn:text-stone-600 transition-colors" />
              Call
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); }}
              className='flex-1 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 font-mono uppercase text-xs'
            >
              <Mail size={18} />
              Email
            </button>
          </div>
        </div>
        
        {/* Action Buttons (Absolute in list view too) */}
        <div className="absolute top-4 right-4 flex gap-2 z-20">
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                navigate('/compare');
              }}
              className='p-2 bg-white/90 backdrop-blur-sm rounded-full text-stone-400 hover:text-orange-500 transition-colors shadow-sm group/compare' 
              title="Compare"
            >
              <ArrowRightLeft size={20} className="group-hover/compare:scale-110 transition-transform" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); }}
              className='p-2 bg-white/90 backdrop-blur-sm rounded-full text-stone-400 hover:text-red-500 transition-colors shadow-sm group/heart' 
              title="Save"
            >
              <Heart size={20} className="group-hover/heart:scale-110 transition-transform" />
            </button>
        </div>
      </div>
    );
  }

  // Grid Layout (Default - matches Homepage)
  return (
    <div 
      onClick={handleCardClick}
      className='bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-stone-100 cursor-pointer relative flex flex-col h-full'
    >
      <div className='relative h-64 overflow-hidden shrink-0'>
        <img
          src={home.images[currentImageIndex]}
          alt={home.address}
          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-10">
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2">
            <Eye size={16} className="text-stone-800" />
            <span className="text-sm font-semibold text-stone-800">Click to view details</span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevImage}
          className='absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 rounded-full hover:bg-white text-stone-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-20'
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={nextImage}
          className='absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 rounded-full hover:bg-white text-stone-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-20'
        >
          <ChevronRight size={18} />
        </button>

        <div className="absolute top-4 right-4 flex gap-2 z-20">
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              navigate('/compare');
            }}
            className='p-2 bg-white/90 backdrop-blur-sm rounded-full text-stone-400 hover:text-orange-500 transition-colors shadow-sm group/compare' 
            title="Compare"
          >
            <ArrowRightLeft size={20} className="group-hover/compare:scale-110 transition-transform" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); }}
            className='p-2 bg-white/90 backdrop-blur-sm rounded-full text-stone-400 hover:text-red-500 transition-colors shadow-sm group/heart' 
            title="Save"
          >
            <Heart size={20} className="group-hover/heart:scale-110 transition-transform" />
          </button>
        </div>

        {/* Availability Banner */}
        <div className="absolute bottom-0 left-0">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-tr-lg shadow-sm flex items-center gap-2 border border-stone-100">
            <Calendar size={14} className="text-orange-600" />
            <span className="text-xs font-semibold text-stone-800 uppercase tracking-wide font-mono">
              {home.availableDate}
            </span>
          </div>
        </div>

        {/* Dots indicators */}
        <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5'>
          {home.images.map((_: any, idx: number) => (
            <div
              key={idx}
              className={`w-1.5 h-1.5 rounded-full shadow-sm transition-colors ${idx === currentImageIndex ? "bg-white scale-110" : "bg-white/60"}`}
            />
          ))}
        </div>
      </div>
      
      <div className='p-6 flex flex-col gap-4 flex-grow'>
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className='text-xl font-bold text-stone-900 tracking-tight line-clamp-1 font-serif'>
              {home.title}
            </h3>
            <span className="text-lg font-bold text-orange-600 font-mono">{home.price}</span>
          </div>
          
          <div className='flex items-start gap-2 text-stone-500'>
            <MapPin size={16} className="mt-0.5 shrink-0 text-stone-400" />
            <p className="text-sm font-medium leading-snug">
              {home.address}, {home.city}
            </p>
          </div>
        </div>

        <div className='flex items-center py-4 border-t border-b border-stone-100 mt-auto'>
          <div className="flex-1 flex items-center justify-center gap-2 text-stone-700 font-mono">
            <Bed size={18} className="text-orange-500" />
            <span className="font-semibold">{home.beds}</span>
            <span className="text-stone-500 text-sm">Beds</span>
          </div>
          <div className="w-px h-4 bg-stone-200" />
          <div className="flex-1 flex items-center justify-center gap-2 text-stone-700 font-mono">
            <Bath size={18} className="text-orange-500" />
            <span className="font-semibold">{home.baths}</span>
            <span className="text-stone-500 text-sm">Baths</span>
          </div>
        </div>

        <div className='flex gap-3'>
          <button 
            onClick={(e) => { e.stopPropagation(); }}
            className='flex-1 py-2.5 border border-stone-200 rounded-lg text-stone-600 font-medium hover:bg-stone-50 hover:text-stone-900 hover:border-stone-300 transition-all duration-200 flex items-center justify-center gap-2 group/btn font-mono uppercase text-xs'
          >
            <FaPhone size={16} className="text-stone-400 group-hover/btn:text-stone-600 transition-colors" />
            Call
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); }}
            className='flex-1 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 font-mono uppercase text-xs'
          >
            <Mail size={18} />
            Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
