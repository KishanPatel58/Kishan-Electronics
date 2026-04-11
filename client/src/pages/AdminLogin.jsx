import { useState, useRef } from "react";
import { loginAdmin, verifyOTP, getProfile } from "../services/api";
import { useAdmin } from "../context/AdminContext";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [step, setStep] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

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

      console.log("PROFILE:", profile.data);

      setAdmin(profile.data.admin); // ✅ ONLY THIS

      toast.success("Login successful ✅");

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
    <div className="h-screen w-screen bg-gray-100 flex items-center justify-center">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl !p-10">

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
              className="w-full border-b !p-2"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full border-b !p-2"
            />

            <button
              disabled={loading}
              className={`w-full text-white !py-3 rounded-xl transition ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:opacity-90"
                }`}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* OTP */}
        {step === "otp" && (
          <form onSubmit={handleVerify} className="!space-y-8 text-center">

            <p className="text-gray-500 text-sm">
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
              className={`w-full text-white !py-3 rounded-xl ${verifyLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:opacity-90"
                }`}
            >
              {verifyLoading ? "Verifying..." : "Verify OTP"}
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