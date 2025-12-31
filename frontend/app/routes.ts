import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),

    // Consolidated listings route with type parameter
    route("listings", "routes/listings.tsx"),

    // Detail page routes (keep for SEO-friendly URLs)
    route("rentals/:slug", "routes/rentals.$slug.tsx"),
    route("sublets/:slug", "routes/sublets.$slug.tsx"),
    route("rooms/:slug", "routes/rooms.$slug.tsx"),

    // Redirect old list routes to new consolidated listings
    route("rentals", "routes/redirect-rentals.tsx"),
    route("sublets", "routes/redirect-sublets.tsx"),
    route("rooms", "routes/redirect-rooms.tsx"),
    route("short-term", "routes/redirect-short-term.tsx"),

    // Landlord Auth
    route("landlord/login", "routes/landlord.login.tsx"),
    route("landlord/signup", "routes/landlord.signup.tsx"),

    // Landlord Authenticated Routes (with Sidebar Layout)
    layout("routes/landlord.layout.tsx", [
        route("landlord/dashboard", "routes/landlord-dashboard.tsx"),
        route("landlord/create-listing", "routes/landlord-new-listing.tsx"),
        route("landlord/settings", "routes/landlord.settings.tsx"),
        route("landlord/change-password", "routes/landlord.change-password.tsx"),
        route("landlord/edit-listing/:id", "routes/landlord-edit-listing.$id.tsx"),
        route("landlord/billing", "routes/landlord.billing.tsx"),
        route("landlord/help", "routes/landlord.help.tsx"),
    ]),

    // Legacy directory routes
    route("directory/complex", "routes/directory-complex.tsx"),
    route("directory/business", "routes/directory-business.tsx"),
    // New directory routes
    route("directory/apartment-complexes", "routes/directory.apartment-complexes.tsx"),
    route("directory/landlords", "routes/directory.landlords.tsx"),
    route("directory/property-managers", "routes/directory.property-managers.tsx"),
    route("directory/local-businesses", "routes/directory.local-businesses.tsx"),
    route("directory/local-businesses/add", "routes/directory.local-businesses.add.tsx"),
    route("directory/nonprofits", "routes/directory.nonprofits.tsx"),
    route("directory/team-syracuse", "routes/directory.team-syracuse.tsx"),

    route("blog", "routes/blog.tsx"),
    route("about", "routes/about.tsx"),
    route("contact", "routes/contact.tsx"),

    route("compare", "routes/compare.tsx"),
    route("favorites", "routes/favorites.tsx"),
    route("team-syracuse", "routes/team-syracuse.tsx"),
    route("join-team-syracuse", "routes/join-team-syracuse.tsx"),
    route("faqs", "routes/faqs.tsx"),

    // Admin routes
    route("admin/dashboard", "routes/admin-dashboard.tsx"),
    route("admin/listings", "routes/admin-listings.tsx"),
    route("admin/users", "routes/admin-users.tsx"),
    route("admin/users/:userId/listings", "routes/admin-user-listings.$userId.tsx"),
    route("admin/applications", "routes/admin-applications.tsx"),
    route("admin/blog", "routes/admin-blog.tsx"),
    route("admin/blog/new", "routes/admin-blog-new.tsx"),
] satisfies RouteConfig;
