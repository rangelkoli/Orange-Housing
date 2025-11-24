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
  ArrowRight
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Link } from "react-router";

export default function ListingDetailsPage() {
  // Data from OrangeHousing.com listing 9178
  const listing = {
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
      { icon: Utensils, label: "Dishwasher", sub: "Yes" },
      { icon: Waves, label: "Laundry", sub: "Free (In-Unit)" },
      { icon: TreePine, label: "Porch", sub: "Yes" },
      { icon: Car, label: "Parking", sub: "Off-street Available" },
      { icon: Sofa, label: "Furnished", sub: "Partially" },
      { icon: Home, label: "Building Type", sub: "Whole House" },
    ],
    agent: {
      name: "Dave Hornstein",
      role: "Property Manager",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
      phone: "(315) 436-4733",
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
    <div className="min-h-screen bg-stone-50 pb-20 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Back Link could go here */}
        
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden h-[400px] md:h-[500px] mb-8 shadow-sm">
          <div className="md:col-span-2 h-full relative group">
            <img src={listing.images[0]} alt="Main listing" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-medium">
              1/5 Photos
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 col-span-2 gap-2 h-full">
            {listing.images.slice(1).map((img, idx) => (
              <div key={idx} className="overflow-hidden h-full relative">
                <img src={img} alt={`View ${idx + 2}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Header Info */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <div className="flex items-baseline gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-stone-900">{listing.price}</h1>
                  <span className="text-lg text-stone-500 font-medium">{listing.pricePerBed}</span>
                </div>
                <p className="text-xl text-stone-900 font-semibold">{listing.address}</p>
                <p className="text-stone-600">{listing.location}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="text-stone-500 hover:text-orange-600 hover:bg-orange-50 border-stone-200">
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="text-stone-500 hover:text-red-600 hover:bg-red-50 border-stone-200">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex flex-col items-center justify-center text-center hover:border-orange-200 transition-colors">
                <span className="block text-2xl md:text-3xl font-bold text-stone-900 mb-1">{listing.stats.beds}</span>
                <span className="text-stone-500 font-medium text-sm uppercase tracking-wide">Bedrooms</span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex flex-col items-center justify-center text-center hover:border-orange-200 transition-colors">
                <span className="block text-2xl md:text-3xl font-bold text-stone-900 mb-1">{listing.stats.baths}</span>
                <span className="text-stone-500 font-medium text-sm uppercase tracking-wide">Bathrooms</span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex flex-col items-center justify-center text-center hover:border-orange-200 transition-colors">
                <Home className="h-8 w-8 text-stone-900 mb-1" />
                <span className="text-stone-500 font-medium text-sm uppercase tracking-wide">{listing.stats.type}</span>
              </div>
            </div>

            {/* Description & Highlights */}
            <section className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
              <h2 className="text-2xl font-bold text-stone-900 mb-4">About this Property</h2>
              <p className="text-stone-700 leading-relaxed mb-8 text-lg">
                {listing.description}
              </p>
              
              <h3 className="text-lg font-bold text-stone-900 mb-4">Highlights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                {listing.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-stone-900 block">{item.title}</span>
                      <span className="text-stone-600">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Amenities & Features */}
            <section>
              <h2 className="text-2xl font-bold text-stone-900 mb-6">Features & Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {listing.amenities.map((amenity, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-stone-200 bg-white flex items-center gap-3 hover:border-orange-200 transition-all">
                    <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                      <amenity.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-stone-900 text-sm">{amenity.label}</p>
                      <p className="text-xs text-stone-500">{amenity.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Commute & Location */}
            <section className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-stone-900">Location & Commute</h2>
                <span className="text-sm text-stone-500 bg-stone-100 px-3 py-1 rounded-full">{listing.location}</span>
              </div>
              
              {/* Map Placeholder */}
              <div className="w-full h-64 bg-stone-100 rounded-xl overflow-hidden relative group border border-stone-200">
                 <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop" 
                  alt="Map View" 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button variant="secondary" className="shadow-lg font-semibold gap-2">
                    <MapPin className="h-4 w-4 text-orange-600" />
                    View on Map
                  </Button>
                </div>
              </div>

              {/* Commute Calculator Mock */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-400 uppercase">Destination</label>
                  <select className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-sm font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20">
                    <option>Syracuse University</option>
                    <option>SUNY ESF</option>
                    <option>Upstate Medical</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-400 uppercase">Mode</label>
                  <div className="flex bg-stone-50 rounded-lg p-1 border border-stone-200">
                    <button className="flex-1 py-1 text-xs font-medium rounded bg-white shadow-sm text-stone-900">Walk</button>
                    <button className="flex-1 py-1 text-xs font-medium rounded text-stone-500 hover:text-stone-900">Bike</button>
                    <button className="flex-1 py-1 text-xs font-medium rounded text-stone-500 hover:text-stone-900">Drive</button>
                  </div>
                </div>
                <div className="flex items-center justify-center md:justify-end">
                   <div className="text-right">
                      <span className="block text-2xl font-bold text-stone-900">5 min</span>
                      <span className="text-xs text-stone-500 font-medium">Walking time</span>
                   </div>
                </div>
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Contact Card */}
            <Card className="p-6 border-stone-200 shadow-md bg-white sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-stone-900">Contact Lister</h3>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">Verified</span>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-stone-100 bg-stone-100">
                   <img src={listing.agent.image} alt={listing.agent.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-stone-900">{listing.agent.name}</h4>
                  <p className="text-sm text-stone-500">{listing.agent.role}</p>
                  <Link to="#" className="text-xs text-orange-600 font-medium hover:underline mt-1 block">
                    View more properties
                  </Link>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <a href={`tel:${listing.agent.phone}`} className="flex items-center justify-between p-3 rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors group">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-stone-400 group-hover:text-orange-600" />
                    <span className="font-semibold text-stone-700">{listing.agent.phone}</span>
                  </div>
                  {listing.agent.texting && <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded">Text OK</span>}
                </a>
              </div>

              <form className="space-y-4">
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-6 text-lg shadow-sm">
                  Send Message
                </Button>
                <p className="text-xs text-center text-stone-400">
                  By sending, you agree to our Terms and Privacy Policy.
                </p>
              </form>
            </Card>

            {/* Property Details / Quick Facts */}
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
              <h3 className="font-bold text-stone-900 mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-orange-500" />
                Property Details
              </h3>
              <div className="space-y-4 divide-y divide-stone-100">
                <div className="flex justify-between py-2">
                  <span className="text-stone-500 text-sm flex items-center gap-2"><Calendar className="h-4 w-4" /> Available</span>
                  <span className="font-semibold text-stone-900">{listing.details.availableDate}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-stone-500 text-sm flex items-center gap-2"><Clock className="h-4 w-4" /> Lease Length</span>
                  <span className="font-semibold text-stone-900">{listing.details.leaseLength}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-stone-500 text-sm flex items-center gap-2"><PawPrint className="h-4 w-4" /> Pets</span>
                  <span className="font-semibold text-stone-900">{listing.details.pets}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-stone-500 text-sm flex items-center gap-2"><GraduationCap className="h-4 w-4" /> Perfect For</span>
                  <span className="font-semibold text-stone-900">{listing.details.perfectFor}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-stone-500 text-sm flex items-center gap-2"><Tag className="h-4 w-4" /> Listing ID</span>
                  <span className="font-semibold text-stone-900">#9178</span>
                </div>
              </div>
            </div>

            {/* Alerts CTA */}
            <div className="bg-stone-900 p-6 rounded-xl text-white shadow-lg">
              <h3 className="font-bold text-lg mb-2">Don't miss out!</h3>
              <p className="text-stone-300 text-sm mb-4">Get notified when similar properties become available.</p>
              <Button variant="secondary" className="w-full font-semibold">
                Set Apartment Alert
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
