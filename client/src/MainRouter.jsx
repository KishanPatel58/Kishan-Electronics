import { useAdmin } from "./context/AdminContext";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

export default function MainRouter() {
  const { admin, loading } = useAdmin();

  // ⏳ loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // ❌ not logged in
  if (!admin) {
    return <AdminLogin />;
  }

  // ✅ logged in
  return <AdminDashboard />;
}