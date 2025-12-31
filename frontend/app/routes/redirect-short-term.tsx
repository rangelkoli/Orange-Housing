import { redirect } from "react-router";
import type { Route } from "./+types/redirect-short-term";

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  searchParams.set("type", "short-term");
  return redirect(`/listings?${searchParams.toString()}`);
}

export default function RedirectShortTerm() {
  return null;
}
