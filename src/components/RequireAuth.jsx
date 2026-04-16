import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";

/**
 * Route wrapper that redirects guests to /login while preserving the
 * destination they tried to reach (so /login can bounce them back after
 * a successful sign-in).
 */
export default function RequireAuth() {
  const { currentUser } = useAppData();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
