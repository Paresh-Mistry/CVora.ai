// PrivateRoute.tsx

import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../hooks/useAuth";

export default function PrivateRoute() {
  const { data: user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}