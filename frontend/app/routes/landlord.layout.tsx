import { Outlet } from "react-router";
import { LandlordSidebar } from "../components/LandlordSidebar";
import { RequireAuth } from "../components/RequireAuth";

export default function LandlordLayout() {
  // Use RequireAuth here to protect all child routes
  return (
    <RequireAuth requiredRole="landlord">
    <div className="flex min-h-screen bg-[#F5F7FA] font-sans text-stone-900">
        <LandlordSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Outlet />
        </div>
      </div>
    </RequireAuth>
  );
}
