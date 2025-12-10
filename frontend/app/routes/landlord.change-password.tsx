import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Lock, ArrowLeft, Shield, CheckCircle2, AlertCircle } from "lucide-react";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/landlord/login");
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const validatePassword = (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    return checks;
  };

  const getPasswordStrength = (password: string) => {
    const checks = validatePassword(password);
    const passed = Object.values(checks).filter(Boolean).length;
    if (passed <= 2) return { label: "Weak", color: "bg-red-500", width: "w-1/4" };
    if (passed === 3) return { label: "Fair", color: "bg-yellow-500", width: "w-2/4" };
    if (passed === 4) return { label: "Good", color: "bg-blue-500", width: "w-3/4" };
    return { label: "Strong", color: "bg-green-500", width: "w-full" };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      setError("New password must be different from your current password");
      return;
    }

    setLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/users/change-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to change password");
      }

      setSuccess(true);
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      
      // Redirect after success
      setTimeout(() => {
        navigate("/landlord/dashboard");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const passwordChecks = validatePassword(formData.newPassword);
  const passwordStrength = getPasswordStrength(formData.newPassword);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F2EB] font-sans text-stone-900">
      <main className="max-w-2xl mx-auto py-12 px-4">
        {/* Back Link */}
        <Link 
          to="/landlord/dashboard"
          className="inline-flex items-center gap-2 text-stone-600 hover:text-orange-600 mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Back to Dashboard</span>
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-stone-800 to-stone-900 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500 rounded-xl">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Change Password</h1>
                <p className="text-stone-400 mt-1">Update your account password</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">Password Updated!</h3>
                <p className="text-stone-500 mb-4">
                  Your password has been changed successfully. Redirecting to dashboard...
                </p>
              </div>
            ) : (
              <>
                {/* User Info */}
                <div className="mb-6 p-4 bg-stone-50 rounded-xl">
                  <p className="text-sm text-stone-500">Logged in as</p>
                  <p className="font-medium text-stone-900">{user.email}</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-red-800 font-medium">Error</p>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Current Password */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-stone-700">Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                      <input 
                        type={showOldPassword ? "text" : "password"} 
                        placeholder="Enter your current password"
                        className="w-full pl-11 pr-11 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        value={formData.oldPassword}
                        onChange={(e) => setFormData({...formData, oldPassword: e.target.value})}
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                      >
                        {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <hr className="border-stone-200" />

                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-stone-700">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                      <input 
                        type={showNewPassword ? "text" : "password"} 
                        placeholder="Enter your new password"
                        className="w-full pl-11 pr-11 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
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

                    {/* Password Strength Indicator */}
                    {formData.newPassword && (
                      <div className="mt-3 space-y-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-stone-500">Password strength</span>
                            <span className={`font-medium ${
                              passwordStrength.label === 'Weak' ? 'text-red-600' :
                              passwordStrength.label === 'Fair' ? 'text-yellow-600' :
                              passwordStrength.label === 'Good' ? 'text-blue-600' : 'text-green-600'
                            }`}>
                              {passwordStrength.label}
                            </span>
                          </div>
                          <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                            <div className={`h-full ${passwordStrength.color} ${passwordStrength.width} transition-all duration-300`} />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className={`flex items-center gap-1.5 ${passwordChecks.length ? 'text-green-600' : 'text-stone-400'}`}>
                            <CheckCircle2 size={14} />
                            <span>8+ characters</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${passwordChecks.uppercase ? 'text-green-600' : 'text-stone-400'}`}>
                            <CheckCircle2 size={14} />
                            <span>Uppercase letter</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${passwordChecks.lowercase ? 'text-green-600' : 'text-stone-400'}`}>
                            <CheckCircle2 size={14} />
                            <span>Lowercase letter</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${passwordChecks.number ? 'text-green-600' : 'text-stone-400'}`}>
                            <CheckCircle2 size={14} />
                            <span>Number</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${passwordChecks.special ? 'text-green-600' : 'text-stone-400'}`}>
                            <CheckCircle2 size={14} />
                            <span>Special character</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-stone-700">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                      <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="Re-enter your new password"
                        className={`w-full pl-11 pr-11 py-3 bg-stone-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                          formData.confirmPassword && formData.newPassword !== formData.confirmPassword 
                            ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                            : 'border-stone-200 focus:ring-orange-500/20 focus:border-orange-500'
                        }`}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
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
                    {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                      <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
                    )}
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Link 
                      to="/landlord/dashboard"
                      className="flex-1 px-4 py-3.5 border border-stone-300 text-stone-700 font-medium rounded-xl hover:bg-stone-50 transition-colors text-center"
                    >
                      Cancel
                    </Link>
                    <button 
                      type="submit"
                      disabled={loading || (formData.newPassword !== formData.confirmPassword)}
                      className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
