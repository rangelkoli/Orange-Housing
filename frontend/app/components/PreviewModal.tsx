import { useState } from "react";
import {
  X,
  Eye,
  MapPin,
  Calendar,
  Bed,
  Bath,
  Clock,
  Building,
  Droplets,
  Wind,
  Flame,
  Users,
  Home,
  Check,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";

interface PreviewModalProps {
  onClose: () => void;
  formRef: React.RefObject<HTMLFormElement | null>;
  photoPreviewUrls: string[];
  selectedType: number;
  address: string;
  city: string;
  zip: string;
  description: string;
}

export function PreviewModal({
  onClose,
  formRef,
  photoPreviewUrls,
  selectedType,
  address,
  city,
  zip,
  description
}: PreviewModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  
  // Get form values
  const getFormValue = (name: string): string => {
    if (!formRef.current) return '';
    const input = formRef.current.querySelector(`[name="${name}"]`) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    if (!input) return '';
    if (input.type === 'checkbox') {
        return (input as HTMLInputElement).checked ? input.value : '';
    }
    return input.value || '';
  };

  const title = getFormValue('title') || 'Your Listing Title';
  const rent = getFormValue('rent') || '0';
  const beds = getFormValue('beds') || '0';
  const baths = getFormValue('baths') || '1';
  const buildingType = getFormValue('building_type') || 'Apartment';
  const dateAvail = getFormValue('date_avail');
  const leaseLength = getFormValue('lease_length');
  const pets = getFormValue('pets');
  const laundry = getFormValue('laundry');
  const parking = getFormValue('parking');
  const furnished = getFormValue('furnished');
  const dishwasher = getFormValue('dishwasher');
  const fireplace = getFormValue('fireplace');
  const porch = getFormValue('porch');
  const contactName = getFormValue('contact_name');
  const contactEmail = getFormValue('contact_email');
  const contactPhone = getFormValue('contact_number');
  const location = getFormValue('location');

  // Placeholder images if no photos uploaded
  const images = photoPreviewUrls.length > 0 
    ? photoPreviewUrls 
    : [
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1000&auto=format&fit=crop',
      ];

  // Format availability date
  const formattedDate = dateAvail 
    ? new Date(dateAvail).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
    : 'Available Now';

  // Get listing type name
  const typeNames: Record<number, string> = { 1: 'Rental', 2: 'Sublet', 3: 'Room for Rent', 4: 'Short Term' };

  // Build amenities list
  const amenities = [
    { id: 'type', icon: Building, label: "Building Type", sub: buildingType || "Not specified", included: !!buildingType },
    { id: 'dishwasher', icon: Droplets, label: "Dishwasher", sub: dishwasher || "Not specified", included: dishwasher === 'Yes' },
    { id: 'laundry', icon: Wind, label: "Laundry", sub: laundry || "Not specified", included: !!laundry && laundry !== 'None' },
    { id: 'parking', icon: Home, label: "Parking", sub: parking || "Not specified", included: !!parking },
    { id: 'furnished', icon: Home, label: "Furnished", sub: furnished || "Not specified", included: furnished === 'Yes' || furnished === 'Partially' },
    { id: 'fireplace', icon: Flame, label: "Fireplace", sub: fireplace || "Not specified", included: fireplace === 'Yes' },
    { id: 'porch', icon: Wind, label: "Porch", sub: porch || "Not specified", included: porch === 'Yes' },
    { id: 'pets', icon: Users, label: "Pets", sub: pets || "Not specified", included: pets === 'Yes' || pets === 'Cats only' || pets === 'Dogs only' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-50 overflow-y-auto">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-50 p-3 bg-white shadow-lg rounded-full hover:bg-stone-100 transition-colors border border-stone-200"
      >
        <X size={24} className="text-stone-600" />
      </button>

      {/* Preview Banner */}
      <div className="sticky top-0 z-40 bg-orange-600 text-white py-3 px-4 text-center font-semibold shadow-md">
        <div className="flex items-center justify-center gap-3">
          <Eye size={18} />
          <span>Preview Mode — This is how renters will see your listing</span>
          <Button onClick={onClose} size="sm" variant="secondary" className="ml-4 bg-white text-orange-600 hover:bg-orange-50">
            Continue Editing
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Title Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">
              {typeNames[selectedType]}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-2">{title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-stone-600">
            <MapPin className="h-4 w-4 text-orange-500" />
            <span className="font-medium">{address || 'Address'}, {city} {zip}</span>
            {location && (
              <>
                <span className="text-stone-300 mx-2">•</span>
                <span className="text-stone-500">{location}</span>
              </>
            )}
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden h-[400px] md:h-[500px] mb-12 shadow-sm border border-stone-100">
          <div 
            className="md:col-span-2 h-full relative group cursor-pointer"
            onClick={() => setSelectedImageIndex(0)}
          >
            <img src={images[0]} alt="Main listing" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold pointer-events-none border border-white/10">
              1/{images.length} Photos
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 col-span-2 gap-3 h-full">
            {images.slice(1, 5).map((img, idx) => (
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
                  <h1 className="text-4xl font-bold text-stone-900 tracking-tight">${rent}/mo</h1>
                  {parseInt(beds) > 0 && parseInt(rent) > 0 && (
                    <span className="text-lg text-stone-500 font-medium">
                      ${Math.round(parseInt(rent) / parseInt(beds))}/bedroom
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <button className="h-10 w-10 flex items-center justify-center text-stone-500 hover:text-orange-600 hover:bg-orange-50 border border-stone-200 rounded-full transition-colors">
                  <Calendar className="h-4 w-4" />
                </button>
                <button className="h-10 w-10 flex items-center justify-center text-stone-500 hover:text-red-600 hover:bg-red-50 border border-stone-200 rounded-full transition-colors">
                  <Check className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-8 py-2">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-100">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Bed className="h-6 w-6 text-stone-700" />
                </div>
                <div>
                  <span className="block text-2xl font-bold text-stone-900 leading-none mb-1">{beds}</span>
                  <span className="text-stone-500 text-sm font-medium">Bedrooms</span>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-100">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Bath className="h-6 w-6 text-stone-700" />
                </div>
                <div>
                  <span className="block text-2xl font-bold text-stone-900 leading-none mb-1">{baths}</span>
                  <span className="text-stone-500 text-sm font-medium">Bathrooms</span>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-100">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Clock className="h-6 w-6 text-stone-700" />
                </div>
                <div>
                  <span className="block text-xl font-bold text-stone-900 leading-none mb-1">
                    {leaseLength ? `${leaseLength} mo` : 'Flexible'}
                  </span>
                  <span className="text-stone-500 text-sm font-medium">Lease</span>
                </div>
              </div>
            </div>

            {/* Available Date */}
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl">
              <Calendar className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">
                Available: {formattedDate}
              </span>
            </div>

            {/* Description */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-stone-900">About this Property</h2>
              <p className="text-stone-600 leading-relaxed text-lg">
                {description || 'No description provided yet. Add a description in the Photos & Description section to help renters learn more about your property.'}
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
            </section>

            {/* Location */}
            <section className="pt-8 border-t border-stone-200 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-stone-900">Location</h2>
                {location && (
                  <span className="text-sm font-medium text-stone-500 bg-stone-100 px-4 py-2 rounded-full border border-stone-200">
                    {location}
                  </span>
                )}
              </div>
              
              {/* Map Preview */}
              <div className="w-full h-80 bg-stone-100 rounded-3xl overflow-hidden relative border border-stone-200 shadow-sm">
                {address ? (
                  <iframe 
                    width="100%" 
                    height="100%" 
                    title="map"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(address + ", " + city + " " + zip)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    className="w-full h-full filter grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
                    style={{ border: 0 }}
                    loading="lazy"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-stone-300 mx-auto mb-3" />
                      <p className="text-stone-400 font-medium">Enter address to see map</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* Contact Card */}
              <div className="p-6 border border-stone-200 shadow-xl shadow-stone-200/50 bg-white rounded-3xl overflow-hidden">
                <div className="mb-6 pb-6 border-b border-stone-100">
                  <h3 className="text-xl font-bold text-stone-900">Contact Lister</h3>
                </div>
                
                <div className="flex items-center gap-5 mb-6">
                  <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-white shadow-md ring-2 ring-stone-100 bg-stone-200 flex items-center justify-center">
                    <span className="text-2xl font-bold text-stone-500">
                      {contactName ? contactName.charAt(0).toUpperCase() : '?'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-stone-900 leading-tight">
                      {contactName || 'Your Name'}
                    </h4>
                    <p className="text-sm text-stone-500 font-medium mb-1">Property Manager</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {contactPhone && (
                    <button className="w-full border border-stone-200 hover:bg-stone-50 hover:text-orange-600 h-12 rounded-xl font-semibold flex items-center justify-center gap-2 text-stone-700">
                      <User className="h-4 w-4" />
                      Call
                    </button>
                  )}
                  {contactEmail && (
                    <button className="w-full border border-stone-200 hover:bg-stone-50 hover:text-orange-600 h-12 rounded-xl font-semibold flex items-center justify-center gap-2 text-stone-700">
                      <MapPin className="h-4 w-4" />
                      Email
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <textarea 
                    placeholder="I am interested in this property..." 
                    className="w-full resize-none bg-stone-50 border border-stone-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 rounded-xl p-4 text-sm" 
                    rows={4}
                    disabled
                  />
                  <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 text-lg shadow-lg shadow-orange-200 rounded-xl transition-all">
                    Send Message
                  </button>
                  <p className="text-xs text-center text-stone-400 leading-relaxed px-4">
                    By sending, you agree to our Terms and Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Image Gallery Overlay */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg bg-black/80">
          {/* Close Button */}
          <button 
            onClick={() => setSelectedImageIndex(null)}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-50"
          >
            <X className="h-8 w-8" />
          </button>

          {/* Navigation Buttons */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex((prev) => prev !== null && prev > 0 ? prev - 1 : images.length - 1);
            }}
            className="absolute left-4 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-50"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex((prev) => prev !== null && prev < images.length - 1 ? prev + 1 : 0);
            }}
            className="absolute right-4 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-50"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          {/* Main Image */}
          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12" onClick={() => setSelectedImageIndex(null)}>
             <img 
              src={images[selectedImageIndex]} 
              alt={`View ${selectedImageIndex + 1}`} 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md">
              {selectedImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
