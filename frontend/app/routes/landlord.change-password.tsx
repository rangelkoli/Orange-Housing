import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Lock, ArrowLeft, Shield, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuthStore } from "../stores/authStore";

export default function ChangePassword() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
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
          userId: user?.id,
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

  return (
        <main className="flex-grow flex flex-col h-full overflow-y-auto w-full bg-[#F5F7FA]">
          {/* Header Area */}
          <div className="bg-white border-b border-stone-200 px-8 py-6 sticky top-0 z-20">
            <h1 className="text-2xl font-serif font-bold text-stone-900">Security</h1>
            <p className="text-stone-500 mt-1">Manage your password and account security settings.</p>
          </div>

          <div className="p-8 max-w-3xl mx-auto w-full">
            {/* Main Card */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/30">
                 <h2 className="font-serif font-semibold text-stone-900 flex items-center gap-2">
                    <Shield size={18} className="text-orange-600" />
                    Change Password
                 </h2>
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
                    <div className="mb-6 p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                         <p className="text-sm font-medium text-stone-900">Secure your account</p>
                         <p className="text-sm text-stone-500 mt-1">Logged in as <span className="font-semibold text-stone-700">{user?.email}</span></p>
                      </div>
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
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                          <input 
                            type={showOldPassword ? "text" : "password"} 
                            placeholder="Enter your current password"
                            className="w-full pl-9 pr-10 py-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                            value={formData.oldPassword}
                            onChange={(e) => setFormData({...formData, oldPassword: e.target.value})}
                            required
                          />
                          <button 
                            type="button"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                          >
                            {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <hr className="border-stone-100" />

                      {/* New Password */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-stone-700">New Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                          <input 
                            type={showNewPassword ? "text" : "password"} 
                            placeholder="Enter your new password"
                            className="w-full pl-9 pr-10 py-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                            value={formData.newPassword}
                            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                            required
                            minLength={8}
                          />
                          <button 
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                          >
                            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>

                        {/* Password Strength Indicator */}
                        {formData.newPassword && (
                          <div className="mt-3 space-y-3 p-3 bg-stone-50 rounded-lg border border-stone-100">
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
                              <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
                                <div className={`h-full ${passwordStrength.color} ${passwordStrength.width} transition-all duration-300`} />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-xs">
                              <div className={`flex items-center gap-1.5 ${passwordChecks.length ? 'text-green-600' : 'text-stone-400'}`}>
                                <CheckCircle2 size={12} />
                                <span>8+ characters</span>
                              </div>
                              <div className={`flex items-center gap-1.5 ${passwordChecks.uppercase ? 'text-green-600' : 'text-stone-400'}`}>
                                <CheckCircle2 size={12} />
                                <span>Uppercase letter</span>
                              </div>
                              <div className={`flex items-center gap-1.5 ${passwordChecks.lowercase ? 'text-green-600' : 'text-stone-400'}`}>
                                <CheckCircle2 size={12} />
                                <span>Lowercase letter</span>
                              </div>
                              <div className={`flex items-center gap-1.5 ${passwordChecks.number ? 'text-green-600' : 'text-stone-400'}`}>
                                <CheckCircle2 size={12} />
                                <span>Number</span>
                              </div>
                              <div className={`flex items-center gap-1.5 ${passwordChecks.special ? 'text-green-600' : 'text-stone-400'}`}>
                                <CheckCircle2 size={12} />
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
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                          <input 
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder="Re-enter your new password"
                            className={`w-full pl-9 pr-10 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all text-sm ${
                              formData.confirmPassword && formData.newPassword !== formData.confirmPassword 
                                ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                                : 'border-stone-300 focus:ring-orange-500/20 focus:border-orange-500'
                            }`}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            required
                            minLength={8}
                          />
                          <button 
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                          <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
                        )}
                      </div>

                      {/* Submit Buttons */}
                      <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                        <Link 
                          to="/landlord/dashboard"
                          className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                        >
                          Cancel
                        </Link>
                        <button 
                          type="submit"
                          disabled={loading || (formData.newPassword !== formData.confirmPassword)}
                          className="bg-stone-900 hover:bg-stone-800 text-white font-semibold py-2 px-6 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          {loading ? "Updating..." : "Update Password"}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
  );
}
