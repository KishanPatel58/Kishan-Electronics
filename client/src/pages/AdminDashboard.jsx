import { useState, useEffect } from "react";
import axios from "axios";
import AddProduct from "./AddProduct";
import ManageProducts from "./ManageProducts";
import { FiPlusSquare, FiBox, FiLogOut } from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";
import { logoutAdmin } from "../services/api";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("adminTab") || "add"
  );
  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post(
        "http://localhost:3000/api/admin/upload-profile",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // 🔥 update context instantly
      setAdmin(res.data.admin);

      toast.success("Profile updated ✅");

    } catch (err) {
      toast.error("Upload failed");
    }
  };
  const getInitials = (name) => {
    if (!name) return "A";

    const words = name.trim().split(" ");

    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }

    return (
      words[0][0] + words[words.length - 1][0]
    ).toUpperCase();
  };
  const { admin, setAdmin } = useAdmin(); // 🔥 REAL DATA

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      setAdmin(null); // 🔥 clear context
      localStorage.removeItem("adminTab");
      toast.success("Logged out successfully");
    } catch (err) {
      toast.error("Logout failed");
    }
  };
  useEffect(() => {
    localStorage.setItem("adminTab", activeTab);
  }, [activeTab]);
  return (
    <div className="h-screen w-screen flex overflow-hidden">

      {/* SIDEBAR */}
      <aside className="w-72 bg-black text-white flex flex-col justify-between !p-6">

        <div>
          <h1 className="text-2xl font-bold !mb-8">Admin Panel</h1>

          {/* PROFILE */}
          <div className="flex items-center gap-3 !mb-10">
            <input
              type="file"
              id="profileUpload"
              className="hidden"
              onChange={handleProfileUpload}
            />
            <div
              onClick={() => document.getElementById("profileUpload").click()}
              className="w-12 h-12 rounded-full border border-white flex items-center justify-center cursor-pointer bg-gray-700 text-white font-bold text-lg overflow-hidden"
            >

              {admin?.image ? (
                <img
                  src={admin.image}
                  className="w-full h-full object-cover"
                  alt="admin"
                />
              ) : (
                <span>
                  {getInitials(admin?.name)}
                </span>
              )}

            </div>
            <div>
              <h2 className="font-semibold">
                {admin?.name || "Admin"}
              </h2>
              <p className="text-xs text-gray-400">
                {admin?.email || "admin@gmail.com"}
              </p>
            </div>
          </div>

          {/* MENU */}
          <div className="!space-y-2">

            <div
              onClick={() => setActiveTab("add")}
              className={`flex items-center gap-3 !p-3 rounded-lg cursor-pointer transition ${activeTab === "add"
                ? "bg-white text-black"
                : "hover:bg-gray-800"
                }`}
            >
              <FiPlusSquare />
              Add Product
            </div>

            <div
              onClick={() => setActiveTab("manage")}
              className={`flex items-center gap-3 !p-3 rounded-lg cursor-pointer transition ${activeTab === "manage"
                ? "bg-white text-black"
                : "hover:bg-gray-800"
                }`}
            >
              <FiBox />
              Manage Products
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="!space-y-4">

          {/* LOGOUT */}
          <div
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 !p-3 rounded-lg cursor-pointer text-red-400 hover:bg-red-500/10 transition"
          >
            <FiLogOut />
            Logout
          </div>

          <p className="text-xs text-gray-500 text-center">M@de By Kishan Patel</p>
        </div>

      </aside>

      {/* CONTENT */}
      <main className="flex-1 bg-gray-100 flex items-center justify-center">
        <div className="w-full h-full max-w-6xl max-h-[95vh]">
          {activeTab === "add" && <AddProduct />}
          {activeTab === "manage" && <ManageProducts />}
        </div>
      </main>

    </div>
  );
}