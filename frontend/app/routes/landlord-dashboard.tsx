import { useAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router";
import { 
  Plus, 
  Search, 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  Edit2,
  Eye,
  Share2,
  RefreshCw,
  Loader2,
  Rocket
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import { ShareModal } from "../components/ShareModal";
import SubscriptionModal from "../components/SubscriptionModal";
import SubscriptionDetailsModal from "../components/SubscriptionDetailsModal";
import { getListingDetailUrl } from "../utils/listingSlug";

import { Card, CardContent, CardHeader } from "../components/ui/card";

import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../components/ui/table";

import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "../components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, ChevronDown } from "lucide-react";


export default function LandlordDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const userName = user?.firstName || user?.username || user?.email?.split('@')[0] || 'User';

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false); 
  const [selectedListing, setSelectedListing] = useState<{ id: string | number; title: string } | null>(null);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'title', direction: 'asc' });

  // Define fetchListings first so it can be used in effects
  const fetchListings = async () => {
    if (!user?.id) return;
    try {
        setLoading(true);
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${backendUrl}/listings/landlord/?user_id=${user.id}`);
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
            throw new Error(data.error || "Failed to fetch listings");
        }
        setListings(data.listings);
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (user?.id) {
        fetchListings();
    }
  }, [user?.id]);

  // Handle Stripe Redirection Success/Cancel
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("Listing Activated!", {
        description: "Your subscription is now active. It may take a few moments for the status to update."
      });
      
      setSelectedIds([]); 

      // Refresh listings immediately
      if (user?.id) {
          // Manually sync first to catch any webhook misses
           const syncAndRefresh = async () => {
              try {
                  const backendUrl = import.meta.env.VITE_BACKEND_URL;
                  await fetch(`${backendUrl}/payments/sync-subscriptions/`, {
                      method: 'POST',
                      headers: {'Content-Type': 'application/json'},
                      body: JSON.stringify({ user_id: user.id })
                  });
              } catch (e) {
                  // Silent fail on sync
              }
              await fetchListings();
           };
           syncAndRefresh();
           
           // Double check after delay
           setTimeout(() => fetchListings(), 2000);
      }

      
      // Clean URL
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("success");
      newParams.delete("session_id");
      navigate({ search: newParams.toString() }, { replace: true });
      
    } else if (searchParams.get("canceled") === "true") {
       toast.error("Subscription Canceled", {
           description: "No charges were made."
       });
       const newParams = new URLSearchParams(searchParams);
       newParams.delete("canceled");
       navigate({ search: newParams.toString() }, { replace: true });
    }
  }, [searchParams, navigate, user?.id]);

  const handleSubscribeClick = (listing: any) => {
    setSelectedListing({ id: listing.id, title: listing.title });
    setSubscriptionModalOpen(true);
  };
  
  const handleBulkSubscribe = () => {
    setSelectedListing(null);
    setSubscriptionModalOpen(true);
  };

  const handleShareClick = (listing: any) => {
    setSelectedListing({ id: listing.id, title: listing.title });
    setShareModalOpen(true);
  };
  
  const handleManageClick = (listing: any) => {
      setSelectedListing({ id: listing.id, title: listing.title });
      setDetailsModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setShareModalOpen(false);
    setSelectedListing(null);
  };

  const handleCloseSubscriptionModal = () => {
    setSubscriptionModalOpen(false);
    setSelectedListing(null);
  };

  const stats = useMemo(() => [
    { label: "Total Listings", value: listings.length, icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Approved", value: listings.filter(l => l.status === 'approved' || !l.status).length, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    { label: "Pending", value: listings.filter(l => l.status === 'pending').length, icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
  ], [listings]);

  const filteredAndSortedListings = useMemo(() => {
    let result = [...listings];

    if (searchQuery) {
        result = result.filter(l => 
            (l.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) || 
            (l.address?.toLowerCase() || "").includes(searchQuery.toLowerCase())
        );
    }

    if (sortConfig) {
        result.sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (sortConfig.key === 'price') {
                aValue = parseFloat(String(aValue).replace(/[$,]/g, ''));
                bValue = parseFloat(String(bValue).replace(/[$,]/g, ''));
            }

            if ((aValue || "") < (bValue || "")) return sortConfig.direction === 'asc' ? -1 : 1;
            if ((aValue || "") > (bValue || "")) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    return result;
  }, [listings, searchQuery, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
        // Select all currently filtered listings that are NOT public
        const idsToAdd = filteredAndSortedListings
            .filter(l => !l.is_public)
            .map(l => String(l.id));
        setSelectedIds(idsToAdd);
    } else {
        setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
     if (checked) {
         setSelectedIds(prev => [...prev, id]);
     } else {
         setSelectedIds(prev => prev.filter(i => i !== id));
     }
  };


  const SortableHeader = ({ label, sortKey, className = "" }: { label: string; sortKey: string; className?: string }) => {
    const isActive = sortConfig?.key === sortKey;
    return (
      <TableHead 
        className={`px-6 cursor-pointer hover:text-stone-900 text-stone-500 transition-colors group ${className}`}
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
    <div className="h-full overflow-y-auto w-full bg-[#fbfbfb]">
        <div className="p-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-serif font-bold text-stone-900">Dashboard</h1>
              <p className="text-stone-500 mt-2">Welcome back, <span className="text-stone-900 font-semibold">{userName}</span>! Here's a summary of your properties.</p>

            </div>
            
            <div className="flex gap-3">
                 <button 
                    onClick={async () => {
                        setLoading(true);
                        try {
                            const backendUrl = import.meta.env.VITE_BACKEND_URL;
                            await fetch(`${backendUrl}/payments/sync-subscriptions/`, {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify({ user_id: user?.id })
                            });
                            await fetchListings();
                            toast.success("Listings Synced", { description: "Verified subscription status with Stripe." });
                        } catch(e) {
                            toast.error("Sync Failed");
                        } finally {
                            setLoading(false);
                        }
                    }}
                    className="h-[46px] w-[46px] flex items-center justify-center border border-stone-200 text-stone-400 bg-white hover:text-orange-500 hover:border-orange-200 rounded-xl transition-all shadow-sm"
                    title="Sync Subscription Status"
                 >
                    <RefreshCw size={20} />
                 </button>

                {selectedIds.length > 0 && (

                     <button 
                        onClick={handleBulkSubscribe}
                        className="group relative border-2 border-orange-500 bg-orange-500 text-white font-bold py-2.5 px-6 rounded-xl overflow-hidden transition-all duration-300 hover:bg-orange-600 hover:border-orange-600 hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
                    >
                        <span className="relative z-10 font-display text-[11px] uppercase tracking-wider flex items-center gap-2">
                            <Rocket size={16} />
                            Subscribe ({selectedIds.length})
                        </span>
                    </button>
                )}
            
                <button 
                    onClick={() => navigate('/landlord/create-listing')}
                    className="group relative border-2 border-orange-500 text-orange-600 font-bold py-2.5 px-8 rounded-xl overflow-hidden transition-all duration-300 hover:text-white hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
                >
                    <span className="relative z-10 font-display text-[11px] uppercase tracking-wider flex items-center gap-2">
                        <Plus size={16} />
                        Add New Listing
                    </span>
                    <div className="absolute inset-0 bg-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
                <Card key={i} className="border-stone-100 shadow-sm transition-all hover:border-stone-200 group">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-display font-bold text-stone-500 uppercase tracking-[0.2em]">{stat.label}</p>
                                <h3 className="text-3xl font-serif font-bold text-stone-900 mt-1">{stat.value}</h3>
                            </div>
                            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-transform duration-500 group-hover:scale-110`}>
                                <stat.icon size={28} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm text-red-800 font-medium">Error loading listings</p>
                    <p className="text-xs text-red-700">{error}</p>
                </div>
            </div>
          )}

          {/* Table Card */}
          <Card className="border-stone-100 shadow-sm overflow-hidden pb-0">
            <CardHeader className="border-b border-stone-100 bg-white/50 backdrop-blur-sm px-4 py-0 m-0">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 py-4">
                    <div className="relative flex-1 max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                        <Input 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search your listings by title or address..." 
                            className="pl-12 h-12 bg-white border-stone-200 focus:border-orange-500 focus:ring-0 transition-all rounded-md text-base shadow-sm"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
                <Table>
                    <TableHeader className="bg-stone-50/50">
                        <TableRow className="hover:bg-transparent border-stone-100">
                            <TableHead className="w-[50px] px-6">
                                <Checkbox 
                                    checked={
                                        filteredAndSortedListings.some(l => !l.is_public) && 
                                        filteredAndSortedListings.filter(l => !l.is_public).every(l => selectedIds.includes(String(l.id)))
                                    }
                                    onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                                />
                            </TableHead>
                            <SortableHeader label="Property" sortKey="title" />

                            <TableHead className="px-6 text-[10px] font-display font-bold uppercase tracking-[0.2em] text-stone-500">Location</TableHead>
                            <SortableHeader label="Rent" sortKey="price" />
                            <SortableHeader label="Status" sortKey="status" />
                            <TableHead className="text-right px-6 text-[10px] font-display font-bold uppercase tracking-[0.2em] text-stone-500"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center text-stone-400">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                                        <p className="font-medium">Loading your portfolio...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredAndSortedListings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center text-stone-400 font-medium">
                                    No listings found matching your search.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAndSortedListings.map((listing: any) => (
                                <TableRow key={listing.id} className="group hover:bg-stone-50/50 transition-colors border-stone-100">
                                    <TableCell className="px-6">
                                        {!listing.is_public && (
                                            <Checkbox 
                                                checked={selectedIds.includes(String(listing.id))}
                                                onCheckedChange={(checked) => handleSelectOne(String(listing.id), checked as boolean)}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <div className="flex items-center gap-4 py-2">
                                            <div className="w-16 h-10 rounded-lg overflow-hidden border border-stone-100 shrink-0 bg-stone-100 shadow-sm">

                                                <img 
                                                    src={listing.images?.[0] || "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=400&auto=format&fit=crop"} 
                                                    alt="" 
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-stone-900 truncate max-w-[250px]">{listing.title}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <p className="text-sm text-stone-600 truncate max-w-[200px]">{listing.address}</p>
                                        <p className="text-[10px] text-stone-400 font-medium uppercase tracking-wider">{listing.city}</p>
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <span className="font-display text-xs font-bold text-stone-700">{listing.price}</span>
                                        <span className="text-[10px] text-stone-400 block uppercase tracking-tighter">/ month</span>
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <Badge variant={listing.status === 'approved' ? "default" : "outline"} className={
                                            listing.status === 'approved'
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-100 font-bold px-3 py-1" 
                                            : listing.status === 'changes_requested'
                                            ? "bg-red-50 text-red-700 border-red-200 font-bold px-3 py-1"
                                            : listing.payment_method_on_file
                                            ? "bg-blue-50 text-blue-700 border-blue-200 font-bold px-3 py-1"
                                            : "bg-amber-50 text-amber-700 border-amber-200 font-bold px-3 py-1"
                                        }>
                                            {listing.status === 'approved' ? 'Active' : 
                                             listing.status === 'changes_requested' ? 'Changes Requested' :
                                             listing.payment_method_on_file ? 'Pending Approval' : 'Draft / Submit'}
                                        </Badge>
                                        
                                        {listing.status === 'changes_requested' && listing.admin_feedback && (
                                            <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100 max-w-[200px]">
                                                <span className="font-bold block mb-1">Feedback:</span>
                                                {listing.admin_feedback}
                                            </div>
                                        )}


                                    </TableCell>
                                    <TableCell className="text-right px-6">
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button 
                                              variant="outline" 
                                              size="sm"
                                              className="h-9 gap-2 px-4 text-stone-600 border-stone-200 hover:text-orange-600 hover:border-orange-200 hover:bg-orange-50/50 rounded-lg transition-all shadow-sm font-medium"
                                            >
                                              Manage 
                                              <ChevronDown size={14} className="text-stone-400 group-hover:text-orange-400 transition-colors" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-stone-200">
                                            <DropdownMenuGroup>
                                              <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-stone-400 px-2 py-1.5 font-bold">Listing Details</DropdownMenuLabel>
                                              <DropdownMenuItem 
                                                onClick={() => navigate(getListingDetailUrl(listing))}
                                                className="flex items-center gap-2 px-2 py-2 cursor-pointer rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                              >
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                  <Eye size={16} />
                                                </div>
                                                <span className="font-medium">View Public Page</span>
                                              </DropdownMenuItem>
                                              <DropdownMenuItem 
                                                onClick={() => navigate(`/landlord/edit-listing/${listing.id}`)}
                                                className="flex items-center gap-2 px-2 py-2 cursor-pointer rounded-lg hover:bg-stone-100 transition-colors"
                                              >
                                                <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center shrink-0">
                                                  <Edit2 size={16} />
                                                </div>
                                                <span className="font-medium">Edit Property</span>
                                              </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                            
                                            <DropdownMenuSeparator className="my-2" />
                                            
                                            <DropdownMenuGroup>
                                              <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-stone-400 px-2 py-1.5 font-bold">Promotion</DropdownMenuLabel>
                                              <DropdownMenuItem 
                                                onClick={() => handleShareClick(listing)}
                                                className="flex items-center gap-2 px-2 py-2 cursor-pointer rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-colors"
                                              >
                                                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                                  <Share2 size={16} />
                                                </div>
                                                <span className="font-medium">Share Listing</span>
                                              </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                            
                                            <DropdownMenuSeparator className="my-2" />
                                            
                                            <DropdownMenuGroup>
                                              <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-stone-400 px-2 py-1.5 font-bold">Management</DropdownMenuLabel>
                                              
                                              {!listing.is_public && listing.status !== 'approved' && (
                                                <DropdownMenuItem 
                                                  onClick={() => handleSubscribeClick(listing)}
                                                  className="flex items-center gap-2 px-2 py-2 cursor-pointer rounded-lg hover:bg-orange-50 hover:text-orange-700 transition-colors"
                                                >
                                                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                                                    <Rocket size={16} />
                                                  </div>
                                                  <span className="font-medium">
                                                    {listing.payment_method_on_file ? 'Payment Info Saved' : 'Submit for Approval'}
                                                  </span>
                                                </DropdownMenuItem>
                                              )}
                                              
                                              {(listing.is_public || listing.stripe_subscription_id) && (
                                                <DropdownMenuItem 
                                                  onClick={() => handleManageClick(listing)}
                                                  className="flex items-center gap-2 px-2 py-2 cursor-pointer rounded-lg hover:bg-green-50 hover:text-green-700 transition-colors"
                                                >
                                                  <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                                                    <Clock size={16} />
                                                  </div>
                                                  <span className="font-medium">Subscription Status</span>
                                                </DropdownMenuItem>
                                              )}
                                              
                                              <DropdownMenuItem 
                                                className="flex items-center gap-2 px-2 py-2 cursor-pointer rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors focus:bg-red-50 focus:text-red-700"
                                              >
                                                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                                                  <Trash2 size={16} />
                                                </div>
                                                <span className="font-medium text-red-600">Archive Listing</span>
                                              </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        </div>

        {/* Share Modal */}
        {selectedListing && (
          <ShareModal
            isOpen={shareModalOpen}
            onClose={handleCloseShareModal}
            listingId={selectedListing.id}
            listingTitle={selectedListing.title}
          />
        )}

        {/* Subscription Modal */}
        {subscriptionModalOpen && (
            <SubscriptionModal 
                isOpen={subscriptionModalOpen} 
                onClose={handleCloseSubscriptionModal}
                userId={user?.id || ""}
                
                // Pass single listing if selectedListing is set, otherwise pass selectedIds mapped to objects
                listings={
                    selectedListing 
                    ? [{ id: selectedListing.id, title: selectedListing.title }]
                    : listings.filter(l => selectedIds.includes(String(l.id))).map(l => ({ id: l.id, title: l.title }))
                }
            />

        )}
        
        {/* Subscription Details Modal */}
        {selectedListing && (
            <SubscriptionDetailsModal
                isOpen={detailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
                listingId={selectedListing.id}
                listingTitle={selectedListing.title}
                userId={user?.id || ""} 
            />
        )}



    </div>
  );
}
