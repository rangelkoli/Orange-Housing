import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, Link2, QrCode, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string | number;
  listingTitle: string;
}

export function ShareModal({ isOpen, onClose, listingId, listingTitle }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"link" | "qr">("link");
  
  // Generate the full URL for the listing
  const listingUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/listings/${listingId}`
    : `/listings/${listingId}`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(listingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-orange-500" />
            Share Listing
          </DialogTitle>
          <DialogDescription>
            Share "{listingTitle}" with others
          </DialogDescription>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex gap-2 p-1 bg-stone-100 rounded-lg">
          <button
            onClick={() => setActiveTab("link")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "link"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            <Link2 size={16} />
            Copy Link
          </button>
          <button
            onClick={() => setActiveTab("qr")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "qr"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            <QrCode size={16} />
            QR Code
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === "link" ? (
            <div className="space-y-4">
              {/* URL Display */}
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg overflow-hidden">
                  <Link2 className="w-4 h-4 text-stone-400 flex-shrink-0" />
                  <span className="text-sm text-stone-700 truncate">
                    {listingUrl}
                  </span>
                </div>
              </div>
              
              {/* Copy Button */}
              <button
                onClick={handleCopyUrl}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
              >
                {copied ? (
                  <>
                    <Check size={18} />
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copy URL
                  </>
                )}
              </button>
              
              {/* Additional sharing info */}
              <p className="text-xs text-stone-500 text-center">
                Anyone with this link can view your listing
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* QR Code Display */}
              <div className="flex flex-col items-center justify-center p-6 bg-white border border-stone-200 rounded-xl">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-stone-100">
                  <QRCodeSVG
                    value={listingUrl}
                    size={180}
                    level="H"
                    includeMargin={false}
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>
                <p className="mt-4 text-sm text-stone-600 font-medium">
                  Scan to view listing
                </p>
              </div>
              
              {/* URL below QR */}
              <div className="flex items-center gap-2 px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg">
                <Link2 className="w-4 h-4 text-stone-400 flex-shrink-0" />
                <span className="text-xs text-stone-500 truncate flex-1">
                  {listingUrl}
                </span>
                <button
                  onClick={handleCopyUrl}
                  className="flex-shrink-0 p-1.5 text-stone-400 hover:text-orange-500 hover:bg-orange-50 rounded transition-colors"
                  title="Copy URL"
                >
                  {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                </button>
              </div>
              
              <p className="text-xs text-stone-500 text-center">
                Download or screenshot the QR code to share
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
