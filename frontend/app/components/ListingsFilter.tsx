import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  RefreshCw, 
  MapPin,
  Bed,
  DollarSign,
  CalendarDays,
  Map,
  PawPrint,
  Armchair,
  Heart,
  Users,
  Building
} from 'lucide-react';

const ListingFilter = () => {
  const [activeTab, setActiveTab] = useState('Rentals');

  // Updated Tab Order and Labels
  const tabs = [
    { id: 'Rentals', label: 'Rentals - 10 Plus Months' },
    { id: 'ShortTerm', label: 'Short term - 9 months or less' },
    { id: 'Sublets', label: 'Sublets - Take over tenants lease' },
    { id: 'RoomForRent', label: 'Room for Rent - To share common areas' },
  ];

  // Updated Filter List with new options (Pets, Furnished) and specific order
  const filters = [
    { label: 'Location', icon: MapPin, options: ['Downtown', 'Suburbs', 'Uptown', 'Waterfront'] },
    { label: 'Available Date', icon: CalendarDays, options: ['Immediate', 'Next Month', 'Select Date...'] },
    { label: 'Bedrooms', icon: Bed, options: ['Studio', '1 Bedroom', '2 Bedrooms', '3+ Bedrooms'] },
    { label: 'Max Rent', icon: DollarSign, options: ['$1000', '$1500', '$2000', '$2500+'] },
    { label: 'Pets', icon: PawPrint, options: ['Dogs Allowed', 'Cats Allowed', 'No Pets'] },
    { label: 'Furnished', icon: Armchair, options: ['Furnished', 'Unfurnished', 'Partial'] },
    { label: 'Perfect For', icon: Users, options: ['Students', 'Families', 'Professionals', 'Seniors'] },
    { label: 'Building Type', icon: Building, options: ['Apartment', 'House', 'Studio', 'Condo', 'Townhouse'] },
  ];

  return (
    <div className="w-full font-sans">
      

      {/* Main Search Card */}
      <div className="w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 text-gray-900">
        
        {/* Top Bar with Radio Tabs and Right-Side Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 mb-6 pb-4 gap-4">
          
          {/* Tabs Group */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 w-full sm:w-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="group flex items-center gap-2 cursor-pointer focus:outline-none"
                >
                  {/* Custom Radio Button */}
                  <div className={`
                    w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200
                    ${isActive 
                      ? 'border-orange-600 bg-white' 
                      : 'border-gray-300 group-hover:border-orange-400 bg-white'
                    }
                  `}>
                    {isActive && (
                      <div className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-in zoom-in duration-200" />
                    )}
                  </div>
                  
                  <span className={`
                    text-sm font-semibold transition-colors duration-200
                    ${isActive ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-800'}
                  `}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Side Buttons (Map View & Favorites) */}
          <div className="hidden sm:flex items-center gap-6">
            <button className="flex items-center gap-2 text-gray-500 hover:text-orange-600 font-medium text-sm transition-colors group">
              <Heart size={18} className="group-hover:scale-110 transition-transform"/>
              <span>Favorites</span>
            </button>
          </div>
        </div>

        {/* Drill Down Filters Row - 4 columns (2 rows) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {filters.map((filter, index) => (
            <div key={index} className="relative group">
              <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">{filter.label}</label>
              
              {filter.label === 'Max Rent' ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm font-medium">$</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Any"
                    className="w-full pl-6 pr-3 py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-900 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 placeholder-gray-400 truncate"
                  />
                </div>
              ) : (
                <button 
                  className="w-full flex items-center justify-between bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-3 py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 active:bg-gray-50"
                >
                  <span className="truncate text-sm font-medium text-gray-900">
                    Select...
                  </span>
                  <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors shrink-0 ml-2" />
                </button>
              )}
              
              {/* Dropdown Menu */}
              {filter.label !== 'Max Rent' && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 invisible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 z-20 transform translate-y-1 group-focus-within:translate-y-0">
                  {filter.options.map((opt, i) => (
                    <div key={i} className="px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 cursor-pointer first:rounded-t-lg last:rounded-b-lg">
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Search Input Row */}
        <div className="relative flex items-center">
          <div className="relative flex-grow group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400 group-focus-within:text-orange-600 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Enter City, Neighborhood, ZIP, or Listing ID..."
              className="w-full pl-11 pr-32 py-3.5 bg-gray-50 border border-gray-200 hover:bg-white hover:border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200 text-base"
            />
            
            {/* Embedded Action Buttons */}
            <div className="absolute inset-y-1 right-1 flex items-center gap-1">
                <button 
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                title="Reset Search"
              >
                <RefreshCw size={18} />
              </button>
              <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium text-sm">
                Search
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ListingFilter;
