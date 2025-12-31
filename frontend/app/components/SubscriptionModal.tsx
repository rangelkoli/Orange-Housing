import { useState, useEffect, useMemo } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Rocket, Loader2, Sparkles, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "./ui/switch";

interface ListingItem {
    id: number | string;
    title: string;
}

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Single mode
  listingId?: number | string;
  listingTitle?: string;
  // Bulk mode
  listings?: ListingItem[];
  
  userId: number | string;
}

type SubscriptionType = 'standard' | 'featured';

export default function SubscriptionModal({ 
  isOpen, 
  onClose, 
  listingId, 
  listingTitle,
  listings,
  userId,
}: SubscriptionModalProps) {
  const [loading, setLoading] = useState(false);
  const [types, setTypes] = useState<Record<string, SubscriptionType>>({});
  const [socialMedia, setSocialMedia] = useState<Record<string, boolean>>({});

  // Normalize input to array
  const items: ListingItem[] = useMemo(() => {
    if (listings && listings.length > 0) return listings;
    if (listingId && listingTitle) return [{ id: listingId, title: listingTitle }];
    return [];
  }, [listings, listingId, listingTitle]);

  // Reset/Init types when opening
  useEffect(() => {
    if (isOpen && items.length > 0) {
        const initialTypes: Record<string, SubscriptionType> = {};
        const initialSocial: Record<string, boolean> = {};
        items.forEach(item => {
            initialTypes[String(item.id)] = 'standard';
            initialSocial[String(item.id)] = false;
        });
        setTypes(initialTypes);
        setSocialMedia(initialSocial);
    }
  }, [isOpen, items]);

  const toggleType = (id: string | number) => {
      const idStr = String(id);
      setTypes(prev => ({
          ...prev,
          [idStr]: prev[idStr] === 'featured' ? 'standard' : 'featured'
      }));
  };

  const total = items.reduce((sum, item) => {
      const type = types[String(item.id)] || 'standard';
      const hasSocial = socialMedia[String(item.id)] || false;
      let cost = type === 'featured' ? 300 : 10;
      if (hasSocial) cost += 10;
      return sum + cost;
  }, 0);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const payloadItems = items.map(item => ({
          listing_id: item.id,
          type: types[String(item.id)] || 'standard',
          social_media: socialMedia[String(item.id)] || false
      }));

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/payments/create-checkout-session/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          items: payloadItems,
          user_id: userId
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to create checkout session");
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }

    } catch (error: any) {
      console.error("Subscription error:", error);
      toast.error(error.message || "Failed to start subscription. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Rocket className="text-orange-600" size={24} />
          </div>
          <DialogTitle className="text-center text-xl font-serif font-bold">
              {items.length > 1 ? `Activate ${items.length} Listings` : "Make your listing Public"}
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Select your plan for each listing to maximize visibility.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 space-y-4">
            
          {/* List of items */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {items.map(item => {
                  const isFeatured = types[String(item.id)] === 'featured';
                  return (
                    <div key={item.id} className={`p-4 rounded-xl border transition-all ${isFeatured ? 'bg-amber-50 border-amber-200' : 'bg-stone-50 border-stone-100'}`}>
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                                <h4 className="font-bold text-stone-900 truncate">{item.title}</h4>
                                <div className="mt-2 text-sm text-stone-600 flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <span className={isFeatured ? "text-stone-400" : "font-bold text-green-700"}>Standard ($10/mo)</span>
                                        <Switch 
                                            checked={isFeatured}
                                            onCheckedChange={() => toggleType(item.id)}
                                            className="data-[state=checked]:bg-amber-500"
                                        />
                                        <span className={isFeatured ? "font-bold text-amber-700" : "text-stone-400"}>Featured ($300/mo)</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block text-xl font-bold text-stone-900">${isFeatured ? '300' : '10'}</span>
                                <span className="text-xs text-stone-500">/mo</span>
                            </div>
                        </div>
                        {isFeatured && (
                            <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-amber-700">
                                <Sparkles size={12} />
                                <span>Includes Homepage Spotlight & Top Search Placement</span>
                            </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                                    <Share2 size={14} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-stone-800">Social Media Promotion</p>
                                    <p className="text-[10px] text-stone-500">Auto-post to Instagram & Facebook</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-stone-700">+$10/mo</span>
                                <Switch 
                                    checked={socialMedia[String(item.id)]}
                                    onCheckedChange={(checked) => setSocialMedia(prev => ({ ...prev, [String(item.id)]: checked }))}
                                    className="data-[state=checked]:bg-blue-500 shadow-sm"
                                />
                            </div>
                        </div>
                    </div>
                  );
              })}
          </div>

          <div className="bg-white p-4 rounded-xl border-t-2 border-stone-100 flex justify-between items-center">
             <span className="text-lg font-medium text-stone-600">Total Monthly</span>
             <span className="text-3xl font-bold text-stone-900">${total}<span className="text-sm font-normal text-stone-500">.00</span></span>
          </div>

          <p className="text-xs text-center text-stone-400 px-4">
            Secure payment processing by Stripe. Your subscription will renew automatically.
          </p>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button 
            onClick={handleSubscribe} 
            disabled={loading}
            className="w-full sm:w-auto min-w-[200px] bg-orange-600 hover:bg-orange-700 text-white font-bold h-11 rounded-xl shadow-lg shadow-orange-200 transition-all hover:scale-105 active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Subscribe for $${total}/mo`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
