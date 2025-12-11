import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LandlordUser {
    id: number;
    email: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    createdAt?: string;
}

interface AuthState {
    user: LandlordUser | null;
    isAuthenticated: boolean;
    login: (user: LandlordUser) => void;
    logout: () => void;
    updateUser: (user: Partial<LandlordUser>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,

            login: (user: LandlordUser) => {
                set({ user, isAuthenticated: true });
            },

            logout: () => {
                set({ user: null, isAuthenticated: false });
                // Also clear any legacy localStorage user data
                if (typeof window !== "undefined") {
                    localStorage.removeItem("user");
                }
            },

            updateUser: (userData: Partial<LandlordUser>) => {
                const { user } = get();
                if (user) {
                    set({ user: { ...user, ...userData } });
                }
            },
        }),
        {
            name: "orange-housing-landlord-auth",
        }
    )
);

// Helper hook for checking auth status
export const useIsAuthenticated = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return isAuthenticated;
};

// Helper hook for getting user
export const useUser = () => {
    const user = useAuthStore((state) => state.user);
    return user;
};
