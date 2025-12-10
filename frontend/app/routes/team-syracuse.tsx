import { ArrowLeft, ChevronRight, User, Globe, Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { FaPhone } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

export default function TeamSyracusePage() {
  const partners = [
    {
      name: "Copper Beech",
      contact: "Darya Rotblat",
      phone: "(315) 565-7555",
      email: "info@cbcsyracuse.com",
      website: "https://cbcsyracuse.com/",
    },
    {
      name: "Copper Beech",
      contact: "Savonne",
      phone: "(315) 565-7555",
      email: "info@housingsyr.com",
      website: "https://housingsyr.com",
    },
    {
      name: "D.N. Drucker Ltd.",
      contact: "Leasing Agent",
      phone: "(315) 445-1229",
      email: "info@dndruckerltd.com",
      website: "https://dndruckerltd.com",
    },
    {
      name: "Edward Glassberg",
      contact: "Edward Glassberg",
      phone: "(315) 427-6956",
      email: "info@yourkeyrealtor.com",
      website: "https://yourkeyrealtor.com",
    },
    {
      name: "Skyler Commons",
      contact: "Savonne",
      phone: "(315) 565-7775",
      email: "info@skylercommons.com",
      website: "https://skylercommons.com",
    },
    {
      name: "SU Rentals",
      contact: "Brett",
      phone: "(407) 312-5697",
      email: "info@surentals.com",
      website: "https://www.surentals.com",
    },
    {
      name: "Syracuse Quality Living",
      contact: "Property Manager",
      phone: "(315) 820-0200",
      email: "info@syracusequalityliving.com",
      website: "https://syracusequalityliving.com",
    },
    {
      name: "University Hill Realty",
      contact: "Norm",
      phone: "(315) 422-0709",
      email: "info@universityhill.com",
      website: "https://www.universityhill.com",
    },
    {
      name: "Upstate Management",
      contact: "Andy",
      phone: "(315) 415-8613",
      email: "info@upstatecos.com",
      website: "https://www.upstatecos.com",
    },
  ];

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
            to="/join-team-syracuse"
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
        </div>
      </div>
    </div>
  );
}
