import { 
  Share2, 
  Heart, 
  Mail, 
  Phone, 
  Utensils, 
  Waves, 
  Car, 
  TreePine, 
  Calendar,
  PawPrint,
  Clock,
  MapPin,
  Sofa,
  Home,
  Info,
  ArrowLeft,
  X,
  Flame,
  Wind,
  ChevronRight,
  Flag,
  ChevronLeft,
  Loader2,
  AlertCircle,
  Zap,
  Wifi,
  User
} from "lucide-react";
import { useState, useEffect, lazy, Suspense, useMemo } from "react";
import { Link } from "react-router";

// Dynamically import ReactQuill for client-side only rendering
const ReactQuill = lazy(() => import("react-quill-new"));
import "react-quill-new/dist/quill.snow.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

// Types for the listing data from backend
interface ListingData {
  id: number;
  title: string;
  price: string;
  rent: number | null;
  beds: number;
  baths: string;
  address: string;
  city: string;
  zip: number | null;
  images: string[];
  availableDate: string;
  details: string | null;
  pets: string | null;
  utilities: string | null;
  furnished: string | null;
  laundry: string | null;
  parking: string | null;
  building_type: string | null;
  contact_name: string;
  contact_email: string | null;
  contact_number: string | null;
  featured: number;
  latLng: string | null;
  physicalAddress: string | null;
  lease_length: string | null;
  fireplace: string | null;
  dishwasher: string | null;
  porch: string | null;
  smoking: string | null;
  perfect_for: string | null;
  location: string | null;
  date_created: string;
  date_expires: string;
  typeCode?: number;
}

interface ListingDetailPageProps {
  listingId: string;
  listingType: 'rentals' | 'sublets' | 'rooms';
  backLink: string;
  backLinkText: string;
}

