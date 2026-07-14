import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import InstallPrompt from "./components/InstallPrompt";
import WhatsAppFloat from "./components/WhatsAppFloat";
import { isLoggedIn } from "./admin/adminApi";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";

const AdminLayout = lazy(() => import("./admin/AdminLayout"));
const AdminLogin = lazy(() => import("./admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./admin/AdminDashboard"));
const AdminProductForm = lazy(() => import("./admin/AdminProductForm"));
const ProtectedRoute = lazy(() => import("./admin/ProtectedRoute"));

function PublicSite() {
  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
      <Footer />
      <InstallPrompt />
      <WhatsAppFloat />
    </div>
  );
}

function AdminFallback() {
  return <p className="loading container">Loading admin...</p>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<AdminFallback />}>
              {isLoggedIn() ? <Navigate to="/admin" replace /> : <AdminLogin />}
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<AdminFallback />}>
              <ProtectedRoute />
            </Suspense>
          }
        >
          <Route
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminLayout />
              </Suspense>
            }
          >
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
