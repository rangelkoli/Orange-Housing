import { 
  Share2, 
  Heart, 
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
  Zap,
  Wifi,
  Phone,
  Mail,
  AlertCircle,
  User
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";

interface PreviewProps {
  onBack?: () => void;
  data: {
    title: string;
    price: string;
    rent: number;
    beds: number;
    baths: string;
    address: string;
    city: string;
    zip: number | null;
    images: string[];
    availableDate: string;
    details: string | null;
    pets: string;
    utilities: string | string[];
    furnished: string;
    laundry: string;
    parking: string;
    building_type: string;
    contact_name: string;
    contact_email: string;
    contact_number: string;
    featured: number;
    latLng: string | null;
    physicalAddress: string | null;
    lease_length: string | null;
    fireplace: string;
    dishwasher: string;
    porch: string;
    smoking: string;
    perfect_for: string;
    location: string | null;
    date_created: string;
    date_expires: string;
    id: number;
  };
}

export function PreviewListingContent({ data, onBack }: PreviewProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [destination, setDestination] = useState("Syracuse University, Syracuse, NY");
  const [transportMode, setTransportMode] = useState("d");

  // Helper to format price per bed
  const pricePerBed = data.rent && data.beds > 0 
    ? `$${Math.round(data.rent / data.beds)}/bedroom` 
    : null;

  // Build amenities list from listing data
  const amenities = [
    { 
      id: 'type', 
      icon: Home, 
      label: "Building Type", 
      sub: data.building_type || "Not specified", 
      included: !!data.building_type 
    },
    { 
      id: 'dishwasher', 
      icon: Utensils, 
      label: "Dishwasher", 
      sub: data.dishwasher || "Not specified", 
      included: data.dishwasher?.toLowerCase() === 'yes' 
    },
    { 
      id: 'laundry', 
      icon: Waves, 
      label: "Laundry", 
      sub: data.laundry || "Not specified", 
      included: !!data.laundry && data.laundry.toLowerCase() !== 'no' && data.laundry.toLowerCase() !== 'none'
    },
    { 
      id: 'porch', 
      icon: TreePine, 
      label: "Porch", 
      sub: data.porch || "Not specified", 
      included: data.porch?.toLowerCase() === 'yes' 
    },
    { 
      id: 'parking', 
      icon: Car, 
      label: "Parking", 
      sub: data.parking || "Not specified", 
      included: !!data.parking && data.parking.toLowerCase() !== 'no' && data.parking.toLowerCase() !== 'none'
    },
    { 
      id: 'furnished', 
      icon: Sofa, 
      label: "Furnished", 
      sub: data.furnished || "Not specified", 
      included: data.furnished?.toLowerCase() === 'yes' || data.furnished?.toLowerCase() === 'partially'
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
      sub: data.fireplace || "Not specified", 
      included: data.fireplace?.toLowerCase() === 'yes' 
    },
    { 
      id: 'pets', 
      icon: PawPrint, 
      label: "Pets", 
      sub: data.pets === '1' ? 'Yes' : data.pets === '0' ? 'No' : data.pets || "Not specified", 
      included: data.pets === '1' || data.pets?.toLowerCase() === 'yes'
    },
    { 
      id: 'smoking', 
      icon: Info, 
      label: "Smoking", 
      sub: data.smoking || "Contact for info", 
      included: data.smoking?.toLowerCase() === 'yes' 
    },
  ];

  return (
    <div className="bg-stone-50 pb-20 pt-8 h-full overflow-y-auto">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Bar */}
        <div className="flex items-center gap-4 mb-6">
          <div 
            onClick={onBack}
            className="p-2 -ml-2 rounded-full text-stone-600 hover:bg-stone-200 cursor-pointer transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </div>
          
          <div className="h-6 w-px bg-stone-200" />

          <nav className="flex items-center text-sm text-stone-500">
            <span>Home</span>
            <ChevronRight className="h-4 w-4 mx-2 text-stone-300" />
            <span>Listings</span>
            <ChevronRight className="h-4 w-4 mx-2 text-stone-300" />
            <span className="text-stone-900 font-medium truncate">{data.title || "New Value Title"}</span>
          </nav>
        </div>

        {/* Title Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-2">{data.title || "Listing Title"}</h1>
          <div className="flex flex-wrap items-center gap-2 text-stone-600">
            <MapPin className="h-4 w-4 text-orange-500" />
            <span className="font-medium">{data.address || "Address"}, {data.city || "City"}</span>
            {data.location && (
              <>
                <span className="text-stone-300 mx-2">•</span>
                <span className="text-stone-500">{data.location}</span>
              </>
            )}
            <div className="w-full sm:w-auto mt-1 sm:mt-0">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">
                Preview Mode
              </span>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden h-[400px] md:h-[500px] mb-12 shadow-sm border border-stone-100 bg-stone-200">
          {data.images.length > 0 ? (
            <>
              <div 
                className="md:col-span-2 h-full relative group cursor-pointer"
                onClick={() => setSelectedImageIndex(0)}
              >
                <img src={data.images[0]} alt="Main listing" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold pointer-events-none border border-white/10">
                  1/{data.images.length} Photos
                </div>
              </div>
              <div className="hidden md:grid grid-cols-2 col-span-2 gap-3 h-full">
                {data.images.slice(1, 5).map((img, idx) => (
                  <div 
                    key={idx} 
                    className="overflow-hidden h-full relative cursor-pointer"
                    onClick={() => setSelectedImageIndex(idx + 1)}
                  >
                    <img src={img} alt={`View ${idx + 2}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                ))}
                {data.images.length < 5 && Array.from({ length: 4 - (data.images.length - 1) }).map((_, i) => (
                    <div key={`empty-${i}`} className="bg-stone-100 w-full h-full flex items-center justify-center text-stone-300">
                        <Home size={32} />
                    </div>
                ))}
              </div>
            </>
          ) : (
            <div className="col-span-1 md:col-span-4 flex items-center justify-center text-stone-400 bg-stone-100 h-full">
                <div className="text-center">
                    <Home size={48} className="mx-auto mb-2 opacity-50" />
                    <p>No photos uploaded</p>
                </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Header Info */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 pb-8 border-b border-stone-200">
              <div>
                <div className="flex items-baseline gap-3 mb-3">
                  <h1 className="text-4xl font-bold text-stone-900 tracking-tight">{data.price || "Contact for Price"}</h1>
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
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-8 py-2">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-100">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Sofa className="h-6 w-6 text-stone-700" />
                </div>
                <div>
                  <span className="block text-2xl font-bold text-stone-900 leading-none mb-1">{data.beds || 0}</span>
                  <span className="text-stone-500 text-sm font-medium">Bedrooms</span>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-100">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Waves className="h-6 w-6 text-stone-700" />
                </div>
                <div>
                  <span className="block text-2xl font-bold text-stone-900 leading-none mb-1">{data.baths || 0}</span>
                  <span className="text-stone-500 text-sm font-medium">Bathrooms</span>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-100">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Clock className="h-6 w-6 text-stone-700" />
                </div>
                <div>
                  <span className="block text-xl font-bold text-stone-900 leading-none mb-1">
                    {data.lease_length ? `${data.lease_length} months` : 'Flexible'}
                  </span>
                  <span className="text-stone-500 text-sm font-medium">Lease</span>
                </div>
              </div>
            </div>

            {/* Available Date */}
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl">
              <Calendar className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">
                Available: {data.availableDate}
              </span>
              {data.perfect_for && (
                <>
                  <span className="text-green-300 mx-2">•</span>
                  <span className="text-green-700">Perfect for {data.perfect_for}</span>
                </>
              )}
            </div>

            {/* Description */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-stone-900">About this Property</h2>
              <p className="text-stone-600 leading-relaxed text-lg whitespace-pre-line">
                {data.details || 'No description provided.'}
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

              {/* Included Utilities - Subsection */}
              {data.utilities && (
                <div className="mt-8 pt-6 border-t border-stone-100">
                  <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4">Utilities Included</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {(Array.isArray(data.utilities) ? data.utilities : (data.utilities as string).split(',')).map((utility, idx) => {
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
                {data.location && (
                  <span className="text-sm font-medium text-stone-500 bg-stone-100 px-4 py-2 rounded-full border border-stone-200">
                    {data.location}
                  </span>
                )}
              </div>
              
              {/* Map View - Directions Embed */}
              <div className="w-full h-80 bg-stone-100 rounded-3xl overflow-hidden relative border border-stone-200 shadow-sm">
                <iframe 
                  width="100%" 
                  height="100%" 
                  title="map"
                  src={`https://maps.google.com/maps?saddr=${encodeURIComponent(data.physicalAddress || (data.address + ", " + data.city + ", NY"))}&daddr=${encodeURIComponent(destination)}&dirflg=${transportMode}&output=embed`}
                  className="w-full h-full filter grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* Contact Card */}
              <Card className="p-6 border-stone-200 shadow-xl shadow-stone-200/50 bg-white rounded-3xl overflow-hidden">
                <div className="mb-6 pb-6 border-b border-stone-100">
                  <h3 className="text-xl font-bold text-stone-900">Contact Lister</h3>
                </div>
                
                <div className="flex items-center gap-5 mb-6">
                  <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-white shadow-md ring-2 ring-stone-100 bg-stone-200 flex items-center justify-center">
                    <span className="text-2xl font-bold text-stone-500">
                      {data.contact_name ? data.contact_name.charAt(0).toUpperCase() : '?'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-stone-900 leading-tight">
                      {data.contact_name || 'Contact Person'}
                    </h4>
                    <p className="text-sm text-stone-500 font-medium mb-1">Property Manager</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {data.contact_number && (
                    <Button asChild variant="outline" className="w-full border-stone-200 hover:bg-stone-50 hover:text-orange-600 h-12 rounded-xl font-semibold">
                      <a href={`tel:${data.contact_number}`}>
                        <Phone className="mr-2 h-4 w-4" />
                        Call
                      </a>
                    </Button>
                  )}
                  {data.contact_email && (
                    <Button asChild variant="outline" className="w-full border-stone-200 hover:bg-stone-50 hover:text-orange-600 h-12 rounded-xl font-semibold">
                      <a href={`mailto:${data.contact_email}`}>
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                      </a>
                    </Button>
                  )}
                </div>

                <form className="space-y-4">
                  <Textarea 
                    placeholder="I am interested in this property..." 
                    className="resize-none bg-stone-50 border-stone-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl p-4" 
                    rows={4} 
                  />
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-6 text-lg shadow-lg shadow-orange-200 rounded-xl transition-all hover:scale-[1.02]">
                    Send Message
                  </Button>
                  <p className="text-xs text-center text-stone-400 leading-relaxed px-4">
                    By sending, you agree to our Terms and Privacy Policy.
                  </p>
                </form>
              </Card>

              {/* Report Listing Button */}
               <Button variant="ghost" className="w-full text-stone-400 hover:text-red-600 hover:bg-red-50 gap-2 rounded-xl h-12">
                 <Flag className="h-4 w-4" />
                 Report this listing
               </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Image Gallery Overlay */}
      {selectedImageIndex !== null && data.images[selectedImageIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg bg-black/60">
          {/* Close Button */}
          <button 
            onClick={() => setSelectedImageIndex(null)}
            className="absolute top-4 right-4 p-2 text-white hover:text-stone-300 rounded-full transition-colors z-50"
          >
            <X className="h-8 w-8" />
          </button>

          {/* Navigation Buttons */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex((prev) => prev !== null && prev > 0 ? prev - 1 : data.images.length - 1);
            }}
            className="absolute left-4 p-3 text-white hover:text-stone-300 rounded-full transition-colors z-50"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex((prev) => prev !== null && prev < data.images.length - 1 ? prev + 1 : 0);
            }}
            className="absolute right-4 p-3 text-white hover:text-stone-300 rounded-full transition-colors z-50"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          {/* Main Image */}
          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12" onClick={() => setSelectedImageIndex(null)}>
             <img 
              src={data.images[selectedImageIndex]} 
              alt={`View ${selectedImageIndex + 1}`} 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md">
              {selectedImageIndex + 1} / {data.images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
