import { Navigate, Outlet, useLocation } from "react-router";

import { useAuth } from "../context/AuthContext";

export function RequireAuth() {
  const { loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F7F9] text-sm text-[#6B7280]">
        Loading admin session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
