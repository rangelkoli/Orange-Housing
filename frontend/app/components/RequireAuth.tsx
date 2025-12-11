import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuthStore } from "../stores/authStore";
import { Shield, ArrowRight } from "lucide-react";

interface RequireAuthProps {
    children: React.ReactNode;
    redirectTo?: string;
}

/**
 * RequireAuth component protects routes that require landlord authentication.
 * If the user is not authenticated, they will be redirected to the login page.
 * 
 * Usage:
 * ```tsx
 * <RequireAuth>
 *   <ProtectedComponent />
 * </RequireAuth>
 * ```
 */
export function RequireAuth({ children, redirectTo = "/landlord/login" }: RequireAuthProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Small delay to allow hydration of persisted state
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            // Store the attempted URL to redirect back after login
            const returnUrl = encodeURIComponent(location.pathname + location.search);
            navigate(`${redirectTo}?returnUrl=${returnUrl}`, { replace: true });
        }
    }, [isLoading, isAuthenticated, navigate, redirectTo, location]);

    // Show loading state while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-stone-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    // Show unauthorized message briefly before redirect
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-8 h-8 text-orange-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">Authentication Required</h2>
                    <p className="text-stone-500 mb-6">
                        You need to be logged in as a landlord to access this page.
                    </p>
                    <button
                        onClick={() => navigate(redirectTo)}
                        className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 w-full"
                    >
                        Go to Login
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        );
    }

    // User is authenticated, render children
    return <>{children}</>;
}

export default RequireAuth;
