import { Link, useNavigate } from "react-router";
import {
  Heart,
  Menu,
  X,
  MapPin,
  ChevronRight,
  Instagram,
  Facebook,
  Twitter,
  Home,
  Building2,
  Store,
  Coffee,
  Truck,
  ShoppingBag,
  ChevronLeft,
  Linkedin,
  Star,
  Mail,
  Bed,
  Bath,
  ArrowRightLeft,
  Calendar,
  Square,
  Eye,
  User,
  Globe,
} from "lucide-react";
import SearchWidget from "../components/SearchWidget";
import { useState, useEffect } from "react";
import { FaPhone } from "react-icons/fa";
import { BackgroundGradientAnimation } from "components/ui/shadcn-io/background-gradient-animation";
import { type MetaFunction } from "react-router";
import { motion } from "framer-motion";
import { useFavoritesStore } from "../stores/favoritesStore";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
};

export const meta: MetaFunction = () => {
  return [
    {
      title:
        "Orange Housing | Find Apartments, Homes & Rooms for Rent in Syracuse, NY",
    },
    {
      name: "description",
      content:
        "Discover your perfect rental in Syracuse, NY. Browse family homes, student apartments, and shared spaces. Connect with local landlords and property managers today.",
    },
  ];
};

export default function HomePage() {
  return (
    <div className='min-h-screen bg-white font-sans text-stone-900'>
      <Hero />
      <FeaturedHomes />
      <LocalAds />
      <Testimonials />
      <Partners />
      <FAQ />
      <Blog />
    </div>
  );
}

