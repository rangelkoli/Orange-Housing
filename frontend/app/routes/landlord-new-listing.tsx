import { useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, Upload, Calendar, MapPin, Check } from "lucide-react";

export default function CreateListingPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans text-stone-900">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/landlord/dashboard" className="p-2 hover:bg-stone-50 rounded-full text-stone-500 transition-colors">
              <ChevronLeft size={24} />
            </Link>
            <div className="flex items-center gap-2">
              <img src="/logo.webp" alt="Logo" className="h-8 w-auto" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600 mr-4">
              <Link to="#" className="hover:text-stone-900">Find a Rental</Link>
              <Link to="#" className="hover:text-stone-900">For Landlords</Link>
              <Link to="#" className="hover:text-stone-900">About</Link>
              <Link to="#" className="hover:text-stone-900">Blog</Link>
            </nav>
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">
              Add Listing
            </button>
            <div className="w-8 h-8 bg-orange-200 rounded-full border-2 border-white shadow-sm"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Add a New Listing</h1>
          <p className="text-stone-500">Fill out the details below to publish your property. You can save a draft at any time.</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm mb-8">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span className="text-stone-900">Step 1 of 6: Location</span>
            <span className="text-stone-400">15% Complete</span>
          </div>
          <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 w-[15%] rounded-full"></div>
          </div>
        </div>

        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          
          {/* Description & Photos */}
          <section className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm">
            <h2 className="text-xl font-bold text-stone-900 mb-6">Description & Photos</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-stone-700">Details</label>
                  <span className="text-xs text-stone-400">0 / 1000 characters</span>
                </div>
                <textarea 
                  className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all min-h-[120px]"
                  placeholder="Describe the property, its features, and the neighborhood..."
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Listing Photos</label>
                <div className="border-2 border-dashed border-stone-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-stone-50 transition-colors cursor-pointer bg-stone-50/50">
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-stone-400">
                    <Upload size={20} />
                  </div>
                  <p className="text-stone-600 font-medium mb-1">Drag & drop photos here or <span className="text-orange-600">browse</span></p>
                  <p className="text-xs text-stone-400">Max 10 photos. First photo must be the exterior.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm">
            <h2 className="text-xl font-bold text-stone-900 mb-6">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Contact Name</label>
                <input type="text" placeholder="e.g., Jane Doe" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Contact Email</label>
                <input type="email" placeholder="e.g., jane.doe@email.com" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">10-Digit Contact Number</label>
                <input type="tel" placeholder="e.g., 3151234567" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500" />
              </div>
              <div className="flex items-center h-full pt-8">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded border-stone-300 text-orange-600 focus:ring-orange-500" />
                  <span className="text-sm font-medium text-stone-700">Okay to text?</span>
                </label>
              </div>
            </div>
          </section>

          {/* Property Address */}
          <section className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm">
            <h2 className="text-xl font-bold text-stone-900 mb-6">Property Address</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Street Number</label>
                  <input type="text" placeholder="e.g., 123" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Street Name</label>
                  <input type="text" placeholder="e.g., Main Street" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Full Physical Address (for map)</label>
                  <input type="text" placeholder="123 Main Street, Syracuse, NY 13210" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Location / Neighborhood</label>
                  <select className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500">
                    <option>University Area</option>
                    <option>Westcott</option>
                    <option>Downtown</option>
                    <option>Tipperary Hill</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Map Preview</label>
                <div className="bg-stone-100 rounded-xl h-[300px] w-full flex items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 opacity-50 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/OpenStreetMap_Logo_2011.svg/1024px-OpenStreetMap_Logo_2011.svg.png')] bg-cover bg-center grayscale" />
                   <div className="bg-white p-4 rounded-lg shadow-lg relative z-10 max-w-[200px] text-center">
                     <MapPin className="mx-auto text-orange-500 mb-2" />
                     <p className="text-xs text-stone-500">Location will update as you type</p>
                   </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing & Lease Terms */}
          <section className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm">
            <h2 className="text-xl font-bold text-stone-900 mb-6">Pricing & Lease Terms</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Price Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-4 border-2 border-orange-200 bg-orange-50 rounded-xl cursor-pointer transition-all">
                    <input type="radio" name="priceType" className="w-5 h-5 text-orange-600 focus:ring-orange-500" defaultChecked />
                    <span className="font-medium text-stone-900">Per Bedroom / Month</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 transition-all">
                    <input type="radio" name="priceType" className="w-5 h-5 text-orange-600 focus:ring-orange-500" />
                    <span className="font-medium text-stone-900">Total Price / Month</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Rent ($)</label>
                  <input type="text" placeholder="$ e.g., 750" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Lease Length (months)</label>
                  <select className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500">
                    <option>12 Months</option>
                    <option>10 Months</option>
                    <option>6 Months</option>
                    <option>Month-to-Month</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Lease Starts</label>
                  <div className="relative">
                    <input type="text" placeholder="mm/dd/yyyy" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500" />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Lease Ends</label>
                  <div className="relative">
                    <input type="text" placeholder="mm/dd/yyyy" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500" />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Property Specifications */}
          <section className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm">
            <h2 className="text-xl font-bold text-stone-900 mb-6">Property Specifications</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Building Type</label>
                <select className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500">
                  <option>Multi-Family Home</option>
                  <option>Apartment Complex</option>
                  <option>Single Family Home</option>
                  <option>Townhouse</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Beds</label>
                <select className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500">
                  <option>Studio</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5+</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Baths</label>
                <select className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500">
                  <option>1</option>
                  <option>1.5</option>
                  <option>2</option>
                  <option>2.5</option>
                  <option>3+</option>
                </select>
              </div>
            </div>
          </section>

          {/* Amenities & Features */}
          <section className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm">
            <h2 className="text-xl font-bold text-stone-900 mb-6">Amenities & Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Pets</label>
                <div className="flex bg-stone-100 rounded-lg p-1">
                  <button type="button" className="flex-1 py-1.5 bg-white shadow-sm rounded-md text-sm font-medium text-stone-900">Yes</button>
                  <button type="button" className="flex-1 py-1.5 text-sm font-medium text-stone-500 hover:text-stone-900">No</button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Furnished</label>
                <div className="flex bg-stone-100 rounded-lg p-1">
                  <button type="button" className="flex-1 py-1.5 text-sm font-medium text-stone-500 hover:text-stone-900">Yes</button>
                  <button type="button" className="flex-1 py-1.5 bg-white shadow-sm rounded-md text-sm font-medium text-stone-900">No</button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Laundry</label>
                <select className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-orange-500">
                  <option>In-unit</option>
                  <option>On-site</option>
                  <option>None</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Parking</label>
                <select className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-orange-500">
                  <option>Off-street</option>
                  <option>Garage</option>
                  <option>Street</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Includes</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Heat', 'Water', 'Wi-Fi', 'Electricity', 'Snow Removal', 'Trash', 'Cable', 'Gas'].map((item) => (
                  <label key={item} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 rounded border-stone-300 text-orange-600 focus:ring-orange-500" />
                    <span className="text-sm text-stone-600">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 pb-20">
            <button type="button" className="px-6 py-3 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold rounded-xl transition-colors">
              Save Draft
            </button>
            <button type="submit" className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all transform active:scale-[0.98]">
              Publish Listing
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}
