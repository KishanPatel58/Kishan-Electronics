import { useState, useEffect } from "react";
import axios from "axios";
import AddProduct from "./AddProduct";
import ManageProducts from "./ManageProducts";
import { FiPlusSquare, FiBox, FiLogOut } from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";
import { logoutAdmin } from "../services/api";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";

export default function AdminDashboard() {
  const { dark } = useTheme();
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("adminTab") || "add"
  );
  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    window.title = admin?.name || "Admin";
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
    <>
      <Navbar />

      <div className="h-screen w-screen flex overflow-hidden">

        {/* SIDEBAR */}
        <aside
          className={`w-72 flex flex-col justify-between !p-6 transition ${dark
              ? "bg-black text-white border-r border-white/10"
              : "bg-white text-black border-r border-gray-200"
            }`}
        >
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
                onClick={() =>
                  document.getElementById("profileUpload").click()
                }
                className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer overflow-hidden font-bold text-lg ${dark
                    ? "bg-gray-800 border border-white/20"
                    : "bg-gray-200 border border-gray-300"
                  }`}
              >
                {admin?.image ? (
                  <img
                    src={admin.image}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{getInitials(admin?.name)}</span>
                )}
              </div>

              <div>
                <h2 className="font-semibold">
                  {admin?.name || "Admin"}
                </h2>
                <p className="text-xs opacity-60">
                  {admin?.email || "admin@gmail.com"}
                </p>
              </div>
            </div>

            {/* MENU */}
            <div className="!space-y-2">

              {/* ADD PRODUCT */}
              <div
                onClick={() => setActiveTab("add")}
                className={`flex items-center gap-3 !p-3 rounded-xl cursor-pointer transition ${activeTab === "add"
                    ? dark
                      ? "bg-white text-black"
                      : "bg-black text-white"
                    : dark
                      ? "hover:bg-white/10"
                      : "hover:bg-black/10"
                  }`}
              >
                <FiPlusSquare />
                Add Product
              </div>

              {/* MANAGE */}
              <div
                onClick={() => setActiveTab("manage")}
                className={`flex items-center gap-3 !p-3 rounded-xl cursor-pointer transition ${activeTab === "manage"
                    ? dark
                      ? "bg-white text-black"
                      : "bg-black text-white"
                    : dark
                      ? "hover:bg-white/10"
                      : "hover:bg-black/10"
                  }`}
              >
                <FiBox />
                Manage Products
              </div>

            </div>
          </div>

          {/* FOOTER */}
          <div className="!space-y-4">

            <div
              onClick={handleLogout}
              className="flex items-center justify-center gap-3 !p-3 rounded-xl cursor-pointer text-red-400 hover:bg-red-500/10 transition"
            >
              <FiLogOut />
              Logout
            </div>

            <p className="text-xs text-center opacity-50">
              M@de By Kishan Patel
            </p>
          </div>
        </aside>

        {/* CONTENT */}
        <main
          className={`flex-1 flex items-center justify-center transition ${dark ? "bg-[#0f0f0f]" : "bg-gray-100"
            }`}
        >
          <div className="w-full h-full max-w-6xl max-h-[95vh]">
            {activeTab === "add" && <AddProduct />}
            {activeTab === "manage" && <ManageProducts />}
          </div>
        </main>

      </div>
    </>
  );
}