function Hero() {
  return (
    <div className='relative min-h-[500px] md:h-[700px] flex items-center justify-center overflow-hidden py-12 md:py-0'>
      {/* Professional gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-stone-50 to-orange-50/30" />
      
      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #1a1a1a 1px, transparent 1px),
            linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Gradient accent orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-300/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl" />
      
      {/* Content */}
      <div className='relative z-20 container mx-auto px-4 max-w-5xl pointer-events-none'>
        <motion.div 
          className="pointer-events-auto"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.h1 
            className="text-balance text-center mb-8 tracking-tight font-serif text-[40px] md:text-[52px] leading-[1.15] text-stone-800 font-normal"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Find Your
            <span className="relative inline-block mx-2 text-orange-600 italic cursor-pointer hover:text-orange-700
              after:content-[''] after:absolute after:bottom-1 after:left-0 after:w-0 after:h-[3px] after:bg-orange-500/40
              after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">
              Home
            </span>,
            <span className="relative inline-block mx-2 text-orange-600 italic cursor-pointer hover:text-orange-700
              after:content-[''] after:absolute after:bottom-1 after:left-0 after:w-0 after:h-[3px] after:bg-orange-500/40
              after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">
              Apartment,
            </span>or
            <span className="relative inline-block mx-2 text-orange-600 italic cursor-pointer hover:text-orange-700
              after:content-[''] after:absolute after:bottom-1 after:left-0 after:w-0 after:h-[3px] after:bg-orange-500/40
              after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">
              Room
            </span>for Rent in Syracuse, New York
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            <SearchWidget />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function FeaturedHomeCard({ home }: { home: any }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const isHomeFavorite = isFavorite(home.id);

  const handleCardClick = () => {
    navigate(`/listings/${home.id}`);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % home.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(
      (prev) => (prev - 1 + home.images.length) % home.images.length
    );
  };

  return (
    <div 
      onClick={handleCardClick}
      className='bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-stone-100 cursor-pointer relative'
    >
      <div className='relative h-64 overflow-hidden'>
        <img
          src={home.images[currentImageIndex]}
          alt={home.address}
          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-10">
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2">
            <Eye size={16} className="text-stone-800" />
            <span className="text-sm font-semibold text-stone-800">Click to view details</span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevImage}
          className='absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 rounded-full hover:bg-white text-stone-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-20'
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={nextImage}
          className='absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 rounded-full hover:bg-white text-stone-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-20'
        >
          <ChevronRight size={18} />
        </button>

        <div className="absolute top-4 right-4 flex gap-2 z-20">
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              toggleFavorite(home);
            }}
            className={`p-2 bg-white/90 backdrop-blur-sm rounded-full transition-colors shadow-sm group/fav ${isHomeFavorite ? 'text-red-500' : 'text-stone-400 hover:text-red-500'}`}
            title={isHomeFavorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Heart size={20} className={`group-hover/fav:scale-110 transition-transform ${isHomeFavorite ? 'fill-red-500' : ''}`} />
          </button>
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              navigate('/compare');
            }}
            className='p-2 bg-white/90 backdrop-blur-sm rounded-full text-stone-400 hover:text-orange-500 transition-colors shadow-sm group/compare' 
            title="Compare"
          >
            <ArrowRightLeft size={20} className="group-hover/compare:scale-110 transition-transform" />
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-orange-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-sm">
            {home.category || 'Rental'}
          </span>
        </div>

        {/* Availability Banner */}
        <div className="absolute bottom-0 left-0">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-tr-lg shadow-sm flex items-center gap-2 border border-stone-100">
            <Calendar size={14} className="text-orange-600" />
            <span className="text-xs font-semibold text-stone-800 uppercase tracking-wide font-mono">
              Available {home.availableFullDate || home.availableDate}
            </span>
          </div>
        </div>

        {/* Dots indicators */}
        <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5'>
          {home.images.map((_: any, idx: number) => (
            <div
              key={idx}
              className={`w-1.5 h-1.5 rounded-full shadow-sm transition-colors ${idx === currentImageIndex ? "bg-white scale-110" : "bg-white/60"}`}
            />
          ))}
        </div>
      </div>
      <div className='p-6 flex flex-col gap-4'>
        <div>
          <div className="flex justify-between items-start mb-2 gap-2">
            <h3 className='text-lg font-bold text-stone-900 tracking-tight line-clamp-1 font-serif'>
              {home.title}
            </h3>
            <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wide whitespace-nowrap bg-stone-100 px-2 py-0.5 rounded">
              {home.category || 'Rental'}
            </span>
          </div>
          
          <div className='flex items-start gap-2 text-stone-500'>
            <MapPin size={16} className="mt-0.5 shrink-0 text-stone-400" />
            <p className="text-sm font-medium leading-snug">
              {home.address}, {home.city}
            </p>
          </div>
        </div>

        <div className='flex items-center py-4 border-t border-b border-stone-100'>
          <div className="flex-1 flex items-center justify-center gap-2 text-stone-700 font-mono">
            <Bed size={18} className="text-orange-500" />
            <span className="font-semibold">{home.beds}</span>
            <span className="text-stone-500 text-sm">Beds</span>
          </div>
          <div className="w-px h-4 bg-stone-200" />
          <div className="flex-1 flex items-center justify-center gap-2 text-stone-700 font-mono">
            <Bath size={18} className="text-orange-500" />
            <span className="font-semibold">{home.baths}</span>
            <span className="text-stone-500 text-sm">Baths</span>
          </div>
        </div>

        <div className='flex gap-3'>
          <button 
            onClick={(e) => { e.stopPropagation(); }}
            className='flex-1 py-2.5 border border-stone-200 rounded-lg text-stone-600 font-medium hover:bg-stone-50 hover:text-stone-900 hover:border-stone-300 transition-all duration-200 flex items-center justify-center gap-2 group/btn font-mono uppercase text-xs'
          >
            <FaPhone size={14} className="text-stone-400 group-hover/btn:text-stone-600 transition-colors" />
            Call
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); }}
            className='flex-1 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 font-mono uppercase text-xs'
          >
            <Mail size={16} />
            Email
          </button>
        </div>
      </div>
    </div>
  );
}

