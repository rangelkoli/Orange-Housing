import React, { useState } from "react";
import { useNavigate } from "react-router";
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
} from "lucide-react";
import { Calendar } from "./ui/calendar";

const SearchWidget = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Rentals");
  const [filters, setFilters] = useState({
    location: "All",
    buildingType: "Building Type - All",
    availableDate: "Available NOW",
    bedrooms: "All",
    maxRent: "",
    pets: "All",
    furnished: "All",
    searchQuery: "",
  });

  interface SelectedDate {
    day: number;
    month: number;
    year: number;
  }

  const [selectedDate, setSelectedDate] = useState<SelectedDate | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [locationSearch, setLocationSearch] = useState("");
  const filtersRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filtersRef.current &&
        !filtersRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  // Updated Tab Order and Labels
  const tabs = [
    { id: "Rentals", label: "Rentals" },
    { id: "ShortTerm", label: "Short-Term" },
    { id: "Sublets", label: "Sublets" },
    { id: "RoomForRent", label: "Rooms for Rent" },
  ];

  // Filter options organized by category
  const filterOptions = {
    location: [
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
    ],
    buildingType: [
      "Building Type - All",
      "Apartment Complex",
      "Multi-Family",
      "Whole House",
    ],
    bedrooms: ["All", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Studio"],
    pets: [
      "All",
      "Dogs Allowed",
      "Cats Allowed",
      "No Pets",
      "Contact Landlord",
    ],
    furnished: ["All", "Furnished", "Unfurnished", "Partial"],
  };

  // Filter locations based on search
  const filteredLocations = filterOptions.location.filter((loc) =>
    loc.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const handleReset = () => {
    setFilters({
      location: "All",
      buildingType: "Building Type - All",
      availableDate: "Available NOW",
      bedrooms: "All",
      maxRent: "",
      pets: "All",
      furnished: "All",
      searchQuery: "",
    });
    setSelectedDate(null);
    setActiveDropdown(null);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    // Add activeTab as type
    if (activeTab !== "Rentals") {
      params.set("type", activeTab);
    }
    
    // Add filters to query params only if they're not default values
    if (filters.location && filters.location !== "All") {
      params.set("location", filters.location);
    }
    if (filters.buildingType && filters.buildingType !== "Building Type - All") {
      params.set("buildingType", filters.buildingType);
    }
    if (filters.availableDate && filters.availableDate !== "Available NOW") {
      params.set("availableDate", filters.availableDate);
    }
    if (filters.bedrooms && filters.bedrooms !== "All") {
      params.set("bedrooms", filters.bedrooms);
    }
    if (filters.maxRent) {
      params.set("maxRent", filters.maxRent);
    }
    if (filters.pets && filters.pets !== "All") {
      params.set("pets", filters.pets);
    }
    if (filters.furnished && filters.furnished !== "All") {
      params.set("furnished", filters.furnished);
    }
    if (filters.searchQuery) {
      params.set("q", filters.searchQuery);
    }
    
    const queryString = params.toString();
    navigate(queryString ? `/listings?${queryString}` : "/listings");
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleOptionSelect = (filterName: string, value: string) => {
    handleFilterChange(filterName, value);
    setActiveDropdown(null);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate({
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    });
    handleFilterChange("availableDate", date.toLocaleDateString());
    setActiveDropdown(null);
  };

  return (
    <div className='w-full font-sans'>
      {/* Main Search Card */}
      <div className='w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 text-gray-900'>
        {/* Top Bar with Radio Tabs and Right-Side Actions */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 mb-6 pb-4 gap-4'>
          {/* Tabs Group */}
          <div className='flex flex-wrap items-center gap-x-6 gap-y-2 w-full sm:w-auto'>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className='group flex items-center gap-2 cursor-pointer focus:outline-none'
                >
                  {/* Custom Radio Button */}
                  <div
                    className={`
                    w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200
                    ${
                      isActive
                        ? "border-orange-600 bg-white"
                        : "border-gray-300 group-hover:border-orange-400 bg-white"
                    }
                  `}
                  >
                    {isActive && (
                      <div className='w-2.5 h-2.5 rounded-full bg-orange-600 animate-in zoom-in duration-200' />
                    )}
                  </div>

                  <span
                    className={`
                    text-base font-serif tracking-tight transition-colors duration-200
                    ${isActive ? "text-gray-900 font-bold" : "text-gray-600 group-hover:text-gray-800"}
                  `}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Side Buttons (Map View & Favorites) */}
          <div className='hidden sm:flex items-center gap-6'>
            <button className='flex items-center gap-2 text-gray-500 hover:text-orange-600 font-medium text-sm transition-colors group font-mono'>
              <Map
                size={18}
                className='group-hover:scale-110 transition-transform'
              />
              <span>Map View</span>
            </button>
            <button className='flex items-center gap-2 text-gray-500 hover:text-orange-600 font-medium text-sm transition-colors group font-mono'>
              <Heart
                size={18}
                className='group-hover:scale-110 transition-transform'
              />
              <span>Favorites</span>
            </button>
          </div>
        </div>

        {/* Drill Down Filters Row */}
        <div className='grid grid-cols-12 gap-3 mb-6' ref={filtersRef}>
          {/* Location Dropdown with Search */}
          <div className='relative col-span-12 md:col-span-4 lg:col-span-3'>
            <label className='block text-xs font-medium text-gray-500 mb-1.5 ml-1 font-sans tracking-wide uppercase'>
              Location
            </label>
            <button
              onClick={() => {
                toggleDropdown("location");
                setLocationSearch("");
              }}
              className='w-full flex items-center justify-between bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-3 py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 active:bg-gray-50 group'
            >
              <span className='truncate text-sm font-medium text-gray-900 font-mono group-hover:text-orange-600 transition-colors'>
                {filters.location}
              </span>
              <ChevronDown
                size={14}
                className='text-gray-400 transition-colors shrink-0 ml-2'
              />
            </button>
            {activeDropdown === "location" && (
              <div className='absolute top-full left-0 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-lg z-20'>
                {/* Search Input */}
                <div className='p-2 border-b border-gray-100'>
                  <div className='relative'>
                    <Search size={14} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                    <input
                      type='text'
                      placeholder='Search neighborhoods...'
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      className='w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500'
                      autoFocus
                    />
                  </div>
                </div>
                {/* Scrollable Options */}
                <div className='max-h-60 overflow-y-auto'>
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          handleOptionSelect("location", opt);
                          setLocationSearch("");
                        }}
                        className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 font-mono cursor-pointer ${
                          filters.location === opt ? 'bg-orange-50 text-orange-600' : ''
                        }`}
                      >
                        {opt}
                      </button>
                    ))
                  ) : (
                    <div className='px-4 py-3 text-sm text-gray-500 text-center'>
                      No neighborhoods found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Building Type Dropdown */}
          <div className='relative col-span-12 md:col-span-4 lg:col-span-3'>
            <label className='block text-xs font-medium text-gray-500 mb-1.5 ml-1 font-sans tracking-wide uppercase'>
              Building Type
            </label>
            <button
              onClick={() => toggleDropdown("buildingType")}
              className='w-full flex items-center justify-between bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-3 py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 active:bg-gray-50 group'
            >
              <span className='truncate text-sm font-medium text-gray-900 font-mono group-hover:text-orange-600 transition-colors'>
                {filters.buildingType}
              </span>
              <ChevronDown
                size={14}
                className='text-gray-400 transition-colors shrink-0 ml-2'
              />
            </button>
            {activeDropdown === "buildingType" && (
              <div className='absolute top-full left-0 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-lg z-20'>
                {filterOptions.buildingType.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleOptionSelect("buildingType", opt)}
                    className='w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 font-mono cursor-pointer first:rounded-t-lg last:rounded-b-lg'
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Available Date Dropdown */}
          <div className='relative col-span-12 md:col-span-4 lg:col-span-3'>
            <label className='block text-xs font-medium text-gray-500 mb-1.5 ml-1 font-sans tracking-wide uppercase'>
              Available Date
            </label>
            <button
              onClick={() => toggleDropdown("availableDate")}
              className='w-full flex items-center justify-between bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-3 py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 active:bg-gray-50 group'
            >
              <span className='truncate text-sm font-medium text-gray-900 font-mono group-hover:text-orange-600 transition-colors'>
                {filters.availableDate}
              </span>
              <ChevronDown
                size={14}
                className='text-gray-400 transition-colors shrink-0 ml-2'
              />
            </button>
            {activeDropdown === "availableDate" && (
              <div className='absolute top-full left-0 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-lg z-20 min-w-[300px]'>
                <button
                  onClick={() => {
                    handleOptionSelect("availableDate", "Available NOW");
                  }}
                  className='w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 font-mono cursor-pointer rounded-t-lg border-b border-gray-100'
                >
                  Available NOW
                </button>
                <div className='p-3 flex justify-center z-20'>
                  <Calendar
                    mode='single'
                    captionLayout='dropdown'
                    selected={
                      selectedDate
                        ? new Date(
                            selectedDate.year,
                            selectedDate.month - 1,
                            selectedDate.day
                          )
                        : undefined
                    }
                    onSelect={handleDateSelect}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    fromYear={new Date().getFullYear()}
                    toYear={new Date().getFullYear() + 5}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bedrooms Dropdown */}
          <div className='relative col-span-12 md:col-span-4 lg:col-span-3'>
            <label className='block text-xs font-medium text-gray-500 mb-1.5 ml-1 font-sans tracking-wide uppercase'>
              Bedrooms
            </label>
            <button
              onClick={() => toggleDropdown("bedrooms")}
              className='w-full flex items-center justify-between bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-3 py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 active:bg-gray-50 group'
            >
              <span className='truncate text-sm font-medium text-gray-900 font-mono group-hover:text-orange-600 transition-colors'>
                {filters.bedrooms}
              </span>
              <ChevronDown
                size={14}
                className='text-gray-400 transition-colors shrink-0 ml-2'
              />
            </button>
            {activeDropdown === "bedrooms" && (
              <div className='absolute top-full left-0 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto'>
                {filterOptions.bedrooms.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleOptionSelect("bedrooms", opt)}
                    className='w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 font-mono cursor-pointer first:rounded-t-lg last:rounded-b-lg'
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Max Rent */}
          <div className='relative col-span-12 md:col-span-4 lg:col-span-4'>
            <label className='block text-xs font-medium text-gray-500 mb-1.5 ml-1 font-sans tracking-wide uppercase'>
              Max Rent
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <span className='text-gray-500 text-sm font-medium font-mono'>$</span>
              </div>
              <input
                type='number'
                placeholder='Max total rent'
                value={filters.maxRent}
                onChange={(e) => handleFilterChange("maxRent", e.target.value)}
                className='w-full pl-6 pr-3 py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-900 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 placeholder-gray-400 font-mono'
              />
            </div>
          </div>

          {/* Pets Dropdown */}
          <div className='relative col-span-12 md:col-span-4 lg:col-span-4'>
            <label className='block text-xs font-medium text-gray-500 mb-1.5 ml-1 font-sans tracking-wide uppercase'>
              Pets
            </label>
            <button
              onClick={() => toggleDropdown("pets")}
              className='w-full flex items-center justify-between bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-3 py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 active:bg-gray-50 group'
            >
              <span className='truncate text-sm font-medium text-gray-900 font-mono group-hover:text-orange-600 transition-colors'>
                {filters.pets}
              </span>
              <ChevronDown
                size={14}
                className='text-gray-400 transition-colors shrink-0 ml-2'
              />
            </button>
            {activeDropdown === "pets" && (
              <div className='absolute top-full left-0 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-lg z-20'>
                {filterOptions.pets.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleOptionSelect("pets", opt)}
                    className='w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 font-mono cursor-pointer first:rounded-t-lg last:rounded-b-lg'
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Furnished Dropdown */}
          <div className='relative col-span-12 md:col-span-4 lg:col-span-4'>
            <label className='block text-xs font-medium text-gray-500 mb-1.5 ml-1 font-sans tracking-wide uppercase'>
              Furnished
            </label>
            <button
              onClick={() => toggleDropdown("furnished")}
              className='w-full flex items-center justify-between bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-3 py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 active:bg-gray-50 group'
            >
              <span className='truncate text-sm font-medium text-gray-900 font-mono group-hover:text-orange-600 transition-colors'>
                {filters.furnished}
              </span>
              <ChevronDown
                size={14}
                className='text-gray-400 transition-colors shrink-0 ml-2'
              />
            </button>
            {activeDropdown === "furnished" && (
              <div className='absolute top-full left-0 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-lg z-20'>
                {filterOptions.furnished.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleOptionSelect("furnished", opt)}
                    className='w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 font-mono cursor-pointer first:rounded-t-lg last:rounded-b-lg'
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search Input Row */}
        <div className='relative flex items-center gap-2 mb-4'>
          <div className='relative grow group'>
            <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
              <Search
                size={20}
                className='text-gray-400 group-focus-within:text-orange-600 transition-colors'
              />
            </div>
            <input
              type='text'
              placeholder='Enter City, Neighborhood, ZIP, or Listing ID...'
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className='w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 hover:bg-white hover:border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200 text-base font-mono'
            />
          </div>

          {/* Search and Reset Buttons */}
          <button 
            onClick={handleSearch}
            className='flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium text-sm font-sans tracking-tight'
          >
            <Search size={18} />
            Search
          </button>

          <button
            onClick={handleReset}
            className='flex items-center gap-2 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-6 py-3.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium text-sm bg-white hover:bg-gray-50 font-sans tracking-tight'
          >
            <RefreshCw size={18} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchWidget;
