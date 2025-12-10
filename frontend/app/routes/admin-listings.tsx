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
import { Edit, Trash2, Eye } from "lucide-react";

export default function AdminListingsPage() {
  const listings = [
    { id: 1, title: "Modern Family Home", address: "454 Serenity Lane", price: "$2,200", status: "Active", owner: "John Doe" },
    { id: 2, title: "Cozy Downtown Apartment", address: "122 Elmwood Residences", price: "$1,800", status: "Active", owner: "Jane Smith" },
    { id: 3, title: "Student Studio", address: "890 University Ave", price: "$950", status: "Pending", owner: "Mike Johnson" },
    { id: 4, title: "Spacious 5-Bed House", address: "220 Comstock Ave", price: "$3,100", status: "Active", owner: "Sarah Wilson" },
    { id: 5, title: "Charming 2-Bed Flat", address: "55 Westcott St", price: "$1,200", status: "Reported", owner: "David Brown" },
  ];

  return (
    <AdminLayout 
      title="Listings Management"
      action={<Button className="bg-orange-600 hover:bg-orange-700">Add New Listing</Button>}
    >
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell className="font-medium">#{listing.id}</TableCell>
                <TableCell>{listing.title}</TableCell>
                <TableCell>{listing.address}</TableCell>
                <TableCell>{listing.price}</TableCell>
                <TableCell>{listing.owner}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    listing.status === 'Active' ? 'bg-green-100 text-green-700' :
                    listing.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {listing.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-500 hover:text-stone-900">
                      <Eye size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-500 hover:text-blue-600">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-500 hover:text-red-600">
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
