import { Check, X, ArrowLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";

export default function ComparePage() {
  const properties = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1000&auto=format&fit=crop",
      address: "123 Maple St",
      neighborhood: "University Hill",
      price: "$1,800/mo",
      beds: "3 Beds",
      baths: "2 Baths",
      sqft: "1,200 sqft",
      laundry: { available: true, type: "In-unit" },
      petFriendly: { available: true, type: "Yes" },
      parking: "Street",
      leaseTerm: "12 months",
      available: "August 1st",
      description: "Spacious 3-bedroom near the university, perfect for students. Hardwood floors and a large living area.",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000&auto=format&fit=crop",
      address: "456 Oak Ave",
      neighborhood: "Downtown",
      price: "$2,100/mo",
      beds: "2 Beds",
      baths: "2.5 Baths",
      sqft: "1,350 sqft",
      laundry: { available: true, type: "In-unit" },
      petFriendly: { available: false, type: "No" },
      parking: "Garage",
      leaseTerm: "6, 12 months",
      available: "Now",
      description: "Luxury downtown apartment with city views, modern finishes, and concierge service.",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1000&auto=format&fit=crop",
      address: "789 Pine Ln",
      neighborhood: "Westcott",
      price: "$1,950/mo",
      beds: "2 Beds",
      baths: "2 Baths",
      sqft: "1,100 sqft",
      laundry: { available: false, type: "Shared" },
      petFriendly: { available: true, type: "Yes" },
      parking: "Driveway",
      leaseTerm: "12, 18 months",
      available: "July 15th",
      description: "Charming home in a quiet neighborhood with a fenced yard and updated kitchen.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F9] font-sans text-stone-900 pb-20">
      {/* Navbar Placeholder / Back Button */}

      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="p-2 -ml-2 hover:bg-stone-100 rounded-full text-stone-600 transition-colors group" title="Back to Home">
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          
          <div className="h-6 w-px bg-stone-200" />

          <nav className="flex items-center text-sm text-stone-500">
            <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2 text-stone-300" />
            <span className="text-stone-900 font-medium">Compare</span>
          </nav>
        </div>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-stone-900 mb-3">Compare Properties</h1>
          <p className="text-stone-600 text-lg">
            View your selected listings side-by-side to find the perfect home.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr>
                  <th className="p-8 text-left align-top w-64 bg-white sticky left-0 z-10 border-b border-stone-100">
                    <span className="text-sm font-bold text-stone-500 uppercase tracking-wider">Property</span>
                  </th>
                  {properties.map((property) => (
                    <th key={property.id} className="p-8 text-left align-top w-80 border-b border-stone-100 min-w-[300px]">
                      <div className="space-y-4">
                        <div className="aspect-[4/3] rounded-xl overflow-hidden bg-stone-100">
                          <img
                            src={property.image}
                            alt={property.address}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-stone-900">{property.address}</h3>
                          <p className="text-orange-600 font-medium">{property.neighborhood}</p>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {/* Basic Info */}
                <tr>
                  <td className="p-6 pl-8 font-medium text-stone-900 bg-stone-50/50 sticky left-0">Price</td>
                  {properties.map((property) => (
                    <td key={property.id} className="p-6 text-stone-600 font-medium">
                      {property.price}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-6 pl-8 font-medium text-stone-900 bg-stone-50/50 sticky left-0">Beds</td>
                  {properties.map((property) => (
                    <td key={property.id} className="p-6 text-stone-600">
                      {property.beds}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-6 pl-8 font-medium text-stone-900 bg-stone-50/50 sticky left-0">Baths</td>
                  {properties.map((property) => (
                    <td key={property.id} className="p-6 text-stone-600">
                      {property.baths}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-6 pl-8 font-medium text-stone-900 bg-stone-50/50 sticky left-0">Sq. Ft.</td>
                  {properties.map((property) => (
                    <td key={property.id} className="p-6 text-stone-600">
                      {property.sqft}
                    </td>
                  ))}
                </tr>

                {/* Amenities Section Header */}
                <tr className="bg-[#F5F2EB]">
                  <td colSpan={properties.length + 1} className="px-8 py-3 font-bold text-stone-800 text-sm uppercase tracking-wider">
                    Amenities
                  </td>
                </tr>

                <tr>
                  <td className="p-6 pl-8 font-medium text-stone-900 bg-stone-50/50 sticky left-0">Laundry</td>
                  {properties.map((property) => (
                    <td key={property.id} className="p-6">
                      <div className="flex items-center gap-2">
                        {property.laundry.available ? (
                          <div className="p-0.5 rounded-full bg-green-100 text-green-600">
                            <Check size={14} strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="p-0.5 rounded-full bg-red-100 text-red-600">
                            <X size={14} strokeWidth={3} />
                          </div>
                        )}
                        <span className="text-stone-600">{property.laundry.type}</span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-6 pl-8 font-medium text-stone-900 bg-stone-50/50 sticky left-0">Pet Friendly</td>
                  {properties.map((property) => (
                    <td key={property.id} className="p-6">
                      <div className="flex items-center gap-2">
                        {property.petFriendly.available ? (
                          <div className="p-0.5 rounded-full bg-green-100 text-green-600">
                            <Check size={14} strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="p-0.5 rounded-full bg-red-100 text-red-600">
                            <X size={14} strokeWidth={3} />
                          </div>
                        )}
                        <span className="text-stone-600">{property.petFriendly.type}</span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-6 pl-8 font-medium text-stone-900 bg-stone-50/50 sticky left-0">Parking</td>
                  {properties.map((property) => (
                    <td key={property.id} className="p-6 text-stone-600">
                      {property.parking}
                    </td>
                  ))}
                </tr>

                {/* Lease & Contact Section Header */}
                <tr className="bg-[#F5F2EB]">
                  <td colSpan={properties.length + 1} className="px-8 py-3 font-bold text-stone-800 text-sm uppercase tracking-wider">
                    Lease & Contact
                  </td>
                </tr>

                <tr>
                  <td className="p-6 pl-8 font-medium text-stone-900 bg-stone-50/50 sticky left-0">Lease Term</td>
                  {properties.map((property) => (
                    <td key={property.id} className="p-6 text-stone-600">
                      {property.leaseTerm}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-6 pl-8 font-medium text-stone-900 bg-stone-50/50 sticky left-0">Available</td>
                  {properties.map((property) => (
                    <td key={property.id} className="p-6 text-stone-600">
                      {property.available}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-6 pl-8 font-medium text-stone-900 bg-stone-50/50 sticky left-0 align-top">Description</td>
                  {properties.map((property) => (
                    <td key={property.id} className="p-6 text-stone-600 text-sm leading-relaxed align-top">
                      {property.description}
                    </td>
                  ))}
                </tr>

                {/* Actions */}
                <tr>
                    <td className="p-6 pl-8 bg-stone-50/50 sticky left-0"></td>
                    {properties.map((property) => (
                        <td key={property.id} className="p-6 space-y-3 align-bottom">
                            <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold h-12 rounded-xl shadow-sm">
                                View Listing
                            </Button>
                            <Button variant="secondary" className="w-full bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold h-12 rounded-xl">
                                {property.id === 2 ? "Schedule Tour" : "Contact Agent"}
                            </Button>
                        </td>
                    ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
