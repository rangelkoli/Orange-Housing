import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Loader2, Calendar, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns"; // Make sure date-fns is installed or use native

interface SubscriptionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: number | string;
  listingTitle: string;
  userId: number | string;
}

export default function SubscriptionDetailsModal({ 
  isOpen, 
  onClose, 
  listingId, 
  listingTitle,
  userId
}: SubscriptionDetailsModalProps) {
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState("");
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    if (isOpen && listingId) {
        fetchDetails();
    }
  }, [isOpen, listingId]);

  const fetchDetails = async () => {
    setLoading(true);
    setError("");
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/payments/subscription-details/?listing_id=${listingId}&user_id=${userId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch subscription details");
        }
        const data = await response.json();
        setDetails(data);
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  const handleCancel = async () => {
      setCanceling(true);
      try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/payments/cancel-subscription/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ listing_id: listingId, user_id: userId })
          });
          
          if (!response.ok) throw new Error("Failed to cancel subscription");
          
          toast.success("Subscription canceled", {
              description: "It will remain active until the end of the current period."
          });
          onClose();
          // Ideally trigger a refresh of the listing status in parent
      } catch (err: any) {
          toast.error("Error cancellation failed", { description: err.message });
      } finally {
          setCanceling(false);
      }
  };

  const formatDate = (timestamp: number) => {
      return new Date(timestamp * 1000).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif font-bold">Subscription Details</DialogTitle>
          <DialogDescription>
            Manage subscription for <span className="font-semibold text-stone-900">{listingTitle}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6">
            {loading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin text-orange-500" />
                </div>
            ) : error ? (
                <div className="bg-red-50 p-4 rounded-xl text-red-600 text-sm flex gap-2 items-center">
                    <AlertTriangle size={16} />
                    {error}
                </div>
            ) : details ? (
                <div className="space-y-4">
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-stone-500">Status</span>
                            <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                                details.cancel_at_period_end 
                                ? "bg-amber-100 text-amber-700" 
                                : details.status === 'active' 
                                ? "bg-emerald-100 text-emerald-700" 
                                : "bg-stone-100 text-stone-600"
                            }`}>
                                {details.cancel_at_period_end ? (
                                    <>
                                        <ClockIcon size={12} />
                                        Canceling
                                    </>
                                ) : details.status === 'active' ? (
                                    <>
                                        <CheckCircle size={12} />
                                        Active
                                    </>
                                ) : (
                                    <>
                                        <XCircle size={12} />
                                        {details.status}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-stone-500">
                                {details.cancel_at_period_end ? "Expires on" : "Renews on"}
                            </span>
                            <span className="text-stone-900 font-bold flex items-center gap-2">
                                <Calendar size={14} className="text-stone-400" />
                                {formatDate(details.current_period_end)}
                            </span>
                        </div>
                    </div>
                    
                    {!details.cancel_at_period_end && (
                        <p className="text-xs text-stone-500 px-2 italic">
                            Your subscription usually renews automatically. If you cancel, your listing will remain public until the expiration date.
                        </p>
                    )}
                </div>
            ) : null}
        </div>

        <DialogFooter className="sm:justify-between gap-2">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                Close
            </Button>
            {details && !details.cancel_at_period_end && (
                <Button 
                    variant="destructive" 
                    onClick={handleCancel} 
                    disabled={canceling}
                    className="w-full sm:w-auto bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200"
                >
                    {canceling ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Canceling...
                        </>
                    ) : (
                        "Cancel Subscription"
                    )}
                </Button>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ClockIcon({ size, className }: { size?: number, className?: string }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={size || 24} 
            height={size || 24} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
        </svg>
    );
}