export default function ListingDetailPage({
  listingId,
  listingType,
  backLink,
  backLinkText,
}: ListingDetailPageProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [listing, setListing] = useState<ListingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [destination, setDestination] = useState("Syracuse University, Syracuse, NY");
  const [transportMode, setTransportMode] = useState("d"); // d=driving, w=walking, b=bicycling
  const [contactInfo, setContactInfo] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<'viewing' | 'availability'>('viewing');

  // Message templates
  const messageTemplates = {
    viewing: "<p>Hello,</p><p><br></p><p>I am interested in this property and would love to schedule a viewing at your earliest convenience.</p><p><br></p><p>Please let me know what times work best for you.</p><p><br></p><p>Thank you!</p>",
    availability: "<p>Hello,</p><p><br></p><p>I came across your listing and wanted to inquire if this property is still available.</p><p><br></p><p>If so, I would love to learn more about the move-in process.</p><p><br></p><p>Thank you!</p>"
  };

  const [message, setMessage] = useState(messageTemplates.viewing);
  
  // Quill configuration - no toolbar
  const quillModules = useMemo(() => ({
    toolbar: false,
  }), []);

  const quillFormats = ['bold', 'italic', 'underline', 'list'];

  // Handle template change
  const handleTemplateChange = (template: 'viewing' | 'availability') => {
    setSelectedTemplate(template);
    setMessage(messageTemplates[template]);
  };

  // Fetch listing data from backend
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';
        const response = await fetch(`${backendUrl}/listings/${listingId}/`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Listing not found');
          }
          throw new Error('Failed to fetch listing');
        }
        
        const data = await response.json();
        console.log(data);
        setListing(data.listing);
      } catch (err: any) {
        console.error('Error fetching listing:', err);
        setError(err.message || 'Failed to load listing');
      } finally {
        setLoading(false);
      }
    };

    if (listingId) {
      fetchListing();
    }
  }, [listingId]);

  // Handle keyboard navigation for the gallery
  useEffect(() => {
    if (!listing) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      
      if (e.key === "Escape") {
        setSelectedImageIndex(null);
      } else if (e.key === "ArrowRight") {
        setSelectedImageIndex((prev) => 
          prev !== null && prev < listing.images.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowLeft") {
        setSelectedImageIndex((prev) => 
          prev !== null && prev > 0 ? prev - 1 : listing.images.length - 1
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, listing]);

  // Get listing type label for display
  const getTypeLabel = () => {
    switch (listingType) {
      case 'rentals': return 'Rental';
      case 'sublets': return 'Sublet';
      case 'rooms': return 'Room for Rent';
      default: return 'Listing';
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-stone-600 font-medium">Loading listing details...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !listing) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 mb-2">
            {error === 'Listing not found' ? 'Listing Not Found' : 'Error Loading Listing'}
          </h1>
          <p className="text-stone-600 mb-6">
            {error === 'Listing not found' 
              ? 'The listing you are looking for does not exist or has been removed.'
              : 'There was an error loading this listing. Please try again later.'
            }
          </p>
          <Link 
            to={backLink}
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {backLinkText}
          </Link>
        </div>
      </div>
    );
  }

  // Helper to format price per bed
  const pricePerBed = listing.rent && listing.beds > 0 
    ? `$${Math.round(listing.rent / listing.beds)}/bedroom` 
    : null;

  // Build amenities list from listing data
  const amenities = [
    { 
      id: 'type', 
      icon: Home, 
      label: "Building Type", 
      sub: listing.building_type || "Not specified", 
      included: !!listing.building_type 
    },
    { 
      id: 'dishwasher', 
      icon: Utensils, 
      label: "Dishwasher", 
      sub: listing.dishwasher || "Not specified", 
      included: listing.dishwasher?.toLowerCase() === 'yes' 
    },
    { 
      id: 'laundry', 
      icon: Waves, 
      label: "Laundry", 
      sub: listing.laundry || "Not specified", 
      included: !!listing.laundry && listing.laundry.toLowerCase() !== 'no' && listing.laundry.toLowerCase() !== 'none'
    },
    { 
      id: 'porch', 
      icon: TreePine, 
      label: "Porch", 
      sub: listing.porch || "Not specified", 
      included: listing.porch?.toLowerCase() === 'yes' 
    },
    { 
      id: 'parking', 
      icon: Car, 
      label: "Parking", 
      sub: listing.parking || "Not specified", 
      included: !!listing.parking && listing.parking.toLowerCase() !== 'no' && listing.parking.toLowerCase() !== 'none'
    },
    { 
      id: 'furnished', 
      icon: Sofa, 
      label: "Furnished", 
      sub: listing.furnished || "Not specified", 
      included: listing.furnished?.toLowerCase() === 'yes' || listing.furnished?.toLowerCase() === 'partially'
    },
    { 
      id: 'ac', 
      icon: Wind, 
      label: "Air Conditioning", 
      sub: "Contact for info", 
      included: false 
    },
    { 
      id: 'fireplace', 
      icon: Flame, 
      label: "Fireplace", 
      sub: listing.fireplace || "Not specified", 
      included: listing.fireplace?.toLowerCase() === 'yes' 
    },
    { 
      id: 'pets', 
      icon: PawPrint, 
      label: "Pets", 
      sub: listing.pets === '1' ? 'Yes' : listing.pets === '0' ? 'No' : listing.pets || "Not specified", 
      included: listing.pets === '1' || listing.pets?.toLowerCase() === 'yes'
    },
    { 
      id: 'smoking', 
      icon: Info, 
      label: "Smoking", 
      sub: listing.smoking || "Contact for info", 
      included: listing.smoking?.toLowerCase() === 'yes' 
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 pb-20 pt-24 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Bar */}
        <div className="flex items-center gap-4 mb-6">
          <Link to={backLink} className="p-2 -ml-2 hover:bg-stone-100 rounded-full text-stone-600 transition-colors group" title={`Back to ${backLinkText}`}>
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          
          <div className="h-6 w-px bg-stone-200" />

          <nav className="flex items-center text-sm text-stone-500">
            <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2 text-stone-300" />
            <Link to={backLink} className="hover:text-stone-900 transition-colors">{backLinkText}</Link>
            <ChevronRight className="h-4 w-4 mx-2 text-stone-300" />
            <span className="text-stone-900 font-medium truncate">{listing.title}</span>
          </nav>
        </div>

        {/* Title Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold uppercase rounded-full">
              {getTypeLabel()}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-2">{listing.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-stone-600">
            <MapPin className="h-4 w-4 text-orange-500" />
            <span className="font-medium">{listing.address}, {listing.city}</span>
            {listing.location && (
              <>
                <span className="text-stone-300 mx-2">•</span>
                <span className="text-stone-500">{listing.location}</span>
              </>
            )}
            <div className="w-full sm:w-auto mt-1 sm:mt-0">
              <p className="text-sm font-medium text-stone-400">ID: #{listing.id}</p>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden h-[400px] md:h-[500px] mb-12 shadow-sm border border-stone-100">
          <div 
            className="md:col-span-2 h-full relative group cursor-pointer"
            onClick={() => setSelectedImageIndex(0)}
          >
            <img src={listing.images[0]} alt="Main listing" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold pointer-events-none border border-white/10">
              1/{listing.images.length} Photos
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 col-span-2 gap-3 h-full">
            {listing.images.slice(1, 5).map((img, idx) => (
              <div 
                key={idx} 
                className="overflow-hidden h-full relative cursor-pointer"
                onClick={() => setSelectedImageIndex(idx + 1)}
              >
                <img src={img} alt={`View ${idx + 2}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Header Info */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 pb-8 border-b border-stone-200">
              <div>
                <div className="flex items-baseline gap-3 mb-3">
                  <h1 className="text-4xl font-bold text-stone-900 tracking-tight">{listing.price}</h1>
                  {pricePerBed && (
                    <span className="text-lg text-stone-500 font-medium">{pricePerBed}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="icon" className="h-10 w-10 text-stone-500 hover:text-orange-600 hover:bg-orange-50 border-stone-200 rounded-full">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10 text-stone-500 hover:text-red-600 hover:bg-red-50 border-stone-200 rounded-full">
                  <Heart className="h-4 w-4" />
                </Button>
                {/* Report Listing Button & Modal */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="h-10 w-10 text-stone-500 hover:text-red-600 hover:bg-red-50 border-stone-200 rounded-full">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Report Listing</DialogTitle>
                      <DialogDescription>
                        Help us maintain a safe community. Why are you reporting this listing?
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <RadioGroup defaultValue="scam">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="scam" id="scam" />
                          <Label htmlFor="scam">Fraudulent or Scam</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="inaccurate" id="inaccurate" />
                          <Label htmlFor="inaccurate">Inaccurate Information</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="duplicate" id="duplicate" />
                          <Label htmlFor="duplicate">Duplicate Listing</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other">Other</Label>
                        </div>
                      </RadioGroup>
                      <div className="grid gap-2">
                        <Label htmlFor="details">Additional Details (Optional)</Label>
                        <Textarea id="details" placeholder="Please provide any extra context..." />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">Submit Report</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-8 py-2">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-100">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Sofa className="h-6 w-6 text-stone-700" />
                </div>
                <div>
                  <span className="block text-2xl font-bold text-stone-900 leading-none mb-1">{listing.beds}</span>
                  <span className="text-stone-500 text-sm font-medium">Bedrooms</span>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-100">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Waves className="h-6 w-6 text-stone-700" />
                </div>
                <div>
                  <span className="block text-2xl font-bold text-stone-900 leading-none mb-1">{listing.baths}</span>
                  <span className="text-stone-500 text-sm font-medium">Bathrooms</span>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-100">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Clock className="h-6 w-6 text-stone-700" />
                </div>
                <div>
                  <span className="block text-xl font-bold text-stone-900 leading-none mb-1">
                    {listing.lease_length ? `${listing.lease_length} months` : 'Flexible'}
                  </span>
                  <span className="text-stone-500 text-sm font-medium">Lease</span>
                </div>
              </div>
            </div>

            {/* Available Date */}
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl">
              <Calendar className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">
                Available: {listing.availableDate}
              </span>
              {listing.perfect_for && (
                <>
                  <span className="text-green-300 mx-2">•</span>
                  <span className="text-green-700">Perfect for {listing.perfect_for}</span>
                </>
              )}
            </div>

            {/* Description */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-stone-900">About this Property</h2>
              <p className="text-stone-600 leading-relaxed text-lg">
                {listing.details || 'No description provided for this listing.'}
              </p>
            </section>

            {/* Amenities & Features */}
            <section className="pt-8 border-t border-stone-200">
              <h2 className="text-2xl font-bold text-stone-900 mb-8">Features & Amenities</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {amenities.map((item) => (
                  <div 
                    key={item.id} 
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                      item.included 
                        ? 'bg-white border-stone-200' 
                        : 'bg-stone-50 border-transparent opacity-60'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      item.included 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-stone-200 text-stone-400'
                    }`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className={`block font-bold text-sm mb-0.5 ${
                        item.included ? 'text-stone-900' : 'text-stone-500'
                      }`}>
                        {item.label}
                      </span>
                      <span className="text-xs text-stone-500 font-medium">
                        {item.sub}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Included Utilities - Moved from PreviewListingContent logic */}
              {listing.utilities && listing.utilities.length > 0 && (
                <div className="mt-8 pt-6 border-t border-stone-100">
                  <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4">Utilities Included</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {(Array.isArray(listing.utilities) ? listing.utilities : (listing.utilities as string).split(',')).map((utility, idx) => {
                      if (!utility) return null;
                      const utilityName = utility.trim();
                      const lowerName = utilityName.toLowerCase();
                      
                      // Map utility names to their icons and colors
                      let Icon = Zap;
                      let iconColor = 'text-yellow-500';
                      let bgColor = 'bg-yellow-50/50';
                      let borderColor = 'border-yellow-200';
                      
                      if (lowerName.includes('heat') || lowerName.includes('gas')) {
                        Icon = Flame;
                        iconColor = 'text-orange-500';
                        bgColor = 'bg-orange-50/50';
                        borderColor = 'border-orange-200';
                      } else if (lowerName.includes('water')) {
                        Icon = Waves;
                        iconColor = 'text-blue-500';
                        bgColor = 'bg-blue-50/50';
                        borderColor = 'border-blue-200';
                      } else if (lowerName.includes('electric')) {
                        Icon = Zap;
                        iconColor = 'text-yellow-500';
                        bgColor = 'bg-yellow-50/50';
                        borderColor = 'border-yellow-200';
                      } else if (lowerName.includes('wifi') || lowerName.includes('internet')) {
                        Icon = Wifi;
                        iconColor = 'text-green-500';
                        bgColor = 'bg-green-50/50';
                        borderColor = 'border-green-200';
                      } else if (lowerName.includes('contact manager')) {
                        Icon = User;
                        iconColor = 'text-purple-500';
                        bgColor = 'bg-purple-50/50';
                        borderColor = 'border-purple-200';
                      }
                      
                      return (
                        <div 
                          key={idx}
                          className={`flex flex-col items-center justify-center p-4 ${bgColor} border ${borderColor} rounded-2xl transition-all hover:scale-[1.02]`}
                        >
                          <Icon className={`h-6 w-6 ${iconColor} mb-2`} />
                          <span className="text-sm font-semibold text-stone-700 text-center">{utilityName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>

            {/* Location */}
            <section className="pt-8 border-t border-stone-200 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-stone-900">Location & Commute</h2>
                {listing.location && (
                  <span className="text-sm font-medium text-stone-500 bg-stone-100 px-4 py-2 rounded-full border border-stone-200">
                    {listing.location}
                  </span>
                )}
              </div>
              
              {/* Map View - Directions Embed */}
              <div className="w-full h-80 bg-stone-100 rounded-3xl overflow-hidden relative border border-stone-200 shadow-sm">
                <iframe 
                  width="100%" 
                  height="100%" 
                  title="map"
                  src={`https://maps.google.com/maps?saddr=${encodeURIComponent(listing.physicalAddress || (listing.address + ", " + listing.city + ", NY"))}&daddr=${encodeURIComponent(destination)}&dirflg=${transportMode}&output=embed`}
                  className="w-full h-full filter grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Commute Calculator - Enterprise UI */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-5 py-3 bg-stone-50/80 border-b border-stone-100">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-widest">Commute Calculator</span>
                </div>
                
                {/* Controls Row */}
                <div className="p-5">
                  <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
                    {/* Destination Input */}
                    <div className="flex-1 min-w-0">
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                        <input 
                          type="text"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          placeholder="Enter destination address..."
                          className="w-full h-12 pl-11 pr-4 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="hidden lg:block w-px h-10 bg-stone-200" />

                    {/* Transport Mode Toggle */}
                    <div className="flex bg-stone-100 rounded-xl p-1 shrink-0">
                      <button 
                        onClick={() => setTransportMode('w')}
                        className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                          transportMode === 'w' 
                            ? 'bg-white shadow-sm text-stone-900 ring-1 ring-black/5' 
                            : 'text-stone-500 hover:text-stone-700'
                        }`}
                      >
                        <span>🚶</span>
                        <span className="hidden sm:inline">Walk</span>
                      </button>
                      <button 
                        onClick={() => setTransportMode('b')}
                        className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                          transportMode === 'b' 
                            ? 'bg-white shadow-sm text-stone-900 ring-1 ring-black/5' 
                            : 'text-stone-500 hover:text-stone-700'
                        }`}
                      >
                        <span>🚴</span>
                        <span className="hidden sm:inline">Bike</span>
                      </button>
                      <button 
                        onClick={() => setTransportMode('d')}
                        className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                          transportMode === 'd' 
                            ? 'bg-white shadow-sm text-stone-900 ring-1 ring-black/5' 
                            : 'text-stone-500 hover:text-stone-700'
                        }`}
                      >
                        <span>🚗</span>
                        <span className="hidden sm:inline">Drive</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Destinations */}
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-stone-100">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider shrink-0">Popular:</span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "Syracuse University", value: "Syracuse University, Syracuse, NY" },
                        { label: "SUNY ESF", value: "SUNY ESF, Syracuse, NY" },
                        { label: "Upstate Medical", value: "Upstate Medical University, Syracuse, NY" },
                        { label: "Downtown", value: "Downtown Syracuse, NY" },
                        { label: "Destiny USA", value: "Destiny USA, Syracuse, NY" },
                      ].map((place) => (
                        <button
                          key={place.value}
                          type="button"
                          onClick={() => setDestination(place.value)}
                          className={`px-3 py-1 text-[11px] font-semibold rounded-full border transition-all ${
                            destination === place.value
                              ? 'bg-orange-500 border-orange-500 text-white shadow-sm'
                              : 'bg-white border-stone-200 text-stone-600 hover:border-orange-300 hover:text-orange-600'
                          }`}
                        >
                          {place.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* Contact Card */}
              <Card className="p-6 border-stone-200 shadow-xl shadow-stone-200/50 bg-white rounded-3xl overflow-hidden">
                <div className=" pb-6 border-b border-stone-100">
                  <h3 className="text-xl font-bold text-stone-900">Contact Lister</h3>
                </div>
                
                <div className="flex items-center gap-5">
                  <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-white shadow-md ring-2 ring-stone-100 bg-stone-200 flex items-center justify-center">
                    <span className="text-2xl font-bold text-stone-500">
                      {listing.contact_name ? listing.contact_name.charAt(0).toUpperCase() : '?'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-stone-900 leading-tight">
                      {listing.contact_name || 'Contact Person'}
                    </h4>
                    <p className="text-sm text-stone-500 font-medium mb-1">Property Manager</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {listing.contact_number && (
                    <Button asChild variant="outline" className="w-full border-stone-200 hover:bg-stone-50 hover:text-orange-600 h-12 rounded-xl font-semibold">
                      <a href={`tel:${listing.contact_number}`}>
                        <Phone className="mr-2 h-4 w-4" />
                        Call
                      </a>
                    </Button>
                  )}
                  {listing.contact_email && (
                    <Button asChild variant="outline" className="w-full border-stone-200 hover:bg-stone-50 hover:text-orange-600 h-12 rounded-xl font-semibold">
                      <a href={`mailto:${listing.contact_email}`}>
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                      </a>
                    </Button>
                  )}
                </div>

                <form className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5 block">Email or Phone Number *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                        <input
                          type="text"
                          value={contactInfo}
                          onChange={(e) => setContactInfo(e.target.value)}
                          placeholder="Email or phone..."
                          required
                          className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Message Template</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleTemplateChange('viewing')}
                        className={`group relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-300 ${
                          selectedTemplate === 'viewing'
                            ? 'bg-white border-orange-200 shadow-md shadow-orange-100/50 ring-1 ring-orange-100'
                            : 'bg-stone-50 border-stone-200 text-stone-500 hover:border-orange-100 hover:bg-stone-50/80'
                        }`}
                      >
                        <div className={`p-2 rounded-xl transition-colors ${
                          selectedTemplate === 'viewing' ? 'bg-orange-100 text-orange-600' : 'bg-white text-stone-400 group-hover:text-orange-500'
                        }`}>
                          <Calendar className="h-5 w-5" />
                        </div>
                        <span className={`text-[13px] font-bold tracking-tight transition-colors ${
                          selectedTemplate === 'viewing' ? 'text-stone-900' : 'text-stone-500'
                        }`}>
                          Schedule Viewing
                        </span>
                        {selectedTemplate === 'viewing' && (
                          <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-orange-500" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTemplateChange('availability')}
                        className={`group relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-300 ${
                          selectedTemplate === 'availability'
                            ? 'bg-white border-orange-200 shadow-md shadow-orange-100/50 ring-1 ring-orange-100'
                            : 'bg-stone-50 border-stone-200 text-stone-500 hover:border-orange-100 hover:bg-stone-50/80'
                        }`}
                      >
                        <div className={`p-2 rounded-xl transition-colors ${
                          selectedTemplate === 'availability' ? 'bg-orange-100 text-orange-600' : 'bg-white text-stone-400 group-hover:text-orange-500'
                        }`}>
                          <Mail className="h-5 w-5" />
                        </div>
                        <span className={`text-[13px] font-bold tracking-tight transition-colors ${
                          selectedTemplate === 'availability' ? 'text-stone-900' : 'text-stone-500'
                        }`}>
                          Check Availability
                        </span>
                        {selectedTemplate === 'availability' && (
                          <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-orange-500" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="quill-container bg-stone-50 border border-stone-200 rounded-xl overflow-hidden focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
                    <Suspense fallback={
                      <div className="h-32 flex items-center justify-center text-stone-400">
                        <Loader2 className="h-5 w-5 animate-spin" />
                      </div>
                    }>
                      <ReactQuill
                        theme="snow"
                        value={message}
                        onChange={setMessage}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="I am interested in this property..."
                        className="[&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-stone-200 [&_.ql-toolbar]:bg-white [&_.ql-container]:border-0 [&_.ql-editor]:min-h-[100px] [&_.ql-editor]:text-stone-700"
                      />
                    </Suspense>
                  </div>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-6 text-lg shadow-lg shadow-orange-200 rounded-xl transition-all hover:scale-[1.02]">
                    Send Message
                  </Button>
                  <p className="text-xs text-center text-stone-400 leading-relaxed px-4">
                    By sending, you agree to our Terms and Privacy Policy.
                  </p>
                </form>
              </Card>

            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Image Gallery Overlay */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg">
          {/* Close Button */}
          <button 
            onClick={() => setSelectedImageIndex(null)}
            className="absolute top-4 right-4 p-2 text-black/70 hover:text-black hover:bg-white/10 rounded-full transition-colors z-50"
          >
            <X className="h-8 w-8" />
          </button>

          {/* Navigation Buttons */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex((prev) => prev !== null && prev > 0 ? prev - 1 : listing.images.length - 1);
            }}
            className="absolute left-4 p-3 text-black/70 hover:text-black hover:bg-white/10 rounded-full transition-colors z-50"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex((prev) => prev !== null && prev < listing.images.length - 1 ? prev + 1 : 0);
            }}
            className="absolute right-4 p-3 text-black/70 hover:text-black hover:bg-white/10 rounded-full transition-colors z-50"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          {/* Main Image */}
          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12" onClick={() => setSelectedImageIndex(null)}>
             <img 
              src={listing.images[selectedImageIndex]} 
              alt={`View ${selectedImageIndex + 1}`} 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md">
              {selectedImageIndex + 1} / {listing.images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
