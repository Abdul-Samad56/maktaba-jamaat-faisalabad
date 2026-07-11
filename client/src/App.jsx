import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import WhatsAppFloat from "./components/WhatsAppFloat";
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProductForm from "./admin/AdminProductForm";
import ProtectedRoute from "./admin/ProtectedRoute";
import { isLoggedIn } from "./admin/adminApi";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";

function PublicSite() {
  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={isLoggedIn() ? <Navigate to="/admin" replace /> : <AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products/new" element={<AdminProductForm />} />
            <Route path="products/:id" element={<AdminProductForm />} />
          </Route>
        </Route>
        <Route path="/*" element={<PublicSite />} />
      </Routes>
    </BrowserRouter>
  );
}
