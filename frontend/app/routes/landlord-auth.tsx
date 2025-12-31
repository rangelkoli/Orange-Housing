import { useState } from "react";
import { Link } from "react-router";
import { Eye, EyeOff, Building2, Mail, Lock, ArrowRight, CheckCircle2 } from "lucide-react";



export default function LandlordAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-sans text-stone-900 flex flex-col relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(#d6d3d1_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      <main className="flex-grow flex items-center justify-center py-12 px-4 relative z-10">
        <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] overflow-hidden border border-stone-100">
          
          {/* Left Side - Form */}
          <div className="p-8 md:p-14 lg:p-20 flex flex-col justify-center">
            
            <div className="mb-10">
              <Link to="/" className="inline-block">
                <img src="/logo.webp" alt="Orange Housing" className="h-10 w-auto" />
              </Link>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-serif font-bold text-stone-900 mb-3 tracking-tight">
                {isLogin ? "Welcome Back" : "Partner with Us"}
              </h1>
              <p className="text-stone-500 text-base leading-relaxed">
                {isLogin 
                  ? "Log in to access your landlord dashboard and manage your properties." 
                  : "Create an account to list your properties and reach thousands of students."}
              </p>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700 ml-1">Full Name</label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      className="w-full pl-4 pr-4 py-4 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium placeholder:text-stone-300"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-700 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-orange-600 transition-colors" size={20} />
                  <input 
                    type="email" 
                    placeholder="name@company.com"
                    className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium placeholder:text-stone-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-semibold text-stone-700">Password</label>
                  {isLogin && (
                    <Link to="#" className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline transition-colors">
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-orange-600 transition-colors" size={20} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder={isLogin ? "Enter your password" : "Create a strong password"}
                    className="w-full pl-12 pr-12 py-4 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium placeholder:text-stone-300"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 rounded-lg transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button className="w-full bg-stone-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg shadow-stone-900/20 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 mt-2">
                {isLogin ? "Sign In to Dashboard" : "Create Landlord Account"}
                <ArrowRight size={20} />
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-stone-500 text-sm">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-orange-600 font-bold hover:text-orange-700 hover:underline transition-colors"
                >
                  {isLogin ? "Create account" : "Log in"}
                </button>
              </p>
            </div>
          </div>

          {/* Right Side - Feature/Marketing */}
          <div className="hidden lg:flex flex-col justify-between bg-stone-900 p-16 text-white relative overflow-hidden">
             {/* Background Image with Overlay */}
             <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop" 
                alt="Modern Architecture" 
                className="w-full h-full object-cover opacity-30 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/80 to-stone-900/30" />
            </div>
            
            <div className="relative z-10 mt-auto">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                <Building2 size={28} className="text-orange-400" />
              </div>
              <h2 className="text-4xl font-serif font-bold mb-6 leading-tight">
                {isLogin ? "Streamline Your\nProperty Management" : "Scale Your\nResidential Portfolio"}
              </h2>
              <p className="text-stone-300 text-lg leading-relaxed max-w-md mb-8">
                Join the premier housing network for students and professionals. secure, verified, and efficient.
              </p>

              <div className="space-y-4">
                  {[
                    "Verified Student Tenants",
                    "Automated Rent Collection",
                    "Maintenance Request Tracking"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-stone-200">
                      <div className="bg-orange-500/20 p-1.5 rounded-full">
                        <CheckCircle2 size={14} className="text-orange-400" />
                      </div>
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
