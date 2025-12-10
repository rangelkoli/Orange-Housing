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
import { Edit, Trash2, Eye, Plus } from "lucide-react";
import { Link } from "react-router";

export default function AdminBlogPage() {
  const posts = [
    { id: 1, title: "Moving to Syracuse: A Complete Guide", author: "Sarah Jenkins", date: "Oct 24, 2023", status: "Published", views: 1240 },
    { id: 2, title: "Top 5 Neighborhoods for Families", author: "Mike Wilson", date: "Oct 18, 2023", status: "Published", views: 890 },
    { id: 3, title: "Understanding Your Lease Agreement", author: "Legal Team", date: "Oct 10, 2023", status: "Draft", views: 0 },
    { id: 4, title: "Winter Home Maintenance Tips", author: "Maintenance Crew", date: "Sep 28, 2023", status: "Published", views: 560 },
  ];

  return (
    <AdminLayout 
      title="Blog Management"
      action={
        <Button asChild className="bg-orange-600 hover:bg-orange-700 gap-2">
          <Link to="/admin/blog/new">
            <Plus size={18} />
            Write New Post
          </Link>
        </Button>
      }
    >
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">#{post.id}</TableCell>
                <TableCell className="font-medium text-stone-900">{post.title}</TableCell>
                <TableCell>{post.author}</TableCell>
                <TableCell>{post.date}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    post.status === 'Published' ? 'bg-green-100 text-green-700' :
                    'bg-stone-100 text-stone-600'
                  }`}>
                    {post.status}
                  </span>
                </TableCell>
                <TableCell>{post.views.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-500 hover:text-stone-900" title="View">
                      <Eye size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-500 hover:text-blue-600" title="Edit">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-500 hover:text-red-600" title="Delete">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
