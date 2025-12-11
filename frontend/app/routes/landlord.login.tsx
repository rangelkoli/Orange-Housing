import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Eye, EyeOff, Building2, Mail, Lock, ArrowRight, CheckCircle2, Shield, AlertTriangle, X } from "lucide-react";
import { useAuthStore } from "../stores/authStore";

// Password Update Modal Component
interface PasswordUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  oldPassword: string;
  onSuccess: () => void;
}

function PasswordUpdateModal({ isOpen, onClose, email, oldPassword, onSuccess }: PasswordUpdateModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/users/update-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          oldPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update password");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Security Update Required</h3>
                <p className="text-orange-100 text-sm">Please set a new password</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-800 font-medium">Password Migration</p>
              <p className="text-sm text-amber-700 mt-1">
                Your account uses an older password format. Please create a new password to enhance your account security.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-stone-700">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input 
                  type={showNewPassword ? "text" : "password"} 
                  placeholder="Minimum 8 characters"
                  className="w-full pl-11 pr-11 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <button 
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-stone-700">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Re-enter your new password"
                  className="w-full pl-11 pr-11 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Password strength indicator */}
            <div className="space-y-2">
              <div className="flex gap-1">
                <div className={`h-1 flex-1 rounded-full ${newPassword.length >= 8 ? 'bg-green-500' : 'bg-stone-200'}`} />
                <div className={`h-1 flex-1 rounded-full ${newPassword.length >= 10 ? 'bg-green-500' : 'bg-stone-200'}`} />
                <div className={`h-1 flex-1 rounded-full ${/[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword) ? 'bg-green-500' : 'bg-stone-200'}`} />
                <div className={`h-1 flex-1 rounded-full ${/[!@#$%^&*]/.test(newPassword) ? 'bg-green-500' : 'bg-stone-200'}`} />
              </div>
              <p className="text-xs text-stone-500">
                Use 8+ characters with uppercase, numbers, and symbols for a strong password
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-stone-300 text-stone-700 font-medium rounded-xl hover:bg-stone-50 transition-colors"
              >
                Skip for Now
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-500/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Success Toast Component
function SuccessToast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
      <div className="bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5" />
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 hover:bg-white/20 p-1 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function LandlordLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Password update modal state
  const [showPasswordUpdateModal, setShowPasswordUpdateModal] = useState(false);
  const [pendingUser, setPendingUser] = useState<any>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const returnUrl = searchParams.get("returnUrl");
      navigate(returnUrl ? decodeURIComponent(returnUrl) : "/landlord/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate, searchParams]);

  const getReturnUrl = () => {
    const returnUrl = searchParams.get("returnUrl");
    return returnUrl ? decodeURIComponent(returnUrl) : "/landlord/dashboard";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/users/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Check if password update is required
      if (data.requires_password_update) {
        setPendingUser(data.user);
        setShowPasswordUpdateModal(true);
        setLoading(false);
        return;
      }

      // Store user info in persistent auth store
      login({
        id: data.user.id,
        email: data.user.email,
        username: data.user.username,
        firstName: data.user.first_name,
        lastName: data.user.last_name,
        company: data.user.company,
      });
      
      // Redirect to returnUrl or dashboard
      navigate(getReturnUrl());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdateSuccess = () => {
    setShowPasswordUpdateModal(false);
    setShowSuccessToast(true);
    
    // Store user info in persistent auth store and redirect after a brief delay
    if (pendingUser) {
      login({
        id: pendingUser.id,
        email: pendingUser.email,
        username: pendingUser.username,
        firstName: pendingUser.first_name,
        lastName: pendingUser.last_name,
        company: pendingUser.company,
      });
    }
    
    setTimeout(() => {
      navigate(getReturnUrl());
    }, 1500);
  };

  const handleSkipPasswordUpdate = () => {
    setShowPasswordUpdateModal(false);
    
    // Store user info in persistent auth store and redirect (even without updating password)
    if (pendingUser) {
      login({
        id: pendingUser.id,
        email: pendingUser.email,
        username: pendingUser.username,
        firstName: pendingUser.first_name,
        lastName: pendingUser.last_name,
        company: pendingUser.company,
      });
    }
    navigate(getReturnUrl());
  };


  return (
    <div className="min-h-screen bg-[#F5F2EB] font-sans text-stone-900 flex flex-col">
      {/* Success Toast */}
      {showSuccessToast && (
        <SuccessToast 
          message="Password updated successfully!" 
          onClose={() => setShowSuccessToast(false)} 
        />
      )}

      {/* Password Update Modal */}
      <PasswordUpdateModal
        isOpen={showPasswordUpdateModal}
        onClose={handleSkipPasswordUpdate}
        email={formData.email}
        oldPassword={formData.password}
        onSuccess={handlePasswordUpdateSuccess}
      />

      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-100">
          
          {/* Left Side - Form */}
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-stone-900 mb-2">
                Welcome Back, Partner
              </h1>
              <p className="text-stone-500">
                Log in to manage your listings and view inquiries.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-stone-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input 
                    type="email" 
                    placeholder="name@company.com"
                    className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-stone-700">Password</label>
                  <Link to="#" className="text-xs font-medium text-orange-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
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

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing In..." : "Sign In to Dashboard"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-stone-500 text-sm">
                Don't have an account?{" "}
                <Link 
                  to="/landlord/signup"
                  className="text-orange-600 font-bold hover:underline"
                >
                  Sign up now
                </Link>
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
