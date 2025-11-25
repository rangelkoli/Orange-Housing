import { Link } from "react-router";
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
  Linkedin
} from "lucide-react";
import SearchWidget from "../components/SearchWidget";
import { useState } from "react";

import { type MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "Orange Housing | Find Apartments, Homes & Rooms for Rent in Syracuse, NY" },
    { name: "description", content: "Discover your perfect rental in Syracuse, NY. Browse family homes, student apartments, and shared spaces. Connect with local landlords and property managers today." },
  ];
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans text-stone-900">
      <Hero />
      <FeaturedHomes />
      <LocalAds />
      <FAQ />
      <Partners />
      <Blog />
    </div>
  );
}

function Hero() {
  return (
    <div className="relative min-h-[500px] md:h-[700px] flex items-center justify-center overflow-hidden bg-background py-12 md:py-0">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 container mx-auto px-4 max-w-5xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-center mb-8 md:mb-0 tracking-tight text-primary leading-tight">
          Find Your Perfect Home, Apartment, <br className="hidden md:block" />
          or Room for Rent in Syracuse, NY
        </h1>
        <SearchWidget />
      </div>
    </div>
  );
}

function FeaturedHomeCard({ home }: { home: any }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % home.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + home.images.length) % home.images.length);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-stone-100">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={home.images[currentImageIndex]} 
          alt={home.address} 
          className="w-full h-full object-cover transition-transform duration-500"
        />
        
        {/* Navigation Buttons */}
        <button 
          onClick={prevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 rounded-full hover:bg-white text-stone-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
        >
          <ChevronLeft size={18} />
        </button>
        <button 
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 rounded-full hover:bg-white text-stone-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
        >
          <ChevronRight size={18} />
        </button>

        <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full text-stone-400 hover:text-red-500 transition-colors shadow-sm">
          <Heart size={20} />
        </button>
        
        {/* Dots indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {home.images.map((_: any, idx: number) => (
                <div key={idx} className={`w-1.5 h-1.5 rounded-full shadow-sm transition-colors ${idx === currentImageIndex ? 'bg-white scale-110' : 'bg-white/60'}`} />
            ))}
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-end mb-2">
          <h3 className="text-2xl font-bold text-stone-900">{home.price}</h3>
          <span className="text-sm text-stone-500 font-medium">{home.beds} Beds • {home.baths} Baths</span>
        </div>
        <div className="mb-6">
          <p className="text-stone-900 font-medium">{home.address}</p>
          <p className="text-stone-500 text-sm">{home.city}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 py-2.5 border border-stone-200 rounded-lg text-stone-600 font-medium hover:bg-stone-50 transition-colors">
            Compare
          </button>
          <button className="flex-1 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/10">
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

function FeaturedHomes() {
  const homes = [
    {
      id: 1,
      price: "$2,200/mo",
      beds: 4,
      baths: 2,
      address: "454 Serenity Lane",
      city: "Syracuse, NY 13202",
      images: [
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1000&auto=format&fit=crop"
      ]
    },
    {
      id: 2,
      price: "$1,800/mo",
      beds: 2,
      baths: 2,
      address: "122 Elmwood Residences",
      city: "Syracuse, NY 13207",
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?q=80&w=1000&auto=format&fit=crop"
      ]
    },
    {
      id: 3,
      price: "$950/mo",
      beds: 1,
      baths: 1,
      address: "789 Community Court",
      city: "Syracuse, NY 13210",
      images: [
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop"
      ]
    },
    {
      id: 4,
      price: "$3,100/mo",
      beds: 5,
      baths: 3,
      address: "121 Evergreen Estate",
      city: "Syracuse, NY 13224",
      images: [
        "https://images.unsplash.com/photo-1600596542815-27b88e35eabb?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1000&auto=format&fit=crop"
      ]
    },
    {
      id: 5,
      price: "$2,500/mo",
      beds: 3,
      baths: 2,
      address: "321 Lakeside Lofts",
      city: "Syracuse, NY 13204",
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1000&auto=format&fit=crop"
      ]
    },
    {
      id: 6,
      price: "$1,950/mo",
      beds: 3,
      baths: 2,
      address: "555 Willow Creek Dr",
      city: "Syracuse, NY 13207",
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=1000&auto=format&fit=crop"
      ]
    }
  ];

  return (
    <section className="py-20 bg-[#F5F2EB]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Featured Syracuse Apartments & Homes</h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Explore our top-rated listings including spacious family homes, modern apartments, and student rentals in Syracuse's best neighborhoods.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {homes.map((home) => (
            <FeaturedHomeCard key={home.id} home={home} />
          ))}
        </div>
      </div>
    </section>
  );
}

function LocalAds() {
  const businesses = [
    { name: "Salt City Movers", icon: Truck, desc: "Your trusted local movers for a stress-free transition to your new sanctuary." },
    { name: "The Cave Cafe", icon: Coffee, desc: "The perfect spot for great coffee and feel the community vibe. Just around the corner!" },
    { name: "CNY Cleaners", icon: ShoppingBag, desc: "Professional home cleaning services to keep your sanctuary sparkling." },
    { name: "Upstate Home Goods", icon: Store, desc: "Find unique furniture and decor to personalize your new Syracuse home." },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Trusted Local Syracuse Businesses</h2>
          <p className="text-stone-600">Connect with top-rated local movers, cleaners, and shops to make your move to Syracuse seamless.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {businesses.map((biz, idx) => (
            <div key={idx} className="flex flex-col items-center text-center group">
              <div className="w-32 h-32 rounded-full bg-stone-50 flex items-center justify-center mb-6 group-hover:bg-orange-50 transition-colors duration-300 border border-stone-100">
                <biz.icon size={40} className="text-stone-400 group-hover:text-orange-500 transition-colors duration-300" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-3">{biz.name}</h3>
              <p className="text-sm text-stone-500 leading-relaxed px-4">{biz.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "What makes a Syracuse Sanctuary property unique?", a: "Our properties are hand-picked for their family-friendly amenities, safety, and proximity to schools and parks." },
    { q: "How do I list my quality property for families?", a: "Simply click the 'List Your Space' button in the navigation bar to get started with our easy onboarding process." },
    { q: "Are there resources for new residents to Syracuse?", a: "Yes! We provide a comprehensive welcome guide with local recommendations, utility contacts, and school district information." },
    { q: "What are the benefits of long-term rentals?", a: "Long-term rentals offer stability for your family, predictable costs, and the opportunity to truly become part of the community." },
    { q: "Do you offer property management services?", a: "Yes, we connect landlords with top-rated local property managers who specialize in maintaining high-quality family homes." },
    { q: "How can I schedule a viewing?", a: "You can schedule a viewing directly through the property listing page or by contacting our support team." }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const displayedFaqs = faqs.slice(0, 3);

  return (
    <section className="py-20 bg-[#F5F2EB]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Frequently Asked Questions about Renting in Syracuse</h2>
          <p className="text-stone-600">Expert answers to help you find the best long-term rentals and property management services in Syracuse, NY.</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {displayedFaqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-xl overflow-hidden border border-stone-100/50 hover:shadow-md transition-all duration-300"
            >
              <button 
                className="w-full p-5 flex items-center justify-between text-left"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="font-medium text-stone-800">{faq.q}</span>
                <ChevronRight 
                  className={`text-stone-400 transition-transform duration-300 ${openIndex === idx ? 'rotate-90' : ''}`} 
                  size={20} 
                />
              </button>
              <div 
                className={`px-5 text-stone-600 text-sm leading-relaxed overflow-hidden transition-all duration-300 ${openIndex === idx ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                {faq.a}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link 
            to="/faqs"
            className="px-6 py-2.5 bg-white border border-stone-200 rounded-full text-stone-600 font-medium hover:bg-stone-50 hover:text-orange-600 transition-all shadow-sm inline-block"
          >
            More FAQs
          </Link>
        </div>
      </div>
    </section>
  );
}

function Partners() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-4">Our Syracuse Community Partners</h2>
        <p className="text-stone-600 mb-12">We collaborate with local organizations to strengthen the Syracuse housing community.</p>
        
        <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
           {/* Placeholder logos using simple shapes/icons */}
           <div className="w-16 h-16 bg-stone-200 rounded-lg flex items-center justify-center"><Building2 size={32} className="text-stone-500" /></div>
           <div className="w-16 h-16 bg-stone-200 rounded-lg flex items-center justify-center"><Home size={32} className="text-stone-500" /></div>
           <div className="w-16 h-16 bg-stone-200 rounded-lg flex items-center justify-center"><MapPin size={32} className="text-stone-500" /></div>
           <div className="w-16 h-16 bg-stone-200 rounded-lg flex items-center justify-center"><Heart size={32} className="text-stone-500" /></div>
        </div>

        <p className="mt-12 text-stone-500 text-sm">
          Join us in making Syracuse an even better place to live. <Link to="#" className="text-orange-500 hover:underline">Click here to see how to become a partner.</Link>
        </p>
      </div>
    </section>
  );
}

function Blog() {
  const posts = [
    {
      title: "A Family Guide to Syracuse's Tranquil Neighborhoods",
      snippet: "Discover the most welcoming and peaceful neighborhoods for families seeking long-term comfort and community in Syracuse.",
      image: "https://images.unsplash.com/photo-1513584685908-95c9e2d01361?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Crafting Your Home: Tips for Long-Term Residents",
      snippet: "Award-winning tips on how to make your Syracuse house or apartment feel like a true home for years to come.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Exploring Syracuse: Local Amenities for Families",
      snippet: "Discover the best parks, community centers, and family-friendly spots that make living in Syracuse so enriching.",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  return (
    <section className="py-20 bg-[#F5F2EB]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Syracuse Housing & Lifestyle Blog</h2>
            <p className="text-stone-600">Expert tips on finding apartments, neighborhood guides, and living in Syracuse, NY.</p>
          </div>
          <Link to="/blog" className="text-orange-600 font-medium hover:text-orange-700 flex items-center gap-1 group">
            View all articles <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="rounded-xl overflow-hidden mb-6 h-56">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-orange-600 transition-colors">{post.title}</h3>
              <p className="text-stone-600 text-sm leading-relaxed">{post.snippet}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


