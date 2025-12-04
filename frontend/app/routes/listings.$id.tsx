import { 
  Share2, 
  Heart, 
  Mail, 
  Phone, 
  MessageSquare, 
  Utensils, 
  Waves, 
  Car, 
  TreePine, 
  Calendar,
  PawPrint,
  Clock,
  Tag,
  MapPin,
  Sofa,
  GraduationCap,
  Home,
  Info,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Flame,
  Wind,
  ChevronRight,
  Flag,
  ChevronLeft
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Link } from "react-router";

export default function ListingDetailsPage() {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // Handle keyboard navigation for the gallery
  useEffect(() => {
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
  }, [selectedImageIndex]);

  // Data from OrangeHousing.com listing 9178
  const listing = {
    title: "Spacious 3-Bedroom Home Near University",
    price: "$2,025/mo",
    pricePerBed: "$675/bedroom",
    address: "811 Ackerman Ave",
    location: "University Area (Corner of Euclid and Ackerman)",
    cityStateZip: "Syracuse, NY 13210",
    stats: {
      beds: 3,
      baths: 1,
      type: "Whole House"
    },
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2000&auto=format&fit=crop", // Placeholder for house
      "https://images.unsplash.com/photo-1556912173-3db9963f6fdb?q=80&w=1000&auto=format&fit=crop", // Porch/Exterior
      "https://images.unsplash.com/photo-1598228723793-52759bba239c?q=80&w=1000&auto=format&fit=crop", // Kitchen
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1000&auto=format&fit=crop", // Living Room
      "https://images.unsplash.com/photo-1584622050111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop", // Bedroom
    ],
    description: "Easy walk to campus, off-street parking, great front porch, free laundry. Lease term flexible for tenants going abroad or seeking short-term housing.",
    highlights: [
      { title: "Great Location:", desc: "Corner of Euclid and Ackerman, easy walk to campus." },
      { title: "Student Friendly:", desc: "Perfect for students seeking a whole house." },
      { title: "Outdoor Space:", desc: "Enjoy the great front porch." },
      { title: "Convenience:", desc: "Off-street parking and free laundry included." },
      { title: "Flexible Lease:", desc: "Options for study abroad or short-term needs." },
    ],
    amenities: [
      { id: 'type', icon: Home, label: "Building Type", sub: "Whole House", included: true },
      { id: 'dishwasher', icon: Utensils, label: "Dishwasher", sub: "Yes", included: true },
      { id: 'laundry', icon: Waves, label: "Laundry", sub: "Free (In-Unit)", included: true },
      { id: 'porch', icon: TreePine, label: "Porch", sub: "Yes", included: true },
      { id: 'parking', icon: Car, label: "Parking", sub: "Off-street Available", included: true },
      { id: 'furnished', icon: Sofa, label: "Furnished", sub: "Partially", included: true },
      { id: 'ac', icon: Wind, label: "Air Conditioning", sub: "None", included: false },
      { id: 'fireplace', icon: Flame, label: "Fireplace", sub: "No", included: false },
      { id: 'smoking', icon: Info, label: "Smoking", sub: "Contact for info", included: false },
      { id: 'pets', icon: PawPrint, label: "Pets", sub: "No", included: false },
    ],
    agent: {
      name: "Dave Hornstein",
      role: "Property Manager",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
      phone: "(315) 436-4733",
      email: "dave@orangehousing.com",
      texting: true
    },
    details: {
      availableDate: "06-01-2026",
      leaseLength: "12 months",
      pets: "No",
      perfectFor: "Students",
      smoking: "Contact for info"
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20 pt-24 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Back Link */}
        {/* Navigation Bar */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/listings" className="p-2 -ml-2 hover:bg-stone-100 rounded-full text-stone-600 transition-colors group" title="Back to Listings">
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          
          <div className="h-6 w-px bg-stone-200" />

          <nav className="flex items-center text-sm text-stone-500">
            <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2 text-stone-300" />
            <Link to="/listings" className="hover:text-stone-900 transition-colors">Listings</Link>
            <ChevronRight className="h-4 w-4 mx-2 text-stone-300" />
            <span className="text-stone-900 font-medium truncate">{listing.title}</span>
          </nav>
        </div>

        {/* Title Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-2">{listing.title}</h1>
          <div className="flex items-center gap-2 text-stone-600">
            <MapPin className="h-4 w-4 text-orange-500" />
            <span className="font-medium">{listing.address}, {listing.cityStateZip}</span>
            <span className="text-stone-300 mx-2">•</span>
            <span className="text-stone-500">{listing.location}</span>
            <div className="mt-1">
              <p className="text-sm font-medium text-stone-400">ID: #9178</p>
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
            {listing.images.slice(1).map((img, idx) => (
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
                  <span className="text-lg text-stone-500 font-medium">{listing.pricePerBed}</span>
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
                  <span className="block text-2xl font-bold text-stone-900 leading-none mb-1">{listing.stats.beds}</span>
                  <span className="text-stone-500 text-sm font-medium">Bedrooms</span>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-100">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Waves className="h-6 w-6 text-stone-700" />
                </div>
                <div>
                  <span className="block text-2xl font-bold text-stone-900 leading-none mb-1">{listing.stats.baths}</span>
                  <span className="text-stone-500 text-sm font-medium">Bathrooms</span>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-100">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Clock className="h-6 w-6 text-stone-700" />
                </div>
                <div>
                  <span className="block text-xl font-bold text-stone-900 leading-none mb-1">{listing.details.leaseLength}</span>
                  <span className="text-stone-500 text-sm font-medium">Lease</span>
                </div>
              </div>
            </div>

            {/* Description & Highlights */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-stone-900">About this Property</h2>
              <p className="text-stone-600 leading-relaxed text-lg">
                {listing.description}
              </p>
              
              <div className="bg-stone-50 rounded-2xl p-8 border border-stone-100">
                <h3 className="text-lg font-bold text-stone-900 mb-6">Highlights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  {listing.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-stone-900 block mb-1">{item.title}</span>
                        <span className="text-stone-600 text-sm leading-relaxed">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Amenities & Features */}
            <section className="pt-8 border-t border-stone-200">
              <h2 className="text-2xl font-bold text-stone-900 mb-8">Features & Amenities</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { id: 'type', label: 'Building Type', icon: Home },
                  { id: 'dishwasher', label: 'Dishwasher', icon: Utensils },
                  { id: 'laundry', label: 'Laundry', icon: Waves },
                  { id: 'porch', label: 'Porch', icon: TreePine },
                  { id: 'parking', label: 'Parking', icon: Car },
                  { id: 'furnished', label: 'Furnished', icon: Sofa },
                  { id: 'ac', label: 'A/C', icon: Wind },
                  { id: 'fireplace', label: 'Fireplace', icon: Flame },
                  { id: 'pets', label: 'Pets', icon: PawPrint },
                  { id: 'smoking', label: 'Smoking', icon: Info },
                ].map((templateItem) => {
                  const item = listing.amenities.find(a => a.id === templateItem.id);
                  const isIncluded = item?.included || false;
                  const value = item?.sub || "Not Specified";
                  
                  return (
                    <div key={templateItem.id} className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${isIncluded ? 'bg-white border-stone-200' : 'bg-stone-50 border-transparent opacity-60'}`}>
                      <div className={`p-2 rounded-lg ${isIncluded ? 'bg-green-50 text-green-700' : 'bg-stone-200 text-stone-400'}`}>
                        <templateItem.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className={`block font-bold text-sm mb-0.5 ${isIncluded ? 'text-stone-900' : 'text-stone-500'}`}>
                          {templateItem.label}
                        </span>
                        <span className="text-xs text-stone-500 font-medium">
                          {value}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Commute & Location */}
            <section className="pt-8 border-t border-stone-200 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-stone-900">Location & Commute</h2>
                <span className="text-sm font-medium text-stone-500 bg-stone-100 px-4 py-2 rounded-full border border-stone-200">{listing.location}</span>
              </div>
              
              {/* Map Placeholder */}
              <div className="w-full h-80 bg-stone-100 rounded-3xl overflow-hidden relative group border border-stone-200 shadow-sm">
                 <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop" 
                  alt="Map View" 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-transparent transition-colors">
                  <Button variant="secondary" className="shadow-xl font-bold gap-2 h-12 px-6 rounded-full hover:scale-105 transition-transform">
                    <MapPin className="h-4 w-4 text-orange-600" />
                    View on Map
                  </Button>
                </div>
              </div>

              {/* Commute Calculator Mock */}
              <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Destination</label>
                    <select className="w-full p-3 bg-white border border-stone-200 rounded-xl text-sm font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm">
                      <option>Syracuse University</option>
                      <option>SUNY ESF</option>
                      <option>Upstate Medical</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Mode</label>
                    <div className="flex bg-stone-200/50 rounded-xl p-1 border border-stone-200">
                      <button className="flex-1 py-2 text-xs font-bold rounded-lg bg-white shadow-sm text-stone-900 transition-all">Walk</button>
                      <button className="flex-1 py-2 text-xs font-bold rounded-lg text-stone-500 hover:text-stone-900 transition-all">Bike</button>
                      <button className="flex-1 py-2 text-xs font-bold rounded-lg text-stone-500 hover:text-stone-900 transition-all">Drive</button>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3 pb-2">
                     <div className="text-right">
                        <span className="block text-3xl font-bold text-stone-900 tracking-tight">5 min</span>
                        <span className="text-xs text-stone-500 font-bold uppercase tracking-wide">Walking time</span>
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
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-stone-100">
                  <h3 className="text-xl font-bold text-stone-900">Contact Lister</h3>
                  <span className="bg-green-100 text-green-700 text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full">Verified</span>
                </div>
                
                <div className="flex items-center gap-5 mb-8">
                  <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-white shadow-md ring-2 ring-stone-100">
                     <img src={listing.agent.image} alt={listing.agent.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-stone-900 leading-tight">{listing.agent.name}</h4>
                    <p className="text-sm text-stone-500 font-medium mb-1">{listing.agent.role}</p>
                    <Link to="#" className="text-xs text-orange-600 font-bold hover:underline">
                      View All Listings by {listing.agent.name}
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <Button asChild variant="outline" className="w-full border-stone-200 hover:bg-stone-50 hover:text-orange-600 h-12 rounded-xl font-semibold">
                    <a href={`tel:${listing.agent.phone}`}>
                      <Phone className="mr-2 h-4 w-4" />
                      Call
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="w-full border-stone-200 hover:bg-stone-50 hover:text-orange-600 h-12 rounded-xl font-semibold">
                    <a href={`mailto:${listing.agent.email}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </a>
                  </Button>
                </div>

                <form className="space-y-4">
                  <Textarea placeholder="I am interested in this property..." className="resize-none bg-stone-50 border-stone-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl p-4" rows={4} />
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-6 text-lg shadow-lg shadow-orange-200 rounded-xl transition-all hover:scale-[1.02]">
                    Send Message
                  </Button>
                  <p className="text-xs text-center text-stone-400 leading-relaxed px-4">
                    By sending, you agree to our Terms and Privacy Policy.
                  </p>
                </form>
              </Card>

              {/* Report Listing Button & Modal */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="w-full text-stone-400 hover:text-red-600 hover:bg-red-50 gap-2 rounded-xl h-12">
                    <Flag className="h-4 w-4" />
                    Report this listing
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
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
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
