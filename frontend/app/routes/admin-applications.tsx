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
import { Check, X, ExternalLink } from "lucide-react";

export default function AdminApplicationsPage() {
  const applications = [
    { id: 101, business: "Syracuse Coffee Co.", contact: "Alice Baker", email: "alice@coffee.com", phone: "(315) 555-0199", date: "2023-10-24", status: "Pending" },
    { id: 102, business: "Downtown Movers", contact: "Bob Carter", email: "bob@movers.com", phone: "(315) 555-0288", date: "2023-10-23", status: "Approved" },
    { id: 103, business: "Green Cleaners", contact: "Charlie Davis", email: "charlie@clean.com", phone: "(315) 555-0377", date: "2023-10-22", status: "Rejected" },
    { id: 104, business: "Tech Solutions", contact: "Diana Evans", email: "diana@tech.com", phone: "(315) 555-0466", date: "2023-10-21", status: "Pending" },
  ];

  return (
    <AdminLayout title="Team Syracuse Applications">
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Business Name</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Date Applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="font-medium">#{app.id}</TableCell>
                <TableCell>{app.business}</TableCell>
                <TableCell>{app.contact}</TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span>{app.email}</span>
                    <span className="text-stone-500">{app.phone}</span>
                  </div>
                </TableCell>
                <TableCell>{app.date}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    app.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {app.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {app.status === 'Pending' && (
                      <>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:bg-green-50" title="Approve">
                          <Check size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50" title="Reject">
                          <X size={16} />
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-500 hover:text-stone-900" title="View Details">
                      <ExternalLink size={16} />
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
