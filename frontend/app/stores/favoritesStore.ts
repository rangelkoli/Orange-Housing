import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Listing } from "../types/listing";

interface FavoritesState {
    favorites: Listing[];
    addFavorite: (listing: Listing) => void;
    removeFavorite: (listingId: number) => void;
    toggleFavorite: (listing: Listing) => void;
    isFavorite: (listingId: number) => boolean;
    clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            favorites: [],

            addFavorite: (listing: Listing) => {
                const { favorites } = get();
                if (!favorites.find((fav) => fav.id === listing.id)) {
                    set({ favorites: [...favorites, listing] });
                }
            },

            removeFavorite: (listingId: number) => {
                const { favorites } = get();
                set({ favorites: favorites.filter((fav) => fav.id !== listingId) });
            },

            toggleFavorite: (listing: Listing) => {
                const { favorites, addFavorite, removeFavorite } = get();
                const isFav = favorites.some((fav) => fav.id === listing.id);
                if (isFav) {
                    removeFavorite(listing.id);
                } else {
                    addFavorite(listing);
                }
            },

            isFavorite: (listingId: number) => {
                const { favorites } = get();
                return favorites.some((fav) => fav.id === listingId);
            },

            clearFavorites: () => {
                set({ favorites: [] });
            },
        }),
        {
            name: "orange-housing-favorites",
        }
    )
);
