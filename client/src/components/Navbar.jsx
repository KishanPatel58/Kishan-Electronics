import { useTheme } from "../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { IoSunnyOutline } from "react-icons/io5";
import { FaRegMoon } from "react-icons/fa";
import { useAdmin } from "../context/AdminContext";
import { MdLogout } from "react-icons/md";
import { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import axios from "axios";
import toast from "react-hot-toast";
import { logoutAdmin } from "../services/api";
import { FiBox } from "react-icons/fi";
import { useLocation } from "react-router-dom";

export default function Navbar() {
  const { dark, setDark } = useTheme();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const navigate = useNavigate();
  const { admin, loading, setAdmin } = useAdmin();

  const [menu, setMenu] = useState(false); // profile menu
  const [mobileMenu, setMobileMenu] = useState(false); // offcanvas
  const LogoutAdmin = async () => {
    try {
      await logoutAdmin();
      setAdmin(null);
      localStorage.removeItem("adminTab");
      toast.success("Logged out successfully");
      setMenu(false);
    } catch (err) {
      toast.error("Logout failed");
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
  return (
    <>
      {/* 🔥 NAVBAR */}
      <div
        className={`flex justify-between items-center !px-6 md:!px-10 !py-4 shadow sticky top-0 !z-50 ${dark
          ? "bg-black text-white border-b border-[#ffffff38]"
          : "bg-white text-black"
          }`}
      >
        {/* LOGO */}
        <h1
          onClick={() => navigate("/")}
          className="text-xl font-bold cursor-pointer"
        >
          Mayur Electronics
        </h1>

        {/* 🔥 DESKTOP NAV LINKS */}
        <ul className="hidden md:flex gap-6 items-center font-medium">
          <Link
            to="/"
            className={`cursor-pointer ${isActive("/")
              ? "font-semibold underline underline-offset-4"
              : "hover:opacity-70"
              }`}
          >
            Home
          </Link>

          <Link
            to="/products"
            className={`cursor-pointer ${isActive("/products")
              ? "font-semibold underline underline-offset-4"
              : "hover:opacity-70"
              }`}
          >
            Products
          </Link>

          <Link
            to="/about"
            className={`cursor-pointer ${isActive("/about")
              ? "font-semibold underline underline-offset-4"
              : "hover:opacity-70"
              }`}
          >
            About
          </Link>
          {admin && (
            <Link
              to="/dashboard"
              className={`cursor-pointer ${isActive("/dashboard")
                ? "font-semibold underline underline-offset-4"
                : "hover:opacity-70"
                }`}
            >
              Manage Products
            </Link>)}
        </ul>
        {menu && (
          <div
            className="fixed inset-0 z-[999] flex items-start justify-end p-6"
            onClick={() => setMenu(false)}
          >
            {/* 🔥 POPUP CARD */}
            <div
              onClick={(e) => e.stopPropagation()}
              className={`w-64 rounded-2xl fixed top-14 right-14 shadow-2xl border backdrop-blur-md !p-4 animate-[fadeIn_0.2s_ease] ${dark
                ? "bg-black/90 text-white border-white/20"
                : "bg-white text-black border-gray-200"
                }`}
            >
              {/* 🔥 CLOSE */}
              <div className="flex justify-end !mb-2">
                <IoIosCloseCircleOutline
                  size={22}
                  className="cursor-pointer opacity-70 hover:opacity-100"
                  onClick={() => setMenu(false)}
                />
              </div>

              {/* 🔥 PROFILE INFO */}
              <div className="flex items-center gap-3 !mb-4">
                <img
                  src={admin?.image}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm">{admin?.name}</p>
                  <p className="text-xs opacity-60">{admin?.email}</p>
                </div>
              </div>

              {/* 🔥 ACTIONS */}
              <div className="flex flex-col gap-2">

                <button
                  onClick={() => {
                    navigate("/dashboard");
                    setMenu(false);
                  }}
                  className="w-full flex items-center gap-2 text-left !px-3 !py-2 rounded-lg hover:bg-gray-500/10 transition"
                >
                  <FiBox /> Manage Products
                </button>

                <button
                  onClick={() => {
                    LogoutAdmin();
                    setMenu(false);
                  }}
                  className="w-full text-left justify-start cursor-pointer !px-3 !py-2 rounded-lg text-red-500 hover:bg-red-500/10 transition flex items-center gap-2"
                >
                  <MdLogout /> Logout
                </button>

              </div>
            </div>
          </div>
        )}

        {/* 🔥 RIGHT SIDE */}
        <div className="flex gap-4 items-center">

          {/* THEME BUTTON */}
          <button
            onClick={() => setDark(!dark)}
            className={`border cursor-pointer ${dark ? "border-[#ffffff6d]" : "border-black"
              } !px-3 !py-2 rounded-lg ${dark
                ? "hover:bg-white hover:text-black"
                : "hover:bg-black hover:text-white"
              }`}
          >
            {dark ? <IoSunnyOutline size={18} /> : <FaRegMoon size={18} />}
          </button>

          {/* 🔥 ADMIN */}
          {admin ? (
            <>
              {loading ? (
                <div className={`w-10 h-10 flex items-center justify-center ${dark ? "bg-white" : "bg-black"} rounded-full`}>
                  <div className={`w-6 h-6 border-4 rounded-full animate-spin ${dark ? "border-black border-t-transparent" : "border-white border-t-transparent"
                    }`}></div>
                </div>
              ) : (
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

              )}
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className={`!px-4 !py-2 cursor-pointer hidden md:flex rounded ${dark ? "bg-white text-black" : "bg-black text-white"
                }`}
            >
              Admin Login
            </button>
          )}

          {/* 🔥 MOBILE MENU ICON */}
          <HiOutlineMenuAlt3
            size={24}
            className="md:hidden cursor-pointer"
            onClick={() => setMobileMenu(true)}
          />
        </div>
      </div>

      {/* 🔥 OFFCANVAS MENU */}
      <div
        className={`fixed top-0 right-0 h-full w-72 z-[999] transition-transform duration-300 ${mobileMenu ? "translate-x-0" : "translate-x-full"
          } ${dark ? "bg-black text-white" : "bg-white text-black"} shadow-lg`}
      >
        {/* CLOSE */}
        <div className="flex justify-end !p-4">
          <IoIosCloseCircleOutline
            size={26}
            className="cursor-pointer"
            onClick={() => setMobileMenu(false)}
          />
        </div>

        {/* LINKS */}
        <ul className="flex flex-col gap-6 !px-6 text-lg font-medium">
          <Link
            to="/"
            className={`${isActive("/") ? "font-semibold underline" : ""
              }`}
            onClick={() => setMobileMenu(false)}
          >
            Home
          </Link>
          <Link
            to="/products"
            className={`${isActive("/products") ? "font-semibold underline" : ""
              }`}
            onClick={() => setMobileMenu(false)}
          >
            Products
          </Link>

          <Link
            to="/about"
            className={`${isActive("/about") ? "font-semibold underline" : ""
              }`}
            onClick={() => setMobileMenu(false)}
          >
            About
          </Link>
          <Link
            to="/dashboard"
            className={`${isActive("/dashboard") ? "font-semibold underline" : ""
              }`}
            onClick={() => setMobileMenu(false)}
          >
            Manage Products
          </Link>
        </ul>

        {/* ADMIN SECTION */}
        <div className="!mt-10 !px-6">
          {admin ? (
            <div onClick={() => {
              LogoutAdmin();
            }} className="!p-3 border rounded text-red-500 cursor-pointer flex items-center gap-2">
              Logout <MdLogout />
            </div>

          ) : (
            <button
              onClick={() => { navigate("/login"); setMobileMenu(false) }}
              className={`!px-4 !py-2 flex cursor-pointer rounded ${dark ? "bg-white text-black" : "bg-black text-white"
                }`}
            >
              Admin Login
            </button>
          )}
        </div>
      </div>
    </>
  );
}