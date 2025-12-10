import { Link } from "react-router";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Pin, // For Pinterest if available, otherwise MapPin or similar
  Video, // For TikTok placeholder if needed
  Home
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const handleSocialClick = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("Coming Soon!");
  };

  return (
    <footer className='bg-[#F5F2EB] text-stone-900 pt-20 pb-12 font-sans border-t border-stone-200'>
      <div className='container mx-auto px-4 max-w-7xl'>
        
        {/* Main Footer Content - 12 Column Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-20'>
          
          {/* Column 1: Brand & Company (Span 4) */}
          <div className='lg:col-span-4 space-y-10'>
            <div className="space-y-6">
              <Link to='/' className='inline-block'>
                <span className='text-2xl font-bold tracking-tight text-stone-900 font-serif'>
                  OrangeHousing<span className='text-[#EB7B07]'>.com</span>
                </span>
              </Link>
              <p className="text-stone-600 text-sm leading-relaxed max-w-sm">
                The Original Syracuse Rental Platform. Built and managed by Syracuse residents for everyone looking to rent in Syracuse, NY. We work hard to provide real, accurate, and up-to-date listings for houses, apartments, and rooms for rent, including rentals near Syracuse University, ESF, Crouse Hospital, and Upstate Medical.
              </p>
              
              <div className='flex items-center gap-4 bg-transparent p-3  w-full'>
                <div className='bg-stone-50 p-1.5 rounded-lg h-48 w-48 flex items-center justify-center shrink-0 border border-stone-100'>
                  <img
                    src='/womenownedbusiness.png'
                    alt='Certified WBE'
                    className='max-h-full max-w-full object-contain'
                  />
                </div>
                <div className='space-y-0.5'>
                  <p className='text-[10px] font-bold text-[#EB7B07] uppercase tracking-wider font-mono'>
                    Certified Business
                  </p>
                  <p className='text-xs font-medium text-stone-600 leading-tight max-w-[180px]'>
                    Syracuse, NY Certified WBE Rental Website.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className='font-bold text-stone-900 text-sm mb-6 font-serif'>
                Our Company
              </h4>
              <ul className='space-y-3 text-stone-600 text-sm'>
                <li><Link to='/' className='hover:text-[#EB7B07] transition-colors'>OrangeHousing.com</Link></li>
                <li><Link to='/blog' className='hover:text-[#EB7B07] transition-colors'>OrangeHousing Blog</Link></li>
                <li><Link to='#' className='hover:text-[#EB7B07] transition-colors'>Testimonial</Link></li>
                <li><Link to='#' className='hover:text-[#EB7B07] transition-colors'>Privacy Policy</Link></li>
                <li><Link to='#' className='hover:text-[#EB7B07] transition-colors'>Terms of Service</Link></li>
                <li><Link to='#' className='hover:text-[#EB7B07] transition-colors'>Do Not Share or Sell My Personal Information</Link></li>
              </ul>
            </div>
          </div>

          {/* Column 2: Popular Searches & Locations (Span 5) */}
          <div className='lg:col-span-5 space-y-12'>
            <div>
              <h4 className='font-bold text-stone-900 text-sm mb-6 font-serif'>
                Popular Searches
              </h4>
              <ul className='grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-stone-600 text-sm'>
                <li><Link to='#' className='hover:text-[#EB7B07] transition-colors'>Apartments for Rent Near Me</Link></li>
                <li><Link to='#' className='hover:text-[#EB7B07] transition-colors'>Houses for Rent Near Me</Link></li>
                <li><Link to='#' className='hover:text-[#EB7B07] transition-colors'>1 Bedroom Apartments</Link></li>
                <li><Link to='#' className='hover:text-[#EB7B07] transition-colors'>Studio Apartments</Link></li>
                <li><Link to='#' className='hover:text-[#EB7B07] transition-colors'>Cheap Houses Near Me</Link></li>
                <li><Link to='#' className='hover:text-[#EB7B07] transition-colors'>Luxury Apartments</Link></li>
                <li><Link to='#' className='hover:text-[#EB7B07] transition-colors'>Pet Friendly Apartments</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className='font-bold text-stone-900 text-sm mb-6 font-serif'>
                Locations We Serve
              </h4>
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-xs text-stone-500'>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>Armory Square</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>Brighton</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>Camillus</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>Cicero</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>Clay</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>Clinton Square</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>DeWitt</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>Downtown</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>East Syracuse</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>Eastwood</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>Elbridge</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>Fabius</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>Fayetteville</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>Franklin Sq</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>Geddes</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>Inner Harbor</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>Jamesville</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>Lafayette</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>Liverpool</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>Manlius</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>Marcellus</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>Meadbrook</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>North Valley</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>Onondaga Hill</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>Outer Comstock</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>Pompey</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>Salt Springs</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>Sedgwick</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>South Valley</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>Strathmore</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>Syracuse Univ</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>Tipperary Hill</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>University Hill</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>Westcott</Link>
                <Link to='#' className='hover:text-[#EB7B07] transition-colors'>Westvale</Link>
              </div>
            </div>
          </div>

          {/* Column 3: Let Us Help (Span 3) */}
          <div className='lg:col-span-3 space-y-10'>
            <div>
              <h4 className='font-bold text-stone-900 text-sm mb-6 font-serif'>
                Let Us Help
              </h4>
              <ul className='space-y-4 text-stone-600 text-sm'>
                <li className="flex flex-col gap-1">
                  <span className="font-semibold text-stone-900">Contact Us</span>
                  <a href="mailto:support@orangehousing.com" className='hover:text-[#EB7B07] transition-colors font-mono text-xs'>Email Us</a>
                  <a href="tel:3152634621" className='hover:text-[#EB7B07] transition-colors font-mono text-xs'>(315) 263-4621</a>
                </li>
                <li><Link to='#' className='hover:text-[#EB7B07] transition-colors'>Avoid Scams</Link></li>
                <li><Link to='#' className='hover:text-[#EB7B07] transition-colors'>List a Property</Link></li>
                <li><Link to='#' className='hover:text-[#EB7B07] transition-colors'>Business Solutions</Link></li>
                <li><Link to='#' className='hover:text-[#EB7B07] transition-colors'>Site Map</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-stone-900 text-sm mb-4 font-serif">Follow Us</h5>
              <div className='flex flex-wrap gap-2'>
                <button onClick={handleSocialClick} className='p-2 rounded-lg text-stone-500 hover:bg-[#EB7B07] hover:text-white transition-all duration-300'>
                  <Facebook size={20} />
                </button>
                <button onClick={handleSocialClick} className='p-2 rounded-lg text-stone-500 hover:bg-[#EB7B07] hover:text-white transition-all duration-300'>
                  <Twitter size={20} />
                </button>
                <button onClick={handleSocialClick} className='p-2 rounded-lg text-stone-500 hover:bg-[#EB7B07] hover:text-white transition-all duration-300'>
                  <Instagram size={20} />
                </button>
                <button onClick={handleSocialClick} className='p-2 rounded-lg text-stone-500 hover:bg-[#EB7B07] hover:text-white transition-all duration-300'>
                  <Linkedin size={20} />
                </button>
                <button onClick={handleSocialClick} className='p-2 rounded-lg text-stone-500 hover:bg-[#EB7B07] hover:text-white transition-all duration-300'>
                  <Youtube size={20} />
                </button>
                <button onClick={handleSocialClick} className='p-2 rounded-lg text-stone-500 hover:bg-[#EB7B07] hover:text-white transition-all duration-300'>
                  <Pin size={20} />
                </button>
                <button onClick={handleSocialClick} className='p-2 rounded-lg text-stone-500 hover:bg-[#EB7B07] hover:text-white transition-all duration-300'>
                  <Video size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className='border-t border-stone-200 pt-8 flex flex-col items-center text-center gap-6'>
          <div className="flex items-center justify-center gap-2">
            <Home className="h-5 w-5 text-[#EB7B07]" />
            <span className="font-bold text-stone-900 text-lg font-serif">OrangeHousing.com</span>
          </div>
          <p className='text-stone-500 text-sm max-w-3xl leading-relaxed'>
            OrangeHousing.com is committed to and abides by the Fair Housing Act and Equal Opportunity Act. 
            <Link to="#" className="text-[#EB7B07] hover:underline ml-1 font-medium">Fair Housing Policy</Link> and 
            <Link to="#" className="text-[#EB7B07] hover:underline ml-1 font-medium">The New York State Fair Housing Notice</Link>.
          </p>
          <p className='text-stone-400 text-xs font-mono'>
            © {currentYear} OrangeHousing.com. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
