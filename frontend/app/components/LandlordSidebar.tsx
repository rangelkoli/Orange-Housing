import { Link, useLocation, useNavigate } from "react-router";
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Plus, 
  Shield,
  Menu,
  X,
  CreditCard,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "../stores/authStore";
import { useState, useEffect } from "react";

export function LandlordSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;

  // Generate user initials for avatar
  const userInitials = user?.firstName && user?.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';
  const userName = user?.company || user?.firstName || user?.email?.split('@')[0] || 'Landlord';

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/landlord/dashboard" },
    { icon: CreditCard, label: "Billing & Payments", href: "/landlord/billing" },
    { icon: HelpCircle, label: "Help & Support", href: "/landlord/help" },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-40 p-2 bg-white/90 backdrop-blur-md border border-stone-200 rounded-lg shadow-sm text-stone-600 hover:text-stone-900 transition-colors hover:shadow-md"
        aria-label="Toggle Menu"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={cn(
        "w-64 bg-gradient-to-b from-stone-50 to-white border-r border-stone-200 h-screen flex flex-col overflow-y-auto",
        "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:sticky md:top-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-stone-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold text-xl">
                {userInitials}
              </div>
              <div>
                <h2 className="font-serif font-bold text-stone-900 leading-tight">{userName}</h2>
                <p className="text-xs text-stone-500">Landlord Account</p>
              </div>
            </div>
            
            {/* Close Button (Mobile Only) */}
            <button 
              onClick={() => setIsOpen(false)}
              className="md:hidden text-stone-400 hover:text-stone-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border",
                  isActive(item.href)
                    ? "bg-gradient-to-r from-orange-50 to-white text-orange-700 shadow-sm border-orange-100"
                    : "text-stone-600 hover:bg-stone-50 hover:text-stone-900 border-transparent"
                )}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-6">
            <Link
              to="/landlord/create-listing"
              className="w-full relative group overflow-hidden p-6 rounded-3xl transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md border border-orange-100 bg-white block"
            >
              {/* Soft Background Base */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/40 via-white to-orange-50/20" />
              
              {/* Radial Gradient Blobs - using gradients instead of blur to avoid clipping artifacts */}
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[radial-gradient(circle,rgba(255,237,213,0.6)_0%,rgba(255,255,255,0)_70%)] group-hover:bg-[radial-gradient(circle,rgba(254,215,170,0.6)_0%,rgba(255,255,255,0)_70%)] transition-all duration-500" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-[radial-gradient(circle,rgba(255,247,237,0.8)_0%,rgba(255,255,255,0)_70%)] group-hover:bg-[radial-gradient(circle,rgba(255,237,213,0.8)_0%,rgba(255,255,255,0)_70%)] transition-all duration-500" />

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-3">
                   <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg shadow-orange-100 ring-4 ring-white text-orange-600 group-hover:scale-110 group-hover:text-orange-700 transition-all duration-300">
                    <Plus size={24} strokeWidth={2.5} />
                  </div>
                </div>
                
                <span className="font-serif font-bold text-lg tracking-tight mb-1 text-stone-800">Add New Listing</span>
                <span className="text-stone-500 text-xs font-medium group-hover:text-stone-700 transition-colors">Post a new property today</span>
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-auto p-4 border-t border-stone-100">
          <nav className="space-y-1">
            <Link
              to="/landlord/change-password"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
            >
              <Shield size={20} />
              Change Password
            </Link>
            <Link
              to="/landlord/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
            >
              <Settings size={20} />
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-stone-600 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </nav>
        </div>

      </aside>
    </>
  );
}
