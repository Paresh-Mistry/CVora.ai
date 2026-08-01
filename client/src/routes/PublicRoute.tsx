// PublicRoute.tsx

import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../hooks/useAuth";

export default function PublicRoute() {
  const { data: user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  return user ? <Navigate to="/" replace /> : <Outlet />;
}