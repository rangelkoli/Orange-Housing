import { LandlordSidebar } from "../components/LandlordSidebar";
import { Search, Bell, HelpCircle, Filter, ArrowUpDown, Edit2, Eye, RefreshCw } from "lucide-react";

export default function LandlordDashboard() {
  // Mock Data
  const stats = [
    { label: "Active Listings", value: "12", change: "+1 this month", positive: true },
    { label: "Pending Applications", value: "5", change: "+2 this week", positive: true },
    { label: "Total Views This Month", value: "1,204", change: "+15%", positive: true },
    { label: "Occupancy Rate", value: "92%", change: "-2%", positive: false },
  ];

  const listings = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1000&auto=format&fit=crop",
      address: "123 Main Street",
      city: "Syracuse, NY 13202",
      status: "Listed",
      rent: "$1,500/mo",
      views: 245,
      applications: 3,
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000&auto=format&fit=crop",
      address: "456 Oak Avenue, Apt 5B",
      city: "Syracuse, NY 13210",
      status: "Rented",
      rent: "$1,200/mo",
      views: "N/A",
      applications: "N/A",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1000&auto=format&fit=crop",
      address: "789 Pine Street",
      city: "Syracuse, NY 13205",
      status: "Listed",
      rent: "$2,100/mo",
      views: 189,
      applications: 1,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans text-stone-900 flex">
      <LandlordSidebar />

      <main className="flex-grow flex flex-col h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-stone-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input 
                type="text" 
                placeholder="Search properties or tenants..." 
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 ml-4">
            <button className="p-2.5 text-stone-500 hover:bg-stone-50 rounded-lg transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <button className="p-2.5 text-stone-500 hover:bg-stone-50 rounded-lg transition-colors">
              <HelpCircle size={20} />
            </button>
            <div className="h-8 w-px bg-stone-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop" 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover border border-stone-200"
              />
              <div className="hidden md:block">
                <div className="text-sm font-bold text-stone-900">John Doe</div>
                <div className="text-xs text-stone-500">Syracuse Realty</div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-stone-900 mb-2">Dashboard</h1>
            <p className="text-stone-500">Welcome back, John! Here's a summary of your properties.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
                <div className="text-stone-500 text-sm font-medium mb-2">{stat.label}</div>
                <div className="text-3xl font-bold text-stone-900 mb-2">{stat.value}</div>
                <div className={`text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </div>
              </div>
            ))}
          </div>

          {/* Listings Table Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-stone-900">My Listings</h2>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-lg text-stone-600 font-medium hover:bg-stone-50 transition-colors shadow-sm">
                  <Filter size={16} /> Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-lg text-stone-600 font-medium hover:bg-stone-50 transition-colors shadow-sm">
                  <ArrowUpDown size={16} /> Sort
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-100 text-left">
                      <th className="py-4 px-6 text-sm font-semibold text-stone-500 w-[40%]">Property</th>
                      <th className="py-4 px-6 text-sm font-semibold text-stone-500">Status</th>
                      <th className="py-4 px-6 text-sm font-semibold text-stone-500">Rent</th>
                      <th className="py-4 px-6 text-sm font-semibold text-stone-500">Views</th>
                      <th className="py-4 px-6 text-sm font-semibold text-stone-500">Applications</th>
                      <th className="py-4 px-6 text-sm font-semibold text-stone-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.map((listing) => (
                      <tr key={listing.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <img src={listing.image} alt={listing.address} className="w-16 h-12 rounded-lg object-cover" />
                            <div>
                              <div className="font-bold text-stone-900">{listing.address}</div>
                              <div className="text-stone-500 text-sm">{listing.city}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            listing.status === 'Listed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {listing.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-medium text-stone-900">{listing.rent}</td>
                        <td className="py-4 px-6 text-stone-600">{listing.views}</td>
                        <td className="py-4 px-6 text-stone-600">{listing.applications}</td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-stone-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                              <Edit2 size={16} />
                            </button>
                            <button className="p-2 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Eye size={16} />
                            </button>
                            <button className="p-2 text-stone-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                              <RefreshCw size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
