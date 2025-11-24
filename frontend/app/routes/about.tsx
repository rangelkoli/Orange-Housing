
import { Footer } from "../components/Footer";
import { Users, Target, Heart, Award } from "lucide-react";

export default function AboutPage() {
  const team = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop",
      bio: "SU Alum '15. Started Orange Housing to solve the student housing scramble."
    },
    {
      name: "Sarah Williams",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop",
      bio: "Ensuring every listing is verified and every tenant is happy."
    },
    {
      name: "David Chen",
      role: "Lead Developer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop",
      bio: "Building the technology that connects students with their perfect homes."
    },
    {
      name: "Emily Davis",
      role: "Community Manager",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop",
      bio: "Connecting with local businesses and students to build a vibrant community."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F2EB] font-sans text-stone-900 flex flex-col">
      
      {/* Hero Section */}
      <div className="bg-white pt-20 pb-16 border-b border-stone-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-stone-900">We Are <span className="text-orange-600">Team Syracuse</span></h1>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
            Dedicated to simplifying the housing search for Syracuse University and ESF students, faculty, and the local community.
          </p>
        </div>
      </div>

      <main className="flex-grow">
        {/* Mission Section */}
        <section className="py-20 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop" 
                alt="Students on campus" 
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-stone-600 mb-6 leading-relaxed">
                Finding a home shouldn't be the hardest part of your college experience. We created Orange Housing to bring transparency, ease, and trust to the Syracuse rental market.
              </p>
              <p className="text-lg text-stone-600 mb-8 leading-relaxed">
                We verify every landlord, inspect listings, and provide resources to help you make informed decisions. We're not just a listing site; we're your partners in finding a place to call home.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center text-orange-600">
                    <Target size={24} />
                  </div>
                  <h3 className="font-bold text-lg">Student Focused</h3>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center text-orange-600">
                    <Award size={24} />
                  </div>
                  <h3 className="font-bold text-lg">Quality Verified</h3>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center text-orange-600">
                    <Users size={24} />
                  </div>
                  <h3 className="font-bold text-lg">Community First</h3>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center text-orange-600">
                    <Heart size={24} />
                  </div>
                  <h3 className="font-bold text-lg">Locally Owned</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Meet The Team</h2>
              <p className="text-stone-600 max-w-2xl mx-auto">
                The people working behind the scenes to make your housing search better.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, idx) => (
                <div key={idx} className="group text-center">
                  <div className="relative mb-6 inline-block">
                    <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-stone-100 shadow-lg group-hover:border-orange-200 transition-colors">
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-orange-600 text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                      <Users size={16} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-stone-900">{member.name}</h3>
                  <p className="text-orange-600 font-medium text-sm mb-3">{member.role}</p>
                  <p className="text-stone-500 text-sm px-4">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
