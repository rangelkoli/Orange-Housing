import { Link } from "react-router";
import { Facebook, Twitter, Instagram, Linkedin, Home } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#F5F2EB] text-stone-900 pt-20 pb-10 font-sans border-t border-stone-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Brand & Description - Spans 5 columns */}
          <div className="lg:col-span-5 space-y-8 ">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-bold tracking-tight text-stone-900">OrangeHousing<span className="text-[#EB7B07]">.com</span></span>
            </Link>
            
            <p className="text-stone-600 text-base leading-relaxed max-w-md">
              OrangeHousing.com provides hundreds of real, current, and accurate houses, apartments, and condos near Syracuse University, ESF, Crouse Hospital, and Upstate Medical in Syracuse, NY.
            </p>
            
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-sm w-full">
                <div className="bg-stone-50 p-2 rounded-lg h-16 w-16 flex items-center justify-center shrink-0 border border-stone-100">
                  <img src="/womenownedbusiness.png" alt="Certified WBE" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#EB7B07] uppercase tracking-wider">Certified Business</p>
                  <p className="text-sm font-medium text-stone-600 leading-tight max-w-[200px]">
                      Syracuse, NY Certified WBE Homes and Apartments Rental Website.
                  </p>
                </div>
            </div>
          </div>

          {/* Navigation Links - Spans 7 columns */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8 lg:pl-12">
            
            {/* Support Column */}
            <div>
              <h4 className="font-bold text-stone-900 mb-6 text-lg border-b border-[#EB7B07] inline-block pb-1">Support</h4>
              <ul className="space-y-4 text-stone-600">
                <li><Link to="#" className="hover:text-[#EB7B07] transition-colors flex items-center gap-2 hover:translate-x-1 duration-200">Contact Us</Link></li>
                <li><Link to="#" className="hover:text-[#EB7B07] transition-colors flex items-center gap-2 hover:translate-x-1 duration-200">Safety & Scams</Link></li>
                <li><Link to="#" className="hover:text-[#EB7B07] transition-colors flex items-center gap-2 hover:translate-x-1 duration-200">Terms & Conditions</Link></li>
                <li><Link to="#" className="hover:text-[#EB7B07] transition-colors flex items-center gap-2 hover:translate-x-1 duration-200">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
               <h4 className="font-bold text-stone-900 mb-6 text-lg border-b border-[#EB7B07] inline-block pb-1">Company</h4>
               <ul className="space-y-4 text-stone-600">
                <li><Link to="#" className="hover:text-[#EB7B07] transition-colors flex items-center gap-2 hover:translate-x-1 duration-200">About Us</Link></li>
                <li><Link to="#" className="hover:text-[#EB7B07] transition-colors flex items-center gap-2 hover:translate-x-1 duration-200">Customer Comments</Link></li>
                <li><Link to="#" className="hover:text-[#EB7B07] transition-colors flex items-center gap-2 hover:translate-x-1 duration-200">Articles & Blog</Link></li>
              </ul>
            </div>

            {/* Connect Column */}
            <div>
              <h4 className="font-bold text-stone-900 mb-6 text-lg border-b border-[#EB7B07] inline-block pb-1">Connect</h4>
              <div className="flex flex-col gap-4">
                <p className="text-sm text-stone-600">Follow us on social media for the latest updates and listings.</p>
                <div className="flex gap-3">
                  <Link to="#" className="bg-white border border-stone-200 p-3 rounded-lg text-stone-500 hover:bg-[#EB7B07] hover:text-white hover:border-[#EB7B07] transition-all duration-300 shadow-sm">
                    <Facebook size={20} />
                  </Link>
                  <Link to="#" className="bg-white border border-stone-200 p-3 rounded-lg text-stone-500 hover:bg-[#EB7B07] hover:text-white hover:border-[#EB7B07] transition-all duration-300 shadow-sm">
                    <Twitter size={20} />
                  </Link>
                  <Link to="#" className="bg-white border border-stone-200 p-3 rounded-lg text-stone-500 hover:bg-[#EB7B07] hover:text-white hover:border-[#EB7B07] transition-all duration-300 shadow-sm">
                    <Instagram size={20} />
                  </Link>
                  <Link to="#" className="bg-white border border-stone-200 p-3 rounded-lg text-stone-500 hover:bg-[#EB7B07] hover:text-white hover:border-[#EB7B07] transition-all duration-300 shadow-sm">
                    <Linkedin size={20} />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-stone-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-stone-500">
          <p>© OrangeHousing.com 2025. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-stone-500 text-xs">System Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
