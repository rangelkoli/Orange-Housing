import { redirect } from "react-router";
import type { Route } from "./+types/redirect-rentals";

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  searchParams.set("type", "rentals");
  return redirect(`/listings?${searchParams.toString()}`);
}

export default function RedirectRentals() {
  return null;
}
