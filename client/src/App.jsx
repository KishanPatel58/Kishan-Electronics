import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";

import { useAdmin } from "./context/AdminContext";

const App = () => {
  const { admin, loading } = useAdmin();

  // ⏳ Loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={admin ? <AdminDashboard /> : <AdminLogin />} />
      </Routes>
    </>
  );
};

export default App;