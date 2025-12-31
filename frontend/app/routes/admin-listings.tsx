import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import SubscriptionModal from "../components/SubscriptionModal";

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
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit, 
  Trash2, 
  Eye, 
  Plus, 
  Search, 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Rocket,
  Loader2
} from "lucide-react";


export default function AdminListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'pending' | 'draft'>('pending');
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [actionListingId, setActionListingId] = useState<number | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");


  const fetchListings = async () => {
      try {
          setLoading(true);
          const backendUrl = import.meta.env.VITE_BACKEND_URL;
          let url = `${backendUrl}/listings/`; 
          
          if (activeTab === 'pending') {
               url = `${backendUrl}/listings/admin/pending?admin_user_id=500`;
          } else if (activeTab === 'all') {
               url = `${backendUrl}/listings/?visible=all`;
          }
          
          const response = await fetch(url);
          const data = await response.json();
          if(data.listings) {
             setListings(data.listings);
          }
      } catch (err) {
          toast.error("Failed to fetch listings");
      } finally {
          setLoading(false);
      }
  };


  useEffect(() => {
     fetchListings();
  }, [activeTab]);

  const handleApprove = async (id: number) => {
      try {
          setProcessingId(id);
          const backendUrl = import.meta.env.VITE_BACKEND_URL;
          const response = await fetch(`${backendUrl}/listings/admin/approve/${id}/?admin_user_id=500`, {
              method: 'POST'
          });
          const data = await response.json();

          
          if (response.ok) {
              toast.success("Listing Approved & Charged!", { description: "Subscription created successfully." });
              fetchListings();
          } else {
              toast.error("Approval Failed", { description: data.error || "Could not approve listing." });
          }
      } catch (err) {
          toast.error("Error", { description: "Network error occurred." });
      } finally {
          setProcessingId(null);
      }
  };

  const handleRequestChanges = async () => {
      if (!actionListingId || !feedbackText) return;
      try {
          const backendUrl = import.meta.env.VITE_BACKEND_URL;
          const response = await fetch(`${backendUrl}/listings/admin/request-changes/${actionListingId}/?admin_user_id=500`, {
              method: 'POST',
              body: JSON.stringify({ feedback: feedbackText })
          });

          
          if (response.ok) {
              toast.success("Changes Requested", { description: "Feedback sent to landlord." });
              setFeedbackModalOpen(false);
              setFeedbackText("");
              fetchListings();
          } else {
              toast.error("Failed");
          }
      } catch (err) {
          toast.error("Error sending feedback");
      }
  };

  const openFeedbackModal = (id: number) => {
      setActionListingId(id);
      setFeedbackText("");
      setFeedbackModalOpen(true);
  };


  const [searchParams] = useSearchParams();
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<{id: number, title: string} | null>(null);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("Listing is now Public!", {
        description: "Your subscription is active and the listing is visible to everyone."
      });
    } else if (searchParams.get("canceled") === "true") {
      toast.error("Subscription canceled", {
        description: "No charges were made. Listing remains private."
      });
    }
  }, [searchParams]);

  const handleMakePublic = (listing: typeof listings[0]) => {
    setSelectedListing({ id: listing.id, title: listing.title });
    setSubscriptionModalOpen(true);
  };

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'id', direction: 'asc' });

  const stats = [
    { label: "Total Listings", value: "1,248", icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active", value: "1,180", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    { label: "Pending", value: "48", icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Reported", value: "20", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
  ];

  const filteredAndSortedListings = useMemo(() => {
    let result = [...listings];

    // Filter by search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(listing => 
        (listing.title?.toLowerCase() || "").includes(q) || 
        (listing.address?.toLowerCase() || "").includes(q) || 
        (listing.contact_name?.toLowerCase() || "").includes(q) ||
        String(listing.id).includes(q)
      );
    }

    if (!sortConfig) return result;

    return result.sort((a, b) => {
      let aValue: any = a[sortConfig.key as keyof typeof a];
      let bValue: any = b[sortConfig.key as keyof typeof b];


      // Special handling for price (remove $ and ,)
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

  const SortableHeader = ({ label, sortKey }: { label: string; sortKey: string }) => {
    const isActive = sortConfig?.key === sortKey;
    return (
      <TableHead 
        className="px-6 cursor-pointer hover:text-stone-900 text-stone-500 transition-colors group"
        onClick={() => requestSort(sortKey)}
      >
        <div className="flex items-center gap-1.5">
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
      title="Listings Management"
      action={
        <button className="group relative border-2 border-orange-500 text-orange-600 font-bold py-2 px-6 rounded-xl overflow-hidden transition-all duration-300 hover:text-white hover:scale-105 active:scale-95 cursor-pointer">
          <span className="relative z-10 font-display text-[11px] uppercase tracking-wider flex items-center gap-2">
            <Plus size={16} />
            Add New Listing
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
                  placeholder="Search listings by ID, title, address, or owner..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-white border-stone-200 focus:border-orange-500 focus:ring-0 transition-all rounded-md text-base shadow-sm"
                />

              </div>
              <div className="flex items-center bg-stone-100/80 p-1 rounded-md border border-stone-200">
                 <button 
                    onClick={() => setActiveTab('all')}
                    className={`${activeTab === 'all' ? 'bg-white text-stone-900 shadow-sm border-stone-200/50' : 'text-stone-500 hover:text-stone-900 border-transparent'} px-6 py-2 rounded-[4px] border font-display text-[10px] font-bold uppercase tracking-wider transition-all`}
                 >
                    All Listings
                 </button>
                 <button 
                    onClick={() => setActiveTab('active')}
                    className={`${activeTab === 'active' ? 'bg-white text-stone-900 shadow-sm border-stone-200/50' : 'text-stone-500 hover:text-stone-900 border-transparent'} px-6 py-2 rounded-[4px] border font-display text-[10px] font-bold uppercase tracking-wider transition-all`}
                 >
                    Active
                 </button>
                 <button 
                    onClick={() => setActiveTab('pending')}
                    className={`${activeTab === 'pending' ? 'bg-white text-stone-900 shadow-sm border-stone-200/50' : 'text-stone-500 hover:text-stone-900 border-transparent'} px-6 py-2 rounded-[4px] border font-display text-[10px] font-bold uppercase tracking-wider transition-all`}
                 >
                    Pending
                 </button>
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
                  <SortableHeader label="Owner" sortKey="owner" />
                  <SortableHeader label="Status" sortKey="status" />
                  <TableHead className="text-right px-6 text-[10px] font-display font-bold uppercase tracking-[0.2em] text-stone-500">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedListings.map((listing) => (
                  <TableRow key={listing.id} className="group hover:bg-stone-50/50 transition-colors border-stone-50">

                    <TableCell className="font-mono text-xs text-stone-400 px-6">#{listing.id}</TableCell>
                    <TableCell className="px-6">
                      <div className="flex items-center gap-4 py-2">
                        <div className="w-16 h-10 rounded-lg overflow-hidden border border-stone-100 shrink-0 bg-stone-100">
                           <img src={listing.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-stone-900 truncate max-w-[200px]">{listing.title}</p>
                          <p className="text-xs text-stone-500 truncate max-w-[200px]">{listing.address}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6">
                       <span className="font-display text-xs font-bold text-stone-700">{listing.price}</span>
                       <span className="text-[10px] text-stone-400 block">/month</span>
                    </TableCell>
                    <TableCell className="px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-[10px] font-bold text-stone-600 uppercase">
                          {listing.contact_name?.[0]}
                        </div>
                        <span className="text-sm font-medium text-stone-600">{listing.contact_name}</span>
                      </div>
                    </TableCell>
                        <Badge variant={listing.status?.toLowerCase() === 'approved' || listing.status?.toLowerCase() === 'active' ? "default" : "outline"} className={
                          listing.status?.toLowerCase() === 'approved' || listing.status?.toLowerCase() === 'active' 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100 font-bold px-3 py-1" 
                          : listing.status?.toLowerCase() === 'pending' 
                          ? "bg-amber-50 text-amber-700 border-amber-100 font-bold px-3 py-1"
                          : listing.status?.toLowerCase() === 'draft'
                          ? "bg-stone-100 text-stone-600 border-stone-200 font-bold px-3 py-1"
                          : "bg-red-50 text-red-700 border-red-100 font-bold px-3 py-1"
                        }>
                          {listing.status}
                        </Badge>

                    <TableCell className="text-right px-6">
                      <div className="flex justify-end gap-1 items-center">
                          {listing.status?.toLowerCase() === 'draft' && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-stone-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all" 
                              title="Make Public"
                              onClick={() => handleMakePublic(listing)}
                            >
                              <Rocket size={16} />
                            </Button>
                          )}

                        <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-all" title="View">
                          <Eye size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                          <Trash2 size={16} />
                        </Button>
                        
                        {(listing.status?.toLowerCase() === 'pending' || listing.status?.toLowerCase() === 'draft' || listing.status?.toLowerCase() === 'changes_requested') && (
                          <div className="flex items-center gap-1 ml-2">
                               {/* Approve Button - Only if payment info is on file & pending */}
                               {listing.status?.toLowerCase() === 'pending' && (
                                 <Button 
                                    size="sm" 
                                    onClick={() => handleApprove(listing.id)}
                                    disabled={processingId === listing.id}
                                    className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800 h-8 text-[10px] font-bold uppercase tracking-wider"
                                 >
                                    {processingId === listing.id ? <Loader2 size={14} className="animate-spin" /> : 'Approve'}
                                 </Button>
                               )}
                               
                               {/* Request Changes - Available for both draft and pending */}
                               <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => openFeedbackModal(listing.id)}
                                  className="border-stone-200 text-stone-600 hover:bg-stone-50 h-8 text-[10px] font-bold uppercase tracking-wider"
                               >
                                  Edits
                               </Button>
                          </div>
                        )}


                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <div className="p-6 border-t border-stone-100 bg-stone-50/20">
             <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[10px] text-stone-400 font-display font-bold uppercase tracking-[0.2em]">Showing {listings.length} of 1,248 listings</p>
                <div className="flex items-center gap-2">
                   <Button variant="outline" size="sm" className="bg-white border-stone-200 rounded-lg font-bold text-stone-600 hover:bg-stone-50">Previous</Button>
                   <Button variant="outline" size="sm" className="bg-white border-stone-200 rounded-lg font-bold text-stone-600 hover:bg-stone-50">Next</Button>
                </div>
             </div>
          </div>
        </Card>
      </div>

      <SubscriptionModal 
        isOpen={subscriptionModalOpen}
        onClose={() => setSubscriptionModalOpen(false)}
        listingId={selectedListing?.id || ""}
        listingTitle={selectedListing?.title || ""}
        userId="1"
      />
      
      {/* Feedback Modal (Simple Dialog) */}
      {feedbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-md bg-white shadow-xl border-0">
                <CardHeader>
                    <h3 className="font-serif text-xl font-bold">Request Changes</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-stone-500">Please describe what changes are needed before this listing can be approved.</p>
                    <textarea 
                        className="w-full p-3 border border-stone-200 rounded-lg text-sm min-h-[100px] focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        placeholder="e.g. Please update photos, address is incomplete..."
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setFeedbackModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleRequestChanges} className="bg-orange-500 hover:bg-orange-600 text-white font-bold">Send Request</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      )}


    </AdminLayout>
  );
}
