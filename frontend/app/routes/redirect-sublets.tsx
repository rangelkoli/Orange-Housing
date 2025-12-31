import { redirect } from "react-router";
import type { Route } from "./+types/redirect-sublets";

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  searchParams.set("type", "sublets");
  return redirect(`/listings?${searchParams.toString()}`);
}

export default function RedirectSublets() {
  return null;
}
