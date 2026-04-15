import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { useAdmin } from "./context/AdminContext";
import { Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import About from "./pages/About";
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";

export default function App() {
  const { admin, loading } = useAdmin();

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Toaster position="top-center" />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:name" element={<CategoryPage />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route
          path="/dashboard"
          element={
            admin ? <AdminDashboard /> : <Navigate to="/login" />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}