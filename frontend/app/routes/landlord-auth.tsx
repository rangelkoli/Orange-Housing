import { useState } from "react";
import { Link } from "react-router";
import { Eye, EyeOff, Building2, Mail, Lock, ArrowRight, CheckCircle2 } from "lucide-react";



export default function LandlordAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F2EB] font-sans text-stone-900 flex flex-col">

      
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-100">
          
          {/* Left Side - Form */}
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-stone-900 mb-2">
                {isLogin ? "Welcome Back, Partner" : "Join Our Network"}
              </h1>
              <p className="text-stone-500">
                {isLogin 
                  ? "Log in to manage your listings and view inquiries." 
                  : "Create an account to list your properties and reach thousands of students."}
              </p>
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-stone-700">Full Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      className="w-full pl-4 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-stone-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input 
                    type="email" 
                    placeholder="name@company.com"
                    className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-stone-700">Password</label>
                  {isLogin && (
                    <Link to="#" className="text-xs font-medium text-orange-600 hover:underline">
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2">
                {isLogin ? "Sign In to Dashboard" : "Create Landlord Account"}
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-stone-500 text-sm">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-orange-600 font-bold hover:underline"
                >
                  {isLogin ? "Sign up now" : "Log in"}
                </button>
              </p>
            </div>
          </div>

          {/* Right Side - Feature/Marketing */}
          <div className="hidden lg:flex flex-col justify-between bg-stone-900 p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-b from-stone-900/0 via-stone-900/60 to-stone-900/90" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-6">
                <Building2 size={24} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Manage Your Properties with Ease</h2>
              <p className="text-stone-300 leading-relaxed max-w-md">
                Join Syracuse's premier housing network. Connect directly with verified students and professionals looking for their next home.
              </p>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/20 p-1 rounded-full">
                  <CheckCircle2 size={16} className="text-green-400" />
                </div>
                <span className="text-sm font-medium text-stone-200">Verified Tenant Leads</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-green-500/20 p-1 rounded-full">
                  <CheckCircle2 size={16} className="text-green-400" />
                </div>
                <span className="text-sm font-medium text-stone-200">Automated Listing Management</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-green-500/20 p-1 rounded-full">
                  <CheckCircle2 size={16} className="text-green-400" />
                </div>
                <span className="text-sm font-medium text-stone-200">Direct Messaging System</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
