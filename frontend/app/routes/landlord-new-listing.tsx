import { useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, Upload, Calendar, MapPin, Check, PawPrint, Sofa, WashingMachine, Car, Flame, Droplets, Wifi, Zap, Snowflake, Trash2, Tv, Wind } from "lucide-react";

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
                  name="details"
                  className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all min-h-[120px]"
                  placeholder="Describe the property, its features, and the neighborhood..."
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Perfect For</label>
                <input type="text" name="perfect_for" placeholder="e.g., Students, Families, Young Professionals" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Listing Photos</label>
                <div className="border-2 border-dashed border-stone-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-stone-50 transition-colors cursor-pointer bg-stone-50/50">
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-stone-400">
                    <Upload size={20} />
                  </div>
                  <p className="text-stone-600 font-medium mb-1">Drag & drop photos here or <span className="text-orange-600">browse</span></p>
                  <p className="text-xs text-stone-400">Max 10 photos. First photo must be the exterior.</p>
                  <input type="hidden" name="cover_photo_id" />
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
                <input type="text" name="contact_name" placeholder="e.g., Jane Doe" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Contact Email</label>
                <input type="email" name="contact_email" placeholder="e.g., jane.doe@email.com" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">10-Digit Contact Number</label>
                <input type="tel" name="contact_number" placeholder="e.g., 3151234567" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500" />
              </div>
              <div className="flex items-center h-full pt-8">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="textOk" value="1" className="w-5 h-5 rounded border-stone-300 text-orange-600 focus:ring-orange-500" />
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
                  <label className="text-sm font-medium text-stone-700">Full Physical Address</label>
                  <input type="text" name="address" placeholder="123 Main Street" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Unit / Apt #</label>
                    <input type="text" name="unit" placeholder="e.g., 4B" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500" />
                    </div>
                    <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Zip Code</label>
                    <input type="text" name="zip" placeholder="e.g., 13210" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500" />
                    </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Location / Neighborhood</label>
                  <select name="location" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500">
                    <option value="University Area">University Area</option>
                    <option value="Westcott">Westcott</option>
                    <option value="Downtown">Downtown</option>
                    <option value="Tipperary Hill">Tipperary Hill</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <input type="hidden" name="physicalAddress" />
                <input type="hidden" name="latLng" />
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
                    <input type="radio" name="rent_type" value="perBed" className="w-5 h-5 text-orange-600 focus:ring-orange-500" defaultChecked />
                    <span className="font-medium text-stone-900">Per Bedroom / Month</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 transition-all">
                    <input type="radio" name="rent_type" value="total" className="w-5 h-5 text-orange-600 focus:ring-orange-500" />
                    <span className="font-medium text-stone-900">Total Price / Month</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Rent ($)</label>
                  <input type="number" name="rent" placeholder="$ e.g., 750" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Lease Length (months)</label>
                  <input type="number" name="lease_length" placeholder="e.g. 12" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Lease Starts</label>
                  <div className="relative">
                    <input type="date" name="date_avail" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Lease Ends</label>
                  <div className="relative">
                    <input type="date" name="tenant_lease_end" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500" />
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
                <select name="building_type" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500">
                  <option value="Multi-Family Home">Multi-Family Home</option>
                  <option value="Apartment Complex">Apartment Complex</option>
                  <option value="Single Family Home">Single Family Home</option>
                  <option value="Townhouse">Townhouse</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Beds</label>
                <input type="number" name="beds" placeholder="e.g. 3" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Baths</label>
                <input type="text" name="baths" placeholder="e.g. 1.5" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Total Beds in Unit</label>
                <input type="number" name="total_beds" placeholder="e.g. 4" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-orange-500" />
              </div>
            </div>
          </section>

          {/* Amenities & Features */}
          <section className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm">
            <h2 className="text-xl font-bold text-stone-900 mb-6">Amenities & Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Core Features */}
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider">Property Features</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                      <PawPrint size={16} className="text-stone-400" />
                      Pets Allowed
                    </label>
                    <select name="pets" className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 transition-colors">
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                        <option value="Cats">Cats Only</option>
                        <option value="Dogs">Dogs Only</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                      <Sofa size={16} className="text-stone-400" />
                      Furnished
                    </label>
                    <select name="furnished" className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 transition-colors">
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                        <option value="Part">Partially</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                      <WashingMachine size={16} className="text-stone-400" />
                      Laundry
                    </label>
                    <select name="laundry" className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 transition-colors">
                      <option value="None">None</option>
                      <option value="In-unit">In-unit</option>
                      <option value="On-site">On-site</option>
                      <option value="Hookups">Hookups Only</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                      <Car size={16} className="text-stone-400" />
                      Parking
                    </label>
                    <select name="parking" className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 transition-colors">
                      <option value="Street">Street</option>
                      <option value="Off-street">Off-street</option>
                      <option value="Garage">Garage</option>
                      <option value="Covered">Covered</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Utilities & Extras */}
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider">Utilities & Extras</h3>
                <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" name="utilities" value="Heat" className="w-4 h-4 text-orange-600" />
                        <span className="text-sm">Heat Included</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" name="utilities" value="Water" className="w-4 h-4 text-orange-600" />
                        <span className="text-sm">Water Included</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" name="utilities" value="Electric" className="w-4 h-4 text-orange-600" />
                        <span className="text-sm">Electric Included</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" name="utilities" value="Wifi" className="w-4 h-4 text-orange-600" />
                        <span className="text-sm">Wifi Included</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" name="fireplace" value="Yes" className="w-4 h-4 text-orange-600" />
                        <span className="text-sm">Fireplace</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" name="dishwasher" value="Yes" className="w-4 h-4 text-orange-600" />
                        <span className="text-sm">Dishwasher</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" name="porch" value="Yes" className="w-4 h-4 text-orange-600" />
                        <span className="text-sm">Porch/Deck</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" name="smoking" value="Yes" className="w-4 h-4 text-orange-600" />
                        <span className="text-sm">Smoking Allowed</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" name="is_season" value="Yes" className="w-4 h-4 text-orange-600" />
                        <span className="text-sm">Seasonal Rental</span>
                    </label>
                </div>
              </div>
            </div>
          </section>

          {/* Housemate Preferences (For Shared Living) */}
          <section className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm">
            <h2 className="text-xl font-bold text-stone-900 mb-6">Housemate Preferences (Optional)</h2>
            <p className="text-sm text-stone-500 mb-6">Fill this out if you are looking for housemates or listing a room in a shared house.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Kitchen Cleanliness</label>
                    <select name="house_kitchen" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg">
                        <option value="">Select...</option>
                        <option value="Clean as you go">Clean as you go</option>
                        <option value="Clean daily">Clean daily</option>
                        <option value="Clean weekly">Clean weekly</option>
                        <option value="Messy is okay">Messy is okay</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Chores</label>
                    <select name="house_chores" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg">
                        <option value="">Select...</option>
                        <option value="Split evenly">Split evenly</option>
                        <option value="Rotate">Rotate</option>
                        <option value="Hire cleaner">Hire cleaner</option>
                        <option value="Do your own">Do your own</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Sleep Schedule</label>
                    <select name="house_sleep" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg">
                        <option value="">Select...</option>
                        <option value="Early bird">Early bird</option>
                        <option value="Night owl">Night owl</option>
                        <option value="Flexible">Flexible</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">General Cleanliness</label>
                    <select name="house_clean" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg">
                        <option value="">Select...</option>
                        <option value="Neat freak">Neat freak</option>
                        <option value="Average">Average</option>
                        <option value="Relaxed">Relaxed</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Drinking/Partying</label>
                    <select name="house_drink" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg">
                        <option value="">Select...</option>
                        <option value="Non-drinker">Non-drinker</option>
                        <option value="Socially">Socially</option>
                        <option value="Frequently">Frequently</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">We Are (Current Household)</label>
                    <input type="text" name="we_are" placeholder="e.g. 2 male students" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">We Prefer (Housemate)</label>
                    <input type="text" name="we_prefer" placeholder="e.g. Quiet student" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Beds Needed</label>
                    <input type="number" name="beds_needed" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">I Am (Applicant)</label>
                    <input type="text" name="i_am" placeholder="e.g. Grad student" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Max Rent</label>
                    <input type="number" name="max_rent" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">My Gender</label>
                    <input type="text" name="my_gender" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Prefer Gender</label>
                    <input type="text" name="prefer_gender" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg" />
                </div>
            </div>
          </section>

          {/* Hidden Fields for Database Defaults/Required */}
          <input type="hidden" name="user_id" value="1" /> {/* TODO: Get from auth */}
          <input type="hidden" name="date_created" value={new Date().toISOString().split('T')[0]} />
          <input type="hidden" name="date_expires" value={new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]} />
          <input type="hidden" name="visible" value="1" />
          <input type="hidden" name="featured" value="0" />
          <input type="hidden" name="typeCode" value="1" />
          <input type="hidden" name="spotlightListing" value="2010-01-01" />

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
