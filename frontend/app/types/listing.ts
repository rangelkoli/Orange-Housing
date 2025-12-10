export interface Listing {
    id: number;
    title: string;
    price: string;
    beds: number;
    baths: number;
    address: string;
    city: string;
    images: string[];
    availableDate: string;
    typeCode?: number;  // 1 = rentals, 2 = sublets, 3 = rooms
    location?: string;
}

