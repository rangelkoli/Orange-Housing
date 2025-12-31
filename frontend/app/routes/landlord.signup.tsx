import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Building2, Mail, Lock, ArrowRight, CheckCircle2, User, Phone } from "lucide-react";
import { Logo } from "@/components/Navbar";

export default function LandlordSignup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/users/signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log(response);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      // Automatically log inside or redirect to login
      // For now, redirect to login with a message? Or just login.
      // Let's redirect to login for simplicity and security flow
      navigate("/landlord/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3] font-sans text-stone-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern (Optional subtle dots) */}
      <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#E5E7EB 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      <div className="w-full max-w-[480px] relative z-10 flex flex-col items-center">
        
        {/* Logo Section */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Link to="/" className="mb-4">
            <Logo />
          </Link>
        </div>

        {/* Main Card */}
        <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          <div className="p-8 pb-6">
            <div className="mb-8">
              <h1 className="text-2xl font-serif font-bold text-stone-900 mb-2">
                Join Us!
              </h1>
              <p className="text-stone-500 text-sm leading-relaxed">
                Create an account to start listing properties and reach thousands of potential tenants.
              </p>
            </div>

            {error && (
              <div className="w-full mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center rounded-full bg-red-100 text-red-600 font-bold text-xs">!</div>
                <span>{error}</span>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-stone-700">First Name</label>
                  <input 
                    type="text" 
                    name="firstName"
                    placeholder="John"
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-base placeholder:text-stone-300"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-stone-700">Last Name</label>
                  <input 
                    type="text" 
                    name="lastName"
                    placeholder="Doe"
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-base placeholder:text-stone-300"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

               <div className="space-y-1.5">
                  <label className="text-sm font-medium text-stone-700">Contact Number</label>
                  <input 
                    type="tel" 
                    name="contactNumber"
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-base placeholder:text-stone-300"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                  />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-stone-700">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="name@company.com"
                  className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-base placeholder:text-stone-300"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-stone-700">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    placeholder="Create a strong password"
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-base placeholder:text-stone-300"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-base"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          </div>

          <div className="bg-stone-50 p-4 border-t border-stone-100 text-center">
             <p className="text-stone-600 text-sm">
               Already have an account?{" "}
               <Link 
                 to="/landlord/login"
                 className="text-orange-600 font-bold hover:underline"
               >
                 Sign in
               </Link>
             </p>
          </div>
        </div>

        <div className="mt-8 flex gap-6 text-stone-500 text-xs font-medium">
          <Link to="#" className="hover:text-stone-800 transition-colors">Privacy Policy</Link>
          <Link to="#" className="hover:text-stone-800 transition-colors">Terms of Service</Link>
          <Link to="#" className="hover:text-stone-800 transition-colors">Help Center</Link>
        </div>

      </div>
    </div>
  );
}
