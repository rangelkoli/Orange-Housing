import React, { useState } from "react";
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
  const [activeTab, setActiveTab] = useState("Rentals");
  const [filters, setFilters] = useState({
    location: "All",
    buildingType: "Building Type - All",
    availableDate: "Available NOW",
    bedrooms: "All",
    maxRent: "",
    pets: "All",
    furnished: "All",
  });

  interface SelectedDate {
    day: number;
    month: number;
    year: number;
  }

  const [selectedDate, setSelectedDate] = useState<SelectedDate | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
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
    { id: "ShortTerm", label: "Short Term" },
    { id: "Sublets", label: "Sublets" },
    { id: "RoomForRent", label: "Room For Rent" },
  ];

  // Filter options organized by category
  const filterOptions = {
    location: ["All", "Downtown", "Suburbs", "Uptown", "Waterfront"],
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

  const handleReset = () => {
    setFilters({
      location: "All",
      buildingType: "Building Type - All",
      availableDate: "Available NOW",
      bedrooms: "All",
      maxRent: "",
      pets: "All",
      furnished: "All",
    });
    setSelectedDate(null);
    setActiveDropdown(null);
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
                    text-sm font-semibold transition-colors duration-200
                    ${isActive ? "text-gray-900" : "text-gray-600 group-hover:text-gray-800"}
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
            <button className='flex items-center gap-2 text-gray-500 hover:text-orange-600 font-medium text-sm transition-colors group'>
              <Map
                size={18}
                className='group-hover:scale-110 transition-transform'
              />
              <span>Map View</span>
            </button>
            <button className='flex items-center gap-2 text-gray-500 hover:text-orange-600 font-medium text-sm transition-colors group'>
              <Heart
                size={18}
                className='group-hover:scale-110 transition-transform'
              />
              <span>Favorites</span>
            </button>
          </div>
        </div>

        {/* Header Text */}
        <div className='mb-6 text-center md:text-left'>
          <h2 className='text-xl md:text-2xl font-bold text-[#0D2D6C] text-justify'>
            Find Your Perfect <span className='text-orange-600'>Home</span>,{" "}
            <span className='text-orange-600'>Apartment</span>, or{" "}
            <span className='text-orange-600'>Room</span> for Rent in Syracuse,
            NY
          </h2>
        </div>

        {/* Drill Down Filters Row */}
        <div className='grid grid-cols-12 gap-3 mb-6' ref={filtersRef}>
          {/* Location Dropdown */}
          <div className='relative col-span-12 md:col-span-4 lg:col-span-3'>
            <label className='block text-xs font-medium text-gray-500 mb-1.5 ml-1'>
              Location
            </label>
            <button
              onClick={() => toggleDropdown("location")}
              className='w-full flex items-center justify-between bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-3 py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 active:bg-gray-50'
            >
              <span className='truncate text-sm font-medium text-gray-900'>
                {filters.location}
              </span>
              <ChevronDown
                size={14}
                className='text-gray-400 transition-colors shrink-0 ml-2'
              />
            </button>
            {activeDropdown === "location" && (
              <div className='absolute top-full left-0 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-lg z-20'>
                {filterOptions.location.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleOptionSelect("location", opt)}
                    className='w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 cursor-pointer first:rounded-t-lg last:rounded-b-lg'
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Building Type Dropdown */}
          <div className='relative col-span-12 md:col-span-4 lg:col-span-3'>
            <label className='block text-xs font-medium text-gray-500 mb-1.5 ml-1'>
              Building Type
            </label>
            <button
              onClick={() => toggleDropdown("buildingType")}
              className='w-full flex items-center justify-between bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-3 py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 active:bg-gray-50'
            >
              <span className='truncate text-sm font-medium text-gray-900'>
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
                    className='w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 cursor-pointer first:rounded-t-lg last:rounded-b-lg'
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Available Date Dropdown */}
          <div className='relative col-span-12 md:col-span-4 lg:col-span-3'>
            <label className='block text-xs font-medium text-gray-500 mb-1.5 ml-1'>
              Available Date
            </label>
            <button
              onClick={() => toggleDropdown("availableDate")}
              className='w-full flex items-center justify-between bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-3 py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 active:bg-gray-50'
            >
              <span className='truncate text-sm font-medium text-gray-900'>
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
                  className='w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 cursor-pointer rounded-t-lg border-b border-gray-100'
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
            <label className='block text-xs font-medium text-gray-500 mb-1.5 ml-1'>
              Bedrooms
            </label>
            <button
              onClick={() => toggleDropdown("bedrooms")}
              className='w-full flex items-center justify-between bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-3 py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 active:bg-gray-50'
            >
              <span className='truncate text-sm font-medium text-gray-900'>
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
                    className='w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 cursor-pointer first:rounded-t-lg last:rounded-b-lg'
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Max Rent */}
          <div className='relative col-span-12 md:col-span-4 lg:col-span-4'>
            <label className='block text-xs font-medium text-gray-500 mb-1.5 ml-1'>
              Max Rent
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <span className='text-gray-500 text-sm font-medium'>$</span>
              </div>
              <input
                type='number'
                placeholder='Max total rent'
                value={filters.maxRent}
                onChange={(e) => handleFilterChange("maxRent", e.target.value)}
                className='w-full pl-6 pr-3 py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-900 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 placeholder-gray-400'
              />
            </div>
          </div>

          {/* Pets Dropdown */}
          <div className='relative col-span-12 md:col-span-4 lg:col-span-4'>
            <label className='block text-xs font-medium text-gray-500 mb-1.5 ml-1'>
              Pets
            </label>
            <button
              onClick={() => toggleDropdown("pets")}
              className='w-full flex items-center justify-between bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-3 py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 active:bg-gray-50'
            >
              <span className='truncate text-sm font-medium text-gray-900'>
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
                    className='w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 cursor-pointer first:rounded-t-lg last:rounded-b-lg'
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Furnished Dropdown */}
          <div className='relative col-span-12 md:col-span-4 lg:col-span-4'>
            <label className='block text-xs font-medium text-gray-500 mb-1.5 ml-1'>
              Furnished
            </label>
            <button
              onClick={() => toggleDropdown("furnished")}
              className='w-full flex items-center justify-between bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-3 py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 active:bg-gray-50'
            >
              <span className='truncate text-sm font-medium text-gray-900'>
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
                    className='w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 cursor-pointer first:rounded-t-lg last:rounded-b-lg'
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
              className='w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 hover:bg-white hover:border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200 text-base'
            />
          </div>

          {/* Search and Reset Buttons */}
          <button className='flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium text-sm'>
            <Search size={18} />
            Search
          </button>

          <button
            onClick={handleReset}
            className='flex items-center gap-2 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-6 py-3.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium text-sm bg-white hover:bg-gray-50'
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
