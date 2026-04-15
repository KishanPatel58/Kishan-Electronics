import { useState, useRef } from "react";
import { loginAdmin, verifyOTP, getProfile } from "../services/api";
import { useAdmin } from "../context/AdminContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";


export default function AdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [step, setStep] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const { dark } = useTheme();
  const inputsRef = useRef([]);
  const { setAdmin } = useAdmin();

  // 🔐 LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Email and password required");
    }

    try {
      setLoading(true); // 🔥 start loading

      const res = await loginAdmin({ email, password });

      if (!res || res.status !== 200) {
        throw new Error("Login failed");
      }

      toast.success("OTP sent to your email");
      setStep("otp");

    } catch (err) {
      toast.error(
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Login failed"
      );
    } finally {
      setLoading(false); // 🔥 stop loading
    }
  };

  // 🔢 OTP INPUT
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // ✅ VERIFY OTP (FINAL FIX)
  const handleVerify = async (e) => {
    e.preventDefault();

    if (verifyLoading) return;

    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      return toast.error("Enter complete OTP");
    }

    try {
      setVerifyLoading(true);

      const res = await verifyOTP({ email, otp: finalOtp });

      if (res.status !== 200) {
        throw new Error("Invalid OTP");
      }

      // 🔥 WAIT FOR REAL PROFILE
      const profile = await getProfile();

      setAdmin(profile.data.admin); // ✅ ONLY THIS

      toast.success("Login successful ✅");
      navigate("/dashboard");

    } catch (err) {
      console.log("ERROR:", err.response?.data);

      toast.error(
        err.response?.data?.error ||
        err.message ||
        "Invalid OTP"
      );
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div className={`h-screen w-full ${dark ? "bg-black" : "bg-gray-100"} flex items-center justify-center`}>

      <div className={`w-full border max-w-md ${dark ? "bg-black text-white border-[#ffffff76]" : "bg-white"} rounded-3xl shadow-xl !p-10`}>

        <h2 className="text-2xl font-semibold text-center !mb-8">
          Admin Login
        </h2>

        {/* LOGIN */}
        {step === "login" && (
          <form onSubmit={handleLogin} className="!space-y-6">

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={`w-full border-b !p-2 ${dark ? "bg-black text-white placeholder:text-gray-500" : "bg-white text-black placeholder:text-gray-500"}`}
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={`w-full border-b !p-2 ${dark ? "bg-black text-white placeholder:text-gray-500" : "bg-white text-black placeholder:text-gray-500"}`}
            />

            <button
              disabled={loading}
              className={`w-full flex justify-center items-center font-semibold ${dark ? "text-black bg-white" : "text-white bg-black"} !py-3 rounded-xl transition ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:opacity-90"
                }`}
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : "Send OTP"}
            </button>
          </form>
        )}

        {/* OTP */}
        {step === "otp" && (
          <form onSubmit={handleVerify} className="!space-y-8 text-center">

            <p className={`text-gray-500 text-sm ${dark ? "text-gray-400" : ""}`}>
              Enter the 6-digit OTP sent to your email
            </p>

            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) =>
                    handleOtpChange(e.target.value, index)
                  }
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 text-center border rounded-lg focus:ring-2 focus:ring-black"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={verifyLoading}
              className={`w-full flex items-center justify-center ${dark ? "bg-white text-black" : "text-white bg-black"} !py-3 rounded-xl ${verifyLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:opacity-90"
                } cursor-pointer`}
            >
              {verifyLoading ? (<h1 className={`${dark?"text-white":"text-black"} animate-pulse`}>Verifying..</h1>) : "Verify OTP"}
            </button>

            <p
              onClick={() => setStep("login")}
              className="text-sm text-gray-500 cursor-pointer"
            >
              Change email
            </p>
          </form>
        )}

      </div>
    </div>
  );
}