

import { MapPin, Bed, Bath, Square, Calendar, Check, Phone, Mail, Share2, Heart } from "lucide-react";

export default function ListingDetailsPage() {
  // Mock Data for a single listing
  const listing = {
    id: 1,
    price: "$2,200/mo",
    address: "454 Serenity Lane",
    city: "Syracuse, NY 13202",
    beds: 4,
    baths: 2,
    sqft: 2100,
    available: "Aug 1, 2025",
    description: "Experience luxury student living in this spacious 4-bedroom home. Recently renovated with a modern kitchen, hardwood floors, and large bedrooms. Located just a 5-minute walk from campus, this property offers the perfect balance of convenience and comfort. The open-concept living area is perfect for hanging out with roommates, and the backyard patio is great for summer BBQs.",
    amenities: [
      "In-unit Washer/Dryer",
      "Central Air Conditioning",
      "Dishwasher",
      "Off-street Parking",
      "Hardwood Floors",
      "Pet Friendly",
      "Furnished Option Available",
      "High-speed Internet Ready"
    ],
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?q=80&w=1000&auto=format&fit=crop"
    ],
    agent: {
      name: "Sarah Jenkins",
      company: "Orange Property Management",
      phone: "(315) 555-0199",
      email: "sarah@example.com",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop"
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2EB] font-sans text-stone-900 flex flex-col">
      
      <main className="flex-grow pb-20">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[400px] md:h-[500px] w-full">
          <img src={listing.images[0]} alt="Main" className="w-full h-full object-cover" />
          <div className="grid grid-cols-2 gap-2 h-full">
            <img src={listing.images[1]} alt="Interior 1" className="w-full h-full object-cover" />
            <img src={listing.images[2]} alt="Interior 2" className="w-full h-full object-cover" />
            <img src={listing.images[3]} alt="Interior 3" className="w-full h-full object-cover" />
            <div className="relative">
              <img src={listing.images[0]} alt="More" className="w-full h-full object-cover brightness-50" />
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl cursor-pointer hover:underline">
                View All Photos
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Main Content */}
            <div className="lg:w-2/3">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-2">{listing.address}</h1>
                  <div className="flex items-center text-stone-600 text-lg">
                    <MapPin size={20} className="mr-1 text-orange-500" />
                    {listing.city}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="p-3 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-orange-600 hover:border-orange-200 shadow-sm transition-all">
                    <Share2 size={20} />
                  </button>
                  <button className="p-3 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-red-500 hover:border-red-200 shadow-sm transition-all">
                    <Heart size={20} />
                  </button>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm flex flex-col items-center text-center">
                  <Bed className="text-orange-500 mb-2" size={24} />
                  <span className="font-bold text-xl">{listing.beds}</span>
                  <span className="text-stone-500 text-sm">Bedrooms</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm flex flex-col items-center text-center">
                  <Bath className="text-orange-500 mb-2" size={24} />
                  <span className="font-bold text-xl">{listing.baths}</span>
                  <span className="text-stone-500 text-sm">Bathrooms</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm flex flex-col items-center text-center">
                  <Square className="text-orange-500 mb-2" size={24} />
                  <span className="font-bold text-xl">{listing.sqft}</span>
                  <span className="text-stone-500 text-sm">Sq Ft</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm flex flex-col items-center text-center">
                  <Calendar className="text-orange-500 mb-2" size={24} />
                  <span className="font-bold text-xl">Aug 1</span>
                  <span className="text-stone-500 text-sm">Available</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-stone-900 mb-4">About this home</h2>
                <p className="text-stone-600 leading-relaxed text-lg">
                  {listing.description}
                </p>
              </div>

              {/* Amenities */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-stone-900 mb-6">Amenities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {listing.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-stone-700">
                      <div className="bg-green-100 p-1 rounded-full">
                        <Check size={14} className="text-green-600" />
                      </div>
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar / Contact Form */}
            <div className="lg:w-1/3">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-stone-100 sticky top-24">
                <div className="mb-6">
                  <span className="text-stone-500 font-medium">Rent per month</span>
                  <div className="text-4xl font-bold text-orange-600">{listing.price}</div>
                </div>

                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-stone-100">
                  <img src={listing.agent.image} alt={listing.agent.name} className="w-16 h-16 rounded-full object-cover border-2 border-orange-100" />
                  <div>
                    <div className="font-bold text-lg text-stone-900">{listing.agent.name}</div>
                    <div className="text-stone-500 text-sm">{listing.agent.company}</div>
                  </div>
                </div>

                <form className="space-y-4">
                  <input type="text" placeholder="Your Name" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500" />
                  <input type="email" placeholder="Your Email" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500" />
                  <input type="tel" placeholder="Your Phone" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500" />
                  <textarea placeholder="I am interested in this property..." rows={4} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500"></textarea>
                  
                  <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md">
                    Send Message
                  </button>
                </form>

                <div className="mt-6 flex flex-col gap-3">
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 font-medium">
                    <Phone size={18} /> {listing.agent.phone}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
