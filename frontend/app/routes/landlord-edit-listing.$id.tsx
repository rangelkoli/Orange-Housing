import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { ListingForm } from "../components/ListingForm";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "../stores/authStore";

export default function EditListingPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      if (!user?.id) {
        setError("You must be logged in to edit a listing.");
        setLoading(false);
        return;
      }
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api";
        const response = await fetch(`${backendUrl}/listings/edit/${id}/?user_id=${user.id}`); 
        
        if (!response.ok) {
            const errBody = await response.text();
            if (response.status === 403) throw new Error("You do not have permission to edit this listing.");
            if (response.status === 404) throw new Error("Listing not found.");
            throw new Error(`Failed to fetch listing data: ${response.status} ${errBody}`);
        }
        
        const result = await response.json();
        if (result.listing) {
            setData(result.listing);
        } else {
            setData(result);
        }
      } catch (err: any) {
        console.error("Edit fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, user]);

  // Loading State
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F5F7FA]">
        <div className="flex flex-col items-center gap-2 text-stone-500">
             <Loader2 className="animate-spin text-orange-600" size={32} />
             <p>Loading listing details...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
        <div className="flex h-screen items-center justify-center bg-[#F5F7FA]">
          <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-sm border border-stone-200">
             <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">!</span>
             </div>
             <h2 className="text-xl font-bold text-stone-900 mb-2">Unable to Load Listing</h2>
             <p className="text-stone-500 mb-6">{error}</p>
             <button 
                onClick={() => window.history.back()}
                className="text-stone-600 hover:text-stone-900 font-medium underline"
             >
                Go Back
             </button>
          </div>
        </div>
    );
  }

  return <ListingForm initialData={data} />;
}