function FeaturedHomes() {
  const [homes, setHomes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/listings/featured/`)
        const data = await response.json();
        console.log(data);
        if (data.listings && data.listings.length > 0) {
          // Shuffle the listings for randomization
          const shuffled = [...data.listings].sort(() => Math.random() - 0.5);
          
          // Map API data to match expected format
          const formattedHomes = shuffled.map((listing: any) => ({
            id: listing.id,
            title: listing.title,
            price: listing.price,
            beds: listing.beds,
            baths: listing.baths,
            address: listing.address,
            city: listing.city,
            category: listing.typeCode === 1 ? 'Rental' : 
                      listing.typeCode === 2 ? 'Sublet' :
                      listing.typeCode === 3 ? 'Room for Rent' : 
                      listing.typeCode === 4 ? 'Short-Term' : 'Rental',
            availableDate: listing.availableDate?.includes('0000') ? 'Now' :
                          listing.availableDate ? new Date(listing.availableDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Now',
            availableFullDate: listing.availableDate || 'Available Now',
            images: listing.images || ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1000&auto=format&fit=crop'],
          }));
          
          setHomes(formattedHomes);
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <section className='py-32 bg-gradient-to-b from-white via-stone-50/50 to-white relative overflow-hidden'>
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)`,
          backgroundSize: '20px 20px'
        }} />
        <div className='container mx-auto px-4 relative z-10'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold text-stone-900 mb-4 font-serif'>
              Featured Syracuse, NY Apartments, Homes, & Rooms for Rent
            </h2>
            <p className='text-stone-600 max-w-2xl mx-auto'>
              Loading listings...
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto'>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className='bg-white rounded-lg overflow-hidden shadow-sm border border-stone-100 animate-pulse'>
                <div className='h-64 bg-stone-200' />
                <div className='p-6 space-y-4'>
                  <div className='h-6 bg-stone-200 rounded w-3/4' />
                  <div className='h-4 bg-stone-200 rounded w-1/2' />
                  <div className='h-12 bg-stone-200 rounded' />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='py-32 bg-gradient-to-b from-white via-stone-50/50 to-white relative overflow-hidden'>
      {/* Subtle diagonal lines pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)`,
        backgroundSize: '20px 20px'
      }} />
      <div className='container mx-auto px-4 relative z-10'>
        <motion.div 
          className='text-center mb-16'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='text-3xl md:text-4xl font-bold text-stone-900 mb-4 font-serif'>
            Featured Syracuse, NY Apartments, Homes, & Rooms for Rent
          </h2>
          <p className='text-stone-600 max-w-2xl mx-auto'>
            Explore our top-rated listings including spacious family homes,
            modern apartments, and student rentals in Syracuse's best
            neighborhoods.
          </p>
        </motion.div>

        <motion.div 
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto'
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {homes.map((home) => (
            <motion.div
              key={home.id}
              variants={{
                initial: { opacity: 0, y: 30 },
                animate: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.5 }}
            >
              <FeaturedHomeCard home={home} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function LocalAds() {
  const businesses = [
    {
      name: "Salt City Movers",
      image:
        "https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1000&auto=format&fit=crop",
      desc: "Your trusted local movers for a stress-free transition to your new sanctuary.",
      phone: "315-555-0101",
      email: "move@saltcity.com",
    },
    {
      name: "The Cave Cafe",
      image:
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop",
      desc: "The perfect spot for great coffee and feel the community vibe. Just around the corner!",
      phone: "315-555-0102",
      email: "hello@cavecafe.com",
    },
    {
      name: "CNY Cleaners",
      image:
        "https://images.unsplash.com/photo-1581578731117-104f8a746a32?q=80&w=1000&auto=format&fit=crop",
      desc: "Professional home cleaning services to keep your sanctuary sparkling.",
      phone: "315-555-0103",
      email: "clean@cny.com",
    },
    {
      name: "Upstate Home Goods",
      image:
        "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=1000&auto=format&fit=crop",
      desc: "Find unique furniture and decor to personalize your new Syracuse home.",
      phone: "315-555-0104",
      email: "shop@upstate.com",
    },
  ];

  return (
    <section className='py-32 bg-gradient-to-br from-stone-50 via-white to-orange-50/20 relative overflow-hidden'>
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #374151 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />
      <div className='container mx-auto px-4 relative z-10'>
        <motion.div 
          className='text-center mb-16'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
            <h2 className='text-3xl md:text-4xl font-bold text-stone-900 font-serif'>
              Support our Local Syracuse Businesses
            </h2>
            <Link 
              to="/directory/local-businesses/add"
              className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1 border border-orange-200 rounded-full px-4 py-1.5 hover:bg-orange-50 transition-colors"
            >
              Add Your Business Here
            </Link>
          </div>
        </motion.div>

        <motion.div 
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto'
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {businesses.map((biz, idx) => (
            <motion.div
              key={idx}
              variants={{
                initial: { opacity: 0, y: 30 },
                animate: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.5 }}
              className='bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-stone-100'
            >
              <div className='relative h-64 overflow-hidden'>
                <img
                  src={biz.image}
                  alt={biz.name}
                  className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                />

              </div>
              <div className='p-6 flex flex-col gap-4 h-full'>
                <div>
                  <h3 className='text-xl font-bold text-stone-900 mb-2 font-serif'>
                    {biz.name}
                  </h3>
                  <p className='text-stone-500 text-sm leading-relaxed'>
                    {biz.desc}
                  </p>
                </div>

                <div className=' flex gap-3'>
                  <a 
                    href={`tel:${biz.phone}`}
                    className='flex-1 py-2.5 border border-stone-200 rounded-lg text-stone-600 font-medium hover:bg-stone-50 hover:text-stone-900 hover:border-stone-300 transition-all duration-200 flex items-center justify-center gap-2 group/btn font-mono uppercase text-xs'
                  >
                    <FaPhone size={14} className="text-stone-400 group-hover/btn:text-stone-600 transition-colors" />
                    Call
                  </a>
                  <a 
                    href={`mailto:${biz.email}`}
                    className='flex-1 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 font-mono uppercase text-xs'
                  >
                    <Mail size={16} />
                    Email
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Testimonials() {
  const reviews = [
    {
      id: 1,
      name: "Sarah J.",
      role: "Syracuse University Student",
      text: "Orange Housing made finding my off-campus apartment so easy. The landlords are verified and the listings are actually real. Highly recommend for any SU student!",
      date: "2 months ago",
    },
    {
      id: 2,
      name: "Michael C.",
      role: "Young Professional",
      text: "I moved to Syracuse for a job at Upstate Medical and didn't know the area. This site helped me find a great loft in downtown that was within my budget. The 'Perfect For' filter is a lifesaver.",
      date: "1 month ago",
    },
    {
      id: 3,
      name: "The Rodriguez Family",
      role: "Relocated from NYC",
      text: "We needed a family-friendly home in a safe neighborhood. The detailed descriptions and neighborhood guides on Orange Housing gave us peace of mind before we even visited.",
      date: "3 weeks ago",
    },
    {
      id: 4,
      name: "Emily & James",
      role: "Graduate Students",
      text: "Found a perfect quiet duplex near ESF. The process was smooth and the landlord was super responsive. Love the neighborhood guide feature!",
      date: "1 week ago",
    },
    {
      id: 5,
      name: "David R.",
      role: "Local Resident",
      text: "I've lived in Syracuse for 10 years and this is by far the best rental platform. It really highlights the best parts of our city.",
      date: "4 months ago",
    },
  ];

  return (
    <section className='py-32 bg-gradient-to-br from-amber-50/80 via-stone-100/60 to-orange-50/50 overflow-hidden relative'>
      {/* Subtle noise texture effect via gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
      <div className='container mx-auto px-4 relative z-10'>
        <motion.div 
          className='text-center mb-16'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='text-3xl md:text-4xl font-bold text-stone-900 mb-4 font-serif'>
            Google Reviews & Testimonials by the Syracuse Community
          </h2>
          <p className='text-stone-600 max-w-2xl mx-auto'>
            Don't just take our word for it. See what students, professionals,
            and families are saying about their experience with OrangeHousing.com
          </p>
        </motion.div>

        <div className='relative w-full mask-linear-gradient'>
          <div className='flex gap-8 animate-scroll w-max hover:[animation-play-state:paused]'>
            {[...reviews, ...reviews].map((review, idx) => (
              <div
                key={`${review.id}-${idx}`}
                className='w-[350px] md:w-[450px] bg-white p-8 rounded-xl shadow-sm border border-stone-100 flex flex-col h-full flex-shrink-0'
              >
                <div className='flex gap-1 mb-4 text-orange-500'>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill='currentColor' />
                  ))}
                </div>
                <p className='text-stone-700 leading-relaxed mb-6 flex-grow'>
                  "{review.text}"
                </p>
                <div className='flex items-center justify-between mt-auto pt-6 border-t border-stone-100'>
                  <div>
                    <h4 className='font-bold text-stone-900 text-sm font-serif'>
                      {review.name}
                    </h4>
                    <p className='text-stone-500 text-xs'>{review.role}</p>
                  </div>
                  <div className='flex items-center gap-2 opacity-60'>
                    <img
                      src='https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg'
                      alt='Google'
                      className='w-5 h-5'
                    />
                    <span className='text-xs text-stone-400'>{review.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "What makes a Syracuse Sanctuary property unique?",
      a: "Our properties are hand-picked for their family-friendly amenities, safety, and proximity to schools and parks.",
    },
    {
      q: "How do I list my quality property for families?",
      a: "Simply click the 'List Your Space' button in the navigation bar to get started with our easy onboarding process.",
    },
    {
      q: "Are there resources for new residents to Syracuse?",
      a: "Yes! We provide a comprehensive welcome guide with local recommendations, utility contacts, and school district information.",
    },
    {
      q: "What are the benefits of long-term rentals?",
      a: "Long-term rentals offer stability for your family, predictable costs, and the opportunity to truly become part of the community.",
    },
    {
      q: "Do you offer property management services?",
      a: "Yes, we connect landlords with top-rated local property managers who specialize in maintaining high-quality family homes.",
    },
    {
      q: "How can I schedule a viewing?",
      a: "You can schedule a viewing directly through the property listing page or by contacting our support team.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const displayedFaqs = faqs.slice(0, 3);

  return (
    <section className='py-32 bg-gradient-to-tr from-stone-100 via-amber-50/40 to-stone-50 relative overflow-hidden'>
      {/* Subtle geometric pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, #374151 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />
      <div className='container mx-auto px-4 relative z-10'>
        <motion.div 
          className='text-center mb-12'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='text-3xl md:text-4xl font-bold text-stone-900 mb-4 font-serif'>
            Frequently Asked Questions about Renting in Syracuse
          </h2>
          <p className='text-stone-600'>
            Expert answers to help you find the best long-term rentals and
            property management services in Syracuse, NY.
          </p>
        </motion.div>

        <motion.div 
          className='max-w-3xl mx-auto space-y-4'
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {displayedFaqs.map((faq, idx) => (
            <motion.div
              key={idx}
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.4 }}
              className='bg-white rounded-xl overflow-hidden border border-stone-100/50 hover:shadow-md transition-all duration-300'
            >
              <button
                className='w-full p-5 flex items-center justify-between text-left'
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className='font-medium text-stone-800 font-serif tracking-tight text-lg'>{faq.q}</span>
                <ChevronRight
                  className={`text-stone-400 transition-transform duration-300 ${openIndex === idx ? "rotate-90" : ""}`}
                  size={20}
                />
              </button>
              <div
                className={`px-5 text-stone-600 text-sm leading-relaxed overflow-hidden transition-all duration-300 ${openIndex === idx ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0"}`}
              >
                {faq.a}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className='text-center mt-10'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link
            to='/faqs'
            className='px-6 py-2.5 bg-white border border-stone-200 rounded-full text-stone-600 font-medium hover:bg-stone-50 hover:text-orange-600 transition-all shadow-sm inline-block font-mono uppercase text-xs'
          >
            More FAQs
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function Partners() {
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
    <section className='py-32 bg-gradient-to-b from-white to-stone-50 relative overflow-hidden'>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, #374151 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />
      
      <div className='container mx-auto px-4 relative z-10'>
        <motion.div 
          className='text-center mb-16'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
            <h2 className='text-3xl md:text-4xl font-bold text-stone-900 font-serif'>
              Team Syracuse
            </h2>
            <Link 
              to="/directory/team-syracuse/add"
              className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1 border border-orange-200 rounded-full px-4 py-1.5 hover:bg-orange-50 transition-colors"
            >
              Join Team Syracuse
            </Link>
          </div>
          <p className='text-stone-600 max-w-2xl mx-auto'>
            Stronger Together: OrangeHousing.com & Local Partners Team Up to Promote & Support Each Other Daily.
          </p>
        </motion.div>

        <motion.div 
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto'
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.08
              }
            }
          }}
        >
          {partners.map((partner, idx) => (
            <motion.div 
              key={idx} 
              variants={{
                initial: { opacity: 0, y: 30 },
                animate: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.5 }}
              className='bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group'
            >
              <div className='h-48 bg-stone-100 overflow-hidden relative border-b border-stone-100'>
                 <img 
                   src={`https://image.thum.io/get/width/600/crop/800/noanimate/${partner.website}`} 
                   alt={`${partner.name} website`}
                   className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                 />
                 <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
              </div>
              
              <div className="p-6 flex flex-col flex-grow items-center text-center">
                <h3 className='text-xl font-bold text-stone-900 mb-1 font-serif'>
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
                      className='flex-1 py-2.5 border border-stone-200 rounded-lg text-stone-600 font-medium hover:bg-stone-50 hover:text-stone-900 hover:border-stone-300 transition-all duration-200 flex items-center justify-center gap-2 font-mono uppercase text-xs'
                    >
                      <FaPhone size={14} />
                      Call
                    </a>
                    <a 
                      href={`mailto:${partner.email}`}
                      className='flex-1 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 font-mono uppercase text-xs'
                    >
                      <Mail size={16} />
                      Email
                    </a>
                  </div>
                  <a 
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='w-full py-2.5 border border-stone-200 rounded-lg text-stone-600 font-medium hover:bg-stone-50 hover:text-stone-900 hover:border-stone-300 transition-all duration-200 flex items-center justify-center gap-2 font-mono uppercase text-xs'
                  >
                    <Globe size={16} />
                    Visit Website
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Blog() {
  const posts = [
    {
      title: "A Family Guide to Syracuse's Tranquil Neighborhoods",
      snippet:
        "Discover the most welcoming and peaceful neighborhoods for families seeking long-term comfort and community in Syracuse.",
      image:
        "https://images.unsplash.com/photo-1513584685908-95c9e2d01361?q=80&w=1000&auto=format&fit=crop",
    },
    {
      title: "Crafting Your Home: Tips for Long-Term Residents",
      snippet:
        "Award-winning tips on how to make your Syracuse house or apartment feel like a true home for years to come.",
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop",
    },
    {
      title: "Exploring Syracuse: Local Amenities for Families",
      snippet:
        "Discover the best parks, community centers, and family-friendly spots that make living in Syracuse so enriching.",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop",
    },
  ];

  return (
    <section className='py-32 bg-gradient-to-b from-stone-50 to-white relative overflow-hidden'>
      {/* Subtle texture */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)`,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
      }} />
      <div className='container mx-auto px-4 relative z-10'>
        <motion.div 
          className='flex flex-col md:flex-row justify-between items-end mb-12 gap-4'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className='text-3xl md:text-4xl font-bold text-stone-900 mb-4 font-serif'>
              Syracuse Housing & Lifestyle Blog
            </h2>
            <p className='text-stone-600'>
              Syracuse Insights: Fast Tips and Community News from Local Residents
            </p>
          </div>
          <Link
            to='/blog'
            className='text-orange-600 font-medium hover:text-orange-700 flex items-center gap-1 group'
          >
            View all articles{" "}
            <ChevronRight
              size={18}
              className='group-hover:translate-x-1 transition-transform'
            />
          </Link>
        </motion.div>

        <motion.div 
          className='grid grid-cols-1 md:grid-cols-3 gap-8'
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {posts.map((post, idx) => (
            <motion.div 
              key={idx} 
              className='group cursor-pointer'
              variants={{
                initial: { opacity: 0, y: 30 },
                animate: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.5 }}
            >
              <div className='rounded-xl overflow-hidden mb-6 h-56'>
                <img
                  src={post.image}
                  alt={post.title}
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                />
              </div>
              <h3 className='text-xl font-bold text-stone-900 mb-3 group-hover:text-orange-600 transition-colors'>
                {post.title}
              </h3>
              <p className='text-stone-600 text-sm leading-relaxed'>
                {post.snippet}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
