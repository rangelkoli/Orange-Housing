import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Initialize state from URL params
  const [activeTab, setActiveTab] = useState(searchParams.get('type') || 'Rentals');
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    availableDate: searchParams.get('availableDate') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    maxRent: searchParams.get('maxRent') || '',
    pets: searchParams.get('pets') || '',
    furnished: searchParams.get('furnished') || '',
    perfectFor: searchParams.get('perfectFor') || '',
    buildingType: searchParams.get('buildingType') || '',
    searchQuery: searchParams.get('q') || ''
  });

  // Update filters when URL changes
  useEffect(() => {
    setActiveTab(searchParams.get('type') || 'Rentals');
    setFilters({
      location: searchParams.get('location') || '',
      availableDate: searchParams.get('availableDate') || '',
      bedrooms: searchParams.get('bedrooms') || '',
      maxRent: searchParams.get('maxRent') || '',
      pets: searchParams.get('pets') || '',
      furnished: searchParams.get('furnished') || '',
      perfectFor: searchParams.get('perfectFor') || '',
      buildingType: searchParams.get('buildingType') || '',
      searchQuery: searchParams.get('q') || ''
    });
  }, [searchParams]);

  // Updated Tab Order and Labels
  const tabs = [
    { id: 'Rentals', label: 'Rentals', description: '10 Plus Months' },
    { id: 'ShortTerm', label: 'Short Term', description: '9 months or less' },
    { id: 'Sublets', label: 'Sublets', description: 'Take over tenants lease' },
    { id: 'RoomForRent', label: 'Room for Rent', description: 'To share common areas' },
  ];

  // Updated Filter List with new options (Pets, Furnished) and specific order
  const filterOptions = [
    { key: 'location', label: 'Location', icon: MapPin, options: ['Downtown', 'Suburbs', 'Uptown', 'Waterfront'] },
    { key: 'availableDate', label: 'Available Date', icon: CalendarDays, options: ['Immediate', 'Next Month', 'Select Date...'] },
    { key: 'bedrooms', label: 'Bedrooms', icon: Bed, options: ['Studio', '1 Bedroom', '2 Bedrooms', '3+ Bedrooms'] },
    { key: 'maxRent', label: 'Max Rent', icon: DollarSign, options: [] }, // Handled separately
    { key: 'pets', label: 'Pets', icon: PawPrint, options: ['Dogs Allowed', 'Cats Allowed', 'No Pets'] },
    { key: 'furnished', label: 'Furnished', icon: Armchair, options: ['Furnished', 'Unfurnished', 'Partial'] },
    { key: 'perfectFor', label: 'Perfect For', icon: Users, options: ['Students', 'Families', 'Professionals', 'Seniors'] },
    { key: 'buildingType', label: 'Building Type', icon: Building, options: ['Apartment', 'House', 'Studio', 'Condo', 'Townhouse'] },
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (activeTab !== 'Rentals') {
      params.set('type', activeTab);
    }
    if (filters.location) {
      params.set('location', filters.location);
    }
    if (filters.buildingType) {
      params.set('buildingType', filters.buildingType);
    }
    if (filters.availableDate) {
      params.set('availableDate', filters.availableDate);
    }
    if (filters.bedrooms) {
      params.set('bedrooms', filters.bedrooms);
    }
    if (filters.maxRent) {
      params.set('maxRent', filters.maxRent);
    }
    if (filters.pets) {
      params.set('pets', filters.pets);
    }
    if (filters.furnished) {
      params.set('furnished', filters.furnished);
    }
    if (filters.perfectFor) {
      params.set('perfectFor', filters.perfectFor);
    }
    if (filters.searchQuery) {
      params.set('q', filters.searchQuery);
    }
    
    setSearchParams(params);
  };

  const handleReset = () => {
    setFilters({
      location: '',
      availableDate: '',
      bedrooms: '',
      maxRent: '',
      pets: '',
      furnished: '',
      perfectFor: '',
      buildingType: '',
      searchQuery: ''
    });
    setActiveTab('Rentals');
    setSearchParams(new URLSearchParams());
  };

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
                <HoverCard key={tab.id} openDelay={100} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <button
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
                        text-base font-serif tracking-tight transition-colors duration-200
                        ${isActive ? 'text-gray-900 font-bold' : 'text-gray-600 group-hover:text-gray-800'}
                      `}>
                        {tab.label}
                      </span>
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent 
                    className="w-auto px-4 py-2 bg-stone-800 text-stone-50 border-none rounded-lg shadow-xl"
                    sideOffset={5}
                  >
                    <p className="text-xs font-medium font-sans">{tab.description}</p>
                  </HoverCardContent>
                </HoverCard>
              );
            })}
          </div>

          {/* Right Side Buttons (Map View & Favorites) */}
          <div className="hidden sm:flex items-center gap-6">
            <button className="flex items-center gap-2 text-gray-500 hover:text-orange-600 font-medium text-sm transition-colors group font-mono">
              <Heart size={18} className="group-hover:scale-110 transition-transform"/>
              <span>Favorites</span>
            </button>
          </div>
        </div>

        {/* Drill Down Filters Row - 4 columns (2 rows) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {filterOptions.map((filter, index) => (
            <div key={index} className="relative group">
              <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1 font-sans uppercase tracking-wide">{filter.label}</label>
              
              {filter.key === 'maxRent' ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm font-medium font-mono">$</span>
                  </div>
                  <input
                    type="number"
                    placeholder="Any"
                    value={filters.maxRent}
                    onChange={(e) => handleFilterChange('maxRent', e.target.value)}
                    className="w-full pl-6 pr-3 py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-900 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 placeholder-gray-400 truncate font-mono"
                  />
                </div>
              ) : (
                <div className="relative">
                    <button 
                    className="w-full flex items-center justify-between bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-3 py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 active:bg-gray-50 group-focus-within:border-orange-500 group-focus-within:ring-2 group-focus-within:ring-orange-500/20"
                    >
                    <span className={`truncate text-sm font-medium ${filters[filter.key as keyof typeof filters] ? 'text-gray-900' : 'text-gray-500'} font-mono`}>
                        {filters[filter.key as keyof typeof filters] || 'Select...'}
                    </span>
                    <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors shrink-0 ml-2" />
                    </button>
                
                    {/* Dropdown Menu - absolutely positioned within the relative container */}
                    <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 z-50 max-h-60 overflow-y-auto">
                        {filter.options.map((opt, i) => (
                            <button
                            key={i}
                            onClick={() => handleFilterChange(filter.key, opt)}
                            className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 cursor-pointer first:rounded-t-lg last:rounded-b-lg font-mono focus:bg-gray-50 bg-white"
                            >
                            {opt}
                            </button>
                        ))}
                    </div>
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
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              className="w-full pl-11 pr-32 py-3.5 bg-gray-50 border border-gray-200 hover:bg-white hover:border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200 text-base font-mono"
            />
            
            {/* Embedded Action Buttons */}
            <div className="absolute inset-y-1 right-1 flex items-center gap-1">
                <button 
                onClick={handleReset}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                title="Reset Search"
              >
                <RefreshCw size={18} />
              </button>
              <button 
                onClick={handleSearch}
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium text-sm font-mono uppercase tracking-wide"
              >
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
