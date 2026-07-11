import { Link, Outlet, useNavigate } from "react-router-dom";
import { adminLogout } from "./adminApi";
import "./admin.css";

export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    adminLogout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-app">
      <header className="admin-header">
        <div className="admin-header-inner">
          <Link to="/admin" className="admin-brand">
            Admin Panel
          </Link>
          <nav className="admin-nav">
            <Link to="/admin">Books</Link>
            <Link to="/admin/products/new">Add Book</Link>
            <Link to="/" target="_blank">
              View Site
            </Link>
            <button type="button" className="admin-logout" onClick={logout}>
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
