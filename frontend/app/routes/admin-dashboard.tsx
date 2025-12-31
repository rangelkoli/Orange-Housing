import AdminLayout from "../components/AdminLayout";
import { 
  Users, 
  Building2, 
  TrendingUp, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    {
      label: "Total Listings",
      value: "1,248",
      change: "+12%",
      trend: "up",
      icon: Building2,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      label: "Active Users",
      value: "8,542",
      change: "+5.4%",
      trend: "up",
      icon: Users,
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      label: "New Applications",
      value: "45",
      change: "-2.1%",
      trend: "down",
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-50"
    },
    {
      label: "Pending Reports",
      value: "12",
      change: "+0%",
      trend: "neutral",
      icon: AlertCircle,
      color: "text-red-600",
      bg: "bg-red-50"
    }
  ];

  const recentActivity = [
    { user: "John Doe", action: "listed a new property", time: "2 mins ago", target: "123 Main St" },
    { user: "Sarah Smith", action: "reported a listing", time: "15 mins ago", target: "456 Oak Ave" },
    { user: "Mike Johnson", action: "applied to Team Syracuse", time: "1 hour ago", target: "Application #442" },
    { user: "Emily Davis", action: "updated profile", time: "3 hours ago", target: "User ID: 882" },
  ];

  return (
    <AdminLayout title="Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-display font-bold ${stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-stone-500'}`}>
                {stat.change}
                {stat.trend === 'up' && <ArrowUpRight size={14} />}
                {stat.trend === 'down' && <ArrowDownRight size={14} />}
              </div>
            </div>
            <h3 className="text-3xl font-serif font-bold text-stone-900 mb-1">{stat.value}</h3>
            <p className="text-[10px] text-stone-500 font-display font-bold uppercase tracking-[0.2em]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
          <h2 className="text-lg font-serif font-bold text-stone-900 mb-6">Recent Activity</h2>
          <div className="space-y-6">
            {recentActivity.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-orange-400 shrink-0" />
                <div>
                  <p className="text-stone-900 font-medium">
                    {item.user} <span className="text-stone-500 font-normal">{item.action}</span>
                  </p>
                  <p className="text-sm text-stone-500 mt-0.5">
                    {item.target} • {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
          <h2 className="text-lg font-serif font-bold text-stone-900 mb-6">System Status</h2>
          <div className="space-y-4">
             <div className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
                <span className="font-medium text-stone-700">Database Status</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Operational</span>
             </div>
             <div className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
                <span className="font-medium text-stone-700">API Latency</span>
                <span className="text-stone-600 font-mono">24ms</span>
             </div>
             <div className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
                <span className="font-medium text-stone-700">Last Backup</span>
                <span className="text-stone-600">2 hours ago</span>
             </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
