import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

export default function RedirectRooms() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("type", "rooms");
    navigate(`/listings?${newParams.toString()}`, { replace: true });
  }, [navigate, searchParams]);

  return null;
}
