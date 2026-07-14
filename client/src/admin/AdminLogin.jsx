import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Seo from "../components/Seo";
import { adminLogin } from "./adminApi";
import "./admin.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await adminLogin(username, password);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <Seo title="Admin Login" description="Admin login" path="/admin/login" noindex />
      <form className="admin-login-card" onSubmit={onSubmit}>
        <h1>Admin Login</h1>
        <p>Maktaba Jamaat e Islami Faisalabad</p>
        {error && <p className="admin-error">{error}</p>}
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
