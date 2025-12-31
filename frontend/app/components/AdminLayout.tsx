import { Link, useLocation } from "react-router";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  ClipboardList
} from "lucide-react";
import { Button } from "./ui/button";
import { RequireAuth } from "./RequireAuth";
import { useAuthStore } from "../stores/authStore";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}

export default function AdminLayout({ children, title, action }: AdminLayoutProps) {
  const location = useLocation();
  const { logout } = useAuthStore();

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Listings", href: "/admin/listings", icon: Building2 },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Applications", href: "/admin/applications", icon: ClipboardList },
    { label: "Blog Posts", href: "/admin/blog", icon: FileText },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = "/landlord/login";
  };

  return (
    <RequireAuth requiredRole="admin" redirectTo="/landlord/login">
      <div className="min-h-screen bg-stone-50 flex font-sans text-stone-900">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-stone-200 flex flex-col fixed h-full z-20">
          <div className="p-6 border-b border-stone-100">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/logo.webp" alt="Orange Housing" className="h-10 w-auto object-contain" />
              <div className="px-2 py-0.5 bg-orange-50 border border-orange-100 rounded-md text-[10px] font-display font-bold text-orange-600 uppercase tracking-wider">
                Admin
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? "bg-orange-50 text-orange-600 font-semibold border border-orange-100 shadow-sm" 
                      : "text-stone-500 hover:bg-stone-50 hover:text-stone-900"
                  }`}
                >
                  <item.icon size={20} className={isActive ? "text-orange-600" : "text-stone-400"} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-stone-100">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-stone-500 hover:text-red-600 hover:bg-red-50 gap-3 rounded-xl"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64">
          {/* Header */}
          <header className="bg-white border-b border-stone-200 h-16 px-8 flex items-center justify-between sticky top-0 z-10">
            <h1 className="text-2xl font-serif font-bold text-stone-900">{title}</h1>
            <div className="flex items-center gap-4">
              {action}
            </div>
          </header>

          {/* Page Content */}
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}

