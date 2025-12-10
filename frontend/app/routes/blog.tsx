
import { Footer } from "../components/Footer";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router";

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "A Family Guide to Syracuse's Tranquil Neighborhoods",
      excerpt: "Discover the most welcoming and peaceful neighborhoods for families seeking long-term comfort and community in Syracuse. We explore schools, parks, and safety ratings.",
      author: "Emily Thompson",
      date: "Oct 15, 2024",
      image: "https://images.unsplash.com/photo-1513584685908-95c9e2d01361?q=80&w=1000&auto=format&fit=crop",
      category: "Neighborhood Guide"
    },
    {
      id: 2,
      title: "Crafting Your Home: Tips for Long-Term Residents",
      excerpt: "Award-winning tips on how to make your Syracuse house or apartment feel like a true home for years to come. From decor to small renovations that landlords love.",
      author: "Michael Chen",
      date: "Oct 22, 2024",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop",
      category: "Interior Design"
    },
    {
      id: 3,
      title: "Exploring Syracuse: Local Amenities for Families",
      excerpt: "Discover the best parks, community centers, and family-friendly spots that make living in Syracuse so enriching. A weekend guide for new residents.",
      author: "Sarah Jenkins",
      date: "Nov 05, 2024",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop",
      category: "Lifestyle"
    },
    {
      id: 4,
      title: "Student Housing 101: What to Look For",
      excerpt: "First time renting off-campus? Here's a checklist of everything you need to inspect before signing a lease near Syracuse University.",
      author: "David Wilson",
      date: "Nov 12, 2024",
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1000&auto=format&fit=crop",
      category: "Student Tips"
    },
    {
      id: 5,
      title: "Winter Proofing Your Apartment",
      excerpt: "Syracuse winters are famous. Learn how to keep your heating bills down and your apartment cozy during the snowy months.",
      author: "Jessica Lee",
      date: "Nov 18, 2024",
      image: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=1000&auto=format&fit=crop",
      category: "Maintenance"
    },
    {
      id: 6,
      title: "The Best Coffee Shops for Studying",
      excerpt: "Need a quiet place to focus? We've ranked the top 5 coffee shops with the best WiFi and atmosphere near campus.",
      author: "Alex Martinez",
      date: "Nov 20, 2024",
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1000&auto=format&fit=crop",
      category: "Local Guide"
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 flex flex-col">
      
      {/* Hero Section */}
      <div className="bg-stone-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1499750310159-5b9883e73975?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">The Orange Housing Blog</h1>
          <p className="text-xl text-stone-300 max-w-2xl mx-auto">
            Insights, guides, and stories about living, renting, and thriving in Syracuse, NY.
          </p>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-16">
        {/* Featured Post (First one) */}
        <div className="mb-16">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl overflow-hidden shadow-lg border border-stone-100 group cursor-pointer">
             <div className="h-64 lg:h-auto overflow-hidden">
               <img src={posts[0].image} alt={posts[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
             </div>
             <div className="p-8 lg:p-12 flex flex-col justify-center">
               <div className="text-orange-600 font-bold text-sm uppercase tracking-wider mb-3">{posts[0].category}</div>
               <h2 className="text-3xl font-bold text-stone-900 mb-4 group-hover:text-orange-600 transition-colors">{posts[0].title}</h2>
               <p className="text-stone-600 mb-6 text-lg leading-relaxed">{posts[0].excerpt}</p>
               <div className="flex items-center gap-6 text-sm text-stone-500 mt-auto">
                 <div className="flex items-center gap-2">
                   <User size={16} /> {posts[0].author}
                 </div>
                 <div className="flex items-center gap-2">
                   <Calendar size={16} /> {posts[0].date}
                 </div>
               </div>
             </div>
           </div>
        </div>

        {/* Grid of other posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(1).map((post) => (
            <div key={post.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 group flex flex-col">
              <div className="h-56 overflow-hidden relative">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-stone-800 uppercase tracking-wide">
                  {post.category}
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">{post.title}</h3>
                <p className="text-stone-600 text-sm mb-6 line-clamp-3 flex-grow">{post.excerpt}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-stone-100 mt-auto">
                  <div className="text-xs text-stone-500 font-medium">{post.date}</div>
                  <Link to="#" className="text-orange-600 font-medium text-sm hover:underline flex items-center gap-1">
                    Read More <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-20 bg-orange-600 rounded-2xl p-8 md:p-16 text-center text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
            <p className="text-orange-100 mb-8 text-lg">Get the latest Syracuse housing news, tips, and exclusive listings delivered straight to your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="email" placeholder="Enter your email address" className="flex-grow px-6 py-3.5 rounded-xl text-stone-900 focus:outline-none focus:ring-4 focus:ring-orange-400/50" />
              <button className="bg-stone-900 hover:bg-stone-800 text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
