import React, { useState, useEffect, useRef } from 'react';
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
  PawPrint,
  Armchair,
  Heart,
  Users,
  Building
} from 'lucide-react';
import { Calendar } from "./ui/calendar";

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

  // State for location search and dropdown
  const [locationSearch, setLocationSearch] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const filtersRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(prev => (prev === name ? null : name));
  };

  const handleOptionSelect = (filterName: string, value: string) => {
    handleFilterChange(filterName, value);
    setActiveDropdown(null);
  };

  // Selected date for calendar
  interface SelectedDate {
    day: number;
    month: number;
    year: number;
  }
  const [selectedDate, setSelectedDate] = useState<SelectedDate | null>(null);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate({
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    });
    handleFilterChange('availableDate', date.toLocaleDateString());
    setActiveDropdown(null);
  };

  // Updated Tab Order and Labels
  const tabs = [
    { id: 'Rentals', label: 'Rentals', description: '10 Plus Months' },
    { id: 'ShortTerm', label: 'Short Term', description: '9 months or less' },
    { id: 'Sublets', label: 'Sublets', description: 'Take over tenants lease' },
    { id: 'RoomForRent', label: 'Room for Rent', description: 'To share common areas' },
  ];

  // Location options (same as SearchWidget)
  const locationOptions = [
    "All",
    "Armory Square",
    "Brighton",
    "Camillus",
    "Cicero",
    "Clay",
    "Clinton Square",
    "DeWitt",
    "Downtown",
    "East Syracuse",
    "Eastwood",
    "Elbridge",
    "Fabius",
    "Fayetteville",
    "Franklin Sq",
    "Geddes",
    "Inner Harbor",
    "Jamesville",
    "Lafayette",
    "Liverpool",
    "Manlius",
    "Marcellus",
    "Meadbrook",
    "Near Micron",
    "North Valley",
    "Onondaga Hill",
    "Outer Comstock",
    "Pompey",
    "Salt Springs",
    "Sedgwick",
    "South Valley",
    "Strathmore",
    "Syracuse Univ",
    "Tipperary Hill",
    "University Hill",
    "Westcott",
    "Westvale",
  ];

  // Filter locations based on search
  const filteredLocations = locationOptions.filter((loc) =>
    loc.toLowerCase().includes(locationSearch.toLowerCase())
  );

  // Updated Filter List with new options (Pets, Furnished) and specific order
  // Note: Location and Available Date are now handled separately
  const filterOptions = [
    { key: 'bedrooms', label: 'Bedrooms', icon: Bed, options: ['All', 'Studio', '1', '2', '3', '4', '5', '6', '7', '8'] },
    { key: 'maxRent', label: 'Max Rent', icon: DollarSign, options: [] }, // Handled separately
    { key: 'pets', label: 'Pets', icon: PawPrint, options: ['All', 'Dogs Allowed', 'Cats Allowed', 'No Pets', 'Contact Landlord'] },
    { key: 'furnished', label: 'Furnished', icon: Armchair, options: ['All', 'Furnished', 'Unfurnished', 'Partial'] },
    { key: 'perfectFor', label: 'Perfect For', icon: Users, options: ['Students', 'Families', 'Professionals', 'Seniors'] },
    { key: 'buildingType', label: 'Building Type', icon: Building, options: ['Building Type - All', 'Apartment Complex', 'Multi-Family', 'Whole House'] },
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
    setSelectedDate(null);
    setActiveDropdown(null);
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

        {/* Drill Down Filters Row */}
        <div className="grid grid-cols-12 gap-3 mb-6" ref={filtersRef}>
          {/* Location Dropdown with Search */}
          <div className="relative col-span-12 md:col-span-4 lg:col-span-3">
            <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1 font-sans tracking-wide uppercase">
              Location
            </label>
            <button
              onClick={() => {
                toggleDropdown('location');
                setLocationSearch('');
              }}
              className="w-full flex items-center justify-between bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-3 py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 active:bg-gray-50 group"
            >
              <span className="truncate text-sm font-medium text-gray-900 font-mono group-hover:text-orange-600 transition-colors">
                {filters.location || 'All'}
              </span>
              <ChevronDown size={14} className="text-gray-400 transition-colors shrink-0 ml-2" />
            </button>
            {activeDropdown === 'location' && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-lg z-20">
                {/* Search Input */}
                <div className="p-2 border-b border-gray-100">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search neighborhoods..."
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      autoFocus
                    />
                  </div>
                </div>
                {/* Scrollable Options */}
                <div className="max-h-60 overflow-y-auto">
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          handleOptionSelect('location', opt === 'All' ? '' : opt);
                          setLocationSearch('');
                        }}
                        className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 font-mono cursor-pointer ${
                          filters.location === opt || (filters.location === '' && opt === 'All') ? 'bg-orange-50 text-orange-600' : ''
                        }`}
                      >
                        {opt}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                      No neighborhoods found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Available Date Dropdown with Calendar */}
          <div className="relative col-span-12 md:col-span-4 lg:col-span-3">
            <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1 font-sans tracking-wide uppercase">
              Available Date
            </label>
            <button
              onClick={() => toggleDropdown('availableDate')}
              className="w-full flex items-center justify-between bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-3 py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 active:bg-gray-50 group"
            >
              <span className="truncate text-sm font-medium text-gray-900 font-mono group-hover:text-orange-600 transition-colors">
                {filters.availableDate || 'Available NOW'}
              </span>
              <ChevronDown size={14} className="text-gray-400 transition-colors shrink-0 ml-2" />
            </button>
            {activeDropdown === 'availableDate' && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-lg z-20 min-w-[300px]">
                <button
                  onClick={() => handleOptionSelect('availableDate', '')}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 font-mono cursor-pointer rounded-t-lg border-b border-gray-100"
                >
                  Available NOW
                </button>
                <div className="p-3 flex justify-center z-20">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    selected={
                      selectedDate
                        ? new Date(selectedDate.year, selectedDate.month - 1, selectedDate.day)
                        : undefined
                    }
                    onSelect={handleDateSelect}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    fromYear={new Date().getFullYear()}
                    toYear={new Date().getFullYear() + 5}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Other Filters */}
          {filterOptions.map((filter, index) => (
            <div key={index} className="relative col-span-6 md:col-span-4 lg:col-span-3">
              <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1 font-sans uppercase tracking-wide">
                {filter.label}
              </label>
              
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
                <div className="relative group">
                  <button 
                    onClick={() => toggleDropdown(filter.key)}
                    className="w-full flex items-center justify-between bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-3 py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 active:bg-gray-50"
                  >
                    <span className={`truncate text-sm font-medium ${filters[filter.key as keyof typeof filters] ? 'text-gray-900' : 'text-gray-500'} font-mono`}>
                      {filters[filter.key as keyof typeof filters] || 'Select...'}
                    </span>
                    <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors shrink-0 ml-2" />
                  </button>
                  
                  {activeDropdown === filter.key && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                      {filter.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleOptionSelect(filter.key, opt === 'All' ? '' : opt)}
                          className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 cursor-pointer first:rounded-t-lg last:rounded-b-lg font-mono focus:bg-gray-50 bg-white ${
                            filters[filter.key as keyof typeof filters] === opt || (filters[filter.key as keyof typeof filters] === '' && opt === 'All') ? 'bg-orange-50 text-orange-600' : ''
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Search Input Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
          {/* Search Input - Full width on mobile */}
          <div className="relative w-full sm:flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400 group-focus-within:text-orange-600 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Enter City, Neighborhood, ZIP, or Listing ID..."
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 hover:bg-white hover:border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200 text-base font-mono"
            />
          </div>

          {/* Search and Reset Buttons - Row below on mobile, inline on desktop */}
          <div className="flex items-center gap-2">
            <button 
              onClick={handleSearch}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium text-sm font-sans tracking-tight"
            >
              <Search size={18} />
              Search
            </button>

            <button
              onClick={handleReset}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-6 py-3.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium text-sm bg-white hover:bg-gray-50 font-sans tracking-tight"
            >
              <RefreshCw size={18} />
              Reset
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ListingFilter;
