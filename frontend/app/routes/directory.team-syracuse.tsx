import { ArrowLeft, ChevronRight, User, Globe, Mail, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router";
import { FaPhone } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

import { useState, useEffect } from "react";

export default function TeamSyracuseDirectoryPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeamSyracuse = async () => {
      try {
        const response = await fetch("http://localhost:8000/directory/team-syracuse/");
        const result = await response.json();
        if (result.success) {
          const mappedData = result.data.map((item: any) => ({
            name: item.name || "Unnamed Partner",
            contact: item.contact_name || "Representative",
            phone: item.phone,
            email: item.email,
            website: item.url || "https://example.com",
          }));
          setPartners(mappedData);
        }
      } catch (error) {
        console.error("Error fetching team syracuse:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamSyracuse();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pb-20">
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
            <span className="text-stone-900 font-medium">Team Syracuse</span>
          </nav>
        </div>

        {/* Add Your Listing CTA - Top */}
        <div className="max-w-4xl mx-auto mb-8">
          <Link
            to="/directory/team-syracuse/add"
            className="block w-full py-4 px-6 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-dashed border-orange-300 rounded-xl text-center hover:border-orange-400 hover:from-orange-100 hover:to-amber-100 transition-all group"
          >
            <span className="text-orange-600 font-semibold text-lg group-hover:text-orange-700">
              Join Team Syracuse Here
            </span>
          </Link>
        </div>

        <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-3xl border-4 border-white shadow-lg">
                    TS
                </div>
            </div>
          <h1 className="text-4xl font-bold text-stone-900 mb-4">Team Syracuse</h1>
          <p className="text-stone-600 text-lg max-w-2xl mx-auto mb-8">
            Meet the businesses and individuals dedicated to making Syracuse a better place to live.
          </p>
          
          <Link
            to="/directory/team-syracuse/add"
            className="flex overflow-hidden items-center text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-orange-600 text-white shadow hover:bg-orange-700 h-12 px-8 py-2 max-w-60 whitespace-pre md:flex group relative w-full justify-center gap-2 rounded-md transition-all duration-300 ease-out hover:ring-2 hover:ring-orange-600 hover:ring-offset-2 mx-auto"
          >
            <span
              className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"
            ></span>
            <div className="flex items-center gap-2">
                <FaHeart size={18} className="text-white" />

              <span className="ml-1 text-white text-base">Join Team Syracuse</span>
              <ArrowRight size={18} className="text-white" />
            </div>
          </Link>
          
        </div>

        <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-4" />
                <p className="text-stone-500 font-medium">Loading partners...</p>
              </div>
            ) : partners.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {partners.map((partner, idx) => (
                      <div key={idx} className='bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group'>
                          <div className='h-48 bg-stone-100 overflow-hidden relative border-b border-stone-100'>
                              <img 
                              src={`https://image.thum.io/get/width/600/crop/800/noanimate/${partner.website}`} 
                              alt={`${partner.name} website`}
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                          </div>
                          
                          <div className="p-6 flex flex-col flex-grow items-center text-center">
                              <h3 className='text-xl font-bold text-stone-900 mb-1'>
                              {partner.name}
                              </h3>
                              <div className='flex items-center gap-2 text-stone-500 text-sm mb-6'>
                              <User size={14} />
                              <span>{partner.contact}</span>
                              </div>

                              <div className='w-full space-y-3 mt-auto'>
                              <div className='flex gap-3'>
                                  <a 
                                  href={`tel:${partner.phone}`}
                                  className='flex-1 py-2.5 border border-stone-200 rounded-lg text-stone-600 font-medium hover:bg-stone-50 hover:text-stone-900 hover:border-stone-300 transition-all duration-200 flex items-center justify-center gap-2'
                                  >
                                  <FaPhone size={14} />
                                  Call
                                  </a>
                                  <a 
                                  href={`mailto:${partner.email}`}
                                  className='flex-1 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2'
                                  >
                                  <Mail size={16} />
                                  Email
                                  </a>
                              </div>
                              <a 
                                  href={partner.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className='w-full py-2.5 border border-stone-200 rounded-lg text-stone-600 font-medium hover:bg-stone-50 hover:text-stone-900 hover:border-stone-300 transition-all duration-200 flex items-center justify-center gap-2'
                              >
                                  <Globe size={16} />
                                  Visit Website
                              </a>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
            ) : (
              <div className="max-w-md mx-auto bg-white rounded-2xl p-12 text-center border border-stone-100 shadow-sm">
                <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star size={32} className="text-stone-300" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">No Partners Found</h3>
                <p className="text-stone-500 text-sm">Join Team Syracuse to become our first featured partner!</p>
              </div>
            )}
        </div>

        {/* Add Your Listing CTA - Bottom */}
        <div className="max-w-4xl mx-auto mt-12">
          <Link
            to="/directory/team-syracuse/add"
            className="block w-full py-4 px-6 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-dashed border-orange-300 rounded-xl text-center hover:border-orange-400 hover:from-orange-100 hover:to-amber-100 transition-all group"
          >
            <span className="text-orange-600 font-semibold text-lg group-hover:text-orange-700">
              Join Team Syracuse Here
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
