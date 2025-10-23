"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, EyeOff, Lock, User } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const locale = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? "/api/admin/login" : "/api/admin/register";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("adminToken", data.token);
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex justify-center items-center bg-[#F1F1F1] px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="space-y-8 w-full max-w-md">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-[#740e27] p-3 rounded-full">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 font-bold text-[#1E1E1E] text-3xl">
            {isLogin ? "Admin Login" : "Create Admin Account"}
          </h2>
          <p className="mt-2 text-[#6C757D] text-sm">
            {isLogin
              ? "Access the BUS & BOAT PARIS admin dashboard"
              : "Set up your admin account for BUS & BOAT PARIS"}
          </p>
        </div>

        <div className="bg-white shadow-lg p-8 rounded-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 font-medium text-[#1E1E1E] text-sm">
                email
              </label>
              <div className="relative">
                <User className="top-1/2 left-3 absolute w-5 h-5 text-[#6C757D] -translate-y-1/2 transform" />
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="py-3 pr-4 pl-10 border border-gray-300 focus:border-transparent rounded-lg focus:ring-[#740e27] focus:ring-2 w-full text-[#1E1E1E]"
                  placeholder="Enter admin email"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block mb-2 font-medium text-[#1E1E1E] text-sm">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="px-4 py-3 border border-gray-300 focus:border-transparent rounded-lg focus:ring-[#740e27] focus:ring-2 w-full text-[#1E1E1E]"
                  placeholder="Enter admin email"
                />
              </div>
            )}

            <div>
              <label className="block mb-2 font-medium text-[#1E1E1E] text-sm">
                Password
              </label>
              <div className="relative">
                <Lock className="top-1/2 left-3 absolute w-5 h-5 text-[#6C757D] -translate-y-1/2 transform" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="py-3 pr-12 pl-10 border border-gray-300 focus:border-transparent rounded-lg focus:ring-[#740e27] focus:ring-2 w-full text-[#1E1E1E]"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="top-1/2 right-3 absolute text-[#6C757D] hover:text-[#740e27] -translate-y-1/2 transform"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-[#D00000] bg-opacity-10 px-4 py-3 border border-[#D00000] rounded-lg text-[#D00000] text-sm">
                {error}
              </div>
            )}

            {/* <button
              type="submit"
              disabled={loading}
              className="bg-[#740e27] hover:bg-[#005a8b] disabled:opacity-50 px-4 py-3 rounded-lg w-full font-semibold text-white transition-colors disabled:cursor-not-allowed"
            >
              {loading
                ? "Processing..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </button> */}

            <Button
              disabled={loading}
              type="submit"
              className={`group relative flex justify-center items-center 
                                bg-gradient-to-r from-[#740e27] to-pink-600 hover:from-pink-600  hover:to-[#740e27] 
                                shadow-lg hover:shadow-xl py-4 rounded-lg w-full overflow-hidden font-medium text-white 
                                transition-all duration-[10000ms] ease-in-out h-9`}
            >
              {/* Gradient Overlay */}
              <div className="-z-10 absolute inset-0 bg-gradient-to-r from-amber-400 to-violet-500 opacity-0 group-hover:opacity-50 rounded-2xl transition-opacity duration-500"></div>

              {/* Moving dots */}
              <div className="absolute inset-0 opacity-10">
                <div className="top-2 left-4 absolute bg-white rounded-full w-1 h-1 transition-transform group-hover:translate-x-20 duration-1000"></div>
                <div className="top-4 right-6 absolute bg-white rounded-full w-1 h-1 transition-transform group-hover:-translate-x-20 duration-700"></div>
              </div>

              <span className="z-10 relative flex justify-center items-center text-sm tracking-wide">
                {loading
                  ? "Processing..."
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform group-hover:translate-x-2 duration-300" />
              </span>
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-[#740e27] text-sm"
            >
              {isLogin
                ? "Don't have an admin account? Create one"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
