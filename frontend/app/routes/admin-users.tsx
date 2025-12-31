import { useState, useMemo } from "react";
import AdminLayout from "../components/AdminLayout";
import { Button } from "../components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../components/ui/table";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { 
  Edit, 
  Trash2, 
  Eye, 
  Plus, 
  Search, 
  Users as UsersIcon, 
  UserCheck, 
  UserPlus, 
  UserX,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { Link } from "react-router";

export default function AdminUsersPage() {
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Landlord", status: "Active", joined: "Oct 24, 2023", listings: 12 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Landlord", status: "Active", joined: "Oct 18, 2023", listings: 5 },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "Student", status: "Pending", joined: "Oct 10, 2023", listings: 0 },
    { id: 4, name: "Sarah Wilson", email: "sarah@example.com", role: "Admin", status: "Active", joined: "Sep 28, 2023", listings: 0 },
    { id: 5, name: "David Brown", email: "david@example.com", role: "Landlord", status: "Suspended", joined: "Sep 15, 2023", listings: 8 },
  ];

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'id', direction: 'asc' });

  const stats = [
    { label: "Total Users", value: "8,542", icon: UsersIcon, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active", value: "8,210", icon: UserCheck, color: "text-green-600", bg: "bg-green-50" },
    { label: "New this Month", value: "145", icon: UserPlus, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Suspended", value: "12", icon: UserX, color: "text-red-600", bg: "bg-red-50" },
  ];

  const sortedUsers = useMemo(() => {
    if (!sortConfig) return users;

    return [...users].sort((a, b) => {
      let aValue: any = a[sortConfig.key as keyof typeof a];
      let bValue: any = b[sortConfig.key as keyof typeof b];

      if (sortConfig.key === 'joined') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [users, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const SortableHeader = ({ label, sortKey, className = "" }: { label: string; sortKey: string, className?: string }) => {
    const isActive = sortConfig?.key === sortKey;
    return (
      <TableHead 
        className={`px-6 cursor-pointer hover:text-stone-900 text-stone-500 transition-colors group ${className}`}
        onClick={() => requestSort(sortKey)}
      >
        <div className={`flex items-center gap-1.5 ${className.includes('center') ? 'justify-center' : ''}`}>
          <span className={`text-[10px] font-display font-bold uppercase tracking-[0.2em] ${isActive ? "text-stone-900" : "text-stone-500"}`}>
            {label}
          </span>
          <div className={`transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-20 group-hover:opacity-60"}`}>
            {isActive ? (
              sortConfig.direction === 'asc' ? <ArrowUp size={12} className="text-orange-500" /> : <ArrowDown size={12} className="text-orange-500" />
            ) : (
              <ArrowUpDown size={12} className="text-stone-400" />
            )}
          </div>
        </div>
      </TableHead>
    );
  };

  return (
    <AdminLayout 
      title="User Management"
      action={
        <button className="group relative border-2 border-orange-500 text-orange-600 font-bold py-2 px-6 rounded-xl overflow-hidden transition-all duration-300 hover:text-white hover:scale-105 active:scale-95 cursor-pointer">
          <span className="relative z-10 font-display text-[11px] uppercase tracking-wider flex items-center gap-2">
            <Plus size={16} />
            Create New User
          </span>
          <div className="absolute inset-0 bg-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
        </button>
      }
    >
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="border-stone-100 shadow-sm transition-all hover:border-stone-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-display font-bold text-stone-500 uppercase tracking-[0.2em]">{stat.label}</p>
                    <h3 className="text-3xl font-serif font-bold text-stone-900 mt-1">{stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Table */}
        <Card className="border-stone-100 shadow-sm overflow-hidden pb-0">
          <CardHeader className="border-b border-stone-100 bg-white/50 backdrop-blur-sm px-4 py-0 m-0">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                <Input 
                  placeholder="Search users by name, email, or role..." 
                  className="pl-12 h-12 bg-white border-stone-200 focus:border-orange-500 focus:ring-0 transition-all rounded-md text-base shadow-sm"
                />
              </div>
              <div className="flex items-center bg-stone-100/80 p-1 rounded-md border border-stone-200">
                 <button className="bg-white text-stone-900 shadow-sm px-6 py-2 rounded-[4px] border border-stone-200/50 font-display text-[10px] font-bold uppercase tracking-wider transition-all">All Users</button>
                 <button className="text-stone-500 px-6 py-2 font-display text-[10px] font-bold uppercase tracking-wider hover:text-stone-900 transition-all">Landlords</button>
                 <button className="text-stone-500 px-6 py-2 font-display text-[10px] font-bold uppercase tracking-wider hover:text-stone-900 transition-all">Students</button>
                 <button className="text-stone-500 px-6 py-2 font-display text-[10px] font-bold uppercase tracking-wider hover:text-stone-900 transition-all">Admins</button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-stone-50/50">
                <TableRow className="hover:bg-transparent border-stone-100">
                  <SortableHeader label="ID" sortKey="id" />
                  <SortableHeader label="User" sortKey="name" />
                  <SortableHeader label="Joined" sortKey="joined" />
                  <SortableHeader label="Listings" sortKey="listings" className="text-center" />
                  <SortableHeader label="Status" sortKey="status" className="text-center" />
                  <TableHead className="text-right px-6 text-[10px] font-display font-bold uppercase tracking-[0.2em] text-stone-500">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedUsers.map((user) => (
                  <TableRow key={user.id} className="group hover:bg-stone-50/50 transition-colors border-stone-50">
                    <TableCell className="font-mono text-xs text-stone-400 px-6">#{user.id}</TableCell>
                    <TableCell className="px-6">
                      <Link to={`/admin/users/${user.id}/listings`} className="flex items-center gap-3 py-2 group/user cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-[10px] font-bold text-orange-600 uppercase transition-colors group-hover/user:bg-orange-100">
                          {user.name[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-stone-900 group-hover/user:text-orange-600 transition-colors truncate">{user.name}</p>
                          <p className="text-xs text-stone-500 truncate">{user.email}</p>
                        </div>
                      </Link>
                    </TableCell>

                    <TableCell className="px-6">
                       <span className="text-xs text-stone-500 font-medium">{user.joined}</span>
                    </TableCell>
                    <TableCell className="px-6 text-center">
                       <span className="font-display text-[11px] font-bold text-stone-700">{user.listings}</span>
                    </TableCell>
                    <TableCell className="px-6 text-center">
                      <Badge variant={user.status === 'Active' ? "default" : "outline"} className={
                        user.status === 'Active' 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100 font-bold px-3 py-1" 
                        : user.status === 'Pending' 
                        ? "bg-amber-50 text-amber-700 border-amber-100 font-bold px-3 py-1"
                        : "bg-red-50 text-red-700 border-red-100 font-bold px-3 py-1"
                      }>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <div className="flex justify-end gap-1 items-center">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-all" title="View Profile">
                          <Eye size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Suspend/Delete">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <div className="p-6 border-t border-stone-100 bg-stone-50/20">
             <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[10px] text-stone-400 font-display font-bold uppercase tracking-[0.2em]">Showing {users.length} of 8,542 users</p>
                <div className="flex items-center gap-2">
                   <Button variant="outline" size="sm" className="bg-white border-stone-200 rounded-lg font-bold text-stone-600 hover:bg-stone-50">Previous</Button>
                   <Button variant="outline" size="sm" className="bg-white border-stone-200 rounded-lg font-bold text-stone-600 hover:bg-stone-50">Next</Button>
                </div>
             </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
