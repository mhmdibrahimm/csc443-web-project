import { Navigate, Outlet, useLocation } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { useAppData } from "../context/AppDataContext";

/**
 * Route wrapper that redirects guests to /login while preserving the
 * destination they tried to reach (so /login can bounce them back after
 * a successful sign-in). While the provider is verifying a stored JWT
 * (`authStatus === "loading"`), we show a spinner instead of redirecting,
 * to avoid a flash of /login on full-page reloads.
 */
export default function RequireAuth() {
  const { authStatus } = useAppData();
  const location = useLocation();

  if (authStatus === "loading") {
    return <LoadingSpinner label="Restoring session..." />;
  }

  if (authStatus !== "authed") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
