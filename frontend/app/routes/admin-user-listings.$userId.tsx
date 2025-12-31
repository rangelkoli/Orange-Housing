import { useState, useMemo } from "react";
import { useParams, Link } from "react-router";
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
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Building2
} from "lucide-react";

export default function AdminUserListingsPage() {
  const { userId } = useParams();
  
  // Mock user data - in a real app, you'd fetch this based on userId
  const userData = {
    id: userId,
    name: "John Doe",
    email: "john@example.com",
    role: "Landlord"
  };

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'id', direction: 'asc' });

  const listings = [
    { id: 1, title: "Modern Family Home", address: "454 Serenity Lane", price: "$2,200", status: "Active", image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=250&fit=crop" },
    { id: 2, title: "Cozy Downtown Apartment", address: "122 Elmwood Residences", price: "$1,800", status: "Active", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop" },
    { id: 4, title: "Spacious 5-Bed House", address: "220 Comstock Ave", price: "$3,100", status: "Active", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=250&fit=crop" },
  ];

  const sortedListings = useMemo(() => {
    if (!sortConfig) return listings;

    return [...listings].sort((a, b) => {
      let aValue: any = a[sortConfig.key as keyof typeof a];
      let bValue: any = b[sortConfig.key as keyof typeof b];

      if (sortConfig.key === 'price') {
        aValue = parseFloat(aValue.replace(/[$,]/g, ''));
        bValue = parseFloat(bValue.replace(/[$,]/g, ''));
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [listings, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const SortableHeader = ({ label, sortKey, className = "" }: { label: string; sortKey: string; className?: string }) => {
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
      title={`Listings by ${userData.name}`}
      action={
        <div className="flex gap-3">
          <Link to="/admin/users">
            <Button variant="outline" className="rounded-xl border-stone-200 hover:bg-stone-50 gap-2">
              <ArrowLeft size={16} />
              Back to Users
            </Button>
          </Link>
          <button className="group relative border-2 border-orange-500 text-orange-600 font-bold py-2 px-6 rounded-xl overflow-hidden transition-all duration-300 hover:text-white hover:scale-105 active:scale-95 cursor-pointer">
            <span className="relative z-10 font-display text-[11px] uppercase tracking-wider flex items-center gap-2">
              <Plus size={16} />
              Add Listing for User
            </span>
            <div className="absolute inset-0 bg-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          </button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* User Brief Info */}
        <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-xl font-bold border border-orange-100">
              {userData.name[0]}
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900">{userData.name}</h2>
              <p className="text-sm text-stone-500">{userData.email} • {userData.role}</p>
            </div>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-display font-bold text-stone-400 uppercase tracking-widest">Active Listings</p>
             <p className="text-2xl font-serif font-bold text-orange-600">{listings.length}</p>
          </div>
        </div>

        {/* Listings Table */}
        <Card className="border-stone-100 shadow-sm overflow-hidden pb-0">
          <CardHeader className="border-b border-stone-100 bg-white/50 backdrop-blur-sm px-4 py-0 m-0">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                <Input 
                  placeholder="Search user's listings..." 
                  className="pl-12 h-12 bg-white border-stone-200 focus:border-orange-500 focus:ring-0 transition-all rounded-md text-base shadow-sm"
                />
              </div>
              <div className="flex items-center bg-stone-100/80 p-1 rounded-md border border-stone-200">
                 <button className="bg-white text-stone-900 shadow-sm px-6 py-2 rounded-[4px] border border-stone-200/50 font-display text-[10px] font-bold uppercase tracking-wider transition-all">All User Listings</button>
                 <button className="text-stone-500 px-6 py-2 font-display text-[10px] font-bold uppercase tracking-wider hover:text-stone-900 transition-all">Active</button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-stone-50/50">
                <TableRow className="hover:bg-transparent border-stone-100">
                  <SortableHeader label="ID" sortKey="id" />
                  <SortableHeader label="Property" sortKey="title" />
                  <SortableHeader label="Price" sortKey="price" />
                  <SortableHeader label="Status" sortKey="status" />
                  <TableHead className="text-right px-6 text-[10px] font-display font-bold uppercase tracking-[0.2em] text-stone-500">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedListings.map((listing) => (
                  <TableRow key={listing.id} className="group hover:bg-stone-50/50 transition-colors border-stone-50">
                    <TableCell className="font-mono text-xs text-stone-400 px-6">#{listing.id}</TableCell>
                    <TableCell className="px-6">
                      <div className="flex items-center gap-4 py-2">
                        <div className="w-16 h-10 rounded-lg overflow-hidden border border-stone-100 shrink-0 bg-stone-100">
                           <img src={listing.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-stone-900 truncate max-w-[300px]">{listing.title}</p>
                          <p className="text-xs text-stone-500 truncate max-w-[300px]">{listing.address}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6">
                       <span className="font-display text-xs font-bold text-stone-700">{listing.price}</span>
                       <span className="text-[10px] text-stone-400 block">/month</span>
                    </TableCell>
                    <TableCell className="px-6">
                      <Badge variant={listing.status === 'Active' ? "default" : "outline"} className={
                        listing.status === 'Active' 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100 font-bold px-3 py-1" 
                        : "bg-red-50 text-red-700 border-red-100 font-bold px-3 py-1"
                      }>
                        {listing.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <div className="flex justify-end gap-1 items-center">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-all" title="View">
                          <Eye size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
