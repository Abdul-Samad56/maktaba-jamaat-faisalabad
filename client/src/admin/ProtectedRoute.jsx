import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "./adminApi";

export default function ProtectedRoute() {
  if (!isLoggedIn()) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}
