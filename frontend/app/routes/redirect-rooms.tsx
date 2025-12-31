import { redirect } from "react-router";
import type { Route } from "./+types/redirect-rooms";

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  searchParams.set("type", "rooms");
  return redirect(`/listings?${searchParams.toString()}`);
}

export default function RedirectRooms() {
  return null;
}
