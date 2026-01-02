
import { Search, MapPin, Phone, Globe, Mail, Building2 } from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";

export interface DirectoryItem {
  id: number;
  name: string;
  description: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  image?: string;
  category: string;
}

interface DirectoryPageProps {
  title: string;
  subtitle: string;
  items: DirectoryItem[];
  addListingLink?: string;
  addListingText?: string;
  searchPlaceholder?: string;
  isPaidListing?: boolean;
  isLoading?: boolean;
}

// Animation variants
const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export function DirectoryPage({ 
  title, 
  subtitle, 
  items, 
  addListingLink, 
  addListingText, 
  searchPlaceholder = "Search listings...",
  isPaidListing = true,
  isLoading = false 
}: DirectoryPageProps) {
  return (
    <div className="min-h-screen bg-white font-sans text-stone-900 flex flex-col">
      
      {/* Hero Section - Enhanced with gradient orbs and grid pattern */}
      <div className="relative py-16 md:py-28 overflow-hidden">
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-orange-100/80 text-orange-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-orange-200/50">
              <Building2 size={16} />
              <span>Syracuse Housing Directory</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-serif text-stone-900 tracking-tight">{title}</h1>
            <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
          </motion.div>
        </div>
      </div>

      {/* Add Listing CTA - Top - Enhanced glassmorphism design */}
      {addListingLink && addListingText && (
        <motion.div 
          className="container mx-auto px-4 -mt-8 relative z-20 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            to={addListingLink}
            className="block max-w-4xl mx-auto w-full py-4 md:py-5 px-6 md:px-8 bg-white/80 backdrop-blur-md border-2 border-dashed border-orange-300 rounded-2xl text-center hover:border-orange-400 hover:bg-white/95 transition-all duration-300 group shadow-lg shadow-orange-100/50"
          >
            <span className="text-orange-600 font-semibold text-base md:text-lg group-hover:text-orange-700 transition-colors">
              {addListingText}
            </span>
            {isPaidListing && (
              <span className="block text-stone-500 text-xs md:text-sm mt-1.5">
                List Here for 12 Months for only $100
              </span>
            )}
          </Link>
        </motion.div>
      )}

      {/* Search & Filter - Enhanced floating design */}
      <motion.div 
        className="container mx-auto px-4 relative z-20 mb-12 md:mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="bg-white/80 backdrop-blur-md p-4 md:p-5 rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100/80 max-w-4xl mx-auto flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="flex-grow relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
            <input 
              type="text" 
              placeholder={searchPlaceholder} 
              className="w-full pl-12 pr-4 py-3.5 bg-stone-50/80 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-all text-sm md:text-base placeholder:text-stone-400"
            />
          </div>
          <button className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-bold py-3.5 px-8 md:px-10 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 text-sm md:text-base">
            Search
          </button>
        </div>
      </motion.div>

      {/* Directory Grid - Enhanced cards */}
      <main className="flex-grow container mx-auto px-4 pb-16 md:pb-20">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-14 h-14 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-5" />
            <p className="text-stone-500 font-medium font-serif text-lg">Loading directory...</p>
          </div>
        ) : items.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {items.map((item) => (
              <motion.div 
                key={item.id} 
                variants={cardVariant}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-stone-100 group flex flex-col cursor-pointer hover:border-orange-200/50"
              >
                {/* Image Section - Only render if image exists */}
                {item.image && (
                  <div className="h-48 md:h-56 overflow-hidden relative">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop";
                      }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-stone-800 uppercase tracking-wide shadow-sm border border-stone-100/50">
                        {item.category}
                      </span>
                    </div>
                    
                    {/* Quick actions on hover */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <span className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 shadow-md">
                        View Details
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Content Section */}
                <div className="p-5 md:p-6 flex-grow flex flex-col">
                  <h3 className="text-xl md:text-2xl font-bold text-stone-900 mb-2 group-hover:text-orange-600 transition-colors duration-300 line-clamp-1 font-serif">{item.name}</h3>
                  <p className="text-stone-500 text-sm mb-4 line-clamp-2 flex-grow leading-relaxed">{item.description}</p>
                  
                  {/* Info Section */}
                  <div className="space-y-3 pt-4 border-t border-stone-100">
                    <div className="flex items-start gap-3 text-sm text-stone-600">
                      <div className="p-1.5 bg-orange-50 rounded-lg shrink-0">
                        <MapPin size={14} className="text-orange-500" />
                      </div>
                      <span className="line-clamp-1">{item.address}</span>
                    </div>
                    
                    {item.website && (
                      <div className="flex items-center gap-3 text-sm text-stone-600">
                        <div className="p-1.5 bg-orange-50 rounded-lg shrink-0">
                          <Globe size={14} className="text-orange-500" />
                        </div>
                        <a href={item.website} target="_blank" rel="noreferrer" className="hover:text-orange-600 hover:underline truncate transition-colors">
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="mt-5 md:mt-6 grid grid-cols-2 gap-3">
                    {item.phone && (
                      <a 
                        href={`tel:${item.phone}`}
                        className="py-2.5 md:py-3 border border-stone-200 rounded-xl text-center text-stone-600 font-medium hover:bg-stone-50 hover:text-stone-900 hover:border-stone-300 transition-all duration-200 flex items-center justify-center gap-2 text-xs md:text-sm group/btn"
                      >
                        <Phone size={14} className="group-hover/btn:scale-110 transition-transform" />
                        <span>Call Now</span>
                      </a>
                    )}
                    {item.email ? (
                      <a 
                        href={`mailto:${item.email}`}
                        className="py-2.5 md:py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl text-center font-medium hover:from-orange-700 hover:to-orange-600 transition-all duration-200 flex items-center justify-center gap-2 text-xs md:text-sm shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 group/btn"
                      >
                        <Mail size={14} className="group-hover/btn:scale-110 transition-transform" />
                        <span>Email</span>
                      </a>
                    ) : item.website ? (
                      <a 
                        href={item.website}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2.5 md:py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl text-center font-medium hover:from-orange-700 hover:to-orange-600 transition-all duration-200 flex items-center justify-center gap-2 text-xs md:text-sm shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 group/btn"
                      >
                        <Globe size={14} className="group-hover/btn:scale-110 transition-transform" />
                        <span>Website</span>
                      </a>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="max-w-md mx-auto bg-white rounded-3xl p-14 text-center border border-stone-100 shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-stone-50 to-orange-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Search size={36} className="text-stone-300" />
            </div>
            <h3 className="text-2xl font-bold text-stone-900 mb-3 font-serif">No Results Found</h3>
            <p className="text-stone-500 text-sm leading-relaxed">We couldn't find any listings in this category. Check back soon!</p>
          </motion.div>
        )}
      </main>

      {/* Add Listing CTA - Bottom - Enhanced */}
      {addListingLink && addListingText && (
        <div className="container mx-auto px-4 pb-20 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to={addListingLink}
              className="block max-w-4xl mx-auto w-full py-5 md:py-6 px-6 md:px-8 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-2 border-dashed border-orange-300 rounded-2xl text-center hover:border-orange-400 hover:from-orange-100 hover:via-amber-100 hover:to-orange-100 transition-all duration-300 group shadow-sm"
            >
              <span className="text-orange-600 font-semibold text-base md:text-lg group-hover:text-orange-700 transition-colors">
                {addListingText}
              </span>
              {isPaidListing && (
                <span className="block text-stone-500 text-xs md:text-sm mt-1.5">
                  List Here for 12 Months for only $100
                </span>
              )}
            </Link>
          </motion.div>
        </div>
      )}
    </div>
  );
}

