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
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit, 
  Trash2, 
  Eye, 
  Plus, 
  Search, 
  FileText, 
  CheckCircle2, 
  Clock, 
  BarChart3,
} from "lucide-react";
import { Link } from "react-router";

export default function AdminBlogPage() {
  const posts = [
    { id: 1, title: "Moving to Syracuse: A Complete Guide", date: "Oct 24, 2023", status: "Published", cover: "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=400&h=250&fit=crop" },
    { id: 2, title: "Top 5 Neighborhoods for Families", date: "Oct 18, 2023", status: "Published", cover: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=250&fit=crop" },
    { id: 3, title: "Understanding Your Lease Agreement", date: "Oct 10, 2023", status: "Draft", cover: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop" },
    { id: 4, title: "Winter Home Maintenance Tips", date: "Sep 28, 2023", status: "Published", cover: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=250&fit=crop" },
  ];

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'id', direction: 'asc' });

  const stats = [
    { label: "Total Posts", value: "24", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Published", value: "18", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    { label: "Drafts", value: "6", icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  const sortedPosts = useMemo(() => {
    if (!sortConfig) return posts;

    return [...posts].sort((a, b) => {
      let aValue: any = a[sortConfig.key as keyof typeof a];
      let bValue: any = b[sortConfig.key as keyof typeof b];

      // Special handling for dates
      if (sortConfig.key === 'date') {
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
  }, [posts, sortConfig]);

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
        className={`px-6 cursor-pointer hover:text-stone-900 transition-colors group ${className}`}
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
      title="Blog Management"
      action={
        <Link to="/admin/blog/new">
          <button className="group relative border-2 border-orange-500 text-orange-600 font-bold py-2.5 px-8 rounded-xl overflow-hidden transition-all duration-300 hover:text-white hover:scale-105 active:scale-95 cursor-pointer">
            <span className="relative z-10 font-display text-[11px] uppercase tracking-wider">Write a Blog</span>
            {/* Sliding background fill */}
            <div className="absolute inset-0 bg-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          </button>
        </Link>
      }
    >
      <div className="space-y-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="border-stone-100 shadow-sm overflow-hidden group hover:border-stone-200 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-display font-bold text-stone-500 uppercase tracking-[0.2em]">{stat.label}</p>
                    <h3 className="text-3xl font-serif font-bold text-stone-900 mt-1">{stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-transform duration-500 group-hover:scale-110`}>
                    <stat.icon size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Area */}
        <Card className="border-stone-100 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-stone-100 bg-white/50 backdrop-blur-sm py-4 px-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                <Input 
                  placeholder="Search posts by title or category..." 
                  className="pl-12 h-12 bg-white border-stone-200 focus:border-orange-500 focus:ring-0 transition-all rounded-md text-base shadow-sm"
                />
              </div>
              
              <div className="flex items-center bg-stone-100/80 p-1 rounded-md border border-stone-200">
                 <button className="bg-white text-stone-900 shadow-sm px-6 py-2 rounded-[4px] border border-stone-200/50 font-display text-[10px] font-bold uppercase tracking-wider transition-all">All Posts</button>
                 <button className="text-stone-500 px-6 py-2 font-display text-[10px] font-bold uppercase tracking-wider hover:text-stone-900 transition-all">Published</button>
                 <button className="text-stone-500 px-6 py-2 font-display text-[10px] font-bold uppercase tracking-wider hover:text-stone-900 transition-all">Drafts</button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-stone-50/50 border-stone-100">
                <TableRow className="hover:bg-transparent border-stone-100">
                  <SortableHeader label="ID" sortKey="id" />
                  <SortableHeader label="Blog Post" sortKey="title" />
                  <SortableHeader label="Date" sortKey="date" />
                  <SortableHeader label="Status" sortKey="status" className="text-center" />
                  <TableHead className="text-right px-6 text-stone-500 font-bold uppercase text-[11px] tracking-wider">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPosts.map((post) => (
                  <TableRow key={post.id} className="group hover:bg-stone-50/50 transition-colors border-stone-50">
                    <TableCell className="font-mono text-xs text-stone-400 px-6">#{post.id}</TableCell>
                    <TableCell className="px-6">
                      <div className="flex items-center gap-4 py-2">
                        <div className="w-16 h-10 rounded-lg overflow-hidden border border-stone-100 shrink-0 bg-stone-100 shadow-sm shadow-stone-200/50">
                           <img src={post.cover} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-stone-900 group-hover:text-orange-600 transition-colors truncate max-w-[250px]">{post.title}</p>
                          <p className="text-[11px] text-stone-400 font-medium uppercase tracking-tight mt-0.5">Community • 5 min read</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-stone-500 px-6 font-medium">{post.date}</TableCell>
                    <TableCell className="text-center px-6">
                      <Badge variant={post.status === 'Published' ? "default" : "outline"} className={
                        post.status === 'Published' 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100 font-bold px-3 py-1" 
                        : "bg-stone-100 text-stone-600 border-stone-200 font-bold px-3 py-1"
                      }>
                        {post.status}
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
          
          <div className="p-6 border-t border-stone-100 bg-stone-50/20">
             <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[10px] text-stone-400 font-display font-bold uppercase tracking-[0.2em]">Showing {posts.length} of 24 posts</p>
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
