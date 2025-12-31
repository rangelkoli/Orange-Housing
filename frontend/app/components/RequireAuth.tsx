import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuthStore } from "../stores/authStore";
import type { UserRole } from "../stores/authStore";
import { Shield, ArrowRight, AlertCircle } from "lucide-react";

interface RequireAuthProps {
    children: React.ReactNode;
    redirectTo?: string;
    requiredRole?: UserRole | UserRole[];
}

/**
 * RequireAuth component protects routes that require authentication.
 * If the user is not authenticated, they will be redirected to the login page.
 * If a requiredRole is specified, only users with that role can access the route.
 * 
 * Usage:
 * ```tsx
 * <RequireAuth requiredRole="landlord">
 *   <LandlordComponent />
 * </RequireAuth>
 * 
 * <RequireAuth requiredRole="admin">
 *   <AdminComponent />
 * </RequireAuth>
 * ```
 */
export function RequireAuth({ children, redirectTo = "/landlord/login", requiredRole }: RequireAuthProps) {
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

    // Check if user has the required role
    const hasRequiredRole = () => {
        if (!requiredRole || !user?.role) return true;
        
        if (Array.isArray(requiredRole)) {
            return requiredRole.includes(user.role);
        }
        return user.role === requiredRole;
    };

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
                        You need to be logged in to access this page.
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

    // Check role-based access
    if (!hasRequiredRole()) {
        const getRedirectPath = () => {
            if (user?.role === 'admin') return '/admin/dashboard';
            if (user?.role === 'landlord') return '/landlord/dashboard';
            return '/';
        };

        return (
            <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">Access Denied</h2>
                    <p className="text-stone-500 mb-6">
                        You don't have permission to access this page. 
                        {requiredRole && (
                            <span className="block mt-2">
                                This page requires <strong>{Array.isArray(requiredRole) ? requiredRole.join(' or ') : requiredRole}</strong> access.
                            </span>
                        )}
                    </p>
                    <button
                        onClick={() => navigate(getRedirectPath())}
                        className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 w-full"
                    >
                        Go to Your Dashboard
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        );
    }

    // User is authenticated and has required role, render children
    return <>{children}</>;
}

export default RequireAuth;

