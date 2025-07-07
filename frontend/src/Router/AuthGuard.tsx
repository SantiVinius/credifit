import { Navigate, Outlet } from "react-router-dom";

interface AuthGuardProps {
  isPrivate: boolean;
}

export function AuthGuard({ isPrivate }: AuthGuardProps) {
  const token = localStorage.getItem("token");
  const signedIn = !!token;

  if (!signedIn && isPrivate) {
    // Redirect to login route
    return <Navigate to="/login" replace />;
  }

  if (signedIn && !isPrivate) {
    // Redirect to / (dashboard)
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
