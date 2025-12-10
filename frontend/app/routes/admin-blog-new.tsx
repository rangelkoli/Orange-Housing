import AdminLayout from "../components/AdminLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Save, Image as ImageIcon, ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export default function AdminNewBlogPost() {
  return (
    <AdminLayout title="Write New Post">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/admin/blog" className="inline-flex items-center text-stone-500 hover:text-stone-900 transition-colors mb-4">
            <ArrowLeft size={16} className="mr-2" />
            Back to Blog Posts
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-8">
          <form className="space-y-8">
            {/* Title & Slug */}
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base">Post Title</Label>
                <Input id="title" placeholder="Enter a catchy title..." className="text-lg font-medium" />
              </div>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select author" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah">Sarah Jenkins</SelectItem>
                    <SelectItem value="mike">Mike Wilson</SelectItem>
                    <SelectItem value="admin">Admin Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="guides">Guides</SelectItem>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="tips">Tips & Tricks</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Featured Image */}
            <div className="space-y-2">
              <Label>Featured Image</Label>
              <div className="border-2 border-dashed border-stone-200 rounded-lg p-8 text-center hover:bg-stone-50 transition-colors cursor-pointer">
                <div className="flex flex-col items-center gap-2 text-stone-500">
                  <div className="p-3 bg-stone-100 rounded-full">
                    <ImageIcon size={24} />
                  </div>
                  <p className="font-medium">Click to upload or drag and drop</p>
                  <p className="text-sm">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                </div>
              </div>
            </div>

            {/* Content Editor Placeholder */}
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <div className="min-h-[400px] border border-stone-200 rounded-lg p-4 bg-stone-50/50">
                {/* Simple Toolbar */}
                <div className="flex gap-2 border-b border-stone-200 pb-2 mb-4">
                  <Button variant="ghost" size="sm" className="font-bold">B</Button>
                  <Button variant="ghost" size="sm" className="italic">I</Button>
                  <Button variant="ghost" size="sm" className="underline">U</Button>
                  <div className="w-px h-6 bg-stone-300 mx-1" />
                  <Button variant="ghost" size="sm">H1</Button>
                  <Button variant="ghost" size="sm">H2</Button>
                  <Button variant="ghost" size="sm">Quote</Button>
                </div>
                <Textarea 
                  id="content" 
                  className="min-h-[350px] border-0 bg-transparent focus-visible:ring-0 resize-none p-0" 
                  placeholder="Start writing your amazing story here..." 
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-stone-100">
              <Button variant="outline" className="text-stone-600">Save Draft</Button>
              <Button className="bg-orange-600 hover:bg-orange-700 gap-2">
                <Save size={18} />
                Publish Post
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
