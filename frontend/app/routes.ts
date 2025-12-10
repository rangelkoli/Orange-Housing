import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("listings", "routes/listings.tsx"),
    route("rentals", "routes/rentals.tsx"),
    route("rentals/:slug", "routes/rentals.$slug.tsx"),
    route("sublets", "routes/sublets.tsx"),
    route("sublets/:slug", "routes/sublets.$slug.tsx"),
    route("rooms", "routes/rooms.tsx"),
    route("rooms/:slug", "routes/rooms.$slug.tsx"),
    route("landlord/login", "routes/landlord.login.tsx"),
    route("landlord/signup", "routes/landlord.signup.tsx"),
    route("directory/complex", "routes/directory-complex.tsx"),
    route("directory/business", "routes/directory-business.tsx"),
    route("directory/landlords", "routes/directory-landlords.tsx"),
    route("listings/:id", "routes/listings.$id.tsx"),
    route("blog", "routes/blog.tsx"),
    route("about", "routes/about.tsx"),
    route("contact", "routes/contact.tsx"),
    route("landlord/dashboard", "routes/landlord-dashboard.tsx"),
    route("landlord/create-listing", "routes/landlord-new-listing.tsx"),
    route("compare", "routes/compare.tsx"),
    route("team-syracuse", "routes/team-syracuse.tsx"),
    route("join-team-syracuse", "routes/join-team-syracuse.tsx"),
    route("faqs", "routes/faqs.tsx"),
    route("admin/dashboard", "routes/admin-dashboard.tsx"),
    route("admin/listings", "routes/admin-listings.tsx"),
    route("admin/applications", "routes/admin-applications.tsx"),
    route("admin/blog", "routes/admin-blog.tsx"),
    route("admin/blog/new", "routes/admin-blog-new.tsx"),
] satisfies RouteConfig;


