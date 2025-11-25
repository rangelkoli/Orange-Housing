import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("listings", "routes/listings.tsx"),
    route("landlord/login", "routes/landlord-auth.tsx"),
    route("directory/complex", "routes/directory-complex.tsx"),
    route("directory/business", "routes/directory-business.tsx"),
    route("directory/landlords", "routes/directory-landlords.tsx"),
    route("listings/:id", "routes/listings.$id.tsx"),
    route("blog", "routes/blog.tsx"),
    route("about", "routes/about.tsx"),
    route("contact", "routes/contact.tsx"),
    route("landlord/dashboard", "routes/landlord-dashboard.tsx"),
    route("landlord/create-listing", "routes/landlord-new-listing.tsx"),
] satisfies RouteConfig;
