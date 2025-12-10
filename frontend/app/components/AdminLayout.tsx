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

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}

export default function AdminLayout({ children, title, action }: AdminLayoutProps) {
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Listings", href: "/admin/listings", icon: Building2 },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Applications", href: "/admin/applications", icon: ClipboardList },
    { label: "Blog Posts", href: "/admin/blog", icon: FileText },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex font-sans text-stone-900">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 text-stone-300 flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-stone-800">
          <Link to="/" className="flex items-center gap-2 text-white hover:text-orange-500 transition-colors">
            <div className="font-bold text-xl tracking-tight">
              Orange<span className="text-orange-600">Admin</span>
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
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? "bg-orange-600 text-white shadow-md" 
                    : "hover:bg-stone-800 hover:text-white"
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-stone-800">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-stone-400 hover:text-red-400 hover:bg-stone-800 gap-3"
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
          <h1 className="text-2xl font-bold text-stone-900">{title}</h1>
          <div className="flex items-center gap-4">
            {action}
            <div className="h-8 w-8 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-700 font-bold">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
