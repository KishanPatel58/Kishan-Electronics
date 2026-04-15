import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function NotFound() {
  const navigate = useNavigate();
  const { dark } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center text-center !px-6 transition ${
        dark ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* 🔥 BROKEN CONNECTION ICON */}
      <img src="/broken.png" width={320} alt="" />

      {/* 🔥 404 TEXT */}
      <h1 className="text-7xl font-bold !mb-4 tracking-tight">
        404
      </h1>

      <h2 className="text-2xl font-semibold !mb-3">
        Connection Lost
      </h2>

      <p
        className={`max-w-md !mb-8 ${
          dark ? "text-gray-400" : "text-gray-600"
        }`}
      >
        The page you’re trying to reach is unavailable or doesn’t exist.
        It might have been moved or deleted.
      </p>

      {/* 🔥 BUTTON */}
      <button
        onClick={() => navigate("/")}
        className={`!px-6 !py-3 rounded-full font-medium transition ${
          dark
            ? "bg-white text-black hover:scale-105"
            : "bg-black text-white hover:scale-105"
        }`}
      >
        Back to Home
      </button>

      {/* 🔥 OPTIONAL SUBTEXT */}
      <p className="text-xs !mt-6 opacity-50">
        Error Code: 404_NOT_FOUND
      </p>
    </div>
  );
}