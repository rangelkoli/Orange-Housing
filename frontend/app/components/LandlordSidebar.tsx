import { Link, useLocation } from "react-router";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Megaphone, 
  FileText, 
  Settings, 
  LogOut,
  Plus,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";


export function LandlordSidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/landlord/dashboard" },
    { icon: Building2, label: "My Listings", href: "/landlord/dashboard" }, // For now, same as dashboard or we can make a sub-route
    { icon: Users, label: "Applications", href: "#" },
    { icon: Megaphone, label: "Marketing Tools", href: "#" },
    { icon: FileText, label: "Documents", href: "#" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-stone-200 h-screen sticky top-0 flex flex-col hidden md:flex">
      <div className="p-6 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold text-xl">
            SR
          </div>
          <div>
            <h2 className="font-bold text-stone-900 leading-tight">Syracuse Realty</h2>
            <p className="text-xs text-stone-500">Landlord Account</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Link 
          to="/landlord/create-listing" 
          className="w-full bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors mb-6"
        >
          <Plus size={18} /> Add New Listing
        </Link>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                isActive(item.href) 
                  ? "bg-orange-600 text-white shadow-md shadow-orange-500/20" 
                  : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>
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
            to="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
          >
            <Settings size={20} />
            Settings
          </Link>
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-stone-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </Link>
        </nav>
      </div>

    </aside>
  );
}
