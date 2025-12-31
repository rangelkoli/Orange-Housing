import { useState, useEffect } from "react";
import { 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Mail, 
  Phone 
} from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { cn } from "../lib/utils";

interface ProfileData {
  firstName: string;
  lastName: string;
  username: string;
  contactNumber: string;
  email: string;
  createdAt: string | null;
  lastLogin: string | null;
}

export default function LandlordSettings() {
  const { user, updateUser } = useAuthStore();
  
  const [formData, setFormData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    username: "",
    contactNumber: "",
    email: "",
    createdAt: null,
    lastLogin: null,
  });
  
  const [originalData, setOriginalData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${backendUrl}/users/get-profile/?userId=${user.id}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch profile");
        }
        
        const profileData: ProfileData = {
          firstName: data.user.firstName || "",
          lastName: data.user.lastName || "",
          username: data.user.username || "",
          contactNumber: data.user.contactNumber || "",
          email: data.user.email || "",
          createdAt: data.user.createdAt,
          lastLogin: data.user.lastLogin,
        };
        
        setFormData(profileData);
        setOriginalData(profileData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user?.id]);

  const hasChanges = () => {
    if (!originalData) return false;
    return (
      formData.firstName !== originalData.firstName ||
      formData.lastName !== originalData.lastName ||
      formData.username !== originalData.username ||
      formData.contactNumber !== originalData.contactNumber
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    
    if (!user?.id) return;
    
    setSaving(true);
    
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/users/update-profile/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          contactNumber: formData.contactNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      // Update the auth store with new user data
      updateUser({
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        username: data.user.username,
        contactNumber: data.user.contactNumber,
      });
      
      setOriginalData({
        ...formData,
      });
      
      setSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };
    
  return (
      <div className="h-full overflow-y-auto bg-[#F5F7FA] font-sans text-stone-900">
        
          {/* Header Area */}
          <div className="bg-white border-b border-stone-200 px-8 py-6 sticky top-0 z-20">
            <h1 className="text-2xl font-serif font-bold text-stone-900">Settings</h1>
            <p className="text-stone-500 mt-1">Manage your account preferences and personal information.</p>
          </div>

          <div className="p-8 max-w-6xl mx-auto">
            {loading ? (
               <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-stone-200 shadow-sm">
                  <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
                  <p className="text-stone-500 font-medium">Loading your profile...</p>
               </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Left Settings Navigation */}
                  <div className="lg:col-span-1 space-y-6">
                     <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
                        <div className="p-6 text-center bg-stone-50/50">
                           <div className="relative inline-block">
                              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-3xl mx-auto mb-3 border-4 border-white shadow-sm">
                                 {formData.firstName?.[0]}{formData.lastName?.[0] || formData.email?.[0]?.toUpperCase()}
                              </div>
                              <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full border border-stone-200 shadow-sm text-stone-500 hover:text-orange-600 transition-colors">
                                 <Camera size={14} />
                              </button>
                           </div>
                           <h2 className="font-serif font-bold text-stone-900">{formData.firstName} {formData.lastName}</h2>
                           <p className="text-xs text-stone-500">{formData.email}</p>
                        </div>
                        {/* Redundant Navigation Removed */}
                     </div>
                  </div>

                  {/* Right Content Area */}
                  <div className="lg:col-span-3 space-y-6">
                     
                     {/* Feedback Messages */}
                     {success && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                           <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                           <div>
                              <p className="text-sm text-green-800 font-medium">Profile updated successfully</p>
                              <p className="text-xs text-green-700">Your changes have been saved to your account.</p>
                           </div>
                        </div>
                     )}

                     {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                           <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                           <div>
                              <p className="text-sm text-red-800 font-medium">An error occurred</p>
                              <p className="text-xs text-red-700">{error}</p>
                           </div>
                        </div>
                     )}

                     {/* Profile Form Card */}
                     <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/30">
                           <h2 className="font-serif font-semibold text-stone-900">Personal Information</h2>
                           <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded-md border border-stone-200">
                             Member since {formatDate(formData.createdAt)}
                           </span>
                        </div>
                        
                        <div className="p-6">
                           <form onSubmit={handleSubmit} className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div className="space-y-2">
                                    <label className="text-sm font-medium text-stone-700">First Name</label>
                                    <input 
                                       type="text" 
                                       className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                                       value={formData.firstName}
                                       onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-sm font-medium text-stone-700">Last Name</label>
                                    <input 
                                       type="text" 
                                       className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                                       value={formData.lastName}
                                       onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                    />
                                 </div>
                              </div>
                              
                              <div className="space-y-2">
                                 <label className="text-sm font-medium text-stone-700">Username</label>
                                 <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">@</span>
                                    <input 
                                       type="text" 
                                       className="w-full pl-7 pr-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                                       value={formData.username}
                                       onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    />
                                 </div>
                                 <p className="text-xs text-stone-500">Your public username on the platform.</p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-100">
                                 <div className="space-y-2">
                                    <label className="text-sm font-medium text-stone-700">Email Address</label>
                                    <div className="relative">
                                       <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                                       <input 
                                          type="email" 
                                          disabled
                                          className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-500 cursor-not-allowed text-sm"
                                          value={formData.email}
                                       />
                                    </div>
                                    <p className="text-[10px] text-stone-400">Contact support to change email.</p>
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-sm font-medium text-stone-700">Phone Number</label>
                                    <div className="relative">
                                       <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                                       <input 
                                          type="tel" 
                                          className="w-full pl-9 pr-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                                          value={formData.contactNumber}
                                          onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                                          placeholder="(555) 123-4567"
                                       />
                                    </div>
                                 </div>
                              </div>
                              
                              <div className="pt-6 flex justify-end items-center gap-3 border-t border-stone-100">
                                 {hasChanges() && (
                                    <button 
                                       type="button"
                                       onClick={() => setFormData(originalData!)}
                                       className="text-sm font-medium text-stone-500 hover:text-stone-800 transition-colors px-4 py-2"
                                    >
                                       Discard
                                    </button>
                                 )}
                                 <button 
                                    type="submit"
                                    disabled={saving || !hasChanges()}
                                    className={cn(
                                       "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm",
                                       hasChanges() 
                                          ? "bg-stone-900 hover:bg-stone-800 text-white shadow-stone-900/10" 
                                          : "bg-stone-100 text-stone-400 cursor-not-allowed"
                                    )}
                                 >
                                    {saving ? (
                                       <>
                                          <Loader2 size={16} className="animate-spin" />
                                          Saving...
                                       </>
                                    ) : (
                                       <>
                                          Save Changes
                                       </>
                                    )}
                                 </button>
                              </div>

                           </form>
                        </div>
                     </div>
                  </div>
                </div>
            )}
          </div>
      </div>
  );
}